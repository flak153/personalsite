"use client";

import { useEffect, useState } from "react";

export default function BlogTimeline() {
  const [yearData, setYearData] = useState<{ year: number; count: number }[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    const updateTimeline = () => {
      const yearMap = new Map<number, number>();
      
      // Find all visible blog post date elements
      const dateElements = document.querySelectorAll(".lg\\:col-span-3 .border.border-white\\/40 .text-white\\/90");
      
      dateElements.forEach(element => {
        const dateText = element.textContent?.trim();
        if (dateText) {
          const year = new Date(dateText).getFullYear();
          if (!isNaN(year) && year > 1970) {
            yearMap.set(year, (yearMap.get(year) || 0) + 1);
          }
        }
      });
      
      const data = Array.from(yearMap.entries())
        .sort(([a], [b]) => b - a)
        .map(([year, count]) => ({ year, count }));
      
      setYearData(data);
    };

    // Initial update
    updateTimeline();

    // Watch for DOM changes
    const observer = new MutationObserver(updateTimeline);
    const targetNode = document.querySelector(".lg\\:col-span-3");
    
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const postElements = document.querySelectorAll(".lg\\:col-span-3 .border.border-white\\/40");
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      let closestYear: number | null = null;
      let closestDistance = Infinity;
      
      postElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        
        if (distance < closestDistance) {
          const dateElement = element.querySelector(".text-white\\/90");
          if (dateElement) {
            const dateText = dateElement.textContent?.trim();
            if (dateText) {
              const year = new Date(dateText).getFullYear();
              if (!isNaN(year) && year > 1970) {
                closestYear = year;
                closestDistance = distance;
              }
            }
          }
        }
      });
      
      setActiveYear(closestYear);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (yearData.length === 0) return null;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-10">
      <div className="relative">
        {/* Year nodes */}
        <div className="relative">
          {yearData.map(({ year, count }, index) => (
            <div key={year} className="relative">
              <div className="relative flex items-center gap-3 group mb-6">
                {/* Circle node */}
                <button
                  onClick={() => {
                    // Find all posts and locate the first one from this year
                    const postElements = document.querySelectorAll(".lg\\:col-span-3 .border.border-white\\/40");
                    
                    for (const element of postElements) {
                      const dateElement = element.querySelector(".text-white\\/90");
                      if (dateElement) {
                        const dateText = dateElement.textContent?.trim();
                        if (dateText) {
                          const postYear = new Date(dateText).getFullYear();
                          if (postYear === year) {
                            // Scroll to this post
                            element.scrollIntoView({ behavior: "smooth", block: "center" });
                            break;
                          }
                        }
                      }
                    }
                  }}
                  className={`relative z-10 rounded-full transition-all duration-200 cursor-pointer ${
                    activeYear === year 
                      ? "w-6 h-6 bg-white/20 border-2 border-white/80" 
                      : "w-4 h-4 bg-transparent border border-white/40 hover:border-yellow-300 hover:bg-yellow-400/20 group-hover:scale-110"
                  }`}
                  aria-label={`Scroll to posts from ${year}`}
                >
                  {/* Pulse effect on hover */}
                  <span className="absolute inset-0 rounded-full bg-yellow-300/20 scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                </button>
                
                {/* Year label */}
                <div className={`flex items-center gap-1 transition-all duration-200 ${
                  activeYear === year 
                    ? "opacity-100" 
                    : "opacity-50 group-hover:opacity-90"
                }`}>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    activeYear === year ? "text-white" : "text-white"
                  }`}>
                    {year}
                  </span>
                  <span className={`text-xs ${
                    activeYear === year ? "text-white/80" : "text-white/40"
                  }`}>
                    ({count})
                  </span>
                </div>
              </div>
              
              {/* Line to next node */}
              {index < yearData.length - 1 && (
                <div className="absolute left-2 -bottom-6 w-0.5 h-6 bg-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}