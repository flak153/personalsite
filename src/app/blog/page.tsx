import { getBlogPosts } from "@/lib/blog";
import BlogFilters from "@/components/BlogFilters";
import BlogTimeline from "@/components/BlogTimeline";

export default function Blog() {
  const posts = getBlogPosts();
  
  return (
    <div className="pt-20 p-8 md:p-16 min-h-screen">
      <BlogTimeline />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
          Blog
        </h1>
        
        <BlogFilters posts={posts} />
      </div>
    </div>
  );
}