"use client";

import { useState, useEffect, useRef } from "react";

const ConcurrentCollectionAnimation = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const totalSteps = 5;

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Settings
    const width = canvas.width;
    const height = canvas.height;
    const margin = 40;
    const heapWidth = width - 2 * margin;
    const heapHeight = height * 0.5;
    
    // Colors
    const heapColor = "#F5F5F5";      // Light gray for heap
    const objectColor = "#4CAF50";    // Green for live objects
    const deadColor = "#FF6347";      // Red for dead objects
    const markedColor = "#FFD700";    // Gold for marked objects
    const appThreadColor = "#3498DB"; // Blue for application thread
    const gcThreadColor = "#E74C3C";  // Red for GC thread
    
    // Draw memory heap and application state
    drawHeap(ctx, margin, margin, heapWidth, heapHeight, heapColor);
    
    // Draw threads and their activities based on current step
    drawThreads(ctx, step, margin, width, height, appThreadColor, gcThreadColor);
    
    // Draw memory objects based on step
    drawObjects(ctx, step, margin, heapWidth, heapHeight, objectColor, deadColor, markedColor);
    
    // Draw explanation text
    drawExplanation(ctx, step, width, height);

  }, [step]);

  // Helper function to draw memory heap
  const drawHeap = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    heapColor: string
  ) => {
    // Draw title
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("MEMORY HEAP", x + width / 2, y - 10);

    // Draw heap area
    ctx.fillStyle = heapColor;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  };

  // Helper function to draw threads and their activities
  const drawThreads = (
    ctx: CanvasRenderingContext2D,
    step: number,
    margin: number,
    width: number,
    height: number,
    appThreadColor: string,
    gcThreadColor: string
  ) => {
    const heapHeight = height * 0.5;
    const threadAreaY = margin + heapHeight + 20;
    const threadHeight = 30;
    const threadSpacing = 20;
    
    // Draw thread titles
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText("Application Thread", margin, threadAreaY - 5);
    ctx.fillText("GC Thread", margin, threadAreaY + threadHeight + threadSpacing - 5);
    
    // Draw application thread
    ctx.fillStyle = appThreadColor;
    ctx.fillRect(margin + 150, threadAreaY, width - 2 * margin - 150, threadHeight);
    
    // Draw GC thread
    ctx.fillStyle = gcThreadColor;
    ctx.fillRect(margin + 150, threadAreaY + threadHeight + threadSpacing, 
                width - 2 * margin - 150, threadHeight);
    
    // Draw activity indicators based on step
    const appSegmentWidth = (width - 2 * margin - 150) / 5;
    
    // App thread activity
    for (let i = 0; i < 5; i++) {
      const x = margin + 150 + i * appSegmentWidth;
      const y = threadAreaY;
      
      // Draw segment divider
      ctx.strokeStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + threadHeight);
      ctx.stroke();
      
      // Draw activity label
      let activityText = "";
      
      // Different activities for app thread
      if (i === 0 || i === 2 || i === 4) {
        activityText = "Running";
        // Highlight current segment
        if (i === step) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(x + 1, y + 1, appSegmentWidth - 2, threadHeight - 2);
        }
      } else {
        activityText = "Safe Point";
        // Highlight current segment
        if (i === step) {
          ctx.fillStyle = "#FFFF00";
          ctx.globalAlpha = 0.3;
          ctx.fillRect(x + 1, y + 1, appSegmentWidth - 2, threadHeight - 2);
          ctx.globalAlpha = 1.0;
        }
      }
      
      // Draw text
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(activityText, x + appSegmentWidth / 2, y + threadHeight / 2);
    }
    
    // GC thread activity
    for (let i = 0; i < 5; i++) {
      const x = margin + 150 + i * appSegmentWidth;
      const y = threadAreaY + threadHeight + threadSpacing;
      
      // Draw segment divider
      ctx.strokeStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + threadHeight);
      ctx.stroke();
      
      // Draw activity label
      let activityText = "";
      
      // Different activities for GC thread
      switch(i) {
        case 0:
          activityText = "Idle";
          break;
        case 1:
          activityText = "Mark Roots";
          break;
        case 2:
          activityText = "Concurrent Mark";
          break;
        case 3:
          activityText = "Remark";
          break;
        case 4:
          activityText = "Sweep";
          break;
      }
      
      // Highlight current segment
      if (i === step) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x + 1, y + 1, appSegmentWidth - 2, threadHeight - 2);
      }
      
      // Draw text
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(activityText, x + appSegmentWidth / 2, y + threadHeight / 2);
    }
  };

  // Helper function to draw objects in heap
  const drawObjects = (
    ctx: CanvasRenderingContext2D,
    step: number,
    margin: number,
    heapWidth: number,
    heapHeight: number,
    objectColor: string,
    deadColor: string,
    markedColor: string
  ) => {
    const objectSize = 25;
    const spacing = 20;
    const startX = margin + 50;
    const startY = margin + 50;
    
    // Define object grid - 5 rows, 7 objects per row
    const objects = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        objects.push({
          x: startX + col * (objectSize + spacing),
          y: startY + row * (objectSize + spacing),
          // Objects with indices 5, 12, and 17 are unreachable
          isLive: ![5, 12, 17].includes(row * 7 + col),
          isMarked: false,
          isRoot: col === 0 && row === 0
        });
      }
    }
    
    // Update object state based on current step
    switch(step) {
      case 0: // Initial state - app running
        break;
        
      case 1: // Mark roots
        // Mark the root object
        objects.forEach(obj => {
          if (obj.isRoot) {
            obj.isMarked = true;
          }
        });
        break;
        
      case 2: // Concurrent mark
        // Mark all live objects (simulates concurrent marking)
        objects.forEach(obj => {
          if (obj.isLive) {
            obj.isMarked = true;
          }
        });
        // But app thread might have created a new object or changed references
        // Add a new object that simulates a modification during concurrent marking
        objects.push({
          x: startX + 3 * (objectSize + spacing),
          y: startY + 3 * (objectSize + spacing),
          isLive: true,
          isMarked: false,
          isNew: true
        });
        break;
        
      case 3: // Remark - catch any missed objects
        // Mark all live objects including new ones
        objects.forEach(obj => {
          if (obj.isLive) {
            obj.isMarked = true;
          }
        });
        break;
        
      case 4: // Sweep - remove unmarked objects
        // Mark all live objects
        objects.forEach(obj => {
          if (obj.isLive) {
            obj.isMarked = true;
          }
        });
        break;
    }
    
    // Draw the objects
    objects.forEach((obj, index) => {
      let fillColor = objectColor;
      
      // Color based on state and step
      if (!obj.isLive && step >= 4) {
        // Dead objects appear as dead only in final step
        fillColor = deadColor;
      } else if (obj.isMarked) {
        // Marked objects
        fillColor = markedColor;
      } else if (obj.isNew && step >= 2) {
        // New objects added during concurrent marking
        fillColor = "#9C27B0"; // Purple for new objects
      }
      
      // Draw the object
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw object ID
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "12px Arial";
      ctx.fillText(index.toString(), obj.x, obj.y);
      
      // Draw root indicator
      if (obj.isRoot) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.fillText("ROOT", obj.x, obj.y - objectSize/2 - 5);
      }
      
      // Draw "New" indicator for objects added during concurrent marking
      if (obj.isNew && step >= 2) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.fillText("NEW", obj.x, obj.y - objectSize/2 - 5);
      }
    });
    
    // Draw lines connecting objects (simulating references)
    if (step >= 1) {
      // Define some arbitrary connections between objects
      const connections = [
        {from: 0, to: 1},
        {from: 0, to: 7},
        {from: 1, to: 2},
        {from: 1, to: 8},
        {from: 7, to: 14},
        {from: 14, to: 15},
        {from: 14, to: 9},
        {from: 2, to: 3},
        {from: 3, to: 4},
        {from: 3, to: 10},
        {from: 10, to: 11}
      ];
      
      // Add connection to new object on step 2
      if (step >= 2 && objects.length > 21) {
        connections.push({from: 15, to: 21});
      }
      
      // Draw connections
      connections.forEach(conn => {
        if (conn.from < objects.length && conn.to < objects.length) {
          const fromObj = objects[conn.from];
          const toObj = objects[conn.to];
          
          ctx.beginPath();
          ctx.moveTo(fromObj.x, fromObj.y);
          ctx.lineTo(toObj.x, toObj.y);
          ctx.strokeStyle = "#666666";
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Draw arrowhead
          const dx = toObj.x - fromObj.x;
          const dy = toObj.y - fromObj.y;
          const angle = Math.atan2(dy, dx);
          const headLength = 10;
          
          ctx.beginPath();
          ctx.moveTo(toObj.x, toObj.y);
          ctx.lineTo(
            toObj.x - headLength * Math.cos(angle - Math.PI/6),
            toObj.y - headLength * Math.sin(angle - Math.PI/6)
          );
          ctx.lineTo(
            toObj.x - headLength * Math.cos(angle + Math.PI/6),
            toObj.y - headLength * Math.sin(angle + Math.PI/6)
          );
          ctx.closePath();
          ctx.fillStyle = "#666666";
          ctx.fill();
        }
      });
    }
  };

  // Helper function to draw explanation text
  const drawExplanation = (
    ctx: CanvasRenderingContext2D,
    step: number,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    
    const explanations = [
      "Application running normally, garbage collector inactive",
      "App reaches a safe point: GC starts by marking roots (paused)",
      "App continues execution while GC marks objects concurrently",
      "App reaches another safe point: GC performs final remark (paused)",
      "GC sweeps unreachable objects while app continues execution"
    ];
    
    ctx.fillText(explanations[step], width / 2, height - 20);
  };

  // Control functions
  const nextStep = () => {
    setStep((prevStep) => (prevStep < totalSteps - 1 ? prevStep + 1 : prevStep));
  };

  const prevStep = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const resetAnimation = () => {
    setStep(0);
    setIsPlaying(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const playAnimation = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      const startTime = Date.now();
      const intervalMs = 1000; // 1 second interval
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime > intervalMs) {
          nextStep();
          if (step >= totalSteps - 1) {
            setIsPlaying(false);
            return;
          }
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center my-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-gray-300 rounded-md"
      />
      <div className="flex items-center mt-2 space-x-4">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={playAnimation}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={nextStep}
          disabled={step === totalSteps - 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={resetAnimation}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          Reset
        </button>
        <span>
          Step {step + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ConcurrentCollectionAnimation;