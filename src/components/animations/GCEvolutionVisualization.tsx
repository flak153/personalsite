"use client";

import React, { useState } from "react";
import { Info, TrendingUp, Clock, Cpu, HardDrive } from "lucide-react";

interface MemoryManagementApproach {
  name: string;
  year: string;
  latency: number; // 0-100, where 100 is best (lowest latency)
  throughput: number; // 0-100, where 100 is best
  memory: number; // 0-100, where 100 is best (most efficient)
  safety: number; // 0-100, where 100 is safest
  description: string;
  pros: string[];
  cons: string[];
  color: string;
}

const memoryApproaches: MemoryManagementApproach[] = [
  {
    name: "Manual Memory Management",
    year: "1970s",
    latency: 100,
    throughput: 95,
    memory: 95,
    safety: 20,
    description: "Programmer explicitly allocates and frees memory. Zero overhead but error-prone.",
    pros: ["No GC pauses", "Minimal overhead", "Predictable performance"],
    cons: ["Memory leaks", "Dangling pointers", "Buffer overflows", "High developer burden"],
    color: "#FF6B6B"
  },
  {
    name: "Reference Counting",
    year: "1960s-1980s",
    latency: 85,
    throughput: 70,
    memory: 70,
    safety: 60,
    description: "Objects track references. Immediate reclamation but can't handle cycles.",
    pros: ["Incremental collection", "Predictable overhead", "Simple to implement"],
    cons: ["Can't handle cycles", "Reference update overhead", "Memory for ref counts"],
    color: "#4ECDC4"
  },
  {
    name: "Stop-the-World GC",
    year: "1960s-1990s",
    latency: 15,
    throughput: 85,
    memory: 60,
    safety: 90,
    description: "Basic mark-sweep or mark-compact. Simple but causes long pauses.",
    pros: ["Handles cycles", "Simple implementation", "Complete collection"],
    cons: ["Long STW pauses", "Pause times scale with heap size", "Poor for interactive apps"],
    color: "#45B7D1"
  },
  {
    name: "Generational GC",
    year: "1980s-2000s",
    latency: 40,
    throughput: 80,
    memory: 75,
    safety: 90,
    description: "Exploits object lifetime patterns. Better average performance.",
    pros: ["Faster minor collections", "Good for typical workloads", "Reduced average pause"],
    cons: ["Still has major GC pauses", "Complex implementation", "Tuning required"],
    color: "#96CEB4"
  },
  {
    name: "Concurrent Mark-Sweep",
    year: "1990s-2010s",
    latency: 65,
    throughput: 65,
    memory: 55,
    safety: 90,
    description: "Concurrent marking reduces pauses but can't compact concurrently.",
    pros: ["Reduced pause times", "Concurrent marking", "Better latency"],
    cons: ["Fragmentation issues", "Lower throughput", "Complex barriers"],
    color: "#FFA500"
  },
  {
    name: "Pauseless GC (C4/ZGC/Shenandoah)",
    year: "2010s-Present",
    latency: 95,
    throughput: 80,
    memory: 75,
    safety: 95,
    description: "The holy grail: concurrent marking AND compaction. Near-zero pauses.",
    pros: ["Sub-millisecond pauses", "Scales to huge heaps", "Concurrent compaction", "Predictable latency"],
    cons: ["Complex implementation", "Slight throughput overhead", "Barrier costs"],
    color: "#DDA0DD"
  }
];

export default function GCEvolutionVisualization() {
  const [selectedApproach, setSelectedApproach] = useState<MemoryManagementApproach | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">The Evolution of Memory Management</h3>
      <p className="text-sm text-gray-600 mb-6">
        Each approach tries to improve on the limitations of previous ones. C4 represents the culmination of decades of research.
      </p>
      
      {/* Timeline */}
      <div className="relative mb-8">
        <div className="absolute left-0 right-0 top-12 h-1 bg-gray-300"></div>
        <div className="flex justify-between relative">
          {memoryApproaches.map((approach) => (
            <div
              key={approach.name}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => setSelectedApproach(approach === selectedApproach ? null : approach)}
            >
              <div className="text-xs text-gray-500 mb-1">{approach.year}</div>
              <div
                className={`w-6 h-6 rounded-full z-10 transition-all duration-200 ${
                  selectedApproach === approach ? 'ring-4 ring-opacity-50' : ''
                } group-hover:scale-125`}
                style={{ 
                  backgroundColor: approach.color
                }}
              ></div>
              <div className="text-xs mt-2 text-center max-w-[100px] group-hover:font-semibold">
                {approach.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div 
          className="bg-white p-4 rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          onMouseEnter={() => setHoveredMetric('latency')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold">Latency Performance</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            How well does it avoid pausing your application?
          </p>
          {selectedApproach && (
            <div className="mb-3 p-2 bg-blue-100 rounded text-xs text-gray-700">
              {selectedApproach.name === "Manual Memory Management" && 
                "Zero GC pauses since there's no garbage collector. Memory is freed immediately when the programmer calls free()."
              }
              {selectedApproach.name === "Reference Counting" && 
                "Very low pause times. Objects are freed immediately when their reference count hits zero, but updating counts adds small overhead to every pointer operation."
              }
              {selectedApproach.name === "Stop-the-World GC" && 
                "Entire application freezes during collection. Pause times grow with heap size - can be seconds or even minutes for large heaps."
              }
              {selectedApproach.name === "Generational GC" && 
                "Short pauses for minor GCs (young generation), but major GCs still cause long pauses. Better average latency but unpredictable spikes."
              }
              {selectedApproach.name === "Concurrent Mark-Sweep" && 
                "Marking happens concurrently, reducing pauses. But can't compact memory concurrently, so still has some STW pauses."
              }
              {selectedApproach.name === "Pauseless GC (C4/ZGC/Shenandoah)" && 
                "Revolutionary: both marking AND compaction happen concurrently. Sub-millisecond pauses regardless of heap size. The holy grail!"
              }
            </div>
          )}
          <div className="space-y-3">
            {(selectedApproach ? [selectedApproach] : memoryApproaches).map((approach) => {
              const latencyLabel = 
                approach.latency >= 90 ? "Sub-millisecond pauses" :
                approach.latency >= 70 ? "Low millisecond pauses" :
                approach.latency >= 50 ? "Noticeable pauses" :
                approach.latency >= 30 ? "Significant pauses" :
                "Multi-second freezes";
              
              return (
                <div key={approach.name} className="group">
                  <div className="flex items-center gap-2">
                    <div className="w-24 text-sm font-medium" style={{ color: approach.color }}>
                      {approach.name.split(' ')[0]}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${approach.latency}%`,
                          backgroundColor: approach.color,
                          opacity: hoveredMetric === 'latency' || !hoveredMetric || selectedApproach ? 1 : 0.3
                        }}
                      />
                    </div>
                    <div className="text-sm font-medium w-12 text-right">{approach.latency}%</div>
                  </div>
                  <div className="text-xs text-gray-500 ml-24">
                    {latencyLabel}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Worse (long pauses)</span>
              <span>Better (no pauses)</span>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-4 rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          onMouseEnter={() => setHoveredMetric('throughput')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold">Throughput</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            How much CPU time is available for your application?
          </p>
          {selectedApproach && (
            <div className="mb-3 p-2 bg-green-100 rounded text-xs text-gray-700">
              {selectedApproach.name === "Manual Memory Management" && 
                "Near-zero overhead. Only CPU cost is malloc/free calls. No background threads or scanning."
              }
              {selectedApproach.name === "Reference Counting" && 
                "Constant overhead on every pointer assignment to update reference counts. Can be 10-30% slower for pointer-heavy code."
              }
              {selectedApproach.name === "Stop-the-World GC" && 
                "Good throughput between collections, but the app does zero work during GC pauses. Overall throughput depends on pause frequency."
              }
              {selectedApproach.name === "Generational GC" && 
                "Optimized for common allocation patterns. Minor GCs are fast. Still loses time to major collections but less frequently."
              }
              {selectedApproach.name === "Concurrent Mark-Sweep" && 
                "GC threads compete with app threads for CPU. Typically 20-35% overhead from concurrent work and barriers."
              }
              {selectedApproach.name === "Pauseless GC (C4/ZGC/Shenandoah)" && 
                "Read/write barriers add ~5-20% overhead. But no stop-the-world means consistent throughput without sudden drops."
              }
            </div>
          )}
          <div className="space-y-3">
            {(selectedApproach ? [selectedApproach] : memoryApproaches).map((approach) => {
              const throughputLabel = 
                approach.throughput >= 90 ? "< 5% overhead" :
                approach.throughput >= 80 ? "5-20% overhead" :
                approach.throughput >= 70 ? "20-30% overhead" :
                approach.throughput >= 60 ? "30-40% overhead" :
                "> 40% overhead";
              
              return (
                <div key={approach.name} className="group">
                  <div className="flex items-center gap-2">
                    <div className="w-24 text-sm font-medium" style={{ color: approach.color }}>
                      {approach.name.split(' ')[0]}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${approach.throughput}%`,
                          backgroundColor: approach.color,
                          opacity: hoveredMetric === 'throughput' || !hoveredMetric || selectedApproach ? 1 : 0.3
                        }}
                      />
                    </div>
                    <div className="text-sm font-medium w-12 text-right">{approach.throughput}%</div>
                  </div>
                  <div className="text-xs text-gray-500 ml-24">
                    {throughputLabel}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Worse (high overhead)</span>
              <span>Better (low overhead)</span>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-4 rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          onMouseEnter={() => setHoveredMetric('memory')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold">Memory Efficiency</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            How efficiently does it use memory?
          </p>
          {selectedApproach && (
            <div className="mb-3 p-2 bg-purple-100 rounded text-xs text-gray-700">
              {selectedApproach.name === "Manual Memory Management" && 
                "Optimal memory use when done correctly. No GC metadata overhead. But prone to fragmentation without careful management."
              }
              {selectedApproach.name === "Reference Counting" && 
                "Each object needs space for reference count (typically 4-8 bytes). Can't reclaim circular references, leading to leaks."
              }
              {selectedApproach.name === "Stop-the-World GC" && 
                "Simple mark-sweep suffers from fragmentation. Mark-compact fixes this but requires extra space during compaction."
              }
              {selectedApproach.name === "Generational GC" && 
                "Space divided between generations. Some waste from survivor spaces. Better locality of reference for young objects."
              }
              {selectedApproach.name === "Concurrent Mark-Sweep" && 
                "Can't compact concurrently, so fragmentation accumulates over time. May need larger heaps to avoid frequent GCs."
              }
              {selectedApproach.name === "Pauseless GC (C4/ZGC/Shenandoah)" && 
                "Concurrent compaction prevents fragmentation. Some overhead from forwarding pointers and GC metadata, but very efficient overall."
              }
            </div>
          )}
          <div className="space-y-3">
            {(selectedApproach ? [selectedApproach] : memoryApproaches).map((approach) => {
              const memoryLabel = 
                approach.memory >= 90 ? "Minimal waste" :
                approach.memory >= 75 ? "Low fragmentation" :
                approach.memory >= 60 ? "Some fragmentation" :
                approach.memory >= 50 ? "Significant fragmentation" :
                "High overhead & fragmentation";
              
              return (
                <div key={approach.name} className="group">
                  <div className="flex items-center gap-2">
                    <div className="w-24 text-sm font-medium" style={{ color: approach.color }}>
                      {approach.name.split(' ')[0]}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${approach.memory}%`,
                          backgroundColor: approach.color,
                          opacity: hoveredMetric === 'memory' || !hoveredMetric || selectedApproach ? 1 : 0.3
                        }}
                      />
                    </div>
                    <div className="text-sm font-medium w-12 text-right">{approach.memory}%</div>
                  </div>
                  <div className="text-xs text-gray-500 ml-24">
                    {memoryLabel}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Worse (wasteful)</span>
              <span>Better (efficient)</span>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-4 rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          onMouseEnter={() => setHoveredMetric('safety')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold">Memory Safety</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            How well does it prevent memory errors?
          </p>
          {selectedApproach && (
            <div className="mb-3 p-2 bg-red-100 rounded text-xs text-gray-700">
              {selectedApproach.name === "Manual Memory Management" && 
                "Completely unsafe. Programmer errors lead to: segfaults, buffer overflows, use-after-free, double-free, memory leaks. Major security risk."
              }
              {selectedApproach.name === "Reference Counting" && 
                "Prevents many errors but not all. Still vulnerable to circular reference leaks. No protection against buffer overflows."
              }
              {selectedApproach.name === "Stop-the-World GC" && 
                "Safe from most memory errors. No dangling pointers or double-frees. Can still have logical leaks (unintended references)."
              }
              {selectedApproach.name === "Generational GC" && 
                "Same safety as basic GC. Generational hypothesis doesn't affect safety, just performance."
              }
              {selectedApproach.name === "Concurrent Mark-Sweep" && 
                "Safe like other tracing GCs. Concurrent operation doesn't compromise safety thanks to careful synchronization."
              }
              {selectedApproach.name === "Pauseless GC (C4/ZGC/Shenandoah)" && 
                "Excellent safety with minimal performance impact. Read/write barriers ensure consistency even during concurrent operations."
              }
            </div>
          )}
          <div className="space-y-3">
            {(selectedApproach ? [selectedApproach] : memoryApproaches).map((approach) => {
              const safetyLabel = 
                approach.safety >= 90 ? "Prevents most errors" :
                approach.safety >= 70 ? "Good protection" :
                approach.safety >= 50 ? "Some protection" :
                approach.safety >= 30 ? "Limited protection" :
                "Prone to leaks & crashes";
              
              return (
                <div key={approach.name} className="group">
                  <div className="flex items-center gap-2">
                    <div className="w-24 text-sm font-medium" style={{ color: approach.color }}>
                      {approach.name.split(' ')[0]}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${approach.safety}%`,
                          backgroundColor: approach.color,
                          opacity: hoveredMetric === 'safety' || !hoveredMetric || selectedApproach ? 1 : 0.3
                        }}
                      />
                    </div>
                    <div className="text-sm font-medium w-12 text-right">{approach.safety}%</div>
                  </div>
                  <div className="text-xs text-gray-500 ml-24">
                    {safetyLabel}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Worse (error-prone)</span>
              <span>Better (safe)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Approach Details */}
      {selectedApproach && (
        <div className="bg-white p-6 rounded-lg border-2 border-gray-300 mt-6">
          <h4 className="text-xl font-semibold mb-2" style={{ color: selectedApproach.color }}>
            {selectedApproach.name}
          </h4>
          <p className="text-gray-600 mb-4">{selectedApproach.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-700 mb-2">Advantages:</h5>
              <ul className="space-y-1">
                {selectedApproach.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-red-700 mb-2">Limitations:</h5>
              <ul className="space-y-1">
                {selectedApproach.cons.map((con, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!selectedApproach && (
        <div className="bg-blue-50 p-4 rounded border border-blue-200 flex items-start gap-2 mt-6">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="mb-2">
              Click on any point in the timeline to see detailed metrics for that approach.
            </p>
            <p>
              Notice how C4 and modern pauseless collectors achieve excellent scores across all dimensions - 
              they don&apos;t just make trade-offs, they push the boundaries of what&apos;s possible.
            </p>
          </div>
        </div>
      )}

      {selectedApproach && (
        <div className="text-center mt-6">
          <button
            onClick={() => setSelectedApproach(null)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to comparison view
          </button>
        </div>
      )}
    </div>
  );
}
