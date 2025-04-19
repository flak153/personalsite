"use client";

import { useRef, useEffect } from 'react';

interface PlaceholderAnimationProps {
  title: string;
  description?: string;
  width?: number;
  height?: number;
}

const PlaceholderAnimation = ({ 
  title, 
  description = "Animation coming soon...",
  width = 700,
  height = 300
}: PlaceholderAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 1;
    
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 50);
    
    // Draw description
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(description, canvas.width / 2, canvas.height / 2);
    
    // Draw placeholder icon (gear/cog animation)
    drawPlaceholderIcon(ctx, canvas.width / 2, canvas.height / 2 - 50, 30);
    
  }, [title, description]);
  
  const drawPlaceholderIcon = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    radius: number
  ) => {
    const rotation = Date.now() % 3000 / 3000 * Math.PI * 2;
    
    // Outer gear
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Draw gear teeth
    const teeth = 12;
    const outerRadius = radius;
    const innerRadius = radius * 0.7;
    
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
      const endAngle = ((i + 1) / teeth) * Math.PI * 2;
      
      ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      ctx.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
      ctx.lineTo(Math.cos(endAngle) * outerRadius, Math.sin(endAngle) * outerRadius);
    }
    
    ctx.closePath();
    ctx.stroke();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Schedule animation frame
    requestAnimationFrame(() => {
      if (canvasRef.current) {
        const refreshCtx = canvasRef.current.getContext('2d');
        if (refreshCtx) {
          // Only redraw the icon to save performance
          refreshCtx.clearRect(x - radius - 5, y - radius - 5, radius * 2 + 10, radius * 2 + 10);
          drawPlaceholderIcon(refreshCtx, x, y, radius);
        }
      }
    });
  };
  
  return (
    <div className="placeholder-animation" style={{ margin: '20px 0', textAlign: 'center' }}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        style={{ 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          maxWidth: '100%',
        }} 
      />
    </div>
  );
};

export default PlaceholderAnimation;
