"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

const navItems = [
  { 
    name: "Home", 
    href: "/", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    name: "Blog", 
    href: "/blog", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  { 
    name: "Projects", 
    href: "/projects", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  { 
    name: "About", 
    href: "/about", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

const socialLinks = [
  { 
    name: "GitHub",
    href: "https://github.com/flak153",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    )
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/flak153/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    )
  }
];

export default function Navigation() {
  const [showFloatingPill, setShowFloatingPill] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const pathname = usePathname();
  
  // Motion values for floating animation
  const time = useMotionValue(0);
  const floatY = useTransform(time, (t) => Math.sin(t) * 10);
  const springY = useSpring(floatY, { stiffness: 100, damping: 10 });

  // Update floating animation
  useEffect(() => {
    const interval = setInterval(() => {
      time.set(time.get() + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, [time]);

  // Handle scroll to change nav state
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFloatingPill(scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Create particle effect
  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const isCurrentPage = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Render particles
  const renderParticles = () => (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[60]"
          initial={{ 
            left: particle.x, 
            top: particle.y, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            left: particle.x + (Math.random() - 0.5) * 200, 
            top: particle.y + (Math.random() - 0.5) * 200, 
            scale: 0,
            opacity: 0 
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-2 h-2 bg-lavender-bright rounded-full" />
        </motion.div>
      ))}
    </AnimatePresence>
  );

  // Full bar navigation
  const renderFullBar = () => (
    <div className="flex justify-between items-center w-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link 
          href="/" 
          className="relative"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span 
              className="text-4xl font-bold tracking-wider text-white relative z-10"
              style={{
                textShadow: "0 0 10px rgba(200, 177, 245, 0.2)"
              }}
            >
              Flak
            </span>
            
            {/* Animated glow pulse */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-4xl font-bold tracking-wider text-lavender-bright blur-md">
                Flak
              </span>
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>

      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item, index) => {
          const current = isCurrentPage(item.href);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onHoverStart={() => setHoveredItem(item.name)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link 
                href={item.href}
                className="relative text-white font-medium px-3 py-2 pb-3 rounded-lg transition-all flex items-center gap-2 overflow-visible"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  createParticles(rect.x + rect.width / 2, rect.y + rect.height / 2);
                }}
              >
                <motion.span
                  className="relative z-10 flex items-center gap-2"
                  animate={{
                    color: current ? "#C8B1F5" : "#ffffff",
                  }}
                >
                  {item.icon} {item.name}
                </motion.span>
                
                {/* Hover effect blob */}
                {hoveredItem === item.name && (
                  <motion.div
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    layoutId="navbar-hover"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                
                {/* Active indicator - Glowing line with wave effect */}
                {current && (
                  <>
                    {/* Static glow */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-lavender-bright rounded-full"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ 
                        boxShadow: "0 0 10px rgba(200, 177, 245, 1), 0 0 20px rgba(200, 177, 245, 0.6)" 
                      }}
                    />
                    {/* Animated shimmer */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-full"
                    >
                      <motion.div
                        className="h-full w-[50%] bg-gradient-to-r from-transparent via-white to-transparent"
                        animate={{
                          x: ["-50%", "150%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          opacity: 0.8,
                          filter: "blur(2px)",
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </Link>
            </motion.div>
          );
        })}

        <div className="flex gap-4 ml-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-lavender-bright transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Mobile menu button */}
      <motion.button
        className="md:hidden text-white p-2"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
        </svg>
      </motion.button>
    </div>
  );

  return (
    <>
      {/* Full Bar Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border border-white/10 backdrop-blur-md bg-black/10 px-8 py-4"
        style={{
          boxShadow: "0 0 30px rgba(200, 177, 245, 0.1)",
        }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ 
          opacity: showFloatingPill ? 0 : 1,
          y: showFloatingPill ? -100 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
      >
        {renderFullBar()}
      </motion.nav>

      {/* Floating Pill Navigation */}
      <AnimatePresence>
        {showFloatingPill && (
          <motion.nav
            className="fixed top-1/2 -translate-y-1/2 right-8 z-50 flex flex-col gap-3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: 1, 
              x: 0,
            }}
            exit={{ opacity: 0, x: 100 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
            }}
            style={{ y: springY }}
          >
            <div className="backdrop-blur-lg bg-black/20 rounded-full p-3 border border-white/10"
                 style={{ boxShadow: "0 0 30px rgba(200, 177, 245, 0.1)" }}>
              <div className="flex flex-col gap-3">
                {navItems.map((item, index) => {
                  const current = isCurrentPage(item.href);
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link
                        href={item.href}
                        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          createParticles(rect.x + rect.width / 2, rect.y + rect.height / 2);
                        }}
                      >
                        <span className={`${current ? 'text-lavender-bright' : 'text-white'}`}>
                          {item.icon}
                        </span>
                        
                        {/* Expanded label on hover */}
                        <AnimatePresence>
                          {hoveredItem === item.name && (
                            <motion.div
                              className="absolute right-full mr-3 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap"
                              initial={{ opacity: 0, x: 10, scale: 0.8 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 10, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Active indicator - Rotating orbit */}
                        {current && (
                          <>
                            {/* Glow effect */}
                            <motion.div
                              className="absolute inset-0 rounded-full bg-lavender-bright/20"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.2, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            {/* Orbiting dot */}
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-lavender-bright rounded-full shadow-[0_0_6px_rgba(200,177,245,0.8)]" />
                            </motion.div>
                          </>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl p-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex flex-col gap-6">
                {navItems.map((item) => {
                  const current = isCurrentPage(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-white font-medium text-lg flex items-center gap-3 ${current ? 'text-lavender-bright' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon} {item.name}
                    </Link>
                  );
                })}
                
                <div className="flex gap-4 pt-6 border-t border-white/20">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-lavender-bright transition-colors"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render particles globally */}
      {renderParticles()}
    </>
  );
}
