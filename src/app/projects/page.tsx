import fs from "fs";
import path from "path";
import Link from "next/link";

interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
}

function getProjects(): Project[] {
  const projectsDir = path.join(process.cwd(), "src/app/projects");
  const files = fs.readdirSync(projectsDir).filter(
    (file) => !file.includes("page.tsx") && 
              !file.startsWith("[") && 
              !file.startsWith(".")
  );
  
  const projects: Project[] = [];
  
  for (const file of files) {
    const slug = file.replace(/\.(mdx|md|tsx)$/, "");
    const filePath = path.join(projectsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract frontmatter
    const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    let title = slug;
    let description = "";
    let tech: string[] = [];
    
    if (match) {
      const frontmatter = match[1];
      const frontmatterLines = frontmatter.split("\n");
      
      frontmatterLines.forEach((line) => {
        if (line.startsWith("title:")) {
          title = line.replace("title:", "").trim();
        } else if (line.startsWith("description:")) {
          description = line.replace("description:", "").trim();
        } else if (line.startsWith("tech:")) {
          try {
            const techString = line.replace("tech:", "").trim();
            tech = JSON.parse(techString);
          } catch (e) {
            console.error("Error parsing tech array:", e);
          }
        }
      });
    }
    
    projects.push({
      slug,
      title,
      description,
      tech
    });
  }
  
  return projects;
}

export default function Projects() {
  const projects = getProjects();
  
  const displayProjects = projects;
  
  return (
    <div className="pt-20 p-8 md:p-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
          Projects
        </h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {displayProjects.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <p className="text-white/70 text-xl mb-2">There are no projects yet.</p>
              <p className="text-white/40 text-base">Add a <code>.mdx</code> file to <code>src/app/projects</code> to showcase your work!</p>
            </div>
          ) : (
            displayProjects.map((project, i) => (
              <Link href={`/projects/${project.slug}`} key={i}>
                <div className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm h-full">
                  <h2 className="text-xl font-bold mb-2 text-white hover:text-yellow-200 transition-colors">{project.title}</h2>
                  <p className="text-white/80 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}