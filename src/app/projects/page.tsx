import Link from "next/link";
import Image from "next/image";
import { getAllProjects, Project } from "../../lib/projects"; // Corrected import path
// Note: The Project interface from lib/projects.ts is richer, 
// but we'll only use common fields for now unless JSX is updated.

export default function Projects() {
  const displayProjects: Project[] = getAllProjects(); // Use the centralized function and type annotation
  
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
              <p className="text-white/40 text-base">Projects will be listed here once added.</p> 
            </div>
          ) : (
            displayProjects.map((project: Project, i: number) => (
              <Link href={`/projects/${project.slug}`} key={i} className="block h-full"> {/* Added block and h-full to Link for better layout with image */}
                <div className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm h-full flex flex-col"> {/* Added flex flex-col */}
                  {project.imageUrl && (
                    <Image src={project.imageUrl} alt={project.title} width={400} height={160} className="rounded-md mb-4 h-40 w-full object-cover" unoptimized />
                  )}
                  <h2 className="text-xl font-bold mb-2 text-white">{project.title}</h2> {/* Removed hover from title as whole card is link */}
                  <p className="text-white/80 mb-4 flex-grow">{project.description}</p> {/* Added flex-grow */}
                  <div className="flex flex-wrap gap-2 mt-auto"> {/* Added mt-auto to push tech tags down */}
                    {project.tech.map((techItem, j) => ( // Changed inner map key from i to j
                      <span key={j} className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                        {techItem}
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
