import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/blog';
import { getFeaturedProjects } from '@/lib/projects';

export default function Home() {
  const allPosts = getBlogPosts();
  const featuredProjects = getFeaturedProjects();
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const recentPosts = allPosts.length > 1 ? allPosts.slice(1, 4) : []; // Get next 3 posts, or fewer if not available

  return (
    <div className="relative">
      
      {/* Hero Section with Text */}
      <section className="relative h-screen w-full flex items-center justify-center z-10" aria-labelledby="hero-heading">
        <div className="text-center bg-black/30 backdrop-blur-lg rounded-xl p-10">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6 text-white font-[family-name:var(--font-geist-sans)] py-4">
            Mohammed &quot;Flak&quot; Ali
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-[family-name:var(--font-geist-mono)] py-3">
            Tech Blog & Personal Site
          </p>
          <div className="animate-bounce mt-10" role="img" aria-label="Scroll indicator">
            <p className="text-white text-sm drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">Scroll to explore</p>
            <div className="mx-auto w-6 h-6 border-b-2 border-r-2 border-white transform rotate-45 mt-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-16 px-8 md:px-16 z-10" id="about" aria-labelledby="about-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              About Me
            </h2>
            <Link 
              href="/about" 
              className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
              aria-label="Learn more about Mohammed Ali"
            >
              <span>Learn more</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="border border-white/40 rounded-lg p-8 bg-black/20 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-white">Startup Veteran &amp; DevOps Specialist</h3>
            <p className="text-white/90 text-lg mb-4">
              I&apos;m a seasoned developer and startup ecosystem veteran, specializing in taking projects from idea to MVP and beyond. 
              My expertise includes designing scalable backend systems, implementing cloud-native solutions, and building 
              efficient CI/CD pipelines.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6" role="list" aria-label="Technical expertise">
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white" role="listitem">Backend Systems</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white" role="listitem">Cloud Architecture</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white" role="listitem">CI/CD</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white" role="listitem">Compliance</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white" role="listitem">Security</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-4" role="list" aria-label="Social media links">
                <a 
                  href="https://github.com/flak153" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded p-1"
                  aria-label="Visit Mohammed Ali's GitHub profile (opens in new tab)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/flak153/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded p-1"
                  aria-label="Visit Mohammed Ali's LinkedIn profile (opens in new tab)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
              
              <Link 
                href="/about" 
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Read full biography"
              >
                Full Bio
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
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
              <article key={project.slug} className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm h-full flex flex-col" role="listitem">
                {project.imageUrl && (
                  <Image 
                    src={project.imageUrl} 
                    alt={`Screenshot of ${project.title} project`} 
                    width={400} 
                    height={160} 
                    className="rounded-md mb-4 h-40 w-full object-cover" 
                    unoptimized 
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
      
      {/* Blog Section */}
      <section className="relative py-16 px-8 md:px-16 z-10" id="blog" aria-labelledby="blog-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 id="blog-heading" className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              Latest Posts
            </h2>
            <Link 
              href="/blog" 
              className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
              aria-label="View all blog posts"
            >
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          <div className="space-y-6">
            {/* Featured post */}
            {featuredPost && (
              <article className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <time className="text-white/90 font-medium" dateTime={featuredPost.date}>{featuredPost.date}</time>
                    {featuredPost.readTime && <span className="text-white/50" aria-hidden="true">•</span>}
                    {featuredPost.readTime && <span className="text-white/70 text-sm">{featuredPost.readTime}</span>}
                  </div>
                  {featuredPost.category && <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white" role="img" aria-label={`Category: ${featuredPost.category}`}>{featuredPost.category}</span>}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white hover:text-yellow-200 transition-colors">
                  <Link 
                    href={`/blog/${featuredPost.slug}`} 
                    className="focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                    aria-label={`Read article: ${featuredPost.title}`}
                  >
                    {featuredPost.title}
                  </Link>
                </h3>
                {featuredPost.excerpt && <p className="text-white/80 mb-4">{featuredPost.excerpt}</p>}
                <div className="pt-2">
                  <Link 
                    href={`/blog/${featuredPost.slug}`} 
                    className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                    aria-label={`Continue reading ${featuredPost.title}`}
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            )}
            
            {/* Recent posts in a row */}
            {recentPosts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-3" role="list" aria-label="Recent blog posts">
                {recentPosts.map((post) => (
                  <article key={post.slug} className="border border-white/40 rounded-lg p-4 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm" role="listitem">
                    <div className="flex justify-between items-center mb-2">
                      <time className="text-white/70 text-sm" dateTime={post.date}>{post.date}</time>
                      {post.category && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white" role="img" aria-label={`Category: ${post.category}`}>{post.category}</span>}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white hover:text-yellow-200 transition-colors">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                        aria-label={`Read article: ${post.title}`}
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="text-yellow-300 hover:text-yellow-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                      aria-label={`Continue reading ${post.title}`}
                    >
                      Read more →
                    </Link>
                  </article>
                ))}
              </div>
            )}

            {allPosts.length === 0 && (
              <div className="border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
                <p className="text-white/80 text-lg">No blog posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
