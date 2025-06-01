import Link from "next/link";

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
            <h2 className="text-3xl font-bold mb-6 text-white">My Journey in Code and Creation</h2>
            
            <div className="space-y-6">
              <p className="text-white/90 text-lg leading-relaxed">
                For me, software development isn&apos;t just a profession; it&apos;s a craft I&apos;ve honed in the dynamic, often chaotic, world of startups. I thrive on transforming nascent ideas into tangible, robust products. My journey has been one of constant learning and adaptation, navigating the entire lifecycle from the spark of an idea to a scalable, market-ready MVP and beyond. This path has equipped me with a deep appreciation for not just elegant code, but for systems that endure and businesses that flourish.
              </p>
              
              <p className="text-white/90 text-lg leading-relaxed">
                My core technical passions lie in:
              </p>
              <ul className="text-white/90 text-lg leading-relaxed space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>Architecting and nurturing backend systems that are both powerful and resilient.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>Crafting cloud-native infrastructures that allow web applications to breathe and scale.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>Orchestrating complex codebase migrations, ensuring continuity and minimizing disruption.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>Building sophisticated CI/CD pipelines that make rapid, reliable deployment a reality.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>Mastering the intricacies of compliance and security (SOC 2 Type II, ISO 27001), turning obligations into strengths.</span>
                </li>
              </ul>
              
              <p className="text-white/90 text-lg leading-relaxed">
                The startup crucible has forged more than just my technical abilities. It has instilled in me a holistic understanding of business. I&apos;ve walked in the shoes of a founder and an early team member, which means I&apos;ve seen firsthand how every line of code, every system design choice, and every operational process impacts the bigger picture. This perspective allows me to contribute beyond the purely technical:
              </p>
              
              <ul className="text-white/90 text-lg leading-relaxed space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>A pragmatic business sense, understanding the delicate dance between innovation, resources, and market realities.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>The versatility to bridge gaps across departments – I&apos;ve navigated the worlds of HR, marketing, and sales when the need arose.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>An intuitive grasp of diverse industry landscapes and the nuances of different business models.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>A history of spearheading compliance and security efforts, transforming them from hurdles into foundations of trust.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>A solid grounding in the principles of accounting and finance, crucial for sustainable growth.</span>
                </li>
              </ul>
              
              <p className="text-white/90 text-lg leading-relaxed">
                My philosophy for building great software and strong companies is rooted in:
              </p>
              
              <ul className="text-white/90 text-lg leading-relaxed space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>A commitment to meticulous documentation – clarity is kindness to your future self and your team.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>An unwavering belief in the power of thorough testing – building confidence with every check.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>A proactive stance on identifying and thoughtfully addressing technical debt before it compounds.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-300 mr-3 mt-1 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  <span>A dedication to not just meeting, but exceeding industry security standards, because trust is paramount.</span>
                </li>
              </ul>
              
              <p className="text-white/90 text-lg leading-relaxed">
                Having navigated the exhilarating, and at times, perilous startup journey from multiple vantage points, I&apos;ve cultivated an instinct for anticipating challenges and a versatile toolkit for overcoming them. I don&apos;t just solve technical puzzles; I embrace the holistic challenge of helping a company thrive, whether that means architecting a new system, streamlining operations, or contributing to strategic direction. It&apos;s about building something meaningful, something that lasts.
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
              Beyond my core work, I&apos;m interested in advancing the field of computer science. My areas I follow are:
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

            <h2 className="text-3xl font-bold mt-12 mb-6 text-white">Roots & Perspective</h2>
            <div className="space-y-4">
              <p className="text-white/90 text-lg leading-relaxed">
                My early life in the Bronx, sharing a one-bedroom, pest-ridden, rent-stabilized apartment with five family members, provided a unique lens on resourcefulness and community. This was the environment shortly after my Bengali parents immigrated from rural Bangladesh, arriving in New York with minimal resources just before I was born.
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                Their journey from a war-torn village and a simple tin shack to establishing a new life in the U.S. has fundamentally shaped my understanding of perseverance and the effort required to build something meaningful from the ground up. These experiences are integral to my approach to both life and work.
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                You can learn more about their story and its influence on me <Link href="/blog/tribute-to-my-parents-perseverance" className="text-rose-300 hover:text-rose-200 underline">in this blog post</Link>.
              </p>
            </div>
            
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
