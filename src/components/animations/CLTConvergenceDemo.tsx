"use client";

import React, { useState, useEffect, useRef } from "react";

interface CLTConvergenceDemoProps {
  title?: string;
  description?: string;
}

const CLTConvergenceDemo: React.FC<CLTConvergenceDemoProps> = ({
  title = "CLT Convergence Demo",
  description = "Interactive: Adjust sample size and original distribution to see convergence."
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distribution, setDistribution] = useState<"uniform" | "exponential" | "bimodal">("uniform");
  const [sampleSize, setSampleSize] = useState(10);
  const [numSamples, setNumSamples] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number>();

  // Generate random values based on distribution
  const generateValue = (dist: string): number => {
    switch (dist) {
      case "uniform":
        return Math.random();
      case "exponential":
        return -Math.log(1 - Math.random()) / 2; // Rate = 2
      case "bimodal":
        return Math.random() < 0.5 
          ? 0.2 + 0.1 * (Math.random() - 0.5) 
          : 0.8 + 0.1 * (Math.random() - 0.5);
      default:
        return Math.random();
    }
  };

  // Generate sample means
  const generateSampleMeans = () => {
    const means: number[] = [];
    for (let i = 0; i < numSamples; i++) {
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        sum += generateValue(distribution);
      }
      means.push(sum / sampleSize);
    }
    return means;
  };

  // Draw histogram
  const drawHistogram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    const means = generateSampleMeans();
    const numBins = 80;
    const bins = new Array(numBins).fill(0);
    
    // Find min and max for scaling
    const min = Math.min(...means);
    const max = Math.max(...means);
    const range = max - min;

    // Fill bins
    means.forEach(mean => {
      const binIndex = Math.floor((mean - min) / range * (numBins - 1));
      bins[binIndex]++;
    });

    const maxCount = Math.max(...bins);
    const barWidth = width / numBins;
    
    // Draw histogram bars
    ctx.fillStyle = "#4ECDC4";
    bins.forEach((count, i) => {
      const barHeight = (count / maxCount) * (height - 40);
      ctx.fillRect(
        i * barWidth + 1, 
        height - barHeight - 20, 
        barWidth - 2, 
        barHeight
      );
    });

    // Draw normal curve overlay if sample size is large enough
    if (sampleSize >= 5) {
      const mean = means.reduce((a, b) => a + b) / means.length;
      const variance = means.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / means.length;
      const stdDev = Math.sqrt(variance);

      ctx.strokeStyle = "#FFD93D";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // Calculate the expected frequency for normal distribution
      const binWidth = range / numBins;
      
      for (let x = 0; x < width; x++) {
        const value = min + (x / width) * range;
        const z = (value - mean) / stdDev;
        // Normal PDF
        const density = Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
        // Convert density to expected count in histogram
        const expectedCount = density * binWidth * numSamples;
        // Scale to canvas
        const y = height - 20 - (expectedCount / maxCount) * (height - 40);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = "#888";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(min.toFixed(2), 30, height - 5);
    ctx.fillText(((min + max) / 2).toFixed(2), width / 2, height - 5);
    ctx.fillText(max.toFixed(2), width - 30, height - 5);
    
    // Info labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`n=${sampleSize}, samples=${numSamples}`, 10, 20);
    ctx.fillText(`Distribution: ${distribution}`, 10, 35);
    
    // Show convergence indicator
    if (sampleSize >= 30) {
      ctx.fillStyle = "#4ECDC4";
      ctx.fillText("✓ Converging to normal", 10, 50);
    }
  };

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        drawHistogram();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      drawHistogram();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [distribution, sampleSize, numSamples, isRunning]);

  return (
    <div className="my-8 p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="space-y-4">
        <canvas 
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full border border-white/20 rounded bg-black/60"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Original Distribution
            </label>
            <select 
              value={distribution}
              onChange={(e) => setDistribution(e.target.value as any)}
              className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white"
            >
              <option value="uniform">Uniform</option>
              <option value="exponential">Exponential</option>
              <option value="bimodal">Bimodal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Sample Size (n): {sampleSize}
            </label>
            <input 
              type="range"
              min="1"
              max="100"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Number of Samples: {numSamples}
            </label>
            <input 
              type="range"
              min="100"
              max="5000"
              step="100"
              value={numSamples}
              onChange={(e) => setNumSamples(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          {isRunning ? "Stop Animation" : "Start Animation"}
        </button>

        <div className="mt-4 p-4 bg-black/20 rounded text-sm text-gray-300">
          <p className="mb-2">🎯 <strong>Try this:</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• Start with n=1 and slowly increase to see convergence</li>
            <li>• Compare how different distributions converge at different rates</li>
            <li>• Notice the yellow normal curve overlay appears as n increases</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CLTConvergenceDemo;