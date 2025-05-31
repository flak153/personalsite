"use client";

import { useState, useEffect, useRef } from 'react';

export const MarkAndSweepAnimation = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const totalSteps = 8;
  
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
    const nodeRadius = 25;
    const margin = 40;
    const centerX = canvas.width / 2;
    const heapY = 240;
    const rootY = 80;
    
    // Colors
    const nodeColor = '#9E9E9E';
    const markedColor = '#4CAF50';
    const sweepColor = '#F44336';
    const rootColor = '#2196F3';
    const arrowColor = '#757575';
    const textColor = '#F8FAFC';
    
    // Draw title
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mark and Sweep Garbage Collection', centerX, 30);
    
    // Draw heap boundary
    ctx.strokeStyle = '#BDBDBD';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, heapY - 100, canvas.width - 2 * margin, 200);
    
    // Label the heap
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Heap', margin + 10, heapY - 80);
    
    // Node positions
    const rootX = centerX;
    const nodePositions = [
      { x: centerX - 150, y: heapY, reachable: true },
      { x: centerX - 50, y: heapY, reachable: true },
      { x: centerX + 50, y: heapY, reachable: false },
      { x: centerX + 150, y: heapY, reachable: false }
    ];
    
    // Draw connections (always present)
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;
    
    // Root to first two nodes
    drawArrow(ctx, rootX, rootY, nodePositions[0].x, nodePositions[0].y - nodeRadius);
    drawArrow(ctx, rootX, rootY, nodePositions[1].x, nodePositions[1].y - nodeRadius);
    
    // Node 1 connects to Node 0
    drawArrow(
      ctx, 
      nodePositions[1].x - 15, 
      nodePositions[1].y - 15, 
      nodePositions[0].x + 15, 
      nodePositions[0].y - 15
    );
    
    // Draw root object
    ctx.fillStyle = rootColor;
    ctx.beginPath();
    ctx.arc(rootX, rootY, nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Root label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', rootX, rootY + 5);
    
    // Draw nodes based on current step
    nodePositions.forEach((node, i) => {
      // Determine node color based on step
      let fillColor = nodeColor;
      
      if (step >= 2 && step <= 4 && node.reachable) {
        // During marking phase, reachable nodes get marked (green)
        if ((step === 2 && i === 0) || 
            (step === 3 && i <= 1) ||
            (step === 4 && i <= 1)) {
          fillColor = markedColor;
        }
      } else if (step >= 5 && step <= 6) {
        // During sweeping phase
        if (node.reachable) {
          // Reachable nodes stay marked
          fillColor = markedColor;
        } else if ((step === 5 && i === 2) || (step >= 6 && i >= 2)) {
          // Unreachable nodes get swept (red before disappearing)
          fillColor = sweepColor;
        }
      } else if (step === 7) {
        // After sweeping, only reachable nodes remain (and are unmarked)
        if (!node.reachable) {
          // Don't draw unreachable nodes
          return;
        }
        // Unmark the remaining nodes
        fillColor = nodeColor;
      }
      
      // Draw node
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Node label
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obj ${i}`, node.x, node.y + 5);
    });
    
    // Draw explanation text
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    let explanation = '';
    let subExplanation = '';
    
    switch(step) {
      case 0:
        explanation = 'Initial Heap State';
        subExplanation = 'Two objects are reachable from root, two are unreachable';
        break;
      case 1:
        explanation = 'Mark and Sweep: Starting Collection';
        subExplanation = 'Beginning from the root object';
        break;
      case 2:
        explanation = 'Mark Phase: Following References';
        subExplanation = 'Marking Object 0 as reachable';
        break;
      case 3:
        explanation = 'Mark Phase: Following References';
        subExplanation = 'Marking Object 1 as reachable';
        break;
      case 4:
        explanation = 'Mark Phase: Complete';
        subExplanation = 'All reachable objects are now marked';
        break;
      case 5:
        explanation = 'Sweep Phase: Scanning Heap';
        subExplanation = 'Found unmarked Object 2, freeing it';
        break;
      case 6:
        explanation = 'Sweep Phase: Scanning Heap';
        subExplanation = 'Found unmarked Object 3, freeing it';
        break;
      case 7:
        explanation = 'Collection Complete';
        subExplanation = 'Only reachable objects remain, marks are cleared';
        break;
      default:
        explanation = '';
    }
    
    ctx.fillText(explanation, centerX, canvas.height - 50);
    ctx.font = '14px Arial';
    ctx.fillText(subExplanation, centerX, canvas.height - 25);
    
  }, [step]);
  
  const nextStep = () => {
    setStep(prevStep => (prevStep < totalSteps - 1) ? prevStep + 1 : prevStep);
  };
  
  const prevStep = () => {
    setStep(prevStep => (prevStep > 0) ? prevStep - 1 : prevStep);
  };
  
  return (
    <div className="mark-and-sweep-animation" style={{ textAlign: 'center', margin: '20px 0' }}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        style={{ border: '1px solid #ddd', maxWidth: '100%' }} 
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={prevStep} disabled={step === 0} style={{ marginRight: '10px' }}>Previous</button>
        <button onClick={nextStep} disabled={step === totalSteps - 1}>Next</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        Step {step + 1} of {totalSteps}
      </div>
    </div>
  );
};

export default MarkAndSweepAnimation;