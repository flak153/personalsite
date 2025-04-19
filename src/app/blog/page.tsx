import fs from "fs";
import path from "path";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src/app/blog");
  const files = fs.readdirSync(blogDir).filter(
    (file) => !file.includes("page.tsx") && 
              !file.startsWith("[") && 
              !file.startsWith(".")
  );
  
  const posts: BlogPost[] = [];
  
  for (const file of files) {
    const slug = file.replace(/\.(mdx|md|tsx)$/, "");
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract frontmatter
    const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    let title = slug;
    let excerpt = "";
    let date = "";
    let category = "";
    let readTime = "";
    
    if (match) {
      const frontmatter = match[1];
      const frontmatterLines = frontmatter.split("\n");
      
      frontmatterLines.forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        const value = valueParts.join(":").trim();
        
        if (key === "title") title = value;
        if (key === "excerpt") excerpt = value;
        if (key === "date") date = value;
        if (key === "category") category = value;
        if (key === "readTime") readTime = value;
      });
    }
    
    posts.push({
      slug,
      title,
      excerpt,
      date,
      category,
      readTime
    });
  }
  
  // Sort by date (most recent first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export default function Blog() {
  const posts = getBlogPosts();
  
  // If no blog posts exist yet, show some example posts
  const examplePosts = [
    {
      slug: "getting-started-with-nextjs",
      title: "Getting Started with Next.js",
      excerpt: "Learn how to build modern web applications with Next.js and React.",
      date: "March 9, 2025",
      category: "Web Development",
      readTime: "8 min read"
    },
    {
      slug: "power-of-threejs",
      title: "The Power of Three.js",
      excerpt: "Create impressive 3D animations and interactive experiences for the web.",
      date: "March 7, 2025",
      category: "WebGL",
      readTime: "12 min read"
    },
    {
      slug: "tailwind-css-tips",
      title: "Tailwind CSS Tips and Tricks",
      excerpt: "Optimize your workflow and build beautiful UIs with these advanced techniques.",
      date: "March 5, 2025",
      category: "CSS",
      readTime: "5 min read"
    },
    {
      slug: "typescript-best-practices",
      title: "TypeScript Best Practices",
      excerpt: "Write safer, more maintainable code with these TypeScript patterns.",
      date: "March 1, 2025",
      category: "TypeScript",
      readTime: "10 min read"
    }
  ];
  
  const displayPosts = posts.length > 0 ? posts : examplePosts;
  
  return (
    <div className="pt-20 p-8 md:p-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
          Blog
        </h1>
        
        <div className="space-y-8">
          {displayPosts.map((post, i) => (
            <div key={i} className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-white/90 font-medium">{post.date}</span>
                  <span className="text-white/50">•</span>
                  <span className="text-white/70 text-sm">{post.readTime}</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">{post.category}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white hover:text-yellow-200 transition-colors">{post.title}</h2>
              <p className="text-white/80 mb-4 text-lg">{post.excerpt}</p>
              <div className="pt-2">
                <Link href={`/blog/${post.slug}`} className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors">
                  Read more →
                </Link>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
              <p className="text-white/80 mb-4 text-lg">
                Note: These are example posts. To create your own blog posts, add .md or .mdx files to the src/app/blog directory with frontmatter like:
              </p>
              <pre className="bg-black/50 p-4 rounded-lg overflow-auto my-4 text-sm text-yellow-300">
{`---
title: Your Blog Post Title
excerpt: A brief description of your post
date: YYYY-MM-DD
category: Category Name
readTime: X min read
---

Your content here in markdown format.`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}