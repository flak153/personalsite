"use client";

import React, { useState, useEffect } from "react";

interface MemoryBlock {
  id: string;
  size: number;
  isAlive: boolean;
  isGarbage?: boolean; // Objects that will be collected
  position: number;
  newPosition?: number;
}

export default function MarkCompactVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initial memory layout with fragmentation and garbage objects
  const initialBlocks: MemoryBlock[] = [
    { id: "A", size: 32, isAlive: true, position: 0 },
    { id: "X", size: 16, isAlive: false, isGarbage: true, position: 32 }, // Will be garbage collected
    { id: "B", size: 64, isAlive: true, position: 48 },
    { id: "Y", size: 24, isAlive: false, isGarbage: true, position: 112 }, // Will be garbage collected
    { id: "free1", size: 8, isAlive: false, position: 136 },
    { id: "C", size: 16, isAlive: true, position: 144 },
    { id: "Z", size: 32, isAlive: false, isGarbage: true, position: 160 }, // Will be garbage collected
    { id: "free2", size: 32, isAlive: false, position: 192 },
    { id: "D", size: 48, isAlive: true, position: 224 },
    { id: "W", size: 24, isAlive: false, isGarbage: true, position: 272 }, // Will be garbage collected
  ];

  // Calculate new positions after compaction
  const compactedBlocks = (() => {
    let currentPosition = 0;
    return initialBlocks.map(block => {
      if (block.isAlive) {
        const newBlock = { ...block, newPosition: currentPosition };
        currentPosition += block.size;
        return newBlock;
      }
      return block;
    });
  })();

  const steps = [
    { 
      phase: "initial",
      description: "Initial heap state: Memory contains live objects, garbage objects (X, Y, Z, W), and free spaces",
      highlight: [],
      showStats: true
    },
    { 
      phase: "marking",
      description: "Mark phase: Live objects (A, B, C, D) are marked. Garbage objects (X, Y, Z, W) remain unmarked",
      highlight: [],
      showStats: true,
      showGarbageAsGarbage: true
    },
    { 
      phase: "calculating",
      description: "Calculate new positions: Ghost blocks (A', B', C', D') show where live objects will be moved",
      highlight: [],
      showStats: true,
      showNewPositions: true,
      showGarbageAsGarbage: true
    },
    { 
      phase: "compacting",
      description: "Compact phase: Move all live objects to the beginning, garbage objects are collected",
      highlight: [],
      showStats: true,
      animate: true,
      showGarbageAsGarbage: true
    },
    { 
      phase: "completed",
      description: "Compaction complete: Live objects are contiguous, garbage collected, one large free space created",
      highlight: [],
      showStats: true,
      showFinal: true
    }
  ];

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (isPlaying && step >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step, steps.length]);

  const currentStep = steps[step];
  const totalMemory = 296; // Total heap size
  const usedMemory = initialBlocks.filter(b => b.isAlive).reduce((sum, b) => sum + b.size, 0);
  const garbageMemory = initialBlocks.filter(b => !b.isAlive && b.isGarbage).reduce((sum, b) => sum + b.size, 0);
  const existingFreeMemory = initialBlocks.filter(b => !b.isAlive && !b.isGarbage).reduce((sum, b) => sum + b.size, 0);
  const freeMemory = totalMemory - usedMemory;
  const largestFreeBlock = currentStep.showFinal ? freeMemory : 
    Math.max(...initialBlocks.filter(b => !b.isAlive).map(b => b.size));

  const getBlockX = (block: MemoryBlock) => {
    if (currentStep.animate && block.newPosition !== undefined) {
      // Animate to new position
      return block.newPosition;
    } else if (currentStep.showFinal && block.newPosition !== undefined) {
      // Show final position
      return block.newPosition;
    }
    // Show original position
    return block.position;
  };

  const resetAnimation = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-xl font-bold mb-4 text-gray-800">Mark-Compact Memory Transformation</div>
      
      {/* Legend */}
      <div className="flex gap-6 mb-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-blue-400 border-2 border-blue-600 rounded"></div>
          <span className="text-gray-700">Live Objects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-red-300 border-2 border-red-600 rounded"></div>
          <span className="text-gray-700">Garbage Objects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
          <span className="text-gray-700">Free Space</span>
        </div>
      </div>
      
      {/* Memory visualization */}
      <div className="mb-6">
        <svg viewBox="0 0 600 200" className="w-full border border-gray-200 rounded">
          {/* Background */}
          <rect x="0" y="0" width="600" height="200" fill="#f9f9f9" />
          
          {/* Memory scale markers */}
          <text x="10" y="20" fontSize="12" fill="#666">0 KB</text>
          <text x="280" y="20" fontSize="12" fill="#666">148 KB</text>
          <text x="560" y="20" fontSize="12" fill="#666">296 KB</text>
          
          {/* Memory blocks */}
          <g transform="translate(10, 40)">
            {/* Draw all blocks */}
            {(currentStep.showFinal ? compactedBlocks : compactedBlocks).map((block) => {
              if (currentStep.showFinal && !block.isAlive) return null;
              
              const x = (getBlockX(block) / totalMemory) * 580;
              const width = (block.size / totalMemory) * 580;
              // const isHighlighted = currentStep.highlight.includes(block.id); // Removed as unused
              const isMoving = currentStep.animate && block.newPosition !== undefined;
              
              return (
                <g key={block.id}>
                  <rect
                    x={x}
                    y="0"
                    width={width}
                    height="80"
                    fill={block.isAlive ? "#60a5fa" : 
                          (block.isGarbage ? (currentStep.showGarbageAsGarbage ? "#fca5a5" : "#60a5fa") : "#e5e7eb")}
                    stroke={block.isAlive ? "#3b82f6" : 
                            (block.isGarbage ? (currentStep.showGarbageAsGarbage ? "#dc2626" : "#3b82f6") : "#9ca3af")}
                    strokeWidth="2"
                    style={{
                      transition: isMoving ? "all 1.5s ease-in-out" : "none"
                    }}
                  />
                  <text
                    x={x + width / 2}
                    y="45"
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill={block.isAlive ? "white" : (block.isGarbage && !currentStep.showGarbageAsGarbage ? "white" : "#666")}
                    style={{
                      transition: isMoving ? "all 1.5s ease-in-out" : "none"
                    }}
                  >
                    {block.isAlive ? `${block.id}` : (block.isGarbage ? block.id : "Free")}
                  </text>
                  <text
                    x={x + width / 2}
                    y="65"
                    textAnchor="middle"
                    fontSize="12"
                    fill={block.isAlive ? "white" : (block.isGarbage && !currentStep.showGarbageAsGarbage ? "white" : "#666")}
                    style={{
                      transition: isMoving ? "all 1.5s ease-in-out" : "none"
                    }}
                  >
                    {block.size}KB
                  </text>
                  
                  {/* Show new position arrow and ghost block */}
                  {currentStep.showNewPositions && block.newPosition !== undefined && block.position !== block.newPosition && (
                    <>
                      {/* Ghost block at new position */}
                      <rect
                        x={(block.newPosition / totalMemory) * 580}
                        y="0"
                        width={width}
                        height="80"
                        fill="#60a5fa"
                        fillOpacity="0.3"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="4,2"
                      />
                      <text
                        x={(block.newPosition / totalMemory) * 580 + width / 2}
                        y="45"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#3b82f6"
                        fontWeight="bold"
                      >
                        {block.id}&apos;
                      </text>
                      {/* Arrow from current to new position */}
                      <path
                        d={`M ${x + width/2} 85 Q ${x + width/2} 110 ${(block.newPosition / totalMemory) * 580 + width/2} 110 L ${(block.newPosition / totalMemory) * 580 + width/2} 85`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="5,3"
                        markerEnd="url(#arrowhead-blue)"
                      />
                    </>
                  )}
                </g>
              );
            })}
            
            {/* Show final free space */}
            {currentStep.showFinal && (
              <rect
                x={(usedMemory / totalMemory) * 580}
                y="0"
                width={(freeMemory / totalMemory) * 580}
                height="80"
                fill="#86efac"
                stroke="#22c55e"
                strokeWidth="2"
              />
            )}
            {currentStep.showFinal && (
              <text
                x={(usedMemory / totalMemory) * 580 + (freeMemory / totalMemory) * 290}
                y="45"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#166534"
              >
                Free Space
              </text>
            )}
            {currentStep.showFinal && (
              <text
                x={(usedMemory / totalMemory) * 580 + (freeMemory / totalMemory) * 290}
                y="65"
                textAnchor="middle"
                fontSize="12"
                fill="#166534"
              >
                {freeMemory}KB
              </text>
            )}
          </g>
          
          {/* Arrow markers */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Statistics */}
      {currentStep.showStats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded">
            <div className="text-sm text-gray-600">Live Memory</div>
            <div className="text-lg font-semibold text-blue-700">{usedMemory}KB</div>
          </div>
          <div className="bg-red-100 p-3 rounded">
            <div className="text-sm text-gray-600">Garbage</div>
            <div className="text-lg font-semibold text-red-700">{garbageMemory}KB</div>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="text-sm text-gray-600">Free Space</div>
            <div className="text-lg font-semibold text-gray-700">{existingFreeMemory}KB</div>
          </div>
          <div className={`p-3 rounded ${currentStep.showFinal ? 'bg-green-100' : 'bg-orange-100'}`}>
            <div className="text-sm text-gray-600">Largest Free</div>
            <div className={`text-lg font-semibold ${currentStep.showFinal ? 'text-green-700' : 'text-orange-700'}`}>
              {largestFreeBlock}KB
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="bg-gray-100 p-4 rounded mb-4 min-h-[60px]">
        <p className="text-sm font-medium text-gray-700">{currentStep.description}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={resetAnimation}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={step >= steps.length - 1}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setStep(Math.min(step + 1, steps.length - 1))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          disabled={step >= steps.length - 1}
        >
          Next Step
        </button>
      </div>

      {/* Key points */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <div className="font-semibold text-blue-900 mb-2">Key Benefits of Mark-Compact:</div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Eliminates memory fragmentation by moving live objects together</li>
          <li>• Creates a single large free space for efficient allocation</li>
          <li>• Improves cache locality by keeping related objects close</li>
          <li>• Trade-off: Longer GC pauses due to object relocation</li>
        </ul>
      </div>
    </div>
  );
}
