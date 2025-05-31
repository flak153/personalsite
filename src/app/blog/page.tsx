import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default function Blog() {
  const posts = getBlogPosts();
  
  // If no blog posts exist yet, show some example posts
  // const examplePosts: BlogPost[] = [];

  const displayPosts = posts; // Only show real posts
  
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
          
          {/*
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
          */}
        </div>
      </div>
    </div>
  );
}
