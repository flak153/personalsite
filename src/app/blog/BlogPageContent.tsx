"use client";

import { useState, useCallback } from "react";
import { type BlogPost } from "@/lib/blog";
import BlogFilters from "@/components/BlogFilters";
import BlogTimeline from "@/components/BlogTimeline";

interface BlogPageContentProps {
  allPosts: BlogPost[];
}

export default function BlogPageContent({ allPosts }: BlogPageContentProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(allPosts);
  
  const handleFilteredPostsChange = useCallback((posts: BlogPost[]) => {
    setFilteredPosts(posts);
  }, []);
  
  return (
    <div className="pt-20 md:pt-20 p-8 md:p-16 min-h-screen">
      <BlogTimeline posts={filteredPosts} />
      <div className="max-w-7xl mx-auto pt-16 md:pt-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
          Blog
        </h1>
        
        <BlogFilters 
          posts={allPosts} 
          onFilteredPostsChange={handleFilteredPostsChange}
        />
      </div>
    </div>
  );
}