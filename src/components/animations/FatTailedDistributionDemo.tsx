"use client";

import React, { useState, useEffect, useRef } from "react";

interface FatTailedDistributionDemoProps {
  title?: string;
  description?: string;
}

const FatTailedDistributionDemo: React.FC<FatTailedDistributionDemoProps> = ({
  title = "Fat-Tailed Distributions & CLT",
  description = "Interactive: Observe sums from Cauchy/Pareto distributions."
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distribution, setDistribution] = useState<"normal" | "cauchy" | "pareto">("normal");
  const [sampleSize, setSampleSize] = useState(1);
  const [paretoAlpha, setParetoAlpha] = useState(1.5);
  const dataRef = useRef<number[]>([]);

  // Generate random values based on distribution
  const generateValue = (dist: string): number => {
    switch (dist) {
      case "normal":
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      case "cauchy":
        // Cauchy distribution (heavy tails, no mean)
        return Math.tan(Math.PI * (Math.random() - 0.5));
      
      case "pareto":
        // Pareto distribution with adjustable alpha
        const xm = 1; // minimum value
        const u = Math.random();
        if (u === 0) return xm;
        return xm / Math.pow(u, 1 / paretoAlpha);
      
      default:
        return 0;
    }
  };

  // Draw visualization
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Generate data if needed
    if (dataRef.current.length < 1000) {
      // Generate sample means
      for (let i = 0; i < 100; i++) {
        let sum = 0;
        for (let j = 0; j < sampleSize; j++) {
          sum += generateValue(distribution);
        }
        dataRef.current.push(sum / sampleSize);
      }
      
      // Keep only last 1000 values
      if (dataRef.current.length > 1000) {
        dataRef.current = dataRef.current.slice(-1000);
      }
    }

    // Create histogram
    const numBins = 100;
    const bins = new Array(numBins).fill(0);
    
    // Find reasonable bounds
    let minVal: number, maxVal: number;
    
    if (dataRef.current.length === 0) {
      minVal = -5;
      maxVal = 5;
    } else {
      // Use percentiles to handle outliers
      const sorted = [...dataRef.current].sort((a, b) => a - b);
      const p5 = sorted[Math.floor(sorted.length * 0.05)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      
      if (distribution === "normal" || sampleSize > 10) {
        // For normal or large samples, use tighter bounds
        minVal = Math.max(-10, p5);
        maxVal = Math.min(10, p95);
      } else {
        // For fat-tailed with small samples, use wider bounds
        minVal = Math.max(-20, Math.min(-1, p5));
        maxVal = Math.min(20, Math.max(1, p95));
      }
    }
    
    const range = maxVal - minVal;

    // Fill bins
    let leftOutliers = 0;
    let rightOutliers = 0;
    
    dataRef.current.forEach(value => {
      if (value < minVal) {
        leftOutliers++;
      } else if (value > maxVal) {
        rightOutliers++;
      } else {
        const binIndex = Math.floor((value - minVal) / range * numBins);
        const safeBinIndex = Math.max(0, Math.min(numBins - 1, binIndex));
        bins[safeBinIndex]++;
      }
    });

    // Draw histogram
    const maxCount = Math.max(...bins, 1);
    const barWidth = width / numBins;
    
    ctx.fillStyle = "#4ECDC4";
    bins.forEach((count, i) => {
      if (count > 0) {
        const barHeight = (count / maxCount) * (height - 100);
        ctx.fillRect(
          i * barWidth + 1, 
          height - barHeight - 40, 
          barWidth - 2, 
          barHeight
        );
      }
    });

    // Draw outlier indicators
    if (leftOutliers > 0) {
      ctx.fillStyle = "#FF6B6B";
      const barHeight = (leftOutliers / maxCount) * (height - 100);
      ctx.fillRect(0, height - barHeight - 40, 20, barHeight);
      ctx.fillStyle = "#FFF";
      ctx.font = "10px monospace";
      ctx.fillText(`<${leftOutliers}`, 2, height - 45);
    }
    
    if (rightOutliers > 0) {
      ctx.fillStyle = "#FF6B6B";
      const barHeight = (rightOutliers / maxCount) * (height - 100);
      ctx.fillRect(width - 20, height - barHeight - 40, 20, barHeight);
      ctx.fillStyle = "#FFF";
      ctx.font = "10px monospace";
      ctx.fillText(`${rightOutliers}>`, width - 18, height - 45);
    }

    // Draw axes
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height - 40);
    ctx.lineTo(width, height - 40);
    ctx.stroke();

    // Draw scale
    ctx.fillStyle = "#888";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    
    for (let i = 0; i <= 4; i++) {
      const value = minVal + (i / 4) * range;
      const x = (i / 4) * width;
      ctx.fillText(value.toFixed(1), x, height - 25);
      
      ctx.beginPath();
      ctx.moveTo(x, height - 40);
      ctx.lineTo(x, height - 35);
      ctx.stroke();
    }

    // Info panel
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, width, 60);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    
    const distName = distribution === "normal" ? "Normal" : 
                     distribution === "cauchy" ? "Cauchy (no mean!)" : 
                     `Pareto (α=${paretoAlpha.toFixed(1)})`;
    
    ctx.fillText(`Distribution: ${distName}`, 10, 20);
    ctx.fillText(`Sample size: n = ${sampleSize}`, 10, 40);
    
    // Calculate and show statistics
    if (dataRef.current.length > 0) {
      const mean = dataRef.current.reduce((a, b) => a + b) / dataRef.current.length;
      const variance = dataRef.current.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / dataRef.current.length;
      const stdDev = Math.sqrt(variance);
      
      ctx.textAlign = "right";
      ctx.fillText(`Samples: ${dataRef.current.length}`, width - 10, 20);
      ctx.fillText(`Mean: ${mean.toFixed(2)}, SD: ${stdDev.toFixed(2)}`, width - 10, 40);
    }

    // Draw theoretical normal curve if applicable
    if (distribution === "normal" && dataRef.current.length > 50) {
      const theoreticalSD = 1 / Math.sqrt(sampleSize);
      
      ctx.strokeStyle = "#FFD93D";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const value = minVal + (x / width) * range;
        const z = value / theoreticalSD;
        const density = Math.exp(-0.5 * z * z) / (theoreticalSD * Math.sqrt(2 * Math.PI));
        const expectedCount = density * (range / numBins) * dataRef.current.length;
        const y = height - 40 - (expectedCount / maxCount) * (height - 100);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      ctx.fillStyle = "#FFD93D";
      ctx.font = "10px monospace";
      ctx.fillText("Expected", width - 10, 55);
    }

    // Status message
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFF";
    
    if (sampleSize === 1) {
      ctx.fillText("n=1: Shows the original distribution", width / 2, height - 10);
    } else if (distribution === "normal") {
      ctx.fillStyle = "#4ECDC4";
      ctx.fillText(`✓ Normal: Averages concentrate around 0 with SD = 1/√${sampleSize}`, width / 2, height - 10);
    } else if (distribution === "cauchy") {
      ctx.fillStyle = "#ff6b6b";
      ctx.fillText("⚠️ Cauchy: Averages don't converge - still heavy-tailed!", width / 2, height - 10);
    } else if (distribution === "pareto" && paretoAlpha <= 1) {
      ctx.fillStyle = "#ff6b6b";
      ctx.fillText("⚠️ Pareto α≤1: No mean exists!", width / 2, height - 10);
    } else if (distribution === "pareto" && paretoAlpha <= 2) {
      ctx.fillStyle = "#ff6b6b";
      ctx.fillText("⚠️ Pareto α≤2: Infinite variance - CLT fails!", width / 2, height - 10);
    } else {
      ctx.fillText(`Pareto α>${paretoAlpha.toFixed(1)}: Slow convergence`, width / 2, height - 10);
    }
  };

  useEffect(() => {
    // Reset data when distribution or sample size changes
    dataRef.current = [];
    const interval = setInterval(() => {
      draw();
    }, 100);
    
    return () => clearInterval(interval);
  }, [distribution, sampleSize, paretoAlpha]);

  return (
    <div className="my-8 p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="space-y-4">
        <canvas 
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full border border-white/20 rounded bg-black/60"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Distribution Type
            </label>
            <select 
              value={distribution}
              onChange={(e) => setDistribution(e.target.value as any)}
              className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white"
            >
              <option value="normal">Normal (CLT works)</option>
              <option value="cauchy">Cauchy (CLT fails)</option>
              <option value="pareto">Pareto (heavy tail)</option>
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

          {distribution === "pareto" && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Pareto α: {paretoAlpha.toFixed(1)} 
                {paretoAlpha <= 1 ? " (no mean!)" : paretoAlpha <= 2 ? " (infinite variance!)" : ""}
              </label>
              <input 
                type="range"
                min="0.5"
                max="4"
                step="0.1"
                value={paretoAlpha}
                onChange={(e) => setParetoAlpha(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-black/20 rounded text-sm text-gray-300">
          <p className="mb-2">🎯 <strong>Key insight:</strong> Start with n=1 to see the original distribution, then increase n to see averaging effects.</p>
          <ul className="space-y-1 ml-4 mt-2">
            <li>• <strong>Normal:</strong> As n increases, averages concentrate tightly around 0</li>
            <li>• <strong>Cauchy:</strong> Even with large n, averages remain spread out with heavy tails</li>
            <li>• <strong>Pareto:</strong> With α ≤ 2, extreme values prevent convergence</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FatTailedDistributionDemo;