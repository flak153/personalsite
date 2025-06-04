import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import BlogContentWithTOC from "@/components/BlogContentWithTOC";
import ReadingProgress from "@/components/ReadingProgress";

// Get all blog files (except page.tsx)
export function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "src/app/blog");
  const files = fs.readdirSync(blogDir).filter(
    (file) => !file.includes("page.tsx") && 
              !file.startsWith("[") && 
              !file.startsWith(".")
  );
  
  return files.map((file) => ({
    slug: file.replace(/\.(mdx|md|tsx)$/, ""),
  }));
}

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

// Simple function to extract frontmatter manually (as a fallback)
function extractFrontmatter(content: string) {
  const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return { frontmatter: {}, content };
  
  const frontmatterBlock = match[1];
  const frontmatter: Record<string, string> = {};
  
  // Extract key-value pairs from frontmatter
  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, content };
}

// Metadata for the blog post
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const blogDir = path.join(process.cwd(), "src/app/blog");
    const filePath = path.join(blogDir, `${slug}.mdx`);
    
    if (fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, "utf-8");
      const { frontmatter } = extractFrontmatter(source);
      
      return {
        title: frontmatter.title || `${slug} | Blog`,
        description: frontmatter.excerpt || undefined
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  return {
    title: `${slug} | Blog`,
  };
}

// The blog post page
export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  
  try {
    const blogDir = path.join(process.cwd(), "src/app/blog");
    const filePath = path.join(blogDir, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      notFound();
    }
    
    const source = fs.readFileSync(filePath, "utf-8");
    const { frontmatter } = extractFrontmatter(source);
    
    const title = frontmatter.title || slug;
    const date = frontmatter.date || "";
    const category = frontmatter.category || "";
    const readTime = frontmatter.readTime || "";
    
    return (
      <>
        <ReadingProgress />
        <div className="pt-20 p-8 md:p-16 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{date}</span>
                  {readTime && (
                    <>
                      <span className="text-white/70">•</span>
                      <span className="text-white text-sm">{readTime}</span>
                    </>
                  )}
                </div>
                {category && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white font-medium">
                    {category}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
                {title}
              </h1>
            </div>
            
            <BlogContentWithTOC source={source} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    // Safe error handling that doesn't try to access potentially undefined properties
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error && error.stack ? error.stack : "No stack trace available";
    
    console.error('Error rendering blog post:', {
      message: errorMessage,
      stack: errorStack,
      error
    });
    
    return (
      <div className="pt-20 p-8 md:p-16 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              Error Rendering: {slug}
            </h1>
          </div>
          
          <div className="lg:w-full">
            <article className="prose prose-invert prose-lg prose-yellow max-w-none p-8 md:p-12 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-white">
                <p className="text-white text-lg mb-4">There was an error rendering this blog post.</p>
                <p className="text-white text-lg mb-4 text-red-300">Error: {errorMessage}</p>
                
                <div className="mt-8 bg-black/50 p-4 rounded-lg border border-red-900/30 overflow-auto max-h-[300px]">
                  <pre className="text-red-300 text-sm whitespace-pre-wrap">
                    {errorStack}
                  </pre>
                </div>
                
                <p className="text-white text-lg mt-8 bg-yellow-900/20 p-4 rounded-lg border border-yellow-600/20">
                  This blog post may contain complex MDX features that our current renderer doesn&apos;t support.
                  We&apos;re working on improving the MDX support!
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }
}