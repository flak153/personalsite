export default function Home() {
  return (
    <div className="relative">
      
      {/* Hero Section with Text */}
      <section className="relative h-screen w-full flex items-center justify-center z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-[family-name:var(--font-geist-sans)] px-8 py-4 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] shadow-2xl">
            Mohammed Ali
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-[family-name:var(--font-geist-mono)] px-6 py-3 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] shadow-xl">
            Tech Blog & Personal Site
          </p>
          <div className="animate-bounce mt-10">
            <p className="text-white text-sm drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">Scroll to explore</p>
            <div className="mx-auto w-6 h-6 border-b-2 border-r-2 border-white transform rotate-45 mt-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-16 px-8 md:px-16 z-10" id="about">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              About Me
            </h2>
            <a href="/about" className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors">
              <span>Learn more</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          
          <div className="border border-white/40 rounded-lg p-8 bg-black/20 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-white">Startup Veteran & DevOps Specialist</h3>
            <p className="text-white/90 text-lg mb-4">
              I'm a seasoned developer and startup ecosystem veteran, specializing in taking projects from idea to MVP and beyond. 
              My expertise includes designing scalable backend systems, implementing cloud-native solutions, and building 
              efficient CI/CD pipelines.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">Backend Systems</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">Cloud Architecture</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">CI/CD</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">Compliance</span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">Security</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
              
              <a href="/about" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors">
                Full Bio
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="relative py-16 px-8 md:px-16 z-10" id="projects">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              Featured Projects
            </h2>
            <a href="/projects" className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors">
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "AI Content Generator",
                description: "A machine learning application that generates high-quality content for blogs and social media.",
                technologies: ["Python", "TensorFlow", "React", "FastAPI"],
                image: "/project1.jpg"
              },
              {
                title: "Cryptocurrency Dashboard",
                description: "Real-time dashboard for monitoring cryptocurrency prices, trades, and portfolio management.",
                technologies: ["Next.js", "TypeScript", "WebSockets", "Tailwind CSS"],
                image: "/project2.jpg"
              }
            ].map((project, i) => (
              <div key={i} className="border border-white/40 rounded-lg overflow-hidden hover:border-white hover:shadow-lg transition-all bg-black/20 backdrop-blur-sm">
                <div className="h-48 bg-gray-800 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white/30">Project Preview</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
                  <p className="text-white/80 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-xs text-white">{tech}</span>
                    ))}
                  </div>
                  <div className="pt-2 flex gap-4">
                    <a href="#" className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      GitHub
                    </a>
                    <a href="#" className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="relative py-16 px-8 md:px-16 z-10" id="blog">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
              Latest Posts
            </h2>
            <a href="/blog" className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors">
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          
          <div className="space-y-6">
            {/* Featured post */}
            <div className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/20 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-white/90 font-medium">March 9, 2025</span>
                  <span className="text-white/50">•</span>
                  <span className="text-white/70 text-sm">8 min read</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">Web Development</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white hover:text-yellow-200 transition-colors">Getting Started with Next.js</h3>
              <p className="text-white/80 mb-4">Learn how to build modern web applications with Next.js and React. This comprehensive guide covers everything from setup to deployment.</p>
              <div className="pt-2">
                <a href="#" className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors">
                  Read more →
                </a>
              </div>
            </div>
            
            {/* Recent posts in a row */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "The Power of Three.js",
                  date: "March 7, 2025",
                  category: "WebGL"
                },
                {
                  title: "Tailwind CSS Tips and Tricks",
                  date: "March 5, 2025",
                  category: "CSS"
                },
                {
                  title: "TypeScript Best Practices",
                  date: "March 1, 2025",
                  category: "TypeScript"
                }
              ].map((post, i) => (
                <div key={i} className="border border-white/40 rounded-lg p-4 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">{post.date}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white hover:text-yellow-200 transition-colors">{post.title}</h3>
                  <a href="#" className="text-yellow-300 hover:text-yellow-100 text-sm transition-colors">Read more →</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
