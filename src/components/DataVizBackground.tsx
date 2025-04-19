"use client";

import { useEffect, useRef } from "react";

export default function DataVizBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size to match window
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Call initially and on resize
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    
    // Theme colors
    const primaryColor = "rgba(45, 0, 81, 0.2)"; // Royal Plum with low opacity
    const secondaryColor = "rgba(255, 219, 88, 0.15)"; // Mustard Yellow with low opacity
    const accentColor = "rgba(255, 255, 255, 0.3)"; // White with low opacity
    
    // Grid properties
    const gridSpacing = 80;
    const gridPoints: Point[] = [];
    
    // Wave properties
    const waveCount = 3;
    const waves: Wave[] = [];
    
    // Data bar properties
    const dataBarCount = Math.floor(canvas.width / gridSpacing * 0.3); // 30% of horizontal grid points
    const dataBars: DataBar[] = [];
    
    interface Point {
      x: number;
      y: number;
      baseY: number;
      size: number;
      connections: number[];
      value: number;
      targetValue: number;
      changeSpeed: number;
    }
    
    interface Wave {
      amplitude: number;
      length: number;
      speed: number;
      phase: number;
    }
    
    interface DataBar {
      gridIndex: number;
      height: number;
      targetHeight: number;
      changeSpeed: number;
      updateInterval: number;
      lastUpdate: number;
      segments: number;
    }
    
    // Create grid of points
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
      for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
        gridPoints.push({
          x,
          y,
          baseY: y,
          size: Math.random() * 2 + 1,
          connections: [],
          value: 0,
          targetValue: Math.random(),
          changeSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }
    
    // Connect points horizontally and vertically
    for (let i = 0; i < gridPoints.length; i++) {
      // Find points in the same row to connect horizontally
      const sameRow = gridPoints.filter((p, idx) => {
        return Math.abs(p.baseY - gridPoints[i].baseY) < 1 && idx !== i;
      });
      
      // Sort by x position for horizontal connections
      sameRow.sort((a, b) => a.x - b.x);
      
      // Find the closest right neighbor
      const rightNeighbor = sameRow.find(p => p.x > gridPoints[i].x);
      if (rightNeighbor) {
        const rightIndex = gridPoints.indexOf(rightNeighbor);
        gridPoints[i].connections.push(rightIndex);
      }
      
      // Find points in the same column to connect vertically
      const sameColumn = gridPoints.filter((p, idx) => {
        return Math.abs(p.x - gridPoints[i].x) < 1 && idx !== i;
      });
      
      // Sort by y position for vertical connections
      sameColumn.sort((a, b) => a.baseY - b.baseY);
      
      // Find the closest bottom neighbor
      const bottomNeighbor = sameColumn.find(p => p.baseY > gridPoints[i].baseY);
      if (bottomNeighbor) {
        const bottomIndex = gridPoints.indexOf(bottomNeighbor);
        gridPoints[i].connections.push(bottomIndex);
      }
    }
    
    // Create waves
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        amplitude: Math.random() * 15 + 10,
        length: Math.random() * 2 + 1,
        speed: (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2
      });
    }
    
    // Create data bars - find horizontal grid lines
    const horizontalLines: number[] = [];
    const usedIndices = new Set<number>();
    
    // Get unique y positions
    gridPoints.forEach(point => {
      if (!horizontalLines.includes(point.baseY)) {
        horizontalLines.push(point.baseY);
      }
    });
    
    // Sort lines from top to bottom
    horizontalLines.sort((a, b) => a - b);
    
    // Create random data bars
    for (let i = 0; i < dataBarCount; i++) {
      // Select a random horizontal line
      const lineIndex = Math.floor(Math.random() * horizontalLines.length);
      const lineY = horizontalLines[lineIndex];
      
      // Find points on this line
      const pointsOnLine = gridPoints.filter(p => Math.abs(p.baseY - lineY) < 1);
      
      // Make sure we don't use the same grid points
      let attempts = 0;
      let gridIndex: number;
      
      do {
        const randomPoint = pointsOnLine[Math.floor(Math.random() * pointsOnLine.length)];
        gridIndex = gridPoints.indexOf(randomPoint);
        attempts++;
      } while (usedIndices.has(gridIndex) && attempts < 20);
      
      // If we found an unused point, create a data bar
      if (!usedIndices.has(gridIndex) || attempts >= 20) {
        usedIndices.add(gridIndex);
        
        dataBars.push({
          gridIndex,
          height: Math.random() * 80 + 20,
          targetHeight: Math.random() * 80 + 20,
          changeSpeed: Math.random() * 0.1 + 0.05,
          updateInterval: Math.random() * 3000 + 2000,
          lastUpdate: Math.random() * 1000,
          segments: Math.floor(Math.random() * 5) + 3
        });
      }
    }
    
    // Animation loop
    let animationFrame: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update wave phases
      for (const wave of waves) {
        wave.phase += wave.speed * delta / 100;
      }
      
      // Update grid points
      for (const point of gridPoints) {
        // Apply wave effect to y position
        let yOffset = 0;
        for (const wave of waves) {
          // Different wave impacts based on x position
          yOffset += Math.sin(point.x / (gridSpacing * wave.length) + wave.phase) * wave.amplitude;
        }
        point.y = point.baseY + yOffset;
        
        // Update point value (for size animation)
        if (Math.abs(point.value - point.targetValue) > 0.01) {
          point.value += (point.targetValue - point.value) * point.changeSpeed;
        } else {
          point.targetValue = Math.random();
        }
      }
      
      // Update data bars
      for (const bar of dataBars) {
        // Update height when interval has passed
        if (time - bar.lastUpdate > bar.updateInterval) {
          bar.targetHeight = Math.random() * 80 + 20;
          bar.lastUpdate = time;
        }
        
        // Animate height
        if (Math.abs(bar.height - bar.targetHeight) > 0.5) {
          bar.height += (bar.targetHeight - bar.height) * bar.changeSpeed;
        }
      }
      
      // Draw connections
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      for (const point of gridPoints) {
        for (const connectionIndex of point.connections) {
          const connectedPoint = gridPoints[connectionIndex];
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connectedPoint.x, connectedPoint.y);
        }
      }
      ctx.stroke();
      
      // Draw grid points
      for (const point of gridPoints) {
        // Size based on value
        const size = point.size + point.value * 2;
        
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw data bars
      for (const bar of dataBars) {
        const point = gridPoints[bar.gridIndex];
        const barWidth = gridSpacing * 0.4;
        
        // Draw segments
        const segmentHeight = bar.height / bar.segments;
        const gap = segmentHeight * 0.15;
        
        for (let i = 0; i < bar.segments; i++) {
          const segmentY = point.y - i * segmentHeight;
          const fillY = segmentY - segmentHeight + gap;
          
          // Gradient for each segment
          const gradient = ctx.createLinearGradient(
            point.x - barWidth/2, fillY,
            point.x + barWidth/2, fillY + segmentHeight - gap
          );
          
          // Different brightness based on segment position
          const brightness = 0.5 + (i / bar.segments) * 0.5;
          gradient.addColorStop(0, secondaryColor);
          gradient.addColorStop(1, `rgba(255, 219, 88, ${brightness * 0.2})`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(
            point.x - barWidth/2,
            fillY,
            barWidth,
            segmentHeight - gap
          );
          
          // Add glow on top segment
          if (i === bar.segments - 1) {
            ctx.fillStyle = accentColor;
            ctx.fillRect(
              point.x - barWidth/2,
              fillY,
              barWidth,
              2
            );
          }
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 bg-gradient-to-b from-[#2d0051] to-[#ffdb58]"
    />
  );
}