"use client";

import { useState, useEffect, useRef } from "react";

const GenerationalCollectionAnimation = () => {
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
    const youngGenWidth = width * 0.3;
    const youngGenHeight = height * 0.4;
    const oldGenWidth = width * 0.6;
    const oldGenHeight = height * 0.4;
    
    // Colors
    const youngGenColor = "#FFD580"; // Light orange for young generation
    const oldGenColor = "#B0C4DE";   // Light blue for old generation
    const objectColor = "#4CAF50";   // Green for live objects
    const deadColor = "#FF6347";     // Red for dead objects
    const promotedColor = "#9370DB"; // Purple for promoted objects
    const textColor = "#333333";     // Dark gray for text

    // Draw memory layout
    drawMemoryLayout(ctx, margin, margin, width - 2 * margin, height - 2 * margin, 
                    youngGenWidth, youngGenHeight, oldGenWidth, oldGenHeight, 
                    youngGenColor, oldGenColor);
    
    // Draw objects based on current step
    drawObjects(ctx, step, margin, youngGenWidth, youngGenHeight, 
               oldGenWidth, oldGenHeight, objectColor, deadColor, promotedColor);
    
    // Draw explanation text
    drawExplanation(ctx, step, width, height);

  }, [step]);

  // Helper function to draw memory layout
  const drawMemoryLayout = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    youngGenWidth: number,
    youngGenHeight: number,
    oldGenWidth: number,
    oldGenHeight: number,
    youngGenColor: string,
    oldGenColor: string
  ) => {
    // Draw titles
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("MEMORY HEAP", x + width / 2, y - 10);

    // Young generation (Eden + Survivor spaces)
    ctx.fillStyle = youngGenColor;
    ctx.fillRect(x, y + (height - youngGenHeight) / 2, youngGenWidth, youngGenHeight);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + (height - youngGenHeight) / 2, youngGenWidth, youngGenHeight);
    
    // Eden space label
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Young Generation", 
                x + youngGenWidth / 2, 
                y + (height - youngGenHeight) / 2 - 10);

    // Old generation
    ctx.fillStyle = oldGenColor;
    ctx.fillRect(x + youngGenWidth + 20, y + (height - oldGenHeight) / 2, oldGenWidth, oldGenHeight);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + youngGenWidth + 20, y + (height - oldGenHeight) / 2, oldGenWidth, oldGenHeight);
    
    // Old generation label
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Old Generation", 
                x + youngGenWidth + 20 + oldGenWidth / 2, 
                y + (height - oldGenHeight) / 2 - 10);
  };

  // Helper function to draw objects in memory
  const drawObjects = (
    ctx: CanvasRenderingContext2D,
    step: number,
    margin: number,
    youngGenWidth: number,
    youngGenHeight: number,
    oldGenWidth: number,
    oldGenHeight: number,
    objectColor: string,
    deadColor: string,
    promotedColor: string
  ) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const youngGenY = margin + (height - 2 * margin - youngGenHeight) / 2;
    const oldGenY = margin + (height - 2 * margin - oldGenHeight) / 2;
    const oldGenX = margin + youngGenWidth + 20;

    // Object sizes
    const objectSize = 25;
    
    // Objects in young generation
    const youngObjects = [
      { x: margin + 20, y: youngGenY + 30, age: 0, survives: false },
      { x: margin + 60, y: youngGenY + 30, age: 0, survives: true },
      { x: margin + 100, y: youngGenY + 30, age: 0, survives: false },
      { x: margin + 20, y: youngGenY + 80, age: 0, survives: true },
      { x: margin + 60, y: youngGenY + 80, age: 0, survives: false },
      { x: margin + 100, y: youngGenY + 80, age: 1, survives: true, promotes: true },
      { x: margin + 20, y: youngGenY + 130, age: 1, survives: true, promotes: true },
      { x: margin + 60, y: youngGenY + 130, age: 1, survives: false },
    ];

    // Objects in old generation (initially less)
    const oldObjects = [
      { x: oldGenX + 50, y: oldGenY + 30, age: 10 },
      { x: oldGenX + 100, y: oldGenY + 30, age: 15 },
      { x: oldGenX + 150, y: oldGenY + 30, age: 8 },
      { x: oldGenX + 50, y: oldGenY + 80, age: 12 },
      { x: oldGenX + 100, y: oldGenY + 80, age: 20 },
    ];

    // Draw based on current step
    switch(step) {
      case 0: // Initial state
        // Draw young generation objects
        youngObjects.forEach((obj, i) => {
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText(i.toString(), obj.x, obj.y);
        });
        
        // Draw old generation objects
        oldObjects.forEach((obj, i) => {
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText((i + 8).toString(), obj.x, obj.y);
        });
        break;
        
      case 1: // Minor collection - marking dead objects in young generation
        // Draw young generation objects with some marked as dead
        youngObjects.forEach((obj, i) => {
          ctx.fillStyle = obj.survives ? objectColor : deadColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText(i.toString(), obj.x, obj.y);
          
          // Show age for surviving objects
          if (obj.survives) {
            ctx.fillStyle = "#000000";
            ctx.font = "10px Arial";
            ctx.fillText(`Age: ${obj.age}`, obj.x, obj.y + objectSize + 5);
          }
        });
        
        // Draw old generation objects normally
        oldObjects.forEach((obj, i) => {
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText((i + 8).toString(), obj.x, obj.y);
        });
        break;
        
      case 2: // Removing dead objects from young generation
        // Draw only surviving young generation objects
        youngObjects.filter(obj => obj.survives).forEach((obj, idx) => {
          const i = youngObjects.indexOf(obj);
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText(i.toString(), obj.x, obj.y);
          
          // Show age for objects
          ctx.fillStyle = "#000000";
          ctx.font = "10px Arial";
          ctx.fillText(`Age: ${obj.age}`, obj.x, obj.y + objectSize + 5);
        });
        
        // Draw old generation objects
        oldObjects.forEach((obj, i) => {
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText((i + 8).toString(), obj.x, obj.y);
        });
        break;
        
      case 3: // Age incrementation for survivors & promotion
        // Draw young generation objects that survive with updated age
        youngObjects.filter(obj => obj.survives).forEach((obj, idx) => {
          const i = youngObjects.indexOf(obj);
          // Increment age visually
          const newAge = obj.age + 1;
          
          // Objects to be promoted are colored differently
          ctx.fillStyle = obj.promotes ? promotedColor : objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText(i.toString(), obj.x, obj.y);
          
          // Show updated age
          ctx.fillStyle = "#000000";
          ctx.font = "10px Arial";
          ctx.fillText(`Age: ${newAge}`, obj.x, obj.y + objectSize + 5);
          
          // Add promotion indicator arrow for objects to be promoted
          if (obj.promotes) {
            drawArrow(ctx, obj.x + objectSize, obj.y, oldGenX + 20, obj.y, "#000000");
            ctx.fillStyle = "#000000";
            ctx.font = "12px Arial";
            ctx.fillText("Promote", obj.x + objectSize + 30, obj.y - 15);
          }
        });
        
        // Draw old generation objects
        oldObjects.forEach((obj, i) => {
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText((i + 8).toString(), obj.x, obj.y);
        });
        break;
        
      case 4: // After promotion - objects moved to old generation
        // Draw remaining young generation objects
        youngObjects.filter(obj => obj.survives && !obj.promotes).forEach((obj, idx) => {
          const i = youngObjects.indexOf(obj);
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText(i.toString(), obj.x, obj.y);
          
          // Show age
          ctx.fillStyle = "#000000";
          ctx.font = "10px Arial";
          ctx.fillText(`Age: ${obj.age + 1}`, obj.x, obj.y + objectSize + 5);
        });
        
        // Draw old generation objects
        oldObjects.forEach((obj, i) => {
          ctx.fillStyle = objectColor;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText((i + 8).toString(), obj.x, obj.y);
        });
        
        // Draw the promoted objects in old generation
        const promotedObjs = youngObjects.filter(obj => obj.survives && obj.promotes);
        promotedObjs.forEach((obj, idx) => {
          const i = youngObjects.indexOf(obj);
          const newX = oldGenX + 200 + (idx * 50);
          const newY = oldGenY + 80;
          
          ctx.fillStyle = promotedColor;
          ctx.beginPath();
          ctx.arc(newX, newY, objectSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "12px Arial";
          ctx.fillText(i.toString(), newX, newY);
          
          // Show age in old generation
          ctx.fillStyle = "#000000";
          ctx.font = "10px Arial";
          ctx.fillText(`Age: ${obj.age + 1}`, newX, newY + objectSize + 5);
        });
        break;
    }
  };

  // Helper function to draw explanations
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
      "Initial state with objects in young and old generations",
      "Minor collection: mark dead objects in young generation",
      "Remove dead objects from young generation",
      "Increment age of survivors, identify objects for promotion",
      "After promotion: objects exceeding age threshold move to old generation"
    ];
    
    ctx.fillText(explanations[step], width / 2, height - 20);
  };

  // Helper function to draw arrows
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string
  ) => {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI/6), toY - headLength * Math.sin(angle - Math.PI/6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI/6), toY - headLength * Math.sin(angle + Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
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

export default GenerationalCollectionAnimation;