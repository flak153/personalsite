import fs from "fs";
import path from "path";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  imageUrl?: string; // Optional image for the project card
  demoUrl?: string; // Optional link to a live demo
  repoUrl?: string; // Optional link to the code repository
  featured?: boolean; // To mark projects for the homepage
}

export function getAllProjects(): Project[] {
  const projectsDir = path.join(process.cwd(), "src/app/projects");
  
  let files: string[];
  try {
    files = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && !dirent.name.startsWith('.') && /\.(mdx|md)$/.test(dirent.name) && dirent.name !== 'page.tsx')
      .map(dirent => dirent.name);
  } catch (error) {
    // If the directory doesn't exist or other error, return empty array
    console.warn(`Could not read projects directory at ${projectsDir}:`, error);
    return [];
  }
  
  const projects: Project[] = files.map(file => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(projectsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    let title = slug; // Default title
    let description = "";
    let tech: string[] = [];
    let imageUrl: string | undefined;
    let demoUrl: string | undefined;
    let repoUrl: string | undefined;
    let featured: boolean = false;
    
    if (match) {
      const frontmatter = match[1];
      frontmatter.split("\n").forEach(line => {
        const [keyRaw, ...valueParts] = line.split(":");
        const key = keyRaw.trim();
        const value = valueParts.join(":").trim().replace(/^['"]|['"]$/g, '');

        switch (key) {
          case "title":
            title = value;
            break;
          case "description":
            description = value;
            break;
          case "tech":
            try {
              // Attempt to parse as JSON array string, e.g., tech: '["React", "Node.js"]'
              // Or handle comma-separated string, e.g., tech: React, Node.js
              if (value.startsWith('[') && value.endsWith(']')) {
                tech = JSON.parse(value);
              } else {
                tech = value.split(',').map(t => t.trim()).filter(t => t);
              }
            } catch (e) {
              console.error(`Error parsing tech for project ${slug}: ${value}`, e);
              tech = [];
            }
            break;
          case "imageUrl":
            imageUrl = value;
            break;
          case "demoUrl":
            demoUrl = value;
            break;
          case "repoUrl":
            repoUrl = value;
            break;
          case "featured":
            featured = value.toLowerCase() === 'true';
            break;
        }
      });
    }
    
    return { slug, title, description, tech, imageUrl, demoUrl, repoUrl, featured };
  });
  
  return projects.sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(project => project.featured === true);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find(project => project.slug === slug);
}
