"use client";

import React, { useEffect } from "react";
import ApartmentBuildingMemoryAnalogy from './animations/ApartmentBuildingMemoryAnalogy';
import PlaceholderAnimation from './animations/PlaceholderAnimation';
import GCEvolutionVisualization from './animations/GCEvolutionVisualization';
import TricolorAbstractionVisualization from './animations/TricolorAbstractionVisualization';
import MarkCompactVisualization from './animations/MarkCompactVisualization';
import CLTConvergenceDemo from './animations/CLTConvergenceDemo';
import FatTailedDistributionDemo from './animations/FatTailedDistributionDemo';
import PGPTool from './PGPTool'; // Import PGPTool
import DidVcExplorer from './DidVcExplorer'; // Import DidVcExplorer
import DidVcExplorerEnhanced from './DidVcExplorerEnhanced'; // Import DidVcExplorerEnhanced
import DidVcExplorerMultiMethod from './DidVcExplorerMultiMethod'; // Import DidVcExplorerMultiMethod
import DidVcExplorerEnhancedV2 from './DidVcExplorerEnhancedV2'; // Import DidVcExplorerEnhancedV2
import dynamic from 'next/dynamic';
import { bouncingBallAnimation } from "@/app/blog/canvas-demos/bouncingBall";
import { physicsDemoAnimation } from "@/app/blog/canvas-demos/physicsDemo";
import { pulsingCircleAnimation } from "@/app/blog/canvas-demos/pulsingCircle";
import { interactiveDrawingAnimation } from "@/app/blog/canvas-demos/interactiveDrawing";
import { starfieldAnimation } from "@/app/blog/canvas-demos/starfield";
import ResourceLegend from './ResourceLegend';
import ResourceTypeIcon from './ResourceTypeIcon';

// Dynamically import MermaidDiagram to avoid SSR issues
const MermaidDiagram = dynamic(
  () => import('./MermaidDiagram').catch((err) => {
    console.error('Failed to load MermaidDiagram component:', err);
    // Return a fallback component
    return {
      default: ({ code }: { code: string }) => (
        <div className="my-8 p-6 bg-red-50 rounded-lg shadow-lg border border-red-200">
          <p className="text-red-600 text-center font-semibold mb-2">
            Failed to load Mermaid diagram component
          </p>
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer text-center">Show diagram code</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
              <code>{code}</code>
            </pre>
          </details>
        </div>
      )
    };
  }), 
  {
    ssr: false,
    loading: () => (
      <div className="my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200 text-center text-gray-500">
        Loading diagram...
      </div>
    )
  }
);

// A Script component for executing client-side JavaScript
const Script = ({ children }: { children: string | { props?: { children?: string } } }) => {
  useEffect(() => {
    if (!children) return;
    try {
      const script = document.createElement("script");
      script.type = "text/javascript";
      const scriptContent = typeof children === "string"
        ? children
        : (typeof children === "object" && children?.props?.children)
          ? children.props.children
          : String(children);
      script.text = scriptContent;
      document.body.appendChild(script);
      return () => {
        if (script && script.parentNode) {
          document.body.removeChild(script);
        }
      };
    } catch (error) {
      console.error("Error executing MDX script:", error);
    }
  }, [children]);
  return null;
};

// A Canvas component that can run different animations
const Canvas = ({ id, height = "200px", animationType }: { id: string; height?: string; animationType?: string }) => {
  useEffect(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Determine which animation to run based on id or animationType
    const type = animationType || id;

    if (type === "bouncingBall") {
      bouncingBallAnimation(canvas, ctx);
    } else if (type === "physicsDemo") {
      physicsDemoAnimation(canvas, ctx);
    } else if (type === "pulsingCircle") {
      pulsingCircleAnimation(canvas, ctx);
    } else if (type === "interactiveDrawing") {
      interactiveDrawingAnimation(canvas, ctx);
    } else if (type === "starfield") {
      starfieldAnimation(canvas, ctx);
    }
    // Add more animations here as needed
    // else if (type === "newAnimation") {
    //   newAnimationFunction(canvas, ctx);
    // }

  }, [id, height, animationType]);
  
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

const Callout = ({ 
  children, 
  type = "info" 
}: { 
  children: React.ReactNode; 
  type?: "info" | "warning" | "insight" | "danger" | string 
}) => {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    info: { bg: "bg-blue-900/20", border: "border-blue-700", icon: "💡" },
    warning: { bg: "bg-yellow-900/20", border: "border-yellow-700", icon: "⚠️" },
    insight: { bg: "bg-purple-900/20", border: "border-purple-700", icon: "✨" },
    danger: { bg: "bg-red-900/20", border: "border-red-700", icon: "🚨" }
  };
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

export const components = {
  Canvas,
  Demo,
  Script,
  TableOfContents,
  Callout,
  Mermaid: MermaidDiagram, // Added Mermaid component
  MermaidDiagram, // Also export as MermaidDiagram
  PGPTool, // Add PGPTool to components
  DidVcExplorer, // Add DidVcExplorer to components
  DidVcExplorerEnhanced, // Add DidVcExplorerEnhanced to components
  DidVcExplorerMultiMethod, // Add DidVcExplorerMultiMethod to components
  DidVcExplorerEnhancedV2, // Add DidVcExplorerEnhancedV2 to components
  ResourceLegend,
  ResourceTypeIcon,
  
  ApartmentBuildingMemoryAnalogy,
  PlaceholderAnimation,
  GCEvolutionVisualization,
  TricolorAbstractionVisualization,
  MarkCompactVisualization,
  CLTConvergenceDemo,
  FatTailedDistributionDemo,
  
  MemoryManagementVisualizedAsApartmentBuilding: () => <ApartmentBuildingMemoryAnalogy />,
  CommonMemoryManagementErrorsAndTheirConsequences: () => <PlaceholderAnimation title="Common Memory Management Errors" />,
  DeveloperControlledMemoryManagementWorkflow: () => <PlaceholderAnimation title="Developer-Controlled Memory Management Workflow" />,
  HowAutomaticGarbageCollectionManagesMemory: () => <PlaceholderAnimation title="How Automatic Garbage Collection Manages Memory" />,
  ComparisonOfManualAndAutomaticMemoryManagement: () => <PlaceholderAnimation title="Comparison of Manual and Automatic Memory Management" />,
  TheGarbageCollectionTrilemma: () => <PlaceholderAnimation title="The Garbage Collection Trilemma" />,
  HowReferenceCountingTracksAndDeallocatesObjects: () => <PlaceholderAnimation title="How Reference Counting Tracks and Deallocates Objects" />,
  TryCreatingAndRemovingReferencesToSeeHowReferenceCountingWorks: () => <PlaceholderAnimation title="Interactive Reference Counting Demo" />,
  TheCyclicReferenceProblemThatPlaguesReferenceCounting: () => <PlaceholderAnimation title="The Cyclic Reference Problem" />,
  TheMarkAndSweepProcessIdentifyingAndReclaimingGarbage: () => <PlaceholderAnimation title="The Mark and Sweep Process" />,
  ImpactOfStopTheWorldPausesOnApplicationResponsiveness: () => <PlaceholderAnimation title="Impact of Stop-The-World Pauses" />,
  MarkCompactEliminatingMemoryFragmentationThroughCompaction: () => <PlaceholderAnimation title="Mark-Compact Eliminating Memory Fragmentation" />,
  HowMemoryFragmentationOccursAndItsImpactOnAllocationEfficiency: () => <PlaceholderAnimation title="Memory Fragmentation and Allocation Efficiency" />,
  ObjectLifecycleInAGenerationalGarbageCollector: () => <PlaceholderAnimation title="Object Lifecycle in Generational GC" />,
  TypicalObjectLifetimeDistributionShowingMostObjectsDieYoung: () => <PlaceholderAnimation title="Object Lifetime Distribution" />,
  HowObjectsMoveThroughGenerationsDuringTheirLifecycle: () => <PlaceholderAnimation title="Objects Moving Through Generations" />,
  HowApplicationThreadsAndGCWorkCanInterleaveWithoutGlobalPauses: () => <PlaceholderAnimation title="Application Threads and GC Work Interleaving" />,
  HowReadBarriersMaintainConsistentObjectReferencesDuringRelocation: () => <PlaceholderAnimation title="Read Barriers and Consistent Object References" />,
  HowLoadReferenceBarriersRedirectAccessToRelocatedObjects: () => <PlaceholderAnimation title="Load Reference Barriers Redirecting Access" />,
  TheFourCsOfC4AndHowTheyInteract: () => <PlaceholderAnimation title="The Four C's of C4" />,
  ContinuousVsDiscreteGarbageCollectionCycles: () => <PlaceholderAnimation title="Continuous vs Discrete GC Cycles" />,
  HowGCAndApplicationThreadsRunConcurrently: () => <PlaceholderAnimation title="GC and Application Threads Running Concurrently" />,
  BeforeAndAfterCompactionShowingImprovedMemoryLayout: () => <PlaceholderAnimation title="Before and After Compaction" />,
  HighLevelOverviewOfC4sArchitectureAndProcesses: () => <PlaceholderAnimation title="C4 Architecture Overview" />,
  HowConcurrentMarkingProceedsAlongsideApplicationExecution: () => <PlaceholderAnimation title="Concurrent Marking Process" />,
  ObjectRelocationProcessInC4: () => <PlaceholderAnimation title="Object Relocation in C4" />,
  HowReferencesAreUpdatedAsObjectsAreRelocated: () => <PlaceholderAnimation title="Reference Updating During Relocation" />,
  StepByStepExecutionOfAReadBarrier: () => <PlaceholderAnimation title="Step-by-Step Read Barrier Execution" />,
  MemoryRequirementsComparisonBetweenTraditionalGcAndC4: () => <PlaceholderAnimation title="Memory Requirements: Traditional GC vs C4" />,
  PauseTimeComparisonBetweenC4AndTraditionalCollectors: () => <PlaceholderAnimation title="Pause Time Comparison" />,
  ApplicationTypesAndTheirSuitabilityForC4: () => <PlaceholderAnimation title="Application Types and C4 Suitability" />,
  ResponseTimeDistributionForApplicationsWithAndWithoutC4: () => <PlaceholderAnimation title="Response Time Distribution With/Without C4" />,
  EvolutionOfGarbageCollectionAlgorithmsOverTime: () => <PlaceholderAnimation title="Evolution of GC Algorithms" />,
  KeyInsightsFromTheDevelopmentOfC4: () => <PlaceholderAnimation title="Key Insights from C4 Development" />,
  FeatureComparisonOfModernGarbageCollectorsInfluencedByC4: () => <PlaceholderAnimation title="Feature Comparison of Modern GCs" />,
  EmergingTrendsInGarbageCollectionResearch: () => <PlaceholderAnimation title="Emerging Trends in GC Research" />,
  HowMachineLearningMightOptimizeGarbageCollectionDecisions: () => <PlaceholderAnimation title="ML-Optimized GC Decisions" />,
  HowC4ReducesTraditionalGarbageCollectionTradeOffs: () => <PlaceholderAnimation title="How C4 Reduces GC Trade-offs" />,
  TheEvolutionOfMemoryManagementContinues: () => <PlaceholderAnimation title="The Evolution of Memory Management" />,
  EssentialResourcesForLearningMoreAboutAdvancedGarbageCollection: () => <PlaceholderAnimation title="Resources for Learning Advanced GC" />,
  MemoryLeakVisualization: () => <PlaceholderAnimation title="Memory Leak Visualization" />,
  DanglingPointerVisualization: () => <PlaceholderAnimation title="Dangling Pointer Visualization" />,
  BufferOverflowVisualization: () => <PlaceholderAnimation title="Buffer Overflow Visualization" />,
  
  h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-4xl font-bold mt-10 mb-6 text-white pb-2 border-b border-yellow-300/30">{children}</h1>,
  h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-3xl font-bold mt-8 mb-5 text-white text-yellow-200">{children}</h2>,
  h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-2xl font-bold mt-6 mb-4 text-white text-blue-200">{children}</h3>,
  h4: ({ children }: { children: React.ReactNode }) => <h4 className="text-xl font-bold mt-5 mb-3 text-white text-green-200">{children}</h4>,
  p: ({ children }: { children: React.ReactNode }) => {
    if (!children) return null;
    return <div className="text-white text-lg mb-6 leading-relaxed max-w-4xl">{children}</div>;
  },
  ul: ({ children }: { children: React.ReactNode }) => <ul className="text-white mb-6 ml-5 space-y-3 custom-list max-w-4xl">{children}</ul>,
  ol: ({ children }: { children: React.ReactNode }) => <ol className="text-white mb-6 ml-5 space-y-3 custom-list max-w-4xl">{children}</ol>,
  li: ({ children }: { children: React.ReactNode }) => {
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
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    // Simplified pre component: only applies styling, no special Mermaid handling.
    // Mermaid diagrams will be handled by the <Mermaid code={...} /> component.
    return (
      <div className="my-8 rounded-lg overflow-hidden shadow-lg max-w-4xl border border-gray-700/50">
        <pre {...props} className={`${props.className || ''} shadow-inner`} />
      </div>
    );
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    if (props.className) {
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
  strong: ({ children }: { children: React.ReactNode }) => <strong className="text-yellow-200 font-bold">{children}</strong>,
  em: ({ children }: { children: React.ReactNode }) => <em className="text-blue-200 italic">{children}</em>,
  hr: () => <hr className="border-t-2 border-yellow-200/20 my-8 max-w-4xl" />,
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-yellow-300 pl-4 py-1 my-6 text-xl italic text-white/90 max-w-4xl">
      {children}
    </blockquote>
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="rounded-lg max-w-full my-6 border border-white/10" alt="" {...props} />
    </>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-black/60 border-b border-white/20">
      {children}
    </thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-white/10">
      {children}
    </tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-white/5 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-300 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
      {children}
    </td>
  )
};
