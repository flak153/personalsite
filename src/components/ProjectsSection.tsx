import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/projects';

interface ProjectsSectionProps {
  featuredProjects: Project[];
}

export default function ProjectsSection({ featuredProjects }: ProjectsSectionProps) {
  return (
    <section className="relative py-16 px-8 md:px-16 z-10" id="projects" aria-labelledby="projects-heading">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
            Featured Projects
          </h2>
          <Link 
            href="/projects" 
            className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
            aria-label="View all projects"
          >
            <span>View all</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3" role="list" aria-label="Featured projects">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm h-full flex flex-col hover:scale-105" role="listitem">
              {project.imageUrl && (
                <Image 
                  src={project.imageUrl} 
                  alt={`Screenshot of ${project.title} project`} 
                  width={400} 
                  height={160} 
                  className="rounded-md mb-4 h-40 w-full object-cover" 
                />
              )}
              <h3 className="text-xl font-bold mb-2 text-white hover:text-yellow-200 transition-colors">
                {project.demoUrl ? (
                  <Link 
                    href={project.demoUrl} 
                    target={project.demoUrl.startsWith('http') ? '_blank' : '_self'} 
                    rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                    aria-label={`${project.title} project demo${project.demoUrl.startsWith('http') ? ' (opens in new tab)' : ''}`}
                  >
                    {project.title}
                  </Link>
                ) : (
                  project.title
                )}
              </h3>
              <p className="text-white/80 mb-4 flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Technologies used">
                {project.tech.map((tech, j) => (
                  <span key={j} className="bg-white/20 px-3 py-1 rounded-full text-xs text-white" role="listitem">{tech}</span>
                ))}
              </div>
              <div className="mt-auto flex items-center space-x-4">
                {project.demoUrl && (
                  <Link 
                    href={project.demoUrl} 
                    target={project.demoUrl.startsWith('http') ? '_blank' : '_self'} 
                    rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : ''} 
                    className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                    aria-label={`View ${project.title} demo${project.demoUrl.startsWith('http') ? ' (opens in new tab)' : ''}`}
                  >
                    Demo
                  </Link>
                )}
                {project.repoUrl && (
                  <Link 
                    href={project.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                    aria-label={`View ${project.title} source code (opens in new tab)`}
                  >
                    Code
                  </Link>
                )}
              </div>
            </article>
          ))}
          {featuredProjects.length === 0 && (
            <div className="md:col-span-3 border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
              <p className="text-white/80 text-lg">No featured projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
