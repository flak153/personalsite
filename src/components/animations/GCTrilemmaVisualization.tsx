"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

interface MemoryManagementApproach {
  name: string;
  latency: number; // 0-100, where 100 is best (lowest latency)
  throughput: number; // 0-100, where 100 is best
  memory: number; // 0-100, where 100 is best (most efficient)
  description: string;
  color: string;
}

const memoryApproaches: MemoryManagementApproach[] = [
  {
    name: "Manual (C/C++)",
    latency: 100,
    throughput: 95,
    memory: 95,
    description: "Developer controls all allocation/deallocation. Zero overhead but error-prone (leaks, segfaults).",
    color: "#FF6B6B"
  },
  {
    name: "Reference Counting",
    latency: 85,
    throughput: 70,
    memory: 70,
    description: "Objects track their references. Immediate reclamation but can't handle cycles and has update overhead.",
    color: "#4ECDC4"
  },
  {
    name: "Basic Mark-Sweep",
    latency: 10,
    throughput: 85,
    memory: 50,
    description: "Simple tracing GC with stop-the-world pauses. Good throughput but terrible latency and fragmentation.",
    color: "#45B7D1"
  },
  {
    name: "Generational GC",
    latency: 40,
    throughput: 80,
    memory: 75,
    description: "Optimizes for young object collection. Better average latency but still has major GC pauses.",
    color: "#96CEB4"
  },
  {
    name: "Concurrent GC (CMS)",
    latency: 65,
    throughput: 65,
    memory: 55,
    description: "Marks concurrently to reduce pauses. Trades throughput for better latency, suffers fragmentation.",
    color: "#FFA500"
  },
  {
    name: "Modern Pauseless (C4/ZGC)",
    latency: 90,
    throughput: 80,
    memory: 70,
    description: "Concurrent marking AND compaction. Near-zero pauses with good throughput. The holy grail!",
    color: "#DDA0DD"
  }
];

export default function GCTrilemmaVisualization() {
  const [selectedApproach, setSelectedApproach] = useState<MemoryManagementApproach | null>(null);
  const [hoveredApproach, setHoveredApproach] = useState<MemoryManagementApproach | null>(null);

  // Convert approach metrics to triangle coordinates
  const getTrianglePosition = (approach: MemoryManagementApproach) => {
    // Triangle vertices (equilateral triangle)
    const topVertex = { x: 250, y: 50 }; // Latency
    const leftVertex = { x: 100, y: 300 }; // Throughput
    const rightVertex = { x: 400, y: 300 }; // Memory

    // Invert the scale for better visual representation
    // Lower values should be farther from their respective corners
    const latencyScore = approach.latency / 100;
    const throughputScore = approach.throughput / 100;
    const memoryScore = approach.memory / 100;

    // Calculate position using weighted coordinates
    // Each dimension pulls the point toward its corner based on its score
    const totalScore = latencyScore + throughputScore + memoryScore;
    
    // Normalize to ensure proper barycentric coordinates
    const latencyWeight = latencyScore / totalScore;
    const throughputWeight = throughputScore / totalScore;
    const memoryWeight = memoryScore / totalScore;

    // Calculate final position
    const x = latencyWeight * topVertex.x + throughputWeight * leftVertex.x + memoryWeight * rightVertex.x;
    const y = latencyWeight * topVertex.y + throughputWeight * leftVertex.y + memoryWeight * rightVertex.y;

    return { x, y };
  };

  const activeApproach = hoveredApproach || selectedApproach;

  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">The Garbage Collection Trilemma</h3>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Triangle Visualization */}
        <div className="flex-1">
          <svg width="500" height="350" viewBox="0 0 500 350" className="w-full h-auto">
            {/* Background triangle */}
            <polygon
              points="250,50 100,300 400,300"
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
            />
            
            {/* Grid lines for reference */}
            <line x1="250" y1="50" x2="250" y2="300" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="250" y1="50" x2="100" y2="300" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="250" y1="50" x2="400" y2="300" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="5,5" />
            
            {/* Labels */}
            <text x="250" y="30" textAnchor="middle" className="text-sm font-bold fill-gray-700">
              Low Latency
            </text>
            <text x="250" y="45" textAnchor="middle" className="text-xs fill-gray-500">
              (minimal pauses)
            </text>
            
            <text x="80" y="320" textAnchor="middle" className="text-sm font-bold fill-gray-700">
              High Throughput
            </text>
            <text x="80" y="335" textAnchor="middle" className="text-xs fill-gray-500">
              (max work done)
            </text>
            
            <text x="420" y="320" textAnchor="middle" className="text-sm font-bold fill-gray-700">
              Memory Efficient
            </text>
            <text x="420" y="335" textAnchor="middle" className="text-xs fill-gray-500">
              (minimal overhead)
            </text>
            
            {/* Trade-off arrows */}
            <path
              d="M 225 75 Q 175 100 150 150"
              fill="none"
              stroke="#ff9999"
              strokeWidth="2"
              markerEnd="url(#arrowred)"
            />
            <text x="160" y="110" className="text-xs fill-red-600" transform="rotate(-45 160 110)">
              trade-off
            </text>
            
            <path
              d="M 275 75 Q 325 100 350 150"
              fill="none"
              stroke="#ff9999"
              strokeWidth="2"
              markerEnd="url(#arrowred)"
            />
            <text x="320" y="110" className="text-xs fill-red-600" transform="rotate(45 320 110)">
              trade-off
            </text>
            
            <path
              d="M 150 290 Q 250 280 350 290"
              fill="none"
              stroke="#ff9999"
              strokeWidth="2"
              markerEnd="url(#arrowred)"
            />
            <text x="250" y="275" textAnchor="middle" className="text-xs fill-red-600">
              trade-off
            </text>
            
            {/* Arrow markers */}
            <defs>
              <marker
                id="arrowred"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff9999" />
              </marker>
            </defs>
            
            {/* Plot memory management approaches */}
            {memoryApproaches.map((approach) => {
              const pos = getTrianglePosition(approach);
              const isActive = activeApproach?.name === approach.name;
              const isSelected = selectedApproach?.name === approach.name;
              
              return (
                <g key={approach.name}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 12 : 8}
                    fill={approach.color}
                    stroke={isSelected ? "#333" : "white"}
                    strokeWidth={isSelected ? 3 : 2}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredApproach(approach)}
                    onMouseLeave={() => setHoveredApproach(null)}
                    onClick={() => setSelectedApproach(approach === selectedApproach ? null : approach)}
                  />
                  {isActive && (
                    <text
                      x={pos.x}
                      y={pos.y - 20}
                      textAnchor="middle"
                      className="text-sm font-bold fill-gray-800"
                    >
                      {approach.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Algorithm Details */}
        <div className="flex-1 space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold mb-2">Understanding the Trilemma</h4>
            <p className="text-sm text-gray-600 mb-2">
              Memory management approaches must balance three competing goals:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Low Latency:</strong> No pauses or interruptions</li>
              <li>• <strong>High Throughput:</strong> Minimal CPU overhead</li>
              <li>• <strong>Memory Efficiency:</strong> Minimal memory waste</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Manual management achieves all three but is error-prone. Early GCs sacrificed latency. 
              Modern pauseless collectors like C4 finally achieve the "holy grail" of good performance in all dimensions.
            </p>
          </div>
          
          {activeApproach && (
            <div className="bg-white p-4 rounded border-2 border-gray-300">
              <h4 className="font-semibold text-lg mb-2" style={{ color: activeApproach.color }}>
                {activeApproach.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{activeApproach.description}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Latency Performance</span>
                    <span>{activeApproach.latency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${activeApproach.latency}%`,
                        backgroundColor: activeApproach.color
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Throughput</span>
                    <span>{activeApproach.throughput}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${activeApproach.throughput}%`,
                        backgroundColor: activeApproach.color
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Efficiency</span>
                    <span>{activeApproach.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${activeApproach.memory}%`,
                        backgroundColor: activeApproach.color
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!activeApproach && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200 flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Click or hover over the dots in the triangle to explore different memory management approaches 
                and see how they balance the three competing goals.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {memoryApproaches.map((approach) => (
          <div
            key={approach.name}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedApproach(approach === selectedApproach ? null : approach)}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: approach.color }}
            />
            <span className="text-sm">{approach.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}