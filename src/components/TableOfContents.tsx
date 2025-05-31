"use client";

import React, { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents = () => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  
  useEffect(() => {
    const processHeadings = () => {
      // Find all headings in the article (h2, h3, h4)
      const articleHeadings = Array.from(document.querySelectorAll('h2, h3, h4'))
        .map((heading) => {
          // Generate an ID if it doesn't exist
          if (!heading.id) {
            const id = heading.textContent?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') || `heading-${Math.random().toString(36).substr(2, 9)}`;
            heading.id = id;
          }
          
          return {
            id: heading.id,
            text: heading.textContent || "",
            level: parseInt(heading.tagName.substring(1), 10) // Get heading level (2 for h2, 3 for h3, etc.)
          };
        });
      
      return articleHeadings;
    };

    // Initial check
    const articleHeadings = processHeadings();
    
    // If no headings found, set up a MutationObserver to wait for content
    if (articleHeadings.length === 0) {
      const mutationObserver = new MutationObserver(() => {
        const newHeadings = processHeadings();
        if (newHeadings.length > 0) {
          setHeadings(newHeadings);
          mutationObserver.disconnect();
        }
      });

      // Observe the entire document for changes
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Set a timeout to disconnect the observer after 5 seconds
      const timeout = setTimeout(() => {
        mutationObserver.disconnect();
      }, 5000);

      // Cleanup
      return () => {
        clearTimeout(timeout);
        mutationObserver.disconnect();
      };
    } else {
      setHeadings(articleHeadings);
    }
  }, []);

  // Separate effect for intersection observer
  useEffect(() => {
    if (headings.length === 0) return;

    // Set up intersection observer for headings
    const headingElements = document.querySelectorAll('h2, h3, h4');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -66% 0px' }
    );
    
    headingElements.forEach((heading) => observer.observe(heading));
    
    return () => {
      observer.disconnect();
    };
  }, [headings]);
  
  if (headings.length === 0) {
    return null;
  }
  
  return (
    <nav className="toc p-4 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
        Table of Contents
      </h2>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            className="transition-all duration-200 ease-in-out"
            style={{ 
              paddingLeft: `${(heading.level - 2) * 0.75}rem`,
              marginBottom: heading.level === 2 ? '0.75rem' : '0.25rem' 
            }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition duration-200 ease-in-out hover:text-yellow-300 ${
                activeId === heading.id
                  ? 'text-yellow-300 font-bold'
                  : 'text-white/80'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;