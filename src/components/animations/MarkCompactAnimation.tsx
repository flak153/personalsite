"use client";

import { useState, useEffect, useRef } from 'react';

export const MarkCompactAnimation = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const totalSteps = 8;
  // Common settings used across all drawing functions
  const margin = 40;
  
  // Helper function to draw arrows
  function drawArrow(
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number
  ) {
    const headLen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI/6), toY - headLen * Math.sin(angle - Math.PI/6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI/6), toY - headLen * Math.sin(angle + Math.PI/6));
    ctx.stroke();
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Settings
    const blockWidth = 60;
    const blockHeight = 40;
    const heapWidth = canvas.width - (2 * margin);
    const heapY = 180;
    const objectSpacing = 10;
    const rootY = 80;
    
    // Colors
    const objectColor = '#9E9E9E';
    const markedColor = '#4CAF50';
    const rootColor = '#2196F3';
    const arrowColor = '#757575';
    const textColor = '#F8FAFC';
    const compactingArrowColor = '#FF9800';
    
    // Draw title
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mark-Compact Garbage Collection', canvas.width / 2, 30);
    
    // Draw heap boundary
    ctx.strokeStyle = '#BDBDBD';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, heapY - 60, heapWidth, blockHeight + 80);
    
    // Label the heap
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Heap', margin + 10, heapY - 40);
    
    // Define objects (mix of reachable and unreachable)
    const objectCount = 8;
    const objects = [];
    const isReachable = [true, false, true, true, false, false, true, false];
    
    // Initial layout with fragmentation
    let currentX = margin + 20; // This is fine since margin is defined at the component level
    for (let i = 0; i < objectCount; i++) {
      objects.push({
        id: i,
        x: currentX,
        y: heapY,
        width: blockWidth,
        height: blockHeight,
        reachable: isReachable[i]
      });
      currentX += blockWidth + objectSpacing;
    }
    
    // Step-specific rendering
    switch(step) {
      case 0: 
        // Initial state
        drawInitialState(ctx, objects, rootY, arrowColor, objectColor, textColor, rootColor, margin);
        break;
      case 1:
      case 2:
        // Mark phase
        drawMarkPhase(ctx, objects, step - 1, rootY, arrowColor, objectColor, markedColor, textColor, rootColor, margin);
        break;
      case 3:
        // Calculate addresses
        drawCalculateAddresses(ctx, objects, rootY, arrowColor, objectColor, markedColor, textColor, rootColor, margin);
        break;
      case 4:
      case 5:
        // Update references
        drawUpdateReferences(ctx, objects, step - 4, rootY, arrowColor, objectColor, markedColor, textColor, rootColor, compactingArrowColor, margin);
        break;
      case 6:
        // Compact objects
        drawCompactObjects(ctx, objects, rootY, arrowColor, objectColor, markedColor, textColor, rootColor, margin);
        break;
      case 7:
        // Final state
        drawFinalState(ctx, objects, rootY, arrowColor, objectColor, textColor, rootColor, margin);
        break;
    }
    
    // Draw explanation text
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    let explanation = '';
    let subExplanation = '';
    
    switch(step) {
      case 0:
        explanation = 'Initial Fragmented Heap';
        subExplanation = 'Mix of live (reachable) and dead (unreachable) objects';
        break;
      case 1:
        explanation = 'Mark Phase: First Pass';
        subExplanation = 'Identifying reachable objects from roots';
        break;
      case 2:
        explanation = 'Mark Phase: Complete';
        subExplanation = 'All reachable objects are now marked';
        break;
      case 3:
        explanation = 'Preparing for Compaction';
        subExplanation = 'Calculate new addresses for live objects';
        break;
      case 4:
        explanation = 'Update References: First Pass';
        subExplanation = 'Updating pointers to reference new locations';
        break;
      case 5:
        explanation = 'Update References: Complete';
        subExplanation = 'All references now point to new locations';
        break;
      case 6:
        explanation = 'Compaction Phase';
        subExplanation = 'Moving objects to their new locations';
        break;
      case 7:
        explanation = 'Compaction Complete';
        subExplanation = 'Heap is now defragmented with contiguous free space';
        break;
    }
    
    ctx.fillText(explanation, canvas.width / 2, canvas.height - 50);
    ctx.font = '14px Arial';
    ctx.fillText(subExplanation, canvas.width / 2, canvas.height - 25);
    
  }, [step]);
  
  // Helper functions for drawing different stages
  function drawInitialState(
    ctx: CanvasRenderingContext2D,
    objects: Array<any>,
    rootY: number,
    arrowColor: string,
    objectColor: string,
    textColor: string,
    rootColor: string,
    margin: number
  ) {
    // Draw root object
    const rootX = margin + 150;
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Draw arrows from root to reachable objects
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;
    
    const reachableIndices = objects.filter(obj => obj.reachable).map(obj => obj.id);
    reachableIndices.forEach(id => {
      const obj = objects.find(o => o.id === id);
      if (obj) {
        drawArrow(ctx, rootX, rootY + 20, obj.x + obj.width / 2, obj.y);
      }
    });
    
    // Draw all objects
    objects.forEach(obj => {
      // Draw object
      ctx.fillStyle = objectColor;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Object label
      ctx.fillStyle = textColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obj ${obj.id}`, obj.x + obj.width / 2, obj.y + obj.height / 2 + 5);
    });
  }
  
  function drawMarkPhase(
    ctx: CanvasRenderingContext2D,
    objects: Array<any>,
    phase: number,
    rootY: number,
    arrowColor: string,
    objectColor: string,
    markedColor: string,
    textColor: string,
    rootColor: string,
    margin: number
  ) {
    // Draw root object
    const rootX = margin + 150;
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Draw arrows from root to reachable objects
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;
    
    const reachableIndices = objects.filter(obj => obj.reachable).map(obj => obj.id);
    reachableIndices.forEach(id => {
      const obj = objects.find(o => o.id === id);
      if (obj) {
        drawArrow(ctx, rootX, rootY + 20, obj.x + obj.width / 2, obj.y);
      }
    });
    
    // Draw all objects
    objects.forEach(obj => {
      // For reachable objects, use marked color in phase 1 for first half, in phase 2 for all
      const isMarked = phase === 0 
        ? obj.reachable && obj.id <= 3
        : obj.reachable;
        
      ctx.fillStyle = isMarked ? markedColor : objectColor;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Object label
      ctx.fillStyle = textColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obj ${obj.id}`, obj.x + obj.width / 2, obj.y + obj.height / 2 + 5);
    });
  }
  
  function drawCalculateAddresses(
    ctx: CanvasRenderingContext2D,
    objects: Array<any>,
    rootY: number,
    arrowColor: string,
    objectColor: string,
    markedColor: string,
    textColor: string,
    rootColor: string,
    margin: number
  ) {
    // Draw root object
    const rootX = margin + 150;
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Draw arrows from root to reachable objects
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;
    
    const reachableIndices = objects.filter(obj => obj.reachable).map(obj => obj.id);
    reachableIndices.forEach(id => {
      const obj = objects.find(o => o.id === id);
      if (obj) {
        drawArrow(ctx, rootX, rootY + 20, obj.x + obj.width / 2, obj.y);
      }
    });
    
    // Draw all objects
    objects.forEach(obj => {
      // Draw object
      ctx.fillStyle = obj.reachable ? markedColor : objectColor;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Object label
      ctx.fillStyle = textColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obj ${obj.id}`, obj.x + obj.width / 2, obj.y + obj.height / 2 + 5);
      
      // Draw new address for reachable objects
      if (obj.reachable) {
        const newX = margin + 20 + (reachableIndices.indexOf(obj.id) * (obj.width + 10));
        
        // Arrow pointing to new position
        ctx.strokeStyle = '#FF9800';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obj.x + obj.width / 2, obj.y + obj.height + 15);
        ctx.lineTo(newX + obj.width / 2, obj.y + obj.height + 40);
        ctx.stroke();
        
        // New position marker
        ctx.strokeStyle = '#FF9800';
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(newX, obj.y + obj.height + 50, obj.width, obj.height);
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = '#FF9800';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('New address', newX + obj.width / 2, obj.y + obj.height + 80);
      }
    });
  }
  
  function drawUpdateReferences(
    ctx: CanvasRenderingContext2D,
    objects: Array<any>,
    phase: number,
    rootY: number,
    arrowColor: string,
    objectColor: string,
    markedColor: string,
    textColor: string,
    rootColor: string,
    compactingArrowColor: string,
    margin: number
  ) {
    // Draw root object
    const rootX = margin + 150;
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Find reachable objects
    const reachableObjects = objects.filter(obj => obj.reachable);
    const reachableIndices = reachableObjects.map(obj => obj.id);
    
    // Draw objects and forwarding addresses
    objects.forEach(obj => {
      // Draw object
      ctx.fillStyle = obj.reachable ? markedColor : objectColor;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Object label
      ctx.fillStyle = textColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obj ${obj.id}`, obj.x + obj.width / 2, obj.y + obj.height / 2 + 5);
      
      // Draw forwarding pointers for reachable objects
      if (obj.reachable) {
        const newX = margin + 20 + (reachableIndices.indexOf(obj.id) * (obj.width + 10));
        
        // Small icon indicating forwarding pointer
        ctx.fillStyle = compactingArrowColor;
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('→' + newX, obj.x + obj.width - 5, obj.y + 12);
      }
    });
    
    // Draw updated references
    ctx.strokeStyle = phase === 0 ? arrowColor : compactingArrowColor;
    ctx.lineWidth = 2;
    
    reachableIndices.forEach((id, index) => {
      // Calculate the new position this object will have after compaction
      const newX = margin + 20 + (index * (objects[0].width + 10));
      const newY = objects[0].y;
      
      // In phase 0, only update first half of references
      // In phase 1, all references are updated
      if (phase === 0 && index >= reachableIndices.length / 2) {
        // Draw old-style reference
        drawArrow(ctx, rootX, rootY + 20, objects[id].x + objects[id].width / 2, objects[id].y);
      } else {
        // Draw updated reference pointing to new location
        drawArrow(ctx, rootX, rootY + 20, newX + objects[id].width / 2, newY);
        
        // Draw dotted outline of future position
        ctx.strokeStyle = compactingArrowColor;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(newX, newY, objects[id].width, objects[id].height);
        ctx.setLineDash([]);
      }
    });
  }
  
  function drawCompactObjects(
    ctx: CanvasRenderingContext2D,
    objects: Array<any>,
    rootY: number,
    arrowColor: string,
    objectColor: string,
    markedColor: string,
    textColor: string,
    rootColor: string,
    margin: number
  ) {
    // Draw root object
    const rootX = margin + 150;
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Find reachable objects and their new positions
    const reachableObjects = objects.filter(obj => obj.reachable);
    const reachableIndices = reachableObjects.map(obj => obj.id);
    
    // Draw animation of objects moving
    objects.forEach(obj => {
      if (obj.reachable) {
        const index = reachableIndices.indexOf(obj.id);
        const newX = margin + 20 + (index * (obj.width + 10));
        
        // Draw movement trail
        ctx.strokeStyle = '#FF9800';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(obj.x + obj.width / 2, obj.y + obj.height / 2);
        ctx.lineTo(newX + obj.width / 2, obj.y + obj.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw object at new position
        ctx.fillStyle = markedColor;
        ctx.fillRect(newX, obj.y, obj.width, obj.height);
        
        // Object label
        ctx.fillStyle = textColor;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Obj ${obj.id}`, newX + obj.width / 2, obj.y + obj.height / 2 + 5);
      } else {
        // Unreachable objects fade away
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = objectColor;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        
        // Label
        ctx.fillStyle = textColor;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Obj ${obj.id}`, obj.x + obj.width / 2, obj.y + obj.height / 2 + 5);
        ctx.globalAlpha = 1;
      }
    });
    
    // Draw references to new positions
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;
    
    reachableIndices.forEach((id, index) => {
      const newX = margin + 20 + (index * (objects[0].width + 10));
      drawArrow(ctx, rootX, rootY + 20, newX + objects[0].width / 2, objects[0].y);
    });
  }
  
  function drawFinalState(
    ctx: CanvasRenderingContext2D,
    objects: Array<any>,
    rootY: number,
    arrowColor: string,
    objectColor: string,
    textColor: string,
    rootColor: string,
    margin: number
  ) {
    // Draw root object
    const rootX = margin + 150;
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Find reachable objects and their new positions
    const reachableObjects = objects.filter(obj => obj.reachable);
    const reachableIndices = reachableObjects.map(obj => obj.id);
    
    // Draw compacted objects
    reachableIndices.forEach((id, index) => {
      const newX = margin + 20 + (index * (objects[0].width + 10));
      
      // Draw object
      ctx.fillStyle = objectColor;
      ctx.fillRect(newX, objects[0].y, objects[0].width, objects[0].height);
      
      // Object label
      ctx.fillStyle = textColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obj ${id}`, newX + objects[0].width / 2, objects[0].y + objects[0].height / 2 + 5);
      
      // Draw reference
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;
      drawArrow(ctx, rootX, rootY + 20, newX + objects[0].width / 2, objects[0].y);
    });
    
    // Draw free space
    const usedWidth = reachableIndices.length * (objects[0].width + 10);
    const freeX = margin + 20 + usedWidth;
    const freeWidth = (objects.length - reachableIndices.length) * (objects[0].width + 10) - 10;
    
    ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
    ctx.fillRect(freeX, objects[0].y, freeWidth, objects[0].height);
    
    // Free space label
    ctx.fillStyle = textColor;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Contiguous Free Space', freeX + freeWidth / 2, objects[0].y + objects[0].height / 2 + 5);
  }
  
  const nextStep = () => {
    setStep(prevStep => (prevStep < totalSteps - 1) ? prevStep + 1 : prevStep);
  };
  
  const prevStep = () => {
    setStep(prevStep => (prevStep > 0) ? prevStep - 1 : prevStep);
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
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    setIsPlaying(true);
    let lastStepTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      if (now - lastStepTime > 1000) { // Change step every second
        lastStepTime = now;
        setStep(prevStep => {
          const nextStep = prevStep + 1;
          if (nextStep >= totalSteps) {
            setIsPlaying(false);
            return 0; // Reset to beginning
          }
          return nextStep;
        });
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  return (
    <div className="mark-compact-animation" style={{ textAlign: 'center', margin: '20px 0' }}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        style={{ border: '1px solid #ddd', maxWidth: '100%' }} 
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={prevStep} disabled={step === 0} style={{ marginRight: '10px' }}>Previous</button>
        <button onClick={playAnimation}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextStep} disabled={step === totalSteps - 1} style={{ marginLeft: '10px' }}>Next</button>
        <button onClick={resetAnimation} style={{ marginLeft: '10px' }}>Reset</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        Step {step + 1} of {totalSteps}
      </div>
    </div>
  );
};

export default MarkCompactAnimation;