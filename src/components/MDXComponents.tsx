"use client";

import React, { useEffect } from "react";
import ReferenceCountingAnimation from './animations/ReferenceCountingAnimation';
import MarkAndSweepAnimation from './animations/MarkAndSweepAnimation';
import MarkCompactAnimation from './animations/MarkCompactAnimation';
import GenerationalCollectionAnimation from './animations/GenerationalCollectionAnimation';
import ConcurrentCollectionAnimation from './animations/ConcurrentCollectionAnimation';
import MemoryUsageVisualization from './animations/MemoryUsageVisualization';
import ApartmentBuildingMemoryAnalogy from './animations/ApartmentBuildingMemoryAnalogy';
import PlaceholderAnimation from './animations/PlaceholderAnimation';

// A Script component for executing client-side JavaScript
const Script = ({ children }: { children: any }) => {
  useEffect(() => {
    if (!children) return;
    
    try {
      // Create a new script element
      const script = document.createElement("script");
      script.type = "text/javascript";
      
      // Set the content (either a string or JSX children converted to string)
      const scriptContent = typeof children === "string" 
        ? children 
        : children.props?.children || String(children);
      
      script.text = scriptContent;
      
      // Append to document body
      document.body.appendChild(script);
      
      // Cleanup on unmount
      return () => {
        if (script && script.parentNode) {
          document.body.removeChild(script);
        }
      };
    } catch (error) {
      console.error("Error executing MDX script:", error);
    }
  }, [children]);
  
  // Don't render anything visible
  return null;
};

// A Canvas component with built-in animation for the bouncing ball example
const Canvas = ({ id, height = "200px" }: { id: string; height?: string }) => {
  useEffect(() => {
    // Only run this for the bouncingBall canvas to add the demo animation
    if (id === "bouncingBall") {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const width = canvas.width;
      const height = canvas.height;
      
      // Ball properties
      let x = width / 2;
      let y = height / 2;
      let dx = 2;
      let dy = -2;
      const radius = 20;
      
      // Animation function
      function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw the ball
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFF00";
        ctx.fill();
        ctx.closePath();
        
        // Bounce off edges
        if (x + dx > width - radius || x + dx < radius) {
          dx = -dx;
        }
        if (y + dy > height - radius || y + dy < radius) {
          dy = -dy;
        }
        
        // Update position
        x += dx;
        y += dy;
        
        // Continue animation
        requestAnimationFrame(draw);
      }
      
      // Start animation
      draw();
    }
    
    // Physics demo for the physicsDemo canvas
    if (id === "physicsDemo") {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const width = canvas.width;
      const height = canvas.height;
      
      // Physics objects
      const boxes: any[] = [];
      
      // Create initial boxes
      for (let i = 0; i < 10; i++) {
        boxes.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          width: 20 + Math.random() * 30,
          height: 20 + Math.random() * 30,
          vx: -1 + Math.random() * 2,
          vy: -1 + Math.random() * 2,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      }
      
      // Animation function
      function update() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw ground
        ctx.fillStyle = "#333";
        ctx.fillRect(0, height - 20, width, 20);
        
        // Update and draw boxes
        boxes.forEach(box => {
          // Apply gravity
          box.vy += 0.1;
          
          // Update position
          box.x += box.vx;
          box.y += box.vy;
          
          // Bounce off walls
          if (box.x < 0 || box.x + box.width > width) {
            box.vx *= -0.8;
            box.x = box.x < 0 ? 0 : width - box.width;
          }
          
          // Bounce off ground
          if (box.y + box.height > height - 20) {
            box.vy *= -0.8;
            box.y = height - 20 - box.height;
            
            // Apply friction
            box.vx *= 0.95;
          }
          
          // Draw the box
          ctx.fillStyle = box.color;
          ctx.fillRect(box.x, box.y, box.width, box.height);
        });
        
        requestAnimationFrame(update);
      }
      
      // Add click event to create new boxes
      canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        boxes.push({
          x: clickX - 15,
          y: clickY - 15,
          width: 30,
          height: 30,
          vx: -2 + Math.random() * 4,
          vy: -2,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      });
      
      // Start animation
      update();
    }
    
    // Physics demo for the physicsDemo canvas
    if (id === "physicsDemo") {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const width = canvas.width;
      const height = canvas.height;
      
      // Physics objects
      const boxes: any[] = [];
      
      // Create initial boxes
      for (let i = 0; i < 10; i++) {
        boxes.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          width: 20 + Math.random() * 30,
          height: 20 + Math.random() * 30,
          vx: -1 + Math.random() * 2,
          vy: -1 + Math.random() * 2,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      }
      
      // Animation function
      function update() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw ground
        ctx.fillStyle = "#333";
        ctx.fillRect(0, height - 20, width, 20);
        
        // Update and draw boxes
        boxes.forEach(box => {
          // Apply gravity
          box.vy += 0.1;
          
          // Update position
          box.x += box.vx;
          box.y += box.vy;
          
          // Bounce off walls
          if (box.x < 0 || box.x + box.width > width) {
            box.vx *= -0.8;
            box.x = box.x < 0 ? 0 : width - box.width;
          }
          
          // Bounce off ground
          if (box.y + box.height > height - 20) {
            box.vy *= -0.8;
            box.y = height - 20 - box.height;
            
            // Apply friction
            box.vx *= 0.95;
          }
          
          // Draw the box
          ctx.fillStyle = box.color;
          ctx.fillRect(box.x, box.y, box.width, box.height);
        });
        
        requestAnimationFrame(update);
      }
      
      // Add click event to create new boxes
      canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        boxes.push({
          x: clickX - 15,
          y: clickY - 15,
          width: 30,
          height: 30,
          vx: -2 + Math.random() * 4,
          vy: -2,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      });
      
      // Start animation
      update();
    }
  }, [id, height]);
  
  return (
    <div className="my-6">
      <canvas 
        id={id} 
        style={{ width: "100%", height }} 
        className="border border-white/20 rounded-lg bg-black/20"
      />
    </div>
  );
};

// A component to embed external demos
const Demo = ({ src, height = "500px" }: { src: string; height?: string }) => {
  return (
    <div className="my-6 border border-white/20 rounded-lg overflow-hidden bg-black/20">
      <iframe 
        src={src} 
        style={{ width: "100%", height }} 
        className="border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};

// A simple table of contents component that can be added directly in MDX
const TableOfContents = ({ headings }: { headings: Array<{ title: string, link: string }> }) => {
  return (
    <div className="mb-8 p-5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
      <h3 className="text-xl font-bold mb-4 text-white text-center border-b border-white/20 pb-2">
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} className="text-lg">
            <a
              href={`#${heading.link}`}
              className="text-blue-300 hover:text-yellow-300 transition-colors duration-200"
            >
              → {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Callout component for important notes
const Callout = ({ 
  children, 
  type = "info" 
}: { 
  children: React.ReactNode; 
  type?: "info" | "warning" | "insight" | "danger" | string 
}) => {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    info: {
      bg: "bg-blue-900/20",
      border: "border-blue-700",
      icon: "💡"
    },
    warning: {
      bg: "bg-yellow-900/20",
      border: "border-yellow-700",
      icon: "⚠️"
    },
    insight: {
      bg: "bg-purple-900/20", 
      border: "border-purple-700",
      icon: "✨"
    },
    danger: {
      bg: "bg-red-900/20",
      border: "border-red-700",
      icon: "🚨"
    }
  };
  
  // Use info as the default type if the specified type doesn't exist
  const style = colors[type] || colors["info"];
  
  return (
    <div className={`my-6 p-4 ${style.bg} border-l-4 ${style.border} rounded-r-md`}>
      <div className="flex items-start">
        <div className="mr-2 text-xl">{style.icon}</div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Export all components
export const components = {
  // Custom components
  Canvas,
  Demo,
  Script,
  TableOfContents,
  Callout,
  
  // GC Animation components
  ReferenceCountingAnimation,
  MarkAndSweepAnimation,
  MarkCompactAnimation,
  GenerationalCollectionAnimation,
  ConcurrentCollectionAnimation,
  MemoryUsageVisualization,
  ApartmentBuildingMemoryAnalogy,
  PlaceholderAnimation,
  
  // Placeholder components for animations not yet implemented
  MemoryManagementVisualizedAsApartmentBuilding: () => (
    <ApartmentBuildingMemoryAnalogy />
  ),
  CommonMemoryManagementErrorsAndTheirConsequences: () => (
    <PlaceholderAnimation title="Common Memory Management Errors" />
  ),
  DeveloperControlledMemoryManagementWorkflow: () => (
    <PlaceholderAnimation title="Developer-Controlled Memory Management Workflow" />
  ),
  HowAutomaticGarbageCollectionManagesMemory: () => (
    <PlaceholderAnimation title="How Automatic Garbage Collection Manages Memory" />
  ),
  ComparisonOfManualAndAutomaticMemoryManagement: () => (
    <PlaceholderAnimation title="Comparison of Manual and Automatic Memory Management" />
  ),
  TheGarbageCollectionTrilemma: () => (
    <PlaceholderAnimation title="The Garbage Collection Trilemma" />
  ),
  HowReferenceCountingTracksAndDeallocatesObjects: () => (
    <PlaceholderAnimation title="How Reference Counting Tracks and Deallocates Objects" />
  ),
  TryCreatingAndRemovingReferencesToSeeHowReferenceCountingWorks: () => (
    <PlaceholderAnimation title="Interactive Reference Counting Demo" />
  ),
  TheCyclicReferenceProblemThatPlaguesReferenceCounting: () => (
    <PlaceholderAnimation title="The Cyclic Reference Problem" />
  ),
  TheMarkAndSweepProcessIdentifyingAndReclaimingGarbage: () => (
    <PlaceholderAnimation title="The Mark and Sweep Process" />
  ),
  ImpactOfStopTheWorldPausesOnApplicationResponsiveness: () => (
    <PlaceholderAnimation title="Impact of Stop-The-World Pauses" />
  ),
  MarkCompactEliminatingMemoryFragmentationThroughCompaction: () => (
    <PlaceholderAnimation title="Mark-Compact Eliminating Memory Fragmentation" />
  ),
  HowMemoryFragmentationOccursAndItsImpactOnAllocationEfficiency: () => (
    <PlaceholderAnimation title="Memory Fragmentation and Allocation Efficiency" />
  ),
  ObjectLifecycleInAGenerationalGarbageCollector: () => (
    <PlaceholderAnimation title="Object Lifecycle in Generational GC" />
  ),
  TypicalObjectLifetimeDistributionShowingMostObjectsDieYoung: () => (
    <PlaceholderAnimation title="Object Lifetime Distribution" />
  ),
  HowObjectsMoveThroughGenerationsDuringTheirLifecycle: () => (
    <PlaceholderAnimation title="Objects Moving Through Generations" />
  ),
  HowApplicationThreadsAndGCWorkCanInterleaveWithoutGlobalPauses: () => (
    <PlaceholderAnimation title="Application Threads and GC Work Interleaving" />
  ),
  HowReadBarriersMaintainConsistentObjectReferencesDuringRelocation: () => (
    <PlaceholderAnimation title="Read Barriers and Consistent Object References" />
  ),
  HowLoadReferenceBarriersRedirectAccessToRelocatedObjects: () => (
    <PlaceholderAnimation title="Load Reference Barriers Redirecting Access" />
  ),
  TheFourCsOfC4AndHowTheyInteract: () => (
    <PlaceholderAnimation title="The Four C's of C4" />
  ),
  ContinuousVsDiscreteGarbageCollectionCycles: () => (
    <PlaceholderAnimation title="Continuous vs Discrete GC Cycles" />
  ),
  HowGCAndApplicationThreadsRunConcurrently: () => (
    <PlaceholderAnimation title="GC and Application Threads Running Concurrently" />
  ),
  BeforeAndAfterCompactionShowingImprovedMemoryLayout: () => (
    <PlaceholderAnimation title="Before and After Compaction" />
  ),
  HighLevelOverviewOfC4sArchitectureAndProcesses: () => (
    <PlaceholderAnimation title="C4 Architecture Overview" />
  ),
  HowConcurrentMarkingProceedsAlongsideApplicationExecution: () => (
    <PlaceholderAnimation title="Concurrent Marking Process" />
  ),
  ObjectRelocationProcessInC4: () => (
    <PlaceholderAnimation title="Object Relocation in C4" />
  ),
  HowReferencesAreUpdatedAsObjectsAreRelocated: () => (
    <PlaceholderAnimation title="Reference Updating During Relocation" />
  ),
  StepByStepExecutionOfAReadBarrier: () => (
    <PlaceholderAnimation title="Step-by-Step Read Barrier Execution" />
  ),
  MemoryRequirementsComparisonBetweenTraditionalGcAndC4: () => (
    <PlaceholderAnimation title="Memory Requirements: Traditional GC vs C4" />
  ),
  PauseTimeComparisonBetweenC4AndTraditionalCollectors: () => (
    <PlaceholderAnimation title="Pause Time Comparison" />
  ),
  ApplicationTypesAndTheirSuitabilityForC4: () => (
    <PlaceholderAnimation title="Application Types and C4 Suitability" />
  ),
  ResponseTimeDistributionForApplicationsWithAndWithoutC4: () => (
    <PlaceholderAnimation title="Response Time Distribution With/Without C4" />
  ),
  EvolutionOfGarbageCollectionAlgorithmsOverTime: () => (
    <PlaceholderAnimation title="Evolution of GC Algorithms" />
  ),
  KeyInsightsFromTheDevelopmentOfC4: () => (
    <PlaceholderAnimation title="Key Insights from C4 Development" />
  ),
  FeatureComparisonOfModernGarbageCollectorsInfluencedByC4: () => (
    <PlaceholderAnimation title="Feature Comparison of Modern GCs" />
  ),
  EmergingTrendsInGarbageCollectionResearch: () => (
    <PlaceholderAnimation title="Emerging Trends in GC Research" />
  ),
  HowMachineLearningMightOptimizeGarbageCollectionDecisions: () => (
    <PlaceholderAnimation title="ML-Optimized GC Decisions" />
  ),
  HowC4ReducesTraditionalGarbageCollectionTradeOffs: () => (
    <PlaceholderAnimation title="How C4 Reduces GC Trade-offs" />
  ),
  TheEvolutionOfMemoryManagementContinues: () => (
    <PlaceholderAnimation title="The Evolution of Memory Management" />
  ),
  EssentialResourcesForLearningMoreAboutAdvancedGarbageCollection: () => (
    <PlaceholderAnimation title="Resources for Learning Advanced GC" />
  ),
  
  // Additional placeholder components
  MemoryLeakVisualization: () => (
    <PlaceholderAnimation title="Memory Leak Visualization" />
  ),
  DanglingPointerVisualization: () => (
    <PlaceholderAnimation title="Dangling Pointer Visualization" />
  ),
  BufferOverflowVisualization: () => (
    <PlaceholderAnimation title="Buffer Overflow Visualization" />
  ),
  
  // Override HTML elements with styled versions
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-4xl font-bold mt-10 mb-6 text-white pb-2 border-b border-yellow-300/30">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-bold mt-8 mb-5 text-white text-yellow-200">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-bold mt-6 mb-4 text-white text-blue-200">{children}</h3>
  ),
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xl font-bold mt-5 mb-3 text-white text-green-200">{children}</h4>
  ),
  p: ({ children }: { children: React.ReactNode }) => {
    // If this is empty, don't render anything
    if (!children) return null;
    
    // Add a proper parent element to ensure React rendering works correctly
    return <div className="text-white text-lg mb-6 leading-relaxed max-w-4xl">{children}</div>;
  },
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="text-white mb-6 ml-5 space-y-3 custom-list max-w-4xl">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="text-white mb-6 ml-5 space-y-3 custom-list max-w-4xl">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => {
    // Find if this list item contains another list
    const hasNestedList = React.Children.toArray(children).some(
      child => React.isValidElement(child) && (child.type === 'ul' || child.type === 'ol')
    );
    
    return (
      <li className={`text-lg relative pl-7 ${hasNestedList ? 'custom-list-nested mb-3' : 'mb-1'} leading-relaxed`}>
        <span className="absolute left-0 top-1.5 text-yellow-200 text-xl">•</span>
        {children}
      </li>
    );
  },
  pre: (props: any) => {
    // Add custom styling while preserving original props for syntax highlighting
    return (
      <div className="my-8 rounded-lg overflow-hidden shadow-lg max-w-4xl border border-gray-700/50">
        <pre 
          {...props} 
          className={`${props.className || ''} shadow-inner`}
        />
      </div>
    );
  },
  code: (props: any) => {
    // If it's a code block (inside a pre), identified by having a className (e.g., language-js)
    if (props.className) {
      // Extract language from className (e.g., "language-javascript" -> "javascript")
      const language = props.className.replace('language-', '');
      
      return (
        <>
          {language && (
            <div className="bg-gray-800 px-4 py-2 text-sm text-blue-300 font-mono font-bold rounded-t-lg border-b border-gray-700 flex justify-between items-center">
              <span>{language}</span>
              <span className="text-xs text-gray-400">code snippet</span>
            </div>
          )}
          <code {...props} className={`${props.className} font-mono text-base`} />
        </>
      );
    }
    
    // For inline code, apply custom styling
    return <code className="bg-black/30 px-2 py-1 rounded font-mono text-yellow-300 font-bold" {...props} />;
  },
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a 
      href={href} 
      className="text-blue-300 hover:text-yellow-300 transition-colors duration-200 font-medium"
      target={href?.startsWith('http') ? "_blank" : undefined}
      rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-yellow-200 font-bold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-blue-200 italic">{children}</em>
  ),
  hr: () => (
    <hr className="border-t-2 border-yellow-200/20 my-8 max-w-4xl" />
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-yellow-300 pl-4 py-1 my-6 text-xl italic text-white/90 max-w-4xl">
      {children}
    </blockquote>
  ),
  img: (props: any) => (
    <img className="rounded-lg max-w-full my-6 border border-white/10" {...props} />
  )
};