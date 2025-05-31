import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src/app/blog");
  // Adjust filtering to exclude directories like [slug] and files like page.tsx
  const files = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && !dirent.name.startsWith('.') && /\.(mdx|md)$/.test(dirent.name))
    .map(dirent => dirent.name);
  
  const posts: BlogPost[] = [];
  
  for (const file of files) {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract frontmatter
    const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    let title = slug; // Default title to slug if not found
    let excerpt = "";
    let date = ""; // Initialize date
    let category = "General"; // Default category
    let readTime = "";
    
    if (match) {
      const frontmatter = match[1];
      const frontmatterLines = frontmatter.split("\n");
      
      frontmatterLines.forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        const value = valueParts.join(":").trim().replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes
        
        if (key.trim() === "title") title = value;
        if (key.trim() === "excerpt") excerpt = value;
        if (key.trim() === "date") date = value;
        if (key.trim() === "category") category = value;
        if (key.trim() === "readTime") readTime = value;
      });
    }
    
    // Ensure date is valid for sorting, provide a fallback if not
    let parsedDate = new Date(0); // Default to epoch
    if (date) {
      const tempDate = new Date(date);
      if (!isNaN(tempDate.getTime())) { // Check if the date is valid
        parsedDate = tempDate;
      }
    }

    posts.push({
      slug,
      title,
      excerpt,
      date: parsedDate.toISOString().split('T')[0], // Store date in YYYY-MM-DD format
      category,
      readTime
    });
  }
  
  // Sort by date (most recent first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
