import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import MDXContent from "@/components/MDXContent";

// Get all project files (except page.tsx)
export function generateStaticParams() {
  const projectsDir = path.join(process.cwd(), "src/app/projects");
  const files = fs.readdirSync(projectsDir).filter(
    (file) => !file.includes("page.tsx") && 
              !file.startsWith("[") && 
              !file.startsWith(".")
  );
  
  return files.map((file) => ({
    slug: file.replace(/\.(mdx|md|tsx)$/, ""),
  }));
}

interface ProjectProps {
  params: Promise<{
    slug: string;
  }>;
}

// Simple function to extract frontmatter (as a fallback)
function extractFrontmatter(content: string) {
  const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return { frontmatter: {}, content };
  
  const frontmatterBlock = match[1];
  const frontmatter: Record<string, unknown> = {};
  
  // Extract key-value pairs from frontmatter
  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      
      // Special case for tech array
      if (key === 'tech' && value.startsWith('[') && value.endsWith(']')) {
        try {
          frontmatter[key] = JSON.parse(value);
        } catch (e) {
          console.error('Error parsing tech array:', e);
          frontmatter[key] = [];
        }
      } else {
        frontmatter[key] = value;
      }
    }
  });
  
  return { frontmatter, content };
}

// Metadata for the project page
export async function generateMetadata({ params }: ProjectProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const projectsDir = path.join(process.cwd(), "src/app/projects");
    const filePath = path.join(projectsDir, `${slug}.mdx`);
    
    if (fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, "utf-8");
      const { frontmatter } = extractFrontmatter(source);
      
      return {
        title: (typeof frontmatter.title === 'string' ? frontmatter.title : null) || `${slug} | Projects`,
        description: typeof frontmatter.description === 'string' ? frontmatter.description : undefined
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  return {
    title: `${slug} | Projects`,
  };
}

// The project page
export default async function Project({ params }: ProjectProps) {
  const { slug } = await params;
  
  try {
    const projectsDir = path.join(process.cwd(), "src/app/projects");
    const filePath = path.join(projectsDir, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      notFound();
    }
    
    const source = fs.readFileSync(filePath, "utf-8");
    const { frontmatter } = extractFrontmatter(source);
    
    const titleValue = frontmatter.title;
    const title = (typeof titleValue === 'string' || typeof titleValue === 'number') ? titleValue : slug;
    const description = typeof frontmatter.description === 'string' ? frontmatter.description : "";
    const tech = Array.isArray(frontmatter.tech) ? frontmatter.tech : [];
    
    return (
      <div className="pt-20 p-8 md:p-16 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              {title}
            </h1>
            {description && (
              <p className="text-white mb-6 text-xl">
                {description}
              </p>
            )}
            
            {tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tech.map((item: string, i: number) => (
                  <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-xs text-white font-medium">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <article className="prose prose-invert prose-lg prose-yellow max-w-none p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
            <MDXContent source={source} />
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering project:', error);
    
    // Fallback simple display if there's an error
    const title = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return (
      <div className="pt-20 p-8 md:p-16 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              {title}
            </h1>
          </div>
          
          <article className="prose prose-invert prose-yellow max-w-none p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="text-white">
              <p className="text-white text-lg mb-4">There was an error rendering this project.</p>
              <p className="text-white text-lg mb-4 text-red-300">Error: {(error as Error).message}</p>
              <p className="text-white text-lg mt-8 bg-yellow-900/20 p-4 rounded-lg border border-yellow-600/20">
                This project page may contain complex MDX features that our current renderer doesn&apos;t support.
                We&apos;ve enjoyed working on this project.
                If you&apos;ve enjoyed this project, share it!
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }
}
