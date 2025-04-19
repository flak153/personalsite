"use client";

import { useState, useEffect, useRef } from 'react';

export const ReferenceCountingAnimation = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const totalSteps = 6;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Settings
    const boxSize = 60;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const objectX = centerX;
    const objectY = centerY - 20;
    const refStartDist = 120;
    
    // Colors
    const boxColor = '#4CAF50';
    const deadBoxColor = '#F44336';
    const arrowColor = '#2196F3';
    const textColor = '#F8FAFC';
    
    // Draw object
    ctx.fillStyle = step === 5 ? deadBoxColor : boxColor;
    ctx.fillRect(objectX - boxSize/2, objectY - boxSize/2, boxSize, boxSize);
    
    // Draw ref count
    let refCount;
    switch(step) {
      case 0: refCount = 0; break;
      case 1: refCount = 1; break;
      case 2: refCount = 2; break;
      case 3: refCount = 3; break;
      case 4: refCount = 0; break;
      case 5: refCount = 0; break;
      default: refCount = 0;
    }
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Count: ${refCount}`, objectX, objectY + 5);
    
    // Draw references based on current step
    const angles = [210, 270, 330]; // Angles for the three references
    
    for (let i = 0; i < 3; i++) {
      // Only draw references that exist in the current step
      if ((step === 1 && i === 0) || 
          (step === 2 && i <= 1) || 
          (step === 3 && i <= 2)) {
        
        const angleRad = angles[i] * Math.PI / 180;
        const startX = objectX + refStartDist * Math.cos(angleRad);
        const startY = objectY + refStartDist * Math.sin(angleRad);
        const endX = objectX + (boxSize/2) * Math.cos(angleRad);
        const endY = objectY + (boxSize/2) * Math.sin(angleRad);
        
        // Draw reference object
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.arc(startX, startY, 25, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = textColor;
        ctx.font = '16px Arial';
        ctx.fillText(`Ref ${i+1}`, startX, startY + 5);
        
        // Draw arrow
        ctx.strokeStyle = arrowColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        // Draw arrowhead
        const headLen = 10;
        const dx = endX - startX;
        const dy = endY - startY;
        const arrowAngle = Math.atan2(dy, dx);
        ctx.lineTo(endX - headLen * Math.cos(arrowAngle - Math.PI/6), endY - headLen * Math.sin(arrowAngle - Math.PI/6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(arrowAngle + Math.PI/6), endY - headLen * Math.sin(arrowAngle + Math.PI/6));
        ctx.stroke();
      }
    }
    
    // Draw explanation text
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    let explanation = '';
    switch(step) {
      case 0: 
        explanation = 'Object created with reference count of 0';
        break;
      case 1:
        explanation = 'Reference 1 points to object, count = 1';
        break;
      case 2:
        explanation = 'Reference 2 points to object, count = 2';
        break;  
      case 3:
        explanation = 'Reference 3 points to object, count = 3';
        break;
      case 4:
        explanation = 'All references removed, count = 0';
        break;
      case 5:
        explanation = 'Object eligible for garbage collection';
        break;
      default:
        explanation = '';
    }
    
    ctx.fillText(explanation, centerX, canvas.height - 30);
    
    // Draw title
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Reference Counting Garbage Collection', centerX, 30);
    
  }, [step]);
  
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
    <div className="reference-counting-animation" style={{ textAlign: 'center', margin: '20px 0' }}>
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

export default ReferenceCountingAnimation;