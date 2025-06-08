"use client";

import React, { useEffect, useRef } from "react";
import { NetworkActivations } from "./types";
import { NEURAL_NETWORK_CONFIG } from "./constants";

interface NeuralNetworkVisualizerProps {
  activations: NetworkActivations;
  width?: number;
  height?: number;
}

// Input labels for the 39 inputs
const INPUT_LABELS = [
  // Ship state (9)
  "Ship X", "Ship Y", "Velocity X", "Velocity Y", "Cos(Rotation)", "Sin(Rotation)", 
  "Shield", "Rapid Fire", "Multi Shot",
  // Distance to edges (4)
  "Left Edge", "Right Edge", "Top Edge", "Bottom Edge",
  // Threat 1 (6)
  "T1 Distance", "T1 Sin(Angle)", "T1 Cos(Angle)", "T1 Vel X", "T1 Vel Y", "T1 Is UFO",
  // Threat 2 (6)
  "T2 Distance", "T2 Sin(Angle)", "T2 Cos(Angle)", "T2 Vel X", "T2 Vel Y", "T2 Is UFO",
  // Threat 3 (6)
  "T3 Distance", "T3 Sin(Angle)", "T3 Cos(Angle)", "T3 Vel X", "T3 Vel Y", "T3 Is UFO",
  // Power-up (5)
  "Pwr Distance", "Pwr Sin(Angle)", "Pwr Cos(Angle)", "Has Power-up", "Power-up Type",
  // Game state (3)
  "Bullets", "Enemy Bullets", "Wave"
];

export default function NeuralNetworkVisualizer({
  activations,
  width = 400,
  height = 600,
}: NeuralNetworkVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, width, height);
    
    const { inputs, hidden, outputs } = activations;
    if (inputs.length === 0) return;
    
    // Create layer structure
    const layers: number[][] = [];
    
    // Input layer
    layers.push(inputs.slice(0, NEURAL_NETWORK_CONFIG.inputSize));
    
    // Hidden layers - use actual activations if available, otherwise use zeros
    if (hidden.length > 0) {
      layers.push(...hidden);
    } else {
      // Fallback for when hidden activations aren't available
      NEURAL_NETWORK_CONFIG.hiddenLayers.forEach(size => {
        layers.push(Array(size).fill(0));
      });
    }
    
    // Output layer
    layers.push(outputs);
    
    const nodeRadius = 6;
    
    // Calculate layer positions with more space for input labels
    const inputX = 150; // More space for labels
    const layerPositions = [
      inputX,
      ...Array(layers.length - 1).fill(0).map((_, i) => 
        inputX + ((width - inputX - 100) / (layers.length - 1)) * (i + 1)
      )
    ];
    
    // Draw connections and nodes
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const x = layerPositions[i];
      const isInputLayer = i === 0;
      const isOutputLayer = i === layers.length - 1;
      
      // Show all nodes for input and output layers
      const maxNodes = (isInputLayer || isOutputLayer) ? layer.length : Math.min(layer.length, 20);
      const nodeSpacing = (height - 80) / (maxNodes + 1); // Leave room for labels
      
      // Draw connections to next layer
      if (i < layers.length - 1 && activations.weights && activations.weights[i]) {
        const nextLayer = layers[i + 1];
        const nextX = layerPositions[i + 1];
        const nextIsOutput = i + 1 === layers.length - 1;
        const nextMaxNodes = nextIsOutput ? nextLayer.length : Math.min(nextLayer.length, 20);
        const nextNodeSpacing = (height - 80) / (nextMaxNodes + 1);
        
        // Get weight matrix for this layer
        const weightMatrix = activations.weights[i];
        
        // Only draw a subset of connections for middle layers to avoid clutter
        const connectionStep = (i === 0 || i === layers.length - 2) ? 1 : 3;
        
        for (let j = 0; j < maxNodes; j += connectionStep) {
          const y = nodeSpacing * (j + 1) + 40;
          
          for (let k = 0; k < nextMaxNodes; k += connectionStep) {
            const nextY = nextNodeSpacing * (k + 1) + 40;
            
            // Get actual weight value if available
            let weightMagnitude = 0.1;
            if (weightMatrix && j < weightMatrix.length && k < weightMatrix[j].length) {
              weightMagnitude = Math.abs(weightMatrix[j][k]);
            }
            
            // Normalize weight for visualization (typical weights are -2 to 2)
            const normalizedWeight = Math.min(1, weightMagnitude / 2);
            
            // Color based on activation (current activity) but thickness based on weight (learned importance)
            const activation = layer[j] || 0;
            const color = activation > 0 ? [0, 255, 0] : [255, 0, 0];
            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.3 + normalizedWeight * 0.4})`;
            ctx.lineWidth = Math.max(0.5, normalizedWeight * 3);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes with dynamic sizing
      for (let j = 0; j < maxNodes; j++) {
        const y = nodeSpacing * (j + 1) + 40;
        const activation = layer[j] || 0;
        const absActivation = Math.min(1, Math.abs(activation));
        
        // Dynamic node size based on activation
        const dynamicRadius = nodeRadius * (0.5 + absActivation * 0.5);
        
        // Node color based on activation
        if (activation > 0) {
          ctx.fillStyle = `rgba(0, 255, 0, ${absActivation})`;
        } else {
          ctx.fillStyle = `rgba(255, 0, 0, ${absActivation})`;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, dynamicRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // White border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw input labels
        if (isInputLayer && j < INPUT_LABELS.length) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "10px monospace";
          ctx.textAlign = "right";
          ctx.fillText(INPUT_LABELS[j], x - dynamicRadius - 5, y + 3);
        }
      }
    }
    
    // Draw labels
    ctx.fillStyle = "white";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    
    // Input labels
    ctx.fillText("Inputs", layerPositions[0], 20);
    ctx.fillText(`(${inputs.length})`, layerPositions[0], 35);
    
    // Hidden layer labels
    NEURAL_NETWORK_CONFIG.hiddenLayers.forEach((size, i) => {
      const x = layerPositions[i + 1];
      ctx.fillText(`Hidden ${i + 1}`, x, 20);
      ctx.fillText(`(${size})`, x, 35);
    });
    
    // Output labels
    const outputX = layerPositions[layerPositions.length - 1];
    ctx.fillText("Outputs", outputX, 20);
    ctx.fillText("(4)", outputX, 35);
    
    // Output action labels
    const outputLabels = ["Left", "Right", "Thrust", "Shoot"];
    const outputNodeSpacing = (height - 80) / 5;
    outputLabels.forEach((label, i) => {
      const y = outputNodeSpacing * (i + 1) + 40;
      ctx.textAlign = "left";
      ctx.fillText(label, outputX + 15, y + 3);
    });
  }, [activations, width, height]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 text-center">Neural Network Visualization</h3>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg shadow-lg bg-gray-900"
      />
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
        <p>Node color: Green = positive activation | Red = negative activation</p>
        <p>Connection thickness = learned weight strength (what the AI has learned)</p>
        <p>Thicker connections = more important pathways in the network</p>
      </div>
    </div>
  );
}