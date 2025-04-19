export default function About() {
  const skills = [
    "Backend Systems",
    "Cloud Architecture",
    "CI/CD",
    "Compliance",
    "Security",
    "DevOps",
    "System Design",
    "Startup Operations",
    "Business Strategy",
    "Finance & Accounting",
    "Technical Leadership",
    "Project Management"
  ];
  
  const technicalInterests = [
    "Compiler Design",
    "Programming Language Theory",
    "State Management",
    "Distributed Systems",
    "Consensus Algorithms",
    "Database Technologies"
  ];

  return (
    <div className="relative min-h-screen">
      
      <div className="relative z-10 pt-20 p-8 md:p-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
            About Me
          </h1>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/40">
            <h2 className="text-2xl font-bold mb-4 text-white">Startup Veteran & DevOps Specialist</h2>
            
            <div className="space-y-6">
              <p className="text-white/90 text-lg leading-relaxed">
                I'm a seasoned developer and startup ecosystem veteran, specializing in taking projects from idea to MVP and beyond. My core expertise includes:
              </p>
              
              <ul className="list-disc pl-6 text-white/90 text-lg leading-relaxed space-y-2">
                <li>Designing, building and scaling robust backend systems</li>
                <li>Implementing cloud-native solutions for web applications</li>
                <li>Managing large-scale codebase migrations with minimal disruption</li>
                <li>Designing and building elegant CI/CD pipelines for rapid, reliable deployments</li>
                <li>Navigating stringent compliance and security requirements (SOC 2 Type II, ISO 27001)</li>
              </ul>
              
              <p className="text-white/90 text-lg leading-relaxed">
                With years of experience in early-stage startups, I bring more than just technical skills to the table:
              </p>
              
              <ul className="list-disc pl-6 text-white/90 text-lg leading-relaxed space-y-2">
                <li>Comprehensive business acumen from years as a small business owner and early-stage employee</li>
                <li>Ability to wear multiple hats: from HR, marketing, sales, I've done it all</li>
                <li>Deep understanding of various industries and business models</li>
                <li>Proven track record in leading compliance initiatives and security</li>
                <li>Extensive knowledge of accounting, and finance</li>
              </ul>
              
              <p className="text-white/90 text-lg leading-relaxed">
                My approach is characterized by:
              </p>
              
              <ul className="list-disc pl-6 text-white/90 text-lg leading-relaxed space-y-2">
                <li>Rigorous documentation practices</li>
                <li>Thorough testing</li>
                <li>A knack for identifying and addressing technical debt</li>
                <li>Meeting and exceeding industry security standards</li>
              </ul>
              
              <p className="text-white/90 text-lg leading-relaxed">
                Having run the full startup gauntlet, I've developed a keen eye for common pitfalls and a toolbox of solutions. I excel at rising to the challenge of solving whatever problem a company faces, whether it's technical, operational, or strategic.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Core Skills</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {skills.map((skill, i) => (
                <span key={i} className="bg-white/20 px-4 py-2 rounded-full text-sm text-white">
                  {skill}
                </span>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">Technical Interests</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-4">
              Beyond my core work, I'm interested in advancing the field of computer science. My areas I follow are:
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {technicalInterests.map((interest, i) => (
                <span key={i} className="bg-white/10 px-4 py-2 rounded-full text-sm text-white">
                  {interest}
                </span>
              ))}
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed mt-6">
              While these interests may not always directly apply to day-to-day work, they inform my approach to problem-solving and keep me at the forefront of technological advancements in our field.
            </p>
            
            <div className="mt-10 pt-6 border-t border-white/20">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <a href="https://github.com/flak153" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/flak153/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
                
                <a href="mailto:flak153@gmail.com" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors">
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}