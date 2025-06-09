"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Grid, Target, MousePointer } from "lucide-react";

interface TestPoint {
  x: number;
  y: number;
  tested: boolean;
  passed: boolean;
  strategy?: string;
}

type Strategy = "random" | "edge" | "corner" | "manual";

export function TestSpaceExploration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [testPoints, setTestPoints] = useState<TestPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });
  const [strategy, setStrategy] = useState<Strategy>("random");
  const [speed, setSpeed] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  
  // Triangle vertices (normalized to 0-1 range)
  const triangle = {
    v1: { x: 0.5, y: 0.15 },
    v2: { x: 0.2, y: 0.75 },
    v3: { x: 0.8, y: 0.75 }
  };

  // Function being tested: checking if a point is inside a triangle
  const isInsideTriangle = (x: number, y: number): boolean => {
    const { v1, v2, v3 } = triangle;
    
    // Barycentric coordinate method
    const sign = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
      return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    };
    
    const d1 = sign({ x, y }, v1, v2);
    const d2 = sign({ x, y }, v2, v3);
    const d3 = sign({ x, y }, v3, v1);
    
    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    
    return !(hasNeg && hasPos);
  };

  // Generate test points using different strategies
  const generateTestPoints = (strat: Strategy): TestPoint[] => {
    const points: TestPoint[] = [];
    
    switch (strat) {
      case "random":
        // Random sampling - what example-based tests might do
        for (let i = 0; i < 30; i++) {
          points.push({
            x: Math.random(),
            y: Math.random(),
            tested: false,
            passed: false,
            strategy: "Random sampling"
          });
        }
        break;
        
      case "edge":
        // Property-based testing: discovers boundaries through shrinking
        // Start with random points
        for (let i = 0; i < 20; i++) {
          points.push({
            x: Math.random(),
            y: Math.random(),
            tested: false,
            passed: false,
            strategy: "Initial random"
          });
        }
        
        // Simulate shrinking: when a failure is found, test nearby points
        // This represents how Hypothesis would shrink to find minimal cases
        const failureRegions = [
          { x: 0.35, y: 0.45 }, // Near edge
          { x: 0.5, y: 0.7 },   // Near bottom edge
          { x: 0.25, y: 0.6 },  // Near left edge
        ];
        
        failureRegions.forEach(failure => {
          // Test points in decreasing distances (shrinking)
          for (let dist = 0.1; dist > 0.01; dist *= 0.5) {
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
              points.push({
                x: failure.x + Math.cos(angle) * dist,
                y: failure.y + Math.sin(angle) * dist,
                tested: false,
                passed: false,
                strategy: `Shrinking (dist: ${dist.toFixed(3)})`
              });
            }
          }
        });
        break;
        
      case "corner":
        // Corner cases and boundaries
        const corners = [
          { x: 0, y: 0, strategy: "Canvas corner" },
          { x: 1, y: 0, strategy: "Canvas corner" },
          { x: 0, y: 1, strategy: "Canvas corner" },
          { x: 1, y: 1, strategy: "Canvas corner" },
          { ...triangle.v1, strategy: "Triangle vertex" },
          { ...triangle.v2, strategy: "Triangle vertex" },
          { ...triangle.v3, strategy: "Triangle vertex" },
          { x: 0.5, y: 0.5, strategy: "Center point" }
        ];
        
        corners.forEach(corner => {
          points.push({ ...corner, tested: false, passed: false });
          // Add nearby points
          for (let dx = -0.05; dx <= 0.05; dx += 0.05) {
            for (let dy = -0.05; dy <= 0.05; dy += 0.05) {
              if (dx === 0 && dy === 0) continue;
              points.push({
                x: Math.max(0, Math.min(1, corner.x + dx)),
                y: Math.max(0, Math.min(1, corner.y + dy)),
                tested: false,
                passed: false,
                strategy: "Near " + corner.strategy
              });
            }
          }
        });
        break;
    }
    
    return points;
  };

  const initializeDemo = () => {
    const points = generateTestPoints(strategy);
    setTestPoints(points);
    setCurrentIndex(0);
    setStats({ total: points.length, passed: 0, failed: 0 });
    setIsPlaying(false);
  };

  useEffect(() => {
    initializeDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy]);

  useEffect(() => {
    if (!isPlaying || currentIndex >= testPoints.length) {
      if (currentIndex >= testPoints.length) {
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTestPoints(prev => {
        const updated = [...prev];
        const point = updated[currentIndex];
        point.tested = true;
        point.passed = isInsideTriangle(point.x, point.y);
        return updated;
      });
      
      const point = testPoints[currentIndex];
      const passed = isInsideTriangle(point.x, point.y);
      
      setStats(prev => ({
        ...prev,
        passed: prev.passed + (passed ? 1 : 0),
        failed: prev.failed + (passed ? 0 : 1)
      }));
      
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentIndex, testPoints, speed]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const newPoint: TestPoint = {
      x,
      y,
      tested: true,
      passed: isInsideTriangle(x, y),
      strategy: "Manual click"
    };
    
    setTestPoints(prev => [...prev, newPoint]);
    setStats(prev => ({
      total: prev.total + 1,
      passed: prev.passed + (newPoint.passed ? 1 : 0),
      failed: prev.failed + (newPoint.passed ? 0 : 1)
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(156, 163, 175, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (height * i) / 10);
        ctx.lineTo(width, (height * i) / 10);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo((width * i) / 10, 0);
        ctx.lineTo((width * i) / 10, height);
        ctx.stroke();
      }
    }
    
    // Draw triangle
    ctx.strokeStyle = "#4B5563";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * triangle.v1.x, height * triangle.v1.y);
    ctx.lineTo(width * triangle.v2.x, height * triangle.v2.y);
    ctx.lineTo(width * triangle.v3.x, height * triangle.v3.y);
    ctx.closePath();
    ctx.stroke();
    
    // Fill triangle lightly
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.fill();
    
    // Draw test points
    testPoints.forEach((point, idx) => {
      if (!point.tested && idx !== currentIndex) return;
      
      ctx.beginPath();
      ctx.arc(
        point.x * width,
        point.y * height,
        idx === currentIndex && isPlaying ? 6 : 4,
        0,
        2 * Math.PI
      );
      
      if (idx === currentIndex && isPlaying) {
        // Currently testing
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#FEF3C7";
        ctx.fill();
      } else if (point.tested) {
        // Already tested
        ctx.fillStyle = point.passed ? "#10B981" : "#EF4444";
        ctx.fill();
      }
    });
    
    // Draw triangle vertices
    [triangle.v1, triangle.v2, triangle.v3].forEach(vertex => {
      ctx.beginPath();
      ctx.arc(vertex.x * width, vertex.y * height, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#3B82F6";
      ctx.fill();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testPoints, currentIndex, isPlaying, showGrid]);

  return (
    <div className="border-2 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h3 className="text-xl font-bold mb-4">How Property Testing Explores the Input Space</h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm mb-2">
          <strong>Property being tested:</strong> isInsideTriangle(x, y) correctly classifies points
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compare testing strategies: Random sampling vs intelligent shrinking. Property-based testing 
          doesn&apos;t know boundaries beforehand - it discovers them by shrinking failures to minimal cases.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setStrategy("random")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            strategy === "random" 
              ? "bg-blue-500 text-white shadow-md" 
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Zap className="w-4 h-4 inline mr-1" />
          Random (Example-based)
        </button>
        <button
          onClick={() => setStrategy("edge")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            strategy === "edge" 
              ? "bg-purple-500 text-white shadow-md" 
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Target className="w-4 h-4 inline mr-1" />
          Shrinking Discovery (Property-based)
        </button>
        <button
          onClick={() => setStrategy("corner")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            strategy === "corner" 
              ? "bg-green-500 text-white shadow-md" 
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Grid className="w-4 h-4 inline mr-1" />
          Corner Cases
        </button>
      </div>

      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full max-w-lg mx-auto cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ cursor: isInteractive ? 'crosshair' : 'default' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Tests</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {stats.passed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Inside</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">
            {stats.failed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Outside</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={currentIndex >= testPoints.length}
          className="px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isPlaying ? "Pause" : "Run Tests"}
        </button>
        <button
          onClick={initializeDemo}
          className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 flex items-center text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
        <button
          onClick={() => setIsInteractive(!isInteractive)}
          className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
            isInteractive 
              ? "bg-purple-500 text-white hover:bg-purple-600" 
              : "border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          }`}
        >
          <MousePointer className="w-4 h-4 mr-1" />
          {isInteractive ? "Interactive On" : "Click to Test"}
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="rounded"
          />
          <span>Show Grid</span>
        </label>
        <label className="flex items-center gap-2">
          <span>Speed:</span>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-gray-500">{speed}ms</span>
        </label>
      </div>

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs space-y-1">
        <p>🔵 Blue dots: Triangle vertices</p>
        <p>🟢 Green dots: Points inside the triangle</p>
        <p>🔴 Red dots: Points outside the triangle</p>
        <p>🟡 Yellow dot: Currently testing</p>
        {isInteractive && <p>👆 Click anywhere to manually test a point!</p>}
      </div>

      {currentIndex >= testPoints.length && testPoints.length > 0 && (
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-300 dark:border-purple-700">
          <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">
            Testing Complete!
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {strategy === "random" && "Random sampling might miss edge cases and boundary conditions."}
            {strategy === "edge" && "Property-based testing discovers boundaries through intelligent shrinking. When it finds failures, it automatically tests nearby points to find the minimal failing case."}
            {strategy === "corner" && "Corner cases and special values are critical for thorough testing."}
          </p>
        </div>
      )}
    </div>
  );
}