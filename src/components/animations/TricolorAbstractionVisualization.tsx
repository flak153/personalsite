"use client";

import React, { useState, useEffect } from "react";

export default function TricolorAbstractionVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWriteBarrier, setShowWriteBarrier] = useState(false);

  // Define objects with their references
  const objects = [
    { id: "A", refs: ["B", "C"], x: 100, y: 100 },
    { id: "B", refs: ["D"], x: 250, y: 80 },
    { id: "C", refs: ["E"], x: 250, y: 150 },
    { id: "D", refs: [], x: 400, y: 60 },
    { id: "E", refs: ["F"], x: 400, y: 130 },
    { id: "F", refs: [], x: 400, y: 200 },
    { id: "G", refs: [], x: 100, y: 250 }, // Unreachable
    { id: "H", refs: ["G"], x: 250, y: 250 }, // Unreachable
  ];

  // Define marking steps
  const markingSteps = [
    { white: ["A","B","C","D","E","F","G","H"], gray: [], black: [], description: "Initial state: All objects are white (unvisited)" },
    { white: ["B","C","D","E","F","G","H"], gray: ["A"], black: [], description: "Root object A discovered, marked gray" },
    { white: ["D","E","F","G","H"], gray: ["B","C"], black: ["A"], description: "A's children (B, C) discovered and marked gray, A marked black" },
    { white: ["E","F","G","H"], gray: ["C","D"], black: ["A","B"], description: "B's child (D) marked gray, B marked black" },
    { white: ["F","G","H"], gray: ["D","E"], black: ["A","B","C"], description: "C's child (E) marked gray, C marked black" },
    { white: ["F","G","H"], gray: ["E"], black: ["A","B","C","D"], description: "D has no children, marked black" },
    { white: ["G","H"], gray: ["F"], black: ["A","B","C","D","E"], description: "E's child (F) marked gray, E marked black" },
    { white: ["G","H"], gray: [], black: ["A","B","C","D","E","F"], description: "F has no children, marked black. Marking complete!" },
  ];

  const writeBarrierStep = {
    white: ["G","H"], gray: ["B"], black: ["A","C","D","E","F"], 
    description: "Write barrier triggered: B → G reference added, B re-grayed",
    newRef: { from: "B", to: "G" }
  };

  useEffect(() => {
    if (isPlaying && step < markingSteps.length - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && step >= markingSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step]);

  const currentState = showWriteBarrier && step === markingSteps.length - 1 
    ? writeBarrierStep 
    : markingSteps[step];

  const getObjectColor = (id: string) => {
    if (currentState.black.includes(id)) return "#000000";
    if (currentState.gray.includes(id)) return "#808080";
    return "#FFFFFF";
  };

  const getObjectStroke = (id: string) => {
    if (currentState.black.includes(id)) return "#000000";
    if (currentState.gray.includes(id)) return "#404040";
    return "#CCCCCC";
  };

  const resetAnimation = () => {
    setStep(0);
    setIsPlaying(false);
    setShowWriteBarrier(false);
  };

  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-xl font-bold mb-4 text-gray-800">Tricolor Abstraction in Concurrent Marking</div>
      
      {/* Legend */}
      <div className="flex gap-6 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border-2 border-gray-400 rounded-full"></div>
          <span className="text-sm">White (Unvisited)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-500 border-2 border-gray-700 rounded-full"></div>
          <span className="text-sm">Gray (To Process)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black border-2 border-black rounded-full"></div>
          <span className="text-sm">Black (Complete)</span>
        </div>
      </div>

      {/* SVG Visualization */}
      <svg viewBox="0 0 550 350" className="w-full h-96 border border-gray-200 rounded mb-4">
        {/* Draw references */}
        {objects.map(obj => 
          obj.refs.map(ref => {
            const target = objects.find(o => o.id === ref);
            if (!target) return null;
            return (
              <line
                key={`${obj.id}-${ref}`}
                x1={obj.x}
                y1={obj.y}
                x2={target.x}
                y2={target.y}
                stroke="#CCCCCC"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })
        )}

        {/* Draw write barrier reference if active */}
        {showWriteBarrier && step === markingSteps.length - 1 && writeBarrierStep.newRef && (
          <line
            x1={objects.find(o => o.id === writeBarrierStep.newRef!.from)!.x}
            y1={objects.find(o => o.id === writeBarrierStep.newRef!.from)!.y}
            x2={objects.find(o => o.id === writeBarrierStep.newRef!.to)!.x}
            y2={objects.find(o => o.id === writeBarrierStep.newRef!.to)!.y}
            stroke="#FF6B6B"
            strokeWidth="3"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead-red)"
          />
        )}

        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#CCCCCC" />
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF6B6B" />
          </marker>
        </defs>

        {/* Draw objects */}
        {objects.map(obj => (
          <g key={obj.id}>
            <circle
              cx={obj.x}
              cy={obj.y}
              r="25"
              fill={getObjectColor(obj.id)}
              stroke={getObjectStroke(obj.id)}
              strokeWidth="3"
            />
            <text
              x={obj.x}
              y={obj.y + 5}
              textAnchor="middle"
              fill={currentState.black.includes(obj.id) ? "white" : "black"}
              fontSize="16"
              fontWeight="bold"
            >
              {obj.id}
            </text>
          </g>
        ))}

        {/* Root indicator */}
        <text x="100" y="75" textAnchor="middle" fill="#4B5563" fontSize="12" fontWeight="bold">
          ROOT
        </text>
        <line x1="100" y1="80" x2="100" y2="95" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Unreachable label */}
        <text x="175" y="280" textAnchor="middle" fill="#EF4444" fontSize="12" fontStyle="italic">
          (Unreachable)
        </text>
      </svg>

      {/* Description */}
      <div className="bg-gray-100 p-4 rounded mb-4 min-h-[60px]">
        <p className="text-sm font-medium text-gray-700">{currentState.description}</p>
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
          disabled={step >= markingSteps.length - 1 && !showWriteBarrier}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setStep(Math.min(step + 1, markingSteps.length - 1))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          disabled={step >= markingSteps.length - 1}
        >
          Next Step
        </button>
        {step === markingSteps.length - 1 && (
          <button
            onClick={() => setShowWriteBarrier(!showWriteBarrier)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            {showWriteBarrier ? "Hide" : "Show"} Write Barrier
          </button>
        )}
      </div>

      {/* Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <div className="font-semibold text-blue-900 mb-2">How it works:</div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• The GC starts from root objects and marks them gray (to be processed)</li>
          <li>• It processes gray objects by marking their children gray and marking themselves black</li>
          <li>• The process continues until no gray objects remain</li>
          <li>• White objects at the end are unreachable garbage</li>
          <li>• Write barriers detect when black objects get new references to white objects</li>
        </ul>
      </div>
    </div>
  );
}