import Link from 'next/link';

export default function AboutSection() {
  return (
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
            <span>Learn more about me</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="border border-white/40 rounded-lg p-8 bg-black/20 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-white">Startup Veteran & DevOps Specialist</h3>
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
                role="listitem"
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
                role="listitem"
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
              aria-label="Read full biography about Mohammed Ali"
            >
              Full Bio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
