"use client";

import React, { useState } from "react";

export interface BaseNode {
  id: string;
}

export interface Decision extends BaseNode {
  type: "decision";
  question: string;
  description?: string;
  options: {
    label: string;
    nextId: string;
    impact?: string;
  }[];
}

export interface Outcome extends BaseNode {
  type: "outcome";
  title: string;
  description: string;
  sections?: {
    title: string;
    type: "list" | "grid" | "text" | "pills";
    variant?: "success" | "error" | "info" | "warning" | "neutral";
    content: string[] | { primary: string[]; alternatives?: string[] } | string;
    icon?: string;
  }[];
  footer?: string;
}

export type TreeNode = Decision | Outcome;

interface DecisionTreeProps {
  title?: string;
  data: Record<string, TreeNode>;
  startId?: string;
  className?: string;
  theme?: {
    container?: string;
    header?: string;
    question?: string;
    description?: string;
    optionButton?: string;
    optionLabel?: string;
    optionImpact?: string;
    outcomeTitle?: string;
    outcomeDescription?: string;
    sectionContainer?: string;
    backButton?: string;
    restartButton?: string;
    footer?: string;
  };
}

const defaultTheme = {
  container: "my-8 p-6 bg-gray-900 rounded-lg border border-gray-800",
  header: "text-xl font-bold text-gray-100",
  question: "text-lg font-semibold text-gray-100 mb-2",
  description: "text-gray-400 text-sm mb-4",
  optionButton: "w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group",
  optionLabel: "text-gray-100 font-medium",
  optionImpact: "text-sm text-gray-500 mt-1",
  outcomeTitle: "text-lg font-semibold text-gray-100 mb-2",
  outcomeDescription: "text-gray-300",
  sectionContainer: "space-y-4",
  backButton: "px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors",
  restartButton: "px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors",
  footer: "text-xs text-gray-500"
};

const variantStyles = {
  success: {
    container: "bg-green-900/20 p-4 rounded-lg border border-green-800",
    title: "font-semibold text-green-400 mb-2",
    icon: "text-green-400 mr-2",
    pill: "px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm"
  },
  error: {
    container: "bg-red-900/20 p-4 rounded-lg border border-red-800",
    title: "font-semibold text-red-400 mb-2",
    icon: "text-red-400 mr-2",
    pill: "px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm"
  },
  info: {
    container: "bg-blue-900/20 p-4 rounded-lg border border-blue-800",
    title: "font-semibold text-blue-400 mb-2",
    icon: "text-blue-400 mr-2",
    pill: "px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm"
  },
  warning: {
    container: "bg-purple-900/20 p-4 rounded-lg border border-purple-800",
    title: "font-semibold text-purple-400 mb-2",
    icon: "text-purple-400 mr-2",
    pill: "px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm"
  },
  neutral: {
    container: "bg-gray-800 p-4 rounded-lg",
    title: "text-white font-semibold mb-2",
    icon: "text-gray-400 mr-2",
    pill: "px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
  }
};

function isDecision(node: TreeNode): node is Decision {
  return node.type === "decision";
}

function isOutcome(node: TreeNode): node is Outcome {
  return node.type === "outcome";
}

export default function DecisionTree({
  title = "Interactive Decision Tree",
  data,
  startId = "start",
  className = "",
  theme = {}
}: DecisionTreeProps) {
  const [currentNodeId, setCurrentNodeId] = useState(startId);
  const [history, setHistory] = useState<string[]>([]);
  
  const mergedTheme = { ...defaultTheme, ...theme };
  const currentNode = data[currentNodeId];
  
  if (!currentNode) {
    return <div className={mergedTheme.container}>Error: Node not found</div>;
  }
  
  const handleChoice = (nextId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextId);
  };
  
  const handleBack = () => {
    if (history.length > 0) {
      const previousId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(previousId);
    }
  };
  
  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId(startId);
  };
  
  const renderSection = (section: Outcome["sections"][0]) => {
    const variant = section.variant || "neutral";
    const styles = variantStyles[variant];
    
    switch (section.type) {
      case "list":
        const items = section.content as string[];
        return (
          <div className={styles.container}>
            <h5 className={styles.title}>{section.title}</h5>
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start">
                  {section.icon && <span className={styles.icon}>{section.icon}</span>}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
        
      case "grid":
        const gridItems = section.content as string[];
        return (
          <div className={styles.container}>
            <h5 className={styles.title}>{section.title}</h5>
            <div className="grid md:grid-cols-2 gap-2">
              {gridItems.map((item, index) => (
                <div key={index} className="text-sm text-gray-300 flex items-start">
                  {section.icon && <span className={styles.icon}>{section.icon}</span>}
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
        
      case "text":
        return (
          <div className={styles.container}>
            <h5 className={styles.title}>{section.title}</h5>
            <p className="text-sm text-gray-300">
              {section.content as string}
            </p>
          </div>
        );
        
      case "pills":
        const pillData = section.content as { primary: string[]; alternatives?: string[] };
        return (
          <div className={styles.container}>
            <h5 className={styles.title}>{section.title}</h5>
            <div className="space-y-3">
              {pillData.primary.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Primary:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pillData.primary.map((item) => (
                      <span key={item} className={styles.pill}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pillData.alternatives && pillData.alternatives.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Alternatives:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pillData.alternatives.map((item) => (
                      <span key={item} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`${mergedTheme.container} ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={mergedTheme.header}>{title}</h3>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className={mergedTheme.backButton}
            >
              ← Back
            </button>
          )}
          {currentNodeId !== startId && (
            <button
              onClick={handleRestart}
              className={mergedTheme.restartButton}
            >
              Restart
            </button>
          )}
        </div>
      </div>
      
      {isDecision(currentNode) ? (
        <div className="space-y-4">
          <div>
            <h4 className={mergedTheme.question}>
              {currentNode.question}
            </h4>
            {currentNode.description && (
              <p className={mergedTheme.description}>
                {currentNode.description}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option.nextId)}
                className={mergedTheme.optionButton}
              >
                <div className="flex items-center justify-between">
                  <span className={mergedTheme.optionLabel}>{option.label}</span>
                  <span className="text-gray-500 group-hover:text-gray-300 transition-colors">→</span>
                </div>
                {option.impact && (
                  <p className={mergedTheme.optionImpact}>{option.impact}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : isOutcome(currentNode) ? (
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className={mergedTheme.outcomeTitle}>
              {currentNode.title}
            </h4>
            <p className={mergedTheme.outcomeDescription}>
              {currentNode.description}
            </p>
          </div>
          
          {currentNode.sections && (
            <div className={mergedTheme.sectionContainer}>
              {currentNode.sections.map((section, index) => (
                <div key={index}>
                  {renderSection(section)}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
      
      {currentNode && "footer" in currentNode && currentNode.footer && (
        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className={mergedTheme.footer}>
            {currentNode.footer}
          </p>
        </div>
      )}
    </div>
  );
}