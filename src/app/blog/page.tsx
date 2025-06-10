import { getBlogPosts } from "@/lib/blog";
import BlogPageContent from "./BlogPageContent";

export default function Blog() {
  const allPosts = getBlogPosts();
  
  return <BlogPageContent allPosts={allPosts} />;
}
