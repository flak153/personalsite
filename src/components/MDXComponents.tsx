"use client";

import React, { useEffect, useState } from "react";
import ApartmentBuildingMemoryAnalogy from './animations/ApartmentBuildingMemoryAnalogy';
import PlaceholderAnimation from './animations/PlaceholderAnimation';
import GCEvolutionVisualization from './animations/GCEvolutionVisualization';
import TricolorAbstractionVisualization from './animations/TricolorAbstractionVisualization';
import MarkCompactVisualization from './animations/MarkCompactVisualization';
import CLTConvergenceDemo from './animations/CLTConvergenceDemo';
import FatTailedDistributionDemo from './animations/FatTailedDistributionDemo';
import IrisClassificationDemo from './animations/IrisClassificationDemo';
import ModelComparisonDemo from './animations/ModelComparisonDemo';
import BeforeAfterC4Comparison from './animations/BeforeAfterC4Comparison';
import HeapScanPointerHealing from './animations/HeapScanPointerHealing';
import PGPTool from './PGPTool'; // Import PGPTool
import DidVcExplorer from './DidVcExplorer'; // Import DidVcExplorer
import AsteroidsGame from './AsteroidsGameNew'; // Import AsteroidsGame
import DidVcExplorerEnhanced from './DidVcExplorerEnhanced'; // Import DidVcExplorerEnhanced
import DidVcExplorerMultiMethod from './DidVcExplorerMultiMethod'; // Import DidVcExplorerMultiMethod
import DidVcExplorerEnhancedV2 from './DidVcExplorerEnhancedV2'; // Import DidVcExplorerEnhancedV2
import { ShrinkingVisualization } from './animations/ShrinkingVisualization';
import { TestSpaceExploration } from './animations/TestSpaceExploration';
import { PropertyVsExampleComparison } from './animations/PropertyVsExampleComparison';
import dynamic from 'next/dynamic';
import { bouncingBallAnimation } from "@/app/blog/canvas-demos/bouncingBall";
import { physicsDemoAnimation } from "@/app/blog/canvas-demos/physicsDemo";
import { pulsingCircleAnimation } from "@/app/blog/canvas-demos/pulsingCircle";
import { interactiveDrawingAnimation } from "@/app/blog/canvas-demos/interactiveDrawing";
import { starfieldAnimation } from "@/app/blog/canvas-demos/starfield";
import ResourceLegend from './ResourceLegend';
import ResourceTypeIcon from './ResourceTypeIcon';
import InteractiveDecisionTree from './InteractiveDecisionTree';
import DatabaseDecisionTree from './DatabaseDecisionTree';
import DecisionTree from './DecisionTree';
import EngineeringDecisionTree from './EngineeringDecisionTree';
import DatabaseSelectionTree from './DatabaseSelectionTree';
import DatabasePerformanceComparison from './animations/DatabasePerformanceComparison';
import CodeBlock from './CodeBlock';

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
  type = "info",
  collapsible = false,
  defaultOpen = false,
  title
}: { 
  children: React.ReactNode; 
  type?: "info" | "warning" | "insight" | "danger" | string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  title?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    info: { bg: "bg-blue-900/20", border: "border-blue-700", icon: "💡" },
    warning: { bg: "bg-yellow-900/20", border: "border-yellow-700", icon: "⚠️" },
    insight: { bg: "bg-purple-900/20", border: "border-purple-700", icon: "✨" },
    danger: { bg: "bg-red-900/20", border: "border-red-700", icon: "🚨" }
  };
  const style = colors[type] || colors["info"];
  
  if (!collapsible) {
    return (
      <div className={`my-6 p-4 ${style.bg} border-l-4 ${style.border} rounded-r-md`}>
        <div className="flex items-start">
          <div className="mr-2 text-xl">{style.icon}</div>
          <div>{children}</div>
        </div>
      </div>
    );
  }
  
  // Extract title from children if not provided
  let extractedTitle = title;
  let content = children;
  
  if (!title && React.isValidElement(children)) {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length > 0) {
      const firstChild = childrenArray[0];
      if (React.isValidElement(firstChild)) {
        const props = firstChild.props as { children?: React.ReactNode };
        if (props.children) {
          const firstChildContent = props.children;
          if (typeof firstChildContent === 'string' && firstChildContent.includes('**')) {
            // Extract bolded text as title
            const match = firstChildContent.match(/\*\*(.*?)\*\*/);
            if (match) {
              extractedTitle = match[1];
              // Keep all content for expansion
              content = children;
            }
          }
        }
      }
    }
  }
  
  return (
    <div className={`my-6 ${style.bg} border-l-4 ${style.border} rounded-r-md overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left`}
      >
        <div className="flex items-center gap-2">
          <div className="text-xl">{style.icon}</div>
          <div className="font-medium text-white">
            {extractedTitle || "Click to expand"}
          </div>
        </div>
        <div className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-0">
          {content}
        </div>
      </div>
    </div>
  );
};

interface TableColumn {
  header: string;
  key: string;
  align?: "left" | "center" | "right";
}

interface TableRow {
  [key: string]: React.ReactNode;
}

const Table = ({
  columns,
  data,
  caption,
  variant = "default"
}: {
  columns: TableColumn[];
  data: TableRow[];
  caption?: string;
  variant?: "default" | "striped" | "bordered";
}) => {
  const getAlignment = (align?: string) => {
    switch (align) {
      case "center": return "text-center";
      case "right": return "text-right";
      default: return "text-left";
    }
  };

  const variants = {
    default: {
      wrapper: "bg-gradient-to-b from-gray-800/40 to-gray-800/60 backdrop-blur-sm border border-gray-700 shadow-lg",
      header: "bg-gray-700/50 border-b-2 border-yellow-500/30",
      headerText: "text-yellow-400",
      row: "hover:bg-yellow-500/10 transition-all duration-200",
      cell: "text-gray-200",
      divider: "divide-y divide-gray-700/50"
    },
    striped: {
      wrapper: "bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-2xl",
      header: "bg-gradient-to-r from-blue-800/40 to-purple-800/40 border-b-2 border-blue-500/40",
      headerText: "text-blue-300",
      row: "odd:bg-white/[0.03] even:bg-white/[0.06] hover:bg-blue-500/15 transition-all duration-200",
      cell: "text-gray-200",
      divider: ""
    },
    bordered: {
      wrapper: "bg-gray-800/60 backdrop-blur-sm border-2 border-yellow-500/40 shadow-yellow-500/20 shadow-xl",
      header: "bg-yellow-800/30 border-b-2 border-yellow-500/50",
      headerText: "text-yellow-300",
      row: "hover:bg-yellow-500/15 hover:shadow-lg transition-all duration-200",
      cell: "text-gray-200 border-r border-gray-700/50 last:border-r-0",
      divider: "divide-y-2 divide-gray-700/50"
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <div className="my-8 overflow-x-auto rounded-xl">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-xl shadow-xl">
          <table className={`min-w-full ${style.wrapper}`}>
            {caption && (
              <caption className="px-6 py-3 text-sm text-gray-400 bg-black/60 border-b border-gray-800">
                {caption}
              </caption>
            )}
            <thead className={style.header}>
              <tr>
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${style.headerText} ${getAlignment(col.align)}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {col.header}
                      <span className="opacity-20 text-lg">↓</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={style.divider}>
              {data.map((row, rowIdx) => (
                <tr key={rowIdx} className={`${style.row} group`}>
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`px-6 py-4 text-sm ${style.cell} ${getAlignment(col.align)} ${
                        colIdx === 0 ? 'font-medium text-white' : ''
                      }`}
                    >
                      <div className="relative">
                        {row[col.key]}
                        {colIdx === 0 && (
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  Table,
  Mermaid: MermaidDiagram, // Added Mermaid component
  MermaidDiagram, // Also export as MermaidDiagram
  PGPTool, // Add PGPTool to components
  DidVcExplorer, // Add DidVcExplorer to components
  DidVcExplorerEnhanced, // Add DidVcExplorerEnhanced to components
  DidVcExplorerMultiMethod, // Add DidVcExplorerMultiMethod to components
  DidVcExplorerEnhancedV2, // Add DidVcExplorerEnhancedV2 to components
  AsteroidsGame, // Add AsteroidsGame to components
  ResourceLegend,
  ResourceTypeIcon,
  InteractiveDecisionTree,
  DatabaseDecisionTree,
  DecisionTree,
  EngineeringDecisionTree,
  DatabaseSelectionTree,
  DatabasePerformanceComparison,
  
  ApartmentBuildingMemoryAnalogy,
  PlaceholderAnimation,
  GCEvolutionVisualization,
  TricolorAbstractionVisualization,
  MarkCompactVisualization,
  CLTConvergenceDemo,
  FatTailedDistributionDemo,
  IrisClassificationDemo,
  ModelComparisonDemo,
  BeforeAfterC4Comparison,
  HeapScanPointerHealing,
  ShrinkingVisualization,
  TestSpaceExploration,
  PropertyVsExampleComparison,
  
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
  pre: (props: React.HTMLAttributes<HTMLPreElement> & { fileName?: string; highlightLines?: string }) => {
    // Check if children is already a code element
    let codeElement: React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
    
    if (React.isValidElement(props.children)) {
      // Check if it's a code element
      if (typeof props.children.type === 'string' && props.children.type === 'code') {
        codeElement = props.children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      } else if (typeof props.children.type === 'function' && props.children.type.name === 'code') {
        codeElement = props.children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      } else if ((props.children as React.ReactElement<{ className?: string }>).props?.className?.includes('language-')) {
        // Direct code element with language class
        codeElement = props.children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      }
    } else {
      // Try to find code element in children array
      const childrenArray = React.Children.toArray(props.children);
      codeElement = childrenArray.find(
        child => React.isValidElement(child) && 
        (child.type === 'code' || (typeof child.type === 'function' && child.type.name === 'code'))
      ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
    }
    
    if (codeElement && codeElement.props.className?.includes('language-')) {
      // Parse highlight lines if provided (e.g., {1,3-5})
      const highlightLines: number[] = [];
      if (props.highlightLines) {
        const ranges = props.highlightLines.split(',');
        ranges.forEach(range => {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()));
            for (let i = start; i <= end; i++) {
              highlightLines.push(i);
            }
          } else {
            highlightLines.push(parseInt(range.trim()));
          }
        });
      }
      
      // Extract the raw text content from potentially highlighted code
      let codeContent = '';
      
      // If children is already syntax highlighted (contains spans), extract text
      if (React.isValidElement(codeElement.props.children)) {
        // This means it's already been processed by Prism
        const extractText = (node: React.ReactNode): string => {
          if (typeof node === 'string') return node;
          if (React.isValidElement(node)) {
            return React.Children.toArray((node as React.ReactElement<{children?: React.ReactNode}>).props.children).map(extractText).join('');
          }
          if (Array.isArray(node)) {
            return node.map(extractText).join('');
          }
          return '';
        };
        codeContent = extractText(codeElement.props.children);
      } else if (typeof codeElement.props.children === 'string') {
        codeContent = codeElement.props.children;
      } else if (Array.isArray(codeElement.props.children)) {
        // Handle array of mixed content
        const extractText = (node: React.ReactNode): string => {
          if (typeof node === 'string') return node;
          if (React.isValidElement(node)) {
            return React.Children.toArray((node as React.ReactElement<{children?: React.ReactNode}>).props.children).map(extractText).join('');
          }
          return '';
        };
        codeContent = codeElement.props.children.map(extractText).join('');
      }
      
      return (
        <CodeBlock
          className={codeElement.props.className}
          fileName={props.fileName}
          highlightLines={highlightLines}
          showLineNumbers={true}
          collapsible={true}
          startCollapsed={true}
        >
          {codeContent}
        </CodeBlock>
      );
    }
    
    // Fallback for non-code pre elements
    return (
      <div className="my-8 rounded-lg overflow-hidden shadow-lg max-w-4xl border border-gray-700/50">
        <pre {...props} className={`${props.className || ''} shadow-inner`} />
      </div>
    );
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Inline code only - block code is handled by pre
    if (!props.className?.includes('language-')) {
      return <code className="bg-black/30 px-2 py-1 rounded font-mono text-yellow-300/70 font-bold" {...props} />;
    }
    // Return as-is for block code (will be processed by pre)
    return <code {...props} />;
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
