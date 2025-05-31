"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { BlogPost } from "@/lib/blog";

interface BlogFiltersProps {
  posts: BlogPost[];
}

export default function BlogFilters({ posts }: BlogFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category));
    return ["all", ...Array.from(cats)].filter(cat => cat); // Filter out empty categories
  }, [posts]);
  
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);
  
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Filter by tags (posts must have at least one selected tag)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort posts
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    
    return filtered;
  }, [posts, selectedCategory, selectedTags, searchTerm, sortBy]);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-8">
        {filteredPosts.map((post, i) => (
          <div key={i} className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-white/90 font-medium">{post.date}</span>
                <span className="text-white/50">•</span>
                <span className="text-white/70 text-sm">{post.readTime}</span>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                {post.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white hover:text-yellow-200 transition-colors">{post.title}</h2>
            <p className="text-white/80 mb-4 text-lg">{post.excerpt}</p>
            <div className="flex justify-between items-end">
              <Link href={`/blog/${post.slug}`} className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors">
                Read more →
              </Link>
              <div className="flex flex-wrap gap-1 justify-end">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="bg-white/10 px-2 py-0.5 rounded text-xs text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
            <p className="text-white/80 text-lg">
              No posts found matching your filters.
            </p>
          </div>
        )}
      </div>
      
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <div className="border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-white">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-white/80 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:border-white/40 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-black">
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/40"
                          : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="mt-2 text-xs text-yellow-300 hover:text-yellow-100 transition-colors"
                  >
                    Clear all tags
                  </button>
                )}
              </div>
              
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-white/80 mb-2">
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "title")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:border-white/40 transition-colors"
                >
                  <option value="date" className="bg-black">Date (Newest First)</option>
                  <option value="title" className="bg-black">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2 text-white">Stats</h3>
            <div className="space-y-1 text-white/70 text-sm">
              <p>Showing {filteredPosts.length} of {posts.length} posts</p>
              {selectedCategory !== "all" && (
                <p>Category: {selectedCategory}</p>
              )}
              {selectedTags.length > 0 && (
                <p>{selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}