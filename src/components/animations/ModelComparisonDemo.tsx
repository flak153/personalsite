"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

// Simplified Iris dataset for visualization
const irisData = {
  features: [
    // Setosa samples
    [5.1, 3.5, 1.4, 0.2], [4.9, 3.0, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2],
    [5.0, 3.6, 1.4, 0.2], [5.4, 3.9, 1.7, 0.4], [4.6, 3.4, 1.4, 0.3],
    [5.0, 3.4, 1.5, 0.2], [4.4, 2.9, 1.4, 0.2], [5.4, 3.7, 1.5, 0.2],
    [4.8, 3.0, 1.4, 0.1], [5.8, 4.0, 1.2, 0.2], [5.7, 3.8, 1.7, 0.3],
    [5.1, 3.8, 1.5, 0.3], [5.1, 3.7, 1.5, 0.4], [5.2, 3.5, 1.5, 0.2],
    // Versicolor samples
    [7.0, 3.2, 4.7, 1.4], [6.4, 3.2, 4.5, 1.5], [6.9, 3.1, 4.9, 1.5],
    [5.5, 2.3, 4.0, 1.3], [6.5, 2.8, 4.6, 1.5], [5.7, 2.8, 4.5, 1.3],
    [6.3, 3.3, 4.7, 1.6], [4.9, 2.4, 3.3, 1.0], [6.6, 2.9, 4.6, 1.3],
    [5.2, 2.7, 3.9, 1.4], [5.9, 3.0, 4.2, 1.5], [6.1, 2.9, 4.7, 1.4],
    [5.6, 2.9, 3.6, 1.3], [6.7, 3.1, 4.4, 1.4], [5.6, 3.0, 4.5, 1.5],
    // Virginica samples
    [6.3, 3.3, 6.0, 2.5], [5.8, 2.7, 5.1, 1.9], [7.1, 3.0, 5.9, 2.1],
    [6.3, 2.9, 5.6, 1.8], [6.5, 3.0, 5.8, 2.2], [7.6, 3.0, 6.6, 2.1],
    [7.3, 2.9, 6.3, 1.8], [6.7, 2.5, 5.8, 1.8], [7.2, 3.6, 6.1, 2.5],
    [6.4, 2.7, 5.3, 1.9], [6.8, 3.0, 5.5, 2.1], [5.7, 2.5, 5.0, 2.0],
    [6.4, 3.2, 5.3, 2.3], [6.5, 3.0, 5.5, 1.8], [7.7, 3.8, 6.7, 2.2]
  ],
  labels: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
  ]
};

export default function ModelComparisonDemo() {
  const knnRef = useRef<HTMLCanvasElement>(null);
  const svmRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<HTMLCanvasElement>(null);
  const nbRef = useRef<HTMLCanvasElement>(null);
  
  const canvasRefs = useMemo(() => ({
    knn: knnRef,
    svm: svmRef,
    tree: treeRef,
    nb: nbRef
  }), []);
  
  const [selectedFeatures, setSelectedFeatures] = useState({ x: 2, y: 3 }); // Petal length & width
  const featureNames = useMemo(() => ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"], []);
  const colors = useMemo(() => ["#e74c3c", "#3498db", "#2ecc71"], []);
  const classNames = useMemo(() => ["Setosa", "Versicolor", "Virginica"], []);

  // Simplified classifier implementations
  const classifiers = useMemo(() => ({
    knn: {
      name: "K-Nearest Neighbors",
      predict: (x: number, y: number, k: number = 3) => {
        const distances = irisData.features.map((point, idx) => ({
          dist: Math.sqrt(
            Math.pow(point[selectedFeatures.x] - x, 2) + 
            Math.pow(point[selectedFeatures.y] - y, 2)
          ),
          label: irisData.labels[idx]
        }));
        distances.sort((a, b) => a.dist - b.dist);
        const neighbors = distances.slice(0, k);
        const votes = [0, 0, 0];
        neighbors.forEach(n => votes[n.label]++);
        return votes.indexOf(Math.max(...votes));
      }
    },
    svm: {
      name: "Support Vector Machine",
      predict: (x: number) => {
        // Simplified linear boundaries
        if (x < 2.5) return 0;
        if (x < 5.0) return 1;
        return 2;
      }
    },
    tree: {
      name: "Decision Tree",
      predict: (x: number, y: number) => {
        // Axis-aligned splits
        if (x < 2.5) return 0;
        if (x < 4.8) {
          if (y < 1.7) return 1;
          return 2;
        }
        return 2;
      }
    },
    nb: {
      name: "Naive Bayes",
      predict: (x: number, y: number) => {
        // Gaussian-like regions
        const dist0 = Math.sqrt(Math.pow(x - 1.5, 2) + Math.pow(y - 0.3, 2));
        const dist1 = Math.sqrt(Math.pow(x - 4.3, 2) + Math.pow(y - 1.3, 2));
        const dist2 = Math.sqrt(Math.pow(x - 5.5, 2) + Math.pow(y - 2.0, 2));
        const dists = [dist0, dist1, dist2];
        return dists.indexOf(Math.min(...dists));
      }
    }
  }), [selectedFeatures]);

  useEffect(() => {
    Object.entries(canvasRefs).forEach(([modelKey, canvasRef]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get data bounds
      const xFeatures = irisData.features.map(f => f[selectedFeatures.x]);
      const yFeatures = irisData.features.map(f => f[selectedFeatures.y]);
      const xMin = Math.min(...xFeatures) - 0.5;
      const xMax = Math.max(...xFeatures) + 0.5;
      const yMin = Math.min(...yFeatures) - 0.5;
      const yMax = Math.max(...yFeatures) + 0.5;

      // Scale functions
      const scaleX = (x: number) => ((x - xMin) / (xMax - xMin)) * canvas.width;
      const scaleY = (y: number) => canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height;

      // Draw decision boundaries
      const resolution = 40;
      const stepX = (xMax - xMin) / resolution;
      const stepY = (yMax - yMin) / resolution;
      const classifier = classifiers[modelKey as keyof typeof classifiers];

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x = xMin + i * stepX;
          const y = yMin + j * stepY;
          const prediction = classifier.predict(x, y);
          
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
      irisData.features.forEach((point, idx) => {
        const x = scaleX(point[selectedFeatures.x]);
        const y = scaleY(point[selectedFeatures.y]);
        const label = irisData.labels[idx];
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = colors[label];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw title
      ctx.fillStyle = "#666";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(classifier.name, canvas.width / 2, 20);
    });
  }, [selectedFeatures, canvasRefs, classifiers, colors]);

  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Classifier Comparison</h3>
      
      <div className="mb-4 grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(canvasRefs).map(([key, ref]) => (
          <canvas 
            key={key}
            ref={ref} 
            width={300} 
            height={250} 
            className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 w-full"
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-semibold mb-2">Key Observations:</p>
        <ul className="space-y-1 ml-4">
          <li>• <strong>KNN:</strong> Creates flexible, non-linear boundaries</li>
          <li>• <strong>SVM:</strong> Finds optimal linear separations</li>
          <li>• <strong>Decision Tree:</strong> Makes axis-aligned rectangular splits</li>
          <li>• <strong>Naive Bayes:</strong> Creates smooth, probabilistic boundaries</li>
        </ul>
      </div>

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
