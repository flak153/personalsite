"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { BlogPost } from "@/lib/blog";

interface BlogTimelineProps {
  posts: BlogPost[];
}

export default function BlogTimeline({ posts }: BlogTimelineProps) {
  // Initialize active year with the most recent post's year
  const initialYear = posts.length > 0 ? new Date(posts[0].date).getFullYear() : null;
  const [activeYear, setActiveYear] = useState<number | null>(initialYear);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-calculate year data
  const yearData = useMemo(() => {
    const yearMap = new Map<number, number>();
    
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear();
      if (!isNaN(year) && year > 1970 && year <= new Date().getFullYear()) {
        yearMap.set(year, (yearMap.get(year) || 0) + 1);
      }
    });
    
    return Array.from(yearMap.entries())
      .sort(([a], [b]) => b - a)
      .map(([year, count]) => ({ year, count }));
  }, [posts]);


  // Throttled scroll handler for navbar detection
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const scrollY = window.scrollY;
      setNavbarHidden(scrollY > 200);
    }, 50);
  }, []);

  // Intersection Observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    let topMostYear: number | null = null;
    let topMostPosition = Infinity;
    
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target instanceof HTMLElement) {
        const indexStr = entry.target.getAttribute('data-post-index');
        if (indexStr !== null) {
          const index = parseInt(indexStr, 10);
          if (index >= 0 && index < posts.length) {
            const post = posts[index];
            const year = new Date(post.date).getFullYear();
            
            // Get the position of this element relative to the viewport
            const rect = entry.target.getBoundingClientRect();
            
            // Find the topmost visible post
            if (rect.top < topMostPosition && rect.top > -rect.height) {
              topMostPosition = rect.top;
              topMostYear = year;
            }
          }
        }
      }
    });
    
    if (topMostYear !== null) {
      setActiveYear(topMostYear);
    }
  }, [posts]);

  // Setup Intersection Observer
  useEffect(() => {
    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-25% 0px -65% 0px', // Consider posts in upper portion of viewport
      threshold: [0, 0.1, 0.5, 0.9, 1]
    });

    // Setup scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleIntersection, handleScroll]);

  // Register post elements with observer
  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    // Wait a bit for DOM to render
    const timeoutId = setTimeout(() => {
      // Find all blog post cards directly
      const postElements = document.querySelectorAll('.lg\\:col-span-3 div.border.border-white\\/40');
      
      let validIndex = 0;
      postElements.forEach((element) => {
        if (element instanceof HTMLElement && validIndex < posts.length) {
          // Check if this is actually a blog post card (has Read more link)
          if (element.querySelector('a[href^="/blog/"]')) {
            element.setAttribute('data-post-index', validIndex.toString());
            observer.observe(element);
            validIndex++;
          }
        }
      });
      
      // If no posts found with the first selector, try alternative
      if (validIndex === 0) {
        const altElements = document.querySelectorAll('div.border.border-white\\/40.rounded-lg.p-6');
        altElements.forEach((element, index) => {
          if (element instanceof HTMLElement && index < posts.length) {
            element.setAttribute('data-post-index', index.toString());
            observer.observe(element);
          }
        });
      }
    }, 200); // Increased delay for better reliability

    return () => {
      const postElements = document.querySelectorAll('[data-post-index]');
      postElements.forEach(element => {
        if (observerRef.current) {
          observerRef.current.unobserve(element);
        }
        element.removeAttribute('data-post-index');
      });
      clearTimeout(timeoutId);
    };
  }, [posts]); // Re-run when posts change (e.g., filtering)

  // Smooth scroll to year
  const scrollToYear = useCallback((year: number) => {
    // Find the first post of this year
    const firstPostIndex = posts.findIndex(post => {
      const postYear = new Date(post.date).getFullYear();
      return postYear === year;
    });
    
    if (firstPostIndex >= 0) {
      // Try multiple selectors to find the element
      let element = document.querySelector(`[data-post-index="${firstPostIndex}"]`);
      
      // If not found with data attribute, try finding by index in the blog list
      if (!element) {
        const allPosts = document.querySelectorAll('.lg\\:col-span-3 div.border.border-white\\/40');
        if (allPosts[firstPostIndex]) {
          element = allPosts[firstPostIndex];
        }
      }
      
      if (element) {
        const yOffset = -100; // Account for fixed header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Set active year immediately when clicking
        setActiveYear(year);
      }
    }
  }, [posts]);

  if (yearData.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile: Horizontal timeline at top */}
      <div className={`fixed left-0 right-0 z-10 md:hidden bg-black/20 backdrop-blur-sm border-b border-white/10 transition-all duration-300 ${
        navbarHidden ? "top-0" : "top-20"
      }`}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 py-3">
            {yearData.map(({ year, count }) => (
              <button
                key={year}
                onClick={() => scrollToYear(year)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all whitespace-nowrap transform ${
                  activeYear === year 
                    ? "bg-white/20 border border-white/80 text-white scale-105" 
                    : "bg-transparent border border-white/40 text-white/60 hover:border-yellow-300 hover:bg-yellow-400/20 hover:scale-105"
                }`}
              >
                <span className="text-sm font-medium">{year}</span>
                <span className="text-xs">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Vertical timeline on left */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <div className="relative py-4">
          {/* Timeline track behind nodes */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />
          
          {/* Year buttons */}
          <div className="relative space-y-8">
            {yearData.map(({ year, count }) => {
              const isActive = activeYear === year;
              return (
                <div key={year} className="relative group">
                  <button
                    onClick={() => scrollToYear(year)}
                    className="flex items-center gap-3"
                    aria-label={`Jump to ${year}`}
                  >
                    {/* Timeline node */}
                    <div className="relative z-10">
                      <div className={`w-4 h-4 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/30 border border-white/60 scale-125 shadow-lg shadow-white/20' 
                          : 'bg-black/30 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 group-hover:scale-110'
                      }`} />
                      
                      {/* Click pulse effect */}
                      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-[3] transition-transform duration-300 opacity-50" />
                    </div>
                    
                    {/* Year label */}
                    <div className={`transition-all duration-300 ${
                      isActive 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-70 -translate-x-1 group-hover:opacity-90 group-hover:translate-x-0'
                    }`}>
                      <div className={`text-sm font-semibold ${isActive ? 'text-white/90' : 'text-white/70'}`}>
                        {year}
                      </div>
                      <div className="text-xs text-white/40">{count} posts</div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add CSS for hiding scrollbar on mobile */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
