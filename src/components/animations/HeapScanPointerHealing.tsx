"use client";

import React, { useState, useEffect } from "react";

interface HeapObject {
  id: string;
  fromSpacePos: { x: number; y: number };
  toSpacePos?: { x: number; y: number };
  hasForwardingPointer: boolean;
  color: string;
}

interface Pointer {
  id: string;
  fromObjId: string;
  toObjId: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  isStale: boolean;
  isHealed: boolean;
}

export default function HeapScanPointerHealing() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Define objects - some have been relocated to to-space
  const objects: HeapObject[] = [
    { id: "A", fromSpacePos: { x: 100, y: 80 }, toSpacePos: { x: 400, y: 80 }, hasForwardingPointer: true, color: "#93c5fd" },
    { id: "B", fromSpacePos: { x: 100, y: 160 }, toSpacePos: { x: 400, y: 160 }, hasForwardingPointer: true, color: "#a5b4fc" },
    { id: "C", fromSpacePos: { x: 100, y: 240 }, toSpacePos: { x: 400, y: 240 }, hasForwardingPointer: true, color: "#c7d2fe" },
    { id: "D", fromSpacePos: { x: 100, y: 320 }, color: "#fde68a", hasForwardingPointer: false }, // Not relocated yet
  ];

  // Define pointers - initially pointing to from-space (stale)
  const initialPointers: Pointer[] = [
    { 
      id: "p1", 
      fromObjId: "D", 
      toObjId: "A",
      fromPos: { x: 150, y: 320 },
      toPos: { x: 100, y: 80 }, // Initially points to from-space
      isStale: true,
      isHealed: false
    },
    {
      id: "p2",
      fromObjId: "D",
      toObjId: "B",
      fromPos: { x: 150, y: 330 },
      toPos: { x: 100, y: 160 }, // Initially points to from-space
      isStale: true,
      isHealed: false
    },
    {
      id: "p3",
      fromObjId: "External",
      toObjId: "C",
      fromPos: { x: 250, y: 360 },
      toPos: { x: 100, y: 240 }, // Initially points to from-space
      isStale: true,
      isHealed: false
    }
  ];

  const [pointers, setPointers] = useState(initialPointers);

  const steps = [
    {
      description: "Initial state: Objects A, B, C have been relocated to To-Space with forwarding pointers. Pointers are still stale (red).",
      highlightPointer: null,
      highlightObject: null,
      action: "none"
    },
    {
      description: "Heap scan begins. Checking for stale pointers that need healing.",
      highlightPointer: null,
      highlightObject: null,
      action: "scan-start"
    },
    {
      description: "Found first stale pointer (D → A). The pointer still points to From-Space.",
      highlightPointer: "p1",
      highlightObject: "A",
      action: "find-stale"
    },
    {
      description: "Consulting forwarding pointer at A's old location to find new address.",
      highlightPointer: "p1",
      highlightObject: "A",
      action: "consult-forward"
    },
    {
      description: "Updating pointer to point to A's new location in To-Space. Pointer healed (green)!",
      highlightPointer: "p1",
      highlightObject: "A",
      action: "heal-pointer"
    },
    {
      description: "Found second stale pointer (D → B).",
      highlightPointer: "p2",
      highlightObject: "B",
      action: "find-stale"
    },
    {
      description: "Consulting forwarding pointer and updating to B's new location.",
      highlightPointer: "p2",
      highlightObject: "B",
      action: "heal-pointer"
    },
    {
      description: "Found external stale pointer (External → C).",
      highlightPointer: "p3",
      highlightObject: "C",
      action: "find-stale"
    },
    {
      description: "Updating external pointer to C's new location in To-Space.",
      highlightPointer: "p3",
      highlightObject: "C",
      action: "heal-pointer"
    },
    {
      description: "Heap scan complete! All pointers have been healed and now point to To-Space.",
      highlightPointer: null,
      highlightObject: null,
      action: "complete"
    }
  ];

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && step >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step]);

  useEffect(() => {
    const currentStep = steps[step];

    // Update pointers based on step
    if (currentStep.action === "heal-pointer" && currentStep.highlightPointer) {
      setPointers(prev => prev.map(p => {
        if (p.id === currentStep.highlightPointer) {
          const targetObj = objects.find(o => o.id === p.toObjId);
          if (targetObj?.toSpacePos) {
            return {
              ...p,
              toPos: targetObj.toSpacePos,
              isStale: false,
              isHealed: true
            };
          }
        }
        return p;
      }));
    }
  }, [step]);

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
    setPointers(initialPointers);
  };

  const currentStep = steps[step];

  return (
    <div className="my-8 p-6 bg-gray-900 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-center text-white">
        Heap Scan and Pointer Healing Process
      </h3>

      <div className="mb-4 p-3 bg-blue-900/20 rounded text-sm text-blue-200 text-center min-h-[3em] flex items-center justify-center">
        {currentStep.description}
      </div>

      <svg viewBox="0 0 600 480" className="w-full max-w-4xl mx-auto">
        {/* Background regions */}
        <rect x="20" y="20" width="280" height="380" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" rx="8" />
        <rect x="320" y="20" width="280" height="380" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" rx="8" />
        
        {/* Region labels */}
        <text x="160" y="45" textAnchor="middle" className="fill-red-700 font-bold text-lg">From-Space (Old)</text>
        <text x="460" y="45" textAnchor="middle" className="fill-green-700 font-bold text-lg">To-Space (New)</text>

        {/* Objects */}
        {objects.map(obj => {
          const isHighlighted = currentStep.highlightObject === obj.id;
          
          return (
            <g key={obj.id}>
              {/* From-space object */}
              <rect
                x={obj.fromSpacePos.x - 40}
                y={obj.fromSpacePos.y - 20}
                width="80"
                height="40"
                fill={obj.hasForwardingPointer ? "#e5e7eb" : obj.color}
                stroke={obj.hasForwardingPointer ? "#6b7280" : "#1f2937"}
                strokeWidth={isHighlighted && currentStep.action === "consult-forward" ? "3" : "2"}
                strokeDasharray={obj.hasForwardingPointer ? "4 2" : "0"}
                rx="4"
              />
              <text
                x={obj.fromSpacePos.x}
                y={obj.fromSpacePos.y + 5}
                textAnchor="middle"
                className={`font-mono ${obj.hasForwardingPointer ? "fill-gray-500" : "fill-gray-900"}`}
              >
                {obj.id}
              </text>
              
              {/* Highlight effect on from-space when consulting forwarding pointer */}
              {isHighlighted && currentStep.action === "consult-forward" && (
                <circle
                  cx={obj.fromSpacePos.x}
                  cy={obj.fromSpacePos.y}
                  r="35"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from="35"
                    to="45"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0.2"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* To-space object */}
              {obj.toSpacePos && (
                <>
                  <rect
                    x={obj.toSpacePos.x - 40}
                    y={obj.toSpacePos.y - 20}
                    width="80"
                    height="40"
                    fill={obj.color}
                    stroke={isHighlighted && currentStep.action === "heal-pointer" ? "#16a34a" : "#1f2937"}
                    strokeWidth={isHighlighted && currentStep.action === "heal-pointer" ? "3" : "2"}
                    rx="4"
                  />
                  <text
                    x={obj.toSpacePos.x}
                    y={obj.toSpacePos.y + 5}
                    textAnchor="middle"
                    className="fill-gray-900 font-mono"
                  >
                    {obj.id}
                  </text>
                  
                  {/* Highlight effect on to-space when healing pointer */}
                  {isHighlighted && currentStep.action === "heal-pointer" && (
                    <circle
                      cx={obj.toSpacePos.x}
                      cy={obj.toSpacePos.y}
                      r="35"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="3"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        from="35"
                        to="45"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0.2"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </>
              )}
            </g>
          );
        })}
        
        {/* Continue with forwarding pointers... */}
        {objects.map(obj => (
          <g key={`forward-${obj.id}`}>

            {/* Forwarding pointer */}
            {obj.hasForwardingPointer && obj.toSpacePos && (
              <g>
                <defs>
                  <marker
                    id={`arrow-forward-${obj.id}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                  </marker>
                </defs>
                <line
                  x1={obj.fromSpacePos.x + 40}
                  y1={obj.fromSpacePos.y}
                  x2={obj.toSpacePos.x - 40}
                  y2={obj.toSpacePos.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  markerEnd={`url(#arrow-forward-${obj.id})`}
                  opacity={currentStep.action === "consult-forward" && currentStep.highlightPointer && 
                    pointers.find(p => p.id === currentStep.highlightPointer)?.toObjId === obj.id ? 1 : 0.5}
                />
                {currentStep.action === "consult-forward" && currentStep.highlightPointer && 
                  pointers.find(p => p.id === currentStep.highlightPointer)?.toObjId === obj.id && (
                  <text
                    x={(obj.fromSpacePos.x + obj.toSpacePos.x) / 2}
                    y={(obj.fromSpacePos.y + obj.toSpacePos.y) / 2 - 10}
                    textAnchor="middle"
                    className="fill-blue-600 text-sm font-bold"
                  >
                    Forwarding
                  </text>
                )}
              </g>
            )}
          </g>
        ))}

        {/* External reference source */}
        <rect x="200" y="360" width="100" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="4" />
        <text x="250" y="379" textAnchor="middle" className="fill-gray-900 text-sm">External Ref</text>

        {/* Pointers */}
        {pointers.map(pointer => {
          const isHighlighted = currentStep.highlightPointer === pointer.id;
          const strokeColor = pointer.isHealed ? "#16a34a" : "#dc2626";
          const strokeWidth = isHighlighted ? "3" : "2";
          const opacity = isHighlighted ? 1 : 0.7;

          return (
            <g key={pointer.id}>
              <defs>
                <marker
                  id={`arrow-${pointer.id}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={strokeColor} />
                </marker>
              </defs>
              <line
                x1={pointer.fromPos.x}
                y1={pointer.fromPos.y}
                x2={pointer.toPos.x}
                y2={pointer.toPos.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                markerEnd={`url(#arrow-${pointer.id})`}
                opacity={opacity}
              >
                {/* Animate line color transition when healing */}
                {isHighlighted && currentStep.action === "heal-pointer" && (
                  <animate
                    attributeName="stroke"
                    from="#dc2626"
                    to="#16a34a"
                    dur="0.5s"
                    fill="freeze"
                  />
                )}
              </line>
              
              {/* Highlight the pointer origin when it's being examined */}
              {isHighlighted && currentStep.action === "find-stale" && (
                <circle
                  cx={pointer.fromPos.x}
                  cy={pointer.fromPos.y}
                  r="8"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="3"
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    from="8"
                    to="15"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0.2"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* Show healing animation */}
              {isHighlighted && currentStep.action === "heal-pointer" && (
                <circle
                  cx={pointer.toPos.x}
                  cy={pointer.toPos.y}
                  r="5"
                  fill="#16a34a"
                  opacity="0"
                >
                  <animate
                    attributeName="r"
                    from="5"
                    to="20"
                    dur="0.6s"
                    begin="0s"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="0.6s"
                    begin="0s"
                  />
                </circle>
              )}
            </g>
          );
        })}


        {/* Legend */}
        <g transform="translate(20, 440)">
          <line x1="0" y1="0" x2="30" y2="0" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrow-legend-stale)" />
          <text x="35" y="4" className="fill-gray-300 text-xs">Stale Pointer</text>
          
          <line x1="120" y1="0" x2="150" y2="0" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrow-legend-healed)" />
          <text x="155" y="4" className="fill-gray-300 text-xs">Healed Pointer</text>
          
          <line x1="250" y1="0" x2="280" y2="0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow-legend-forward)" />
          <text x="285" y="4" className="fill-gray-300 text-xs">Forwarding Pointer</text>
          
          <defs>
            <marker id="arrow-legend-stale" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#dc2626" />
            </marker>
            <marker id="arrow-legend-healed" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#16a34a" />
            </marker>
            <marker id="arrow-legend-forward" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
            </marker>
          </defs>
        </g>
      </svg>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
        >
          Next
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mt-4 gap-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === step ? "bg-blue-500" : index < step ? "bg-green-500" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}