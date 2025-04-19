"use client";

import { useState, useEffect, useRef } from 'react';

export const MemoryUsageVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  
  const sections = [
    { label: "Program Code", color: "#4CAF50", percentage: 15 },
    { label: "Data Structures", color: "#2196F3", percentage: 35 },
    { label: "Processing", color: "#9C27B0", percentage: 30 },
    { label: "Caching", color: "#FF9800", percentage: 20 }
  ];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Settings
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    // Draw memory usage pie chart
    let startAngle = 0;
    
    sections.forEach((section, index) => {
      const endAngle = startAngle + (section.percentage / 100) * (2 * Math.PI);
      const isHovered = hoveredSection === index;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX, 
        centerY, 
        isHovered ? radius + 10 : radius, 
        startAngle, 
        endAngle
      );
      ctx.closePath();
      
      // Fill slice
      ctx.fillStyle = section.color;
      ctx.fill();
      
      // Add border
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Calculate position for label
      const labelAngle = startAngle + (endAngle - startAngle) / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;
      
      // Draw label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Only show percentage for non-hovered sections to avoid clutter
      if (!isHovered) {
        ctx.fillText(`${section.percentage}%`, labelX, labelY);
      }
      
      startAngle = endAngle;
    });
    
    // Draw title
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Memory Usage Across Different Purposes', centerX, 30);
    
    // Draw legend
    const legendX = 100;
    let legendY = canvas.height - 100;
    
    sections.forEach((section, index) => {
      // Draw color box
      ctx.fillStyle = section.color;
      ctx.fillRect(legendX - 30, legendY - 10, 20, 20);
      
      // Draw border
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX - 30, legendY - 10, 20, 20);
      
      // Draw label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${section.label}: ${section.percentage}%`, legendX, legendY);
      
      // Add highlight for hovered section
      if (hoveredSection === index) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(legendX - 35, legendY - 15, 30, 30);
      }
      
      legendY += 30;
    });
    
  }, [hoveredSection]);
  
  // Handle mouse movement to detect hovering over sections
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    // Check if mouse is in legend area
    const legendX = 100;
    let legendY = canvas.height - 100;
    
    for (let i = 0; i < sections.length; i++) {
      if (
        x >= legendX - 30 && 
        x <= legendX + 150 && 
        y >= legendY - 15 && 
        y <= legendY + 15
      ) {
        setHoveredSection(i);
        return;
      }
      legendY += 30;
    }
    
    // Check if mouse is in pie chart
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= radius) {
      // Calculate angle
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;
      
      // Find which section the angle corresponds to
      let startAngle = 0;
      for (let i = 0; i < sections.length; i++) {
        const endAngle = startAngle + (sections[i].percentage / 100) * (2 * Math.PI);
        if (angle >= startAngle && angle < endAngle) {
          setHoveredSection(i);
          return;
        }
        startAngle = endAngle;
      }
    }
    
    setHoveredSection(null);
  };
  
  const handleMouseLeave = () => {
    setHoveredSection(null);
  };
  
  return (
    <div className="memory-usage-visualization" style={{ textAlign: 'center', margin: '20px 0' }}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          maxWidth: '100%' 
        }} 
      />
    </div>
  );
};

export default MemoryUsageVisualization;
