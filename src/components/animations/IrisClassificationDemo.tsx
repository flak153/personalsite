"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export default function IrisClassificationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [kNeighbors, setKNeighbors] = useState(3);
  const [selectedFeatures, setSelectedFeatures] = useState({ x: 0, y: 1 });

  const featureNames = useMemo(() => ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"], []);
  const colors = useMemo(() => ["#e74c3c", "#3498db", "#2ecc71"], []);
  const classNames = useMemo(() => ["Setosa", "Versicolor", "Virginica"], []);

  // Complete Iris dataset
  const irisData = {
    features: [
      // Setosa (0)
      [5.1, 3.5, 1.4, 0.2], [4.9, 3.0, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2], [4.6, 3.1, 1.5, 0.2],
      [5.0, 3.6, 1.4, 0.2], [5.4, 3.9, 1.7, 0.4], [4.6, 3.4, 1.4, 0.3], [5.0, 3.4, 1.5, 0.2],
      [4.4, 2.9, 1.4, 0.2], [4.9, 3.1, 1.5, 0.1], [5.4, 3.7, 1.5, 0.2], [4.8, 3.4, 1.6, 0.2],
      [4.8, 3.0, 1.4, 0.1], [4.3, 3.0, 1.1, 0.1], [5.8, 4.0, 1.2, 0.2], [5.7, 4.4, 1.5, 0.4],
      [5.4, 3.9, 1.3, 0.4], [5.1, 3.5, 1.4, 0.3], [5.7, 3.8, 1.7, 0.3], [5.1, 3.8, 1.5, 0.3],
      [5.4, 3.4, 1.7, 0.2], [5.1, 3.7, 1.5, 0.4], [4.6, 3.6, 1.0, 0.2], [5.1, 3.3, 1.7, 0.5],
      [4.8, 3.4, 1.9, 0.2], [5.0, 3.0, 1.6, 0.2], [5.0, 3.4, 1.6, 0.4], [5.2, 3.5, 1.5, 0.2],
      [5.2, 3.4, 1.4, 0.2], [4.7, 3.2, 1.6, 0.2], [4.8, 3.1, 1.6, 0.2], [5.4, 3.4, 1.5, 0.4],
      [5.2, 4.1, 1.5, 0.1], [5.5, 4.2, 1.4, 0.2], [4.9, 3.1, 1.5, 0.2], [5.0, 3.2, 1.2, 0.2],
      [5.5, 3.5, 1.3, 0.2], [4.9, 3.6, 1.4, 0.1], [4.4, 3.0, 1.3, 0.2], [5.1, 3.4, 1.5, 0.2],
      [5.0, 3.5, 1.3, 0.3], [4.5, 2.3, 1.3, 0.3], [4.4, 3.2, 1.3, 0.2], [5.0, 3.5, 1.6, 0.6],
      [5.1, 3.8, 1.9, 0.4], [4.8, 3.0, 1.4, 0.3], [5.1, 3.8, 1.6, 0.2], [4.6, 3.2, 1.4, 0.2],
      [5.3, 3.7, 1.5, 0.2], [5.0, 3.3, 1.4, 0.2],
      // Versicolor (1)
      [7.0, 3.2, 4.7, 1.4], [6.4, 3.2, 4.5, 1.5], [6.9, 3.1, 4.9, 1.5], [5.5, 2.3, 4.0, 1.3],
      [6.5, 2.8, 4.6, 1.5], [5.7, 2.8, 4.5, 1.3], [6.3, 3.3, 4.7, 1.6], [4.9, 2.4, 3.3, 1.0],
      [6.6, 2.9, 4.6, 1.3], [5.2, 2.7, 3.9, 1.4], [5.0, 2.0, 3.5, 1.0], [5.9, 3.0, 4.2, 1.5],
      [6.0, 2.2, 4.0, 1.0], [6.1, 2.9, 4.7, 1.4], [5.6, 2.9, 3.6, 1.3], [6.7, 3.1, 4.4, 1.4],
      [5.6, 3.0, 4.5, 1.5], [5.8, 2.7, 4.1, 1.0], [6.2, 2.2, 4.5, 1.5], [5.6, 2.5, 3.9, 1.1],
      [5.9, 3.2, 4.8, 1.8], [6.1, 2.8, 4.0, 1.3], [6.3, 2.5, 4.9, 1.5], [6.1, 2.8, 4.7, 1.2],
      [6.4, 2.9, 4.3, 1.3], [6.6, 3.0, 4.4, 1.4], [6.8, 2.8, 4.8, 1.4], [6.7, 3.0, 5.0, 1.7],
      [6.0, 2.9, 4.5, 1.5], [5.7, 2.6, 3.5, 1.0], [5.5, 2.4, 3.8, 1.1], [5.5, 2.4, 3.7, 1.0],
      [5.8, 2.7, 3.9, 1.2], [6.0, 2.7, 5.1, 1.6], [5.4, 3.0, 4.5, 1.5], [6.0, 3.4, 4.5, 1.6],
      [6.7, 3.1, 4.7, 1.5], [6.3, 2.3, 4.4, 1.3], [5.6, 3.0, 4.1, 1.3], [5.5, 2.5, 4.0, 1.3],
      [5.5, 2.6, 4.4, 1.2], [6.1, 3.0, 4.6, 1.4], [5.8, 2.6, 4.0, 1.2], [5.0, 2.3, 3.3, 1.0],
      [5.6, 2.7, 4.2, 1.3], [5.7, 3.0, 4.2, 1.2], [5.7, 2.9, 4.2, 1.3], [6.2, 2.9, 4.3, 1.3],
      [5.1, 2.5, 3.0, 1.1], [5.7, 2.8, 4.1, 1.3],
      // Virginica (2)
      [6.3, 3.3, 6.0, 2.5], [5.8, 2.7, 5.1, 1.9], [7.1, 3.0, 5.9, 2.1], [6.3, 2.9, 5.6, 1.8],
      [6.5, 3.0, 5.8, 2.2], [7.6, 3.0, 6.6, 2.1], [4.9, 2.5, 4.5, 1.7], [7.3, 2.9, 6.3, 1.8],
      [6.7, 2.5, 5.8, 1.8], [7.2, 3.6, 6.1, 2.5], [6.5, 3.2, 5.1, 2.0], [6.4, 2.7, 5.3, 1.9],
      [6.8, 3.0, 5.5, 2.1], [5.7, 2.5, 5.0, 2.0], [5.8, 2.8, 5.1, 2.4], [6.4, 3.2, 5.3, 2.3],
      [6.5, 3.0, 5.5, 1.8], [7.7, 3.8, 6.7, 2.2], [7.7, 2.6, 6.9, 2.3], [6.0, 2.2, 5.0, 1.5],
      [6.9, 3.2, 5.7, 2.3], [5.6, 2.8, 4.9, 2.0], [7.7, 2.8, 6.7, 2.0], [6.3, 2.7, 4.9, 1.8],
      [6.7, 3.3, 5.7, 2.1], [7.2, 3.2, 6.0, 1.8], [6.2, 2.8, 4.8, 1.8], [6.1, 3.0, 4.9, 1.8],
      [6.4, 2.8, 5.6, 2.1], [7.2, 3.0, 5.8, 1.6], [7.4, 2.8, 6.1, 1.9], [7.9, 3.8, 6.4, 2.0],
      [6.4, 2.8, 5.6, 2.2], [6.3, 2.8, 5.1, 1.5], [6.1, 2.6, 5.6, 1.4], [7.7, 3.0, 6.1, 2.3],
      [6.3, 3.4, 5.6, 2.4], [6.4, 3.1, 5.5, 1.8], [6.0, 3.0, 4.8, 1.8], [6.9, 3.1, 5.4, 2.1],
      [6.7, 3.1, 5.6, 2.4], [6.9, 3.1, 5.1, 2.3], [5.8, 2.7, 5.1, 1.9], [6.8, 3.2, 5.9, 2.3],
      [6.7, 3.3, 5.7, 2.5], [6.7, 3.0, 5.2, 2.3], [6.3, 2.5, 5.0, 1.9], [6.5, 3.0, 5.2, 2.0],
      [6.2, 3.4, 5.4, 2.3], [5.9, 3.0, 5.1, 1.8]
    ],
    labels: [
      // 50 Setosa
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      // 50 Versicolor
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      // 50 Virginica
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2
    ]
  };

  const allFeatures = irisData.features;
  const allLabels = irisData.labels;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get data bounds
    const xFeatures = allFeatures.map(f => f[selectedFeatures.x]);
    const yFeatures = allFeatures.map(f => f[selectedFeatures.y]);
    const xMin = Math.min(...xFeatures) - 0.5;
    const xMax = Math.max(...xFeatures) + 0.5;
    const yMin = Math.min(...yFeatures) - 0.5;
    const yMax = Math.max(...yFeatures) + 0.5;

    // Scale functions
    const scaleX = (x: number) => ((x - xMin) / (xMax - xMin)) * canvas.width;
    const scaleY = (y: number) => canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height;

    // Draw decision boundaries
    const resolution = 50;
    const stepX = (xMax - xMin) / resolution;
    const stepY = (yMax - yMin) / resolution;

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = xMin + i * stepX;
        const y = yMin + j * stepY;
        
        // Simple KNN classification
        const distances = allFeatures.map((point, idx) => ({
          dist: Math.sqrt(
            Math.pow(point[selectedFeatures.x] - x, 2) + 
            Math.pow(point[selectedFeatures.y] - y, 2)
          ),
          label: allLabels[idx]
        }));
        
        distances.sort((a, b) => a.dist - b.dist);
        const neighbors = distances.slice(0, kNeighbors);
        const votes = [0, 0, 0];
        neighbors.forEach(n => votes[n.label]++);
        const prediction = votes.indexOf(Math.max(...votes));
        
        ctx.fillStyle = colors[prediction] + "30";
        ctx.fillRect(
          scaleX(x),
          scaleY(y + stepY),
          (canvas.width / resolution) + 1,
          (canvas.height / resolution) + 1
        );
      }
    }

    // Draw data points
    allFeatures.forEach((point, idx) => {
      const x = scaleX(point[selectedFeatures.x]);
      const y = scaleY(point[selectedFeatures.y]);
      const label = allLabels[idx];
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = colors[label];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw axes
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.moveTo(30, canvas.height - 30);
    ctx.lineTo(30, 10);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#666";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(featureNames[selectedFeatures.x], canvas.width / 2, canvas.height - 10);
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(featureNames[selectedFeatures.y], 0, 0);
    ctx.restore();

  }, [kNeighbors, selectedFeatures, allFeatures, allLabels, colors, featureNames]);

  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Interactive KNN Classification</h3>
      
      <div className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            K Neighbors: {kNeighbors}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={kNeighbors}
            onChange={(e) => setKNeighbors(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Lower K = more complex boundaries, Higher K = smoother boundaries
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">X-axis Feature</label>
            <select 
              value={selectedFeatures.x}
              onChange={(e) => setSelectedFeatures(prev => ({ ...prev, x: Number(e.target.value) }))}
              className="w-full p-2 border rounded dark:bg-gray-700"
            >
              {featureNames.map((name, idx) => (
                <option key={idx} value={idx}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y-axis Feature</label>
            <select 
              value={selectedFeatures.y}
              onChange={(e) => setSelectedFeatures(prev => ({ ...prev, y: Number(e.target.value) }))}
              className="w-full p-2 border rounded dark:bg-gray-700"
            >
              {featureNames.map((name, idx) => (
                <option key={idx} value={idx}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 w-full"
      />

      <div className="mt-4 flex items-center gap-4 text-sm">
        {classNames.map((name, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: colors[idx] }}
            />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
