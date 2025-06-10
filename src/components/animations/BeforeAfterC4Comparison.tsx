"use client";

import React, { useEffect, useRef, useState } from "react";

interface DataPoint {
  time: number;
  latency: number;
  isGC?: boolean;
  gcType?: "minor" | "major";
}

const BeforeAfterC4Comparison: React.FC = () => {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  
  const [beforeMetrics, setBeforeMetrics] = useState({
    current: 0,
    avg: 0,
    p99: 0,
    p999: 0,
    max: 0
  });
  
  const [afterMetrics, setAfterMetrics] = useState({
    current: 0,
    avg: 0,
    p99: 0,
    p999: 0,
    max: 0
  });

  // Data storage
  const beforeDataRef = useRef<DataPoint[]>([]);
  const afterDataRef = useRef<DataPoint[]>([]);
  const beforeLatenciesRef = useRef<number[]>([]);
  const afterLatenciesRef = useRef<number[]>([]);

  // Constants
  const WINDOW_SECONDS = 30;
  const POINTS_PER_SECOND = 20;
  const MAX_POINTS = WINDOW_SECONDS * POINTS_PER_SECOND;
  
  // GC timing
  const MAJOR_GC_INTERVAL = 12000; // 12 seconds
  const MINOR_GC_INTERVAL = 3000;  // 3 seconds
  const MAJOR_GC_DURATION = 800;   // 800ms pause
  const MINOR_GC_DURATION = 50;    // 50ms pause

  const generateLatency = (time: number, isC4: boolean): DataPoint => {
    const baseLatency = 5 + Math.random() * 5; // 5-10ms base
    
    if (isC4) {
      // C4: Consistent low latency with tiny variations
      const microPause = Math.random() < 0.001 ? 0.5 : 0; // Rare 0.5ms micro-pause
      return {
        time,
        latency: baseLatency + microPause + (Math.random() - 0.5) * 2
      };
    } else {
      // Traditional GC: Check for GC pauses
      const timeSinceMajor = time % MAJOR_GC_INTERVAL;
      const timeSinceMinor = time % MINOR_GC_INTERVAL;
      
      if (timeSinceMajor < MAJOR_GC_DURATION) {
        return {
          time,
          latency: 500 + Math.random() * 1500, // 500-2000ms major GC
          isGC: true,
          gcType: "major"
        };
      } else if (timeSinceMinor < MINOR_GC_DURATION) {
        return {
          time,
          latency: 50 + Math.random() * 100, // 50-150ms minor GC
          isGC: true,
          gcType: "minor"
        };
      }
      
      return { time, latency: baseLatency };
    }
  };

  const calculateMetrics = (latencies: number[]) => {
    if (latencies.length === 0) return { current: 0, avg: 0, p99: 0, p999: 0, max: 0 };
    
    const sorted = [...latencies].sort((a, b) => a - b);
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const p99Index = Math.floor(latencies.length * 0.99);
    const p999Index = Math.floor(latencies.length * 0.999);
    
    return {
      current: latencies[latencies.length - 1] || 0,
      avg: avg,
      p99: sorted[p99Index] || 0,
      p999: sorted[p999Index] || 0,
      max: Math.max(...latencies)
    };
  };

  const drawGraph = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    data: DataPoint[],
    isC4: boolean
  ) => {
    // Use display dimensions, not internal canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const leftPadding = 60; // More space for y-axis labels
    const rightPadding = 20;
    const bottomPadding = 20; // Extra space for x-axis
    const topPadding = 40; // Space for title
    const graphWidth = width - leftPadding - rightPadding;
    const graphHeight = height - topPadding - bottomPadding;
    
    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);
    
    // Log scale setup
    const minLatency = 1; // 1ms minimum
    const maxLatency = 10000; // 10 seconds maximum
    const logMin = Math.log10(minLatency);
    const logMax = Math.log10(maxLatency);
    
    // Convert latency to Y position using log scale
    const latencyToY = (latency: number) => {
      const clampedLatency = Math.max(minLatency, Math.min(maxLatency, latency));
      const logValue = Math.log10(clampedLatency);
      const normalized = (logValue - logMin) / (logMax - logMin);
      return height - bottomPadding - (normalized * graphHeight);
    };
    
    // Draw grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    
    // Horizontal grid lines for log scale (1, 10, 100, 1000, 10000)
    const gridValues = [1, 10, 100, 1000, 10000];
    gridValues.forEach(value => {
      const y = latencyToY(value);
      ctx.beginPath();
      ctx.moveTo(leftPadding, y);
      ctx.lineTo(width - rightPadding, y);
      ctx.stroke();
    });
    
    // Draw axes
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftPadding, topPadding);
    ctx.lineTo(leftPadding, height - bottomPadding);
    ctx.lineTo(width - rightPadding, height - bottomPadding);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = "#999";
    ctx.font = "12px monospace";
    ctx.textAlign = "right";
    
    gridValues.forEach(value => {
      const y = latencyToY(value);
      const label = value >= 1000 ? `${value/1000}s` : `${value}ms`;
      ctx.fillText(label, leftPadding - 10, y + 4);
    });
    
    // Draw data
    if (data.length > 1) {
      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = isC4 ? "#10b981" : "#ef4444";
      ctx.lineWidth = 2;
      
      data.forEach((point, i) => {
        const x = leftPadding + (i / MAX_POINTS) * graphWidth;
        const y = latencyToY(point.latency);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw GC markers
      data.forEach((point, i) => {
        if (point.isGC) {
          const x = leftPadding + (i / MAX_POINTS) * graphWidth;
          const y = latencyToY(point.latency);
          
          ctx.fillStyle = point.gcType === "major" ? "#dc2626" : "#f59e0b";
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    
    // Draw title
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      isC4 ? "With C4 (Pauseless GC)" : "Traditional GC",
      width / 2,
      25
    );
  };

  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    
    // Generate new data points
    const newBeforePoint = generateLatency(elapsed, false);
    const newAfterPoint = generateLatency(elapsed, true);
    
    // Add to data arrays
    beforeDataRef.current.push(newBeforePoint);
    afterDataRef.current.push(newAfterPoint);
    beforeLatenciesRef.current.push(newBeforePoint.latency);
    afterLatenciesRef.current.push(newAfterPoint.latency);
    
    // Keep only recent data
    if (beforeDataRef.current.length > MAX_POINTS) {
      beforeDataRef.current.shift();
      beforeLatenciesRef.current.shift();
    }
    if (afterDataRef.current.length > MAX_POINTS) {
      afterDataRef.current.shift();
      afterLatenciesRef.current.shift();
    }
    
    // Update metrics
    setBeforeMetrics(calculateMetrics(beforeLatenciesRef.current));
    setAfterMetrics(calculateMetrics(afterLatenciesRef.current));
    
    // Draw graphs
    const beforeCanvas = beforeCanvasRef.current;
    const afterCanvas = afterCanvasRef.current;
    
    if (beforeCanvas && afterCanvas) {
      const beforeCtx = beforeCanvas.getContext("2d");
      const afterCtx = afterCanvas.getContext("2d");
      
      if (beforeCtx && afterCtx) {
        drawGraph(beforeCanvas, beforeCtx, beforeDataRef.current, false);
        drawGraph(afterCanvas, afterCtx, afterDataRef.current, true);
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Set canvas resolution
    const setupCanvas = (canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set the internal size to match the display size
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Set the display size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };
    
    if (beforeCanvasRef.current) setupCanvas(beforeCanvasRef.current);
    if (afterCanvasRef.current) setupCanvas(afterCanvasRef.current);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const MetricsDisplay = ({ metrics, title, color }: { metrics: typeof beforeMetrics; title: string; color: string }) => (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className={`text-lg font-bold mb-3 ${color}`}>{title}</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-400">Current:</span>
          <span className="ml-2 font-mono text-white">{metrics.current.toFixed(1)}ms</span>
        </div>
        <div>
          <span className="text-gray-400">Average:</span>
          <span className="ml-2 font-mono text-white">{metrics.avg.toFixed(1)}ms</span>
        </div>
        <div>
          <span className="text-gray-400">99th %ile:</span>
          <span className="ml-2 font-mono text-white">{metrics.p99.toFixed(1)}ms</span>
        </div>
        <div>
          <span className="text-gray-400">99.9th %ile:</span>
          <span className="ml-2 font-mono text-white">{metrics.p999.toFixed(1)}ms</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-400">Max:</span>
          <span className="ml-2 font-mono text-white">{metrics.max.toFixed(1)}ms</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-8 p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Application Response Time: Before vs After C4
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Before C4 */}
        <div>
          <MetricsDisplay metrics={beforeMetrics} title="Traditional GC" color="text-red-400" />
          <div className="bg-gray-900 rounded p-2">
            <canvas
              ref={beforeCanvasRef}
              className="w-full"
              style={{ height: "280px", imageRendering: "crisp-edges" }}
            />
            <div className="flex justify-end gap-4 text-xs mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-gray-400">Major GC</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-gray-400">Minor GC</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* After C4 */}
        <div>
          <MetricsDisplay metrics={afterMetrics} title="C4 Pauseless GC" color="text-green-400" />
          <div className="bg-gray-900 rounded p-2">
            <canvas
              ref={afterCanvasRef}
              className="w-full"
              style={{ height: "280px", imageRendering: "crisp-edges" }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Real-time simulation showing 30-second window of application latency (logarithmic scale)</p>
        <p className="mt-1">Notice how traditional GC causes periodic spikes up to 2 seconds while C4 maintains consistent ~10ms latency</p>
      </div>
    </div>
  );
};

export default BeforeAfterC4Comparison;