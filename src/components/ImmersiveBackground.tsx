"use client";

import { useEffect, useRef } from "react";

export default function ImmersiveBackground() {
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
    
    // Colors that match your theme
    const royalPlum = { r: 45, g: 0, b: 81 };
    const mustardYellow = { r: 255, g: 219, b: 88 };
    
    // PARTICLES SYSTEM
    const particleCount = 200;
    const particles: Particle[] = [];
    
    // CIRCUIT SYSTEM
    const nodeCount = Math.floor(window.innerWidth * window.innerHeight / 50000); // Reduced density
    const nodes: Node[] = [];
    const maxConnections = 2;
    const connectionDistance = 300;
    
    // DATA VISUALIZATION SYSTEM
    const graphCount = 5;
    const graphs: Graph[] = [];
    
    // CODE RAIN SYSTEM
    const codeSymbols = "01".split("");
    const columns = Math.floor(canvas.width / 20);
    const codeDrops: CodeDrop[] = [];
    
    // INTERFACES
    interface Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: { r: number, g: number, b: number };
    }
    
    interface Node {
      x: number;
      y: number;
      size: number;
      connections: Connection[];
      pulseActive: boolean;
      pulseProgress: number;
      pulseSpeed: number;
      activationTime: number;
    }
    
    interface Connection {
      to: Node;
      width: number;
      pathPoints: {x: number, y: number}[];
      hasPulse: boolean;
    }
    
    interface Graph {
      x: number;
      points: number[];
      targetPoints: number[];
      width: number;
      height: number;
      speed: number;
      color: string;
      lineWidth: number;
    }
    
    interface CodeDrop {
      x: number;
      y: number;
      speed: number;
      symbols: string[];
      opacity: number;
    }
    
    // Initialize particles (falling elements with color gradient)
    for (let i = 0; i < particleCount; i++) {
      // Calculate normalized Y position (0-1) for gradient color
      const y = Math.random() * canvas.height;
      const normalizedY = y / canvas.height;
      
      // Interpolate between colors based on y position
      const color = {
        r: Math.round(royalPlum.r + normalizedY * (mustardYellow.r - royalPlum.r)),
        g: Math.round(royalPlum.g + normalizedY * (mustardYellow.g - royalPlum.g)),
        b: Math.round(royalPlum.b + normalizedY * (mustardYellow.b - royalPlum.b))
      };
      
      particles.push({
        x: Math.random() * canvas.width,
        y,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        color
      });
    }
    
    // Initialize circuit nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 1,
        connections: [],
        pulseActive: false,
        pulseProgress: 0,
        pulseSpeed: Math.random() * 0.01 + 0.003,
        activationTime: Math.random() * 5000
      });
    }
    
    // Connect circuit nodes
    for (const node of nodes) {
      // Sort other nodes by distance
      const otherNodes = [...nodes]
        .filter(n => n !== node)
        .sort((a, b) => {
          const distA = Math.hypot(a.x - node.x, a.y - node.y);
          const distB = Math.hypot(b.x - node.x, b.y - node.y);
          return distA - distB;
        });
      
      // Connect to closest nodes
      let connections = 0;
      for (const otherNode of otherNodes) {
        if (connections >= maxConnections) break;
        
        const dist = Math.hypot(otherNode.x - node.x, otherNode.y - node.y);
        if (dist < connectionDistance) {
          // Create path with slight curves
          const pathPoints = [];
          const segmentCount = Math.floor(dist / 50) + 1;
          const angleVariation = Math.PI / 8;
          
          let currentX = node.x;
          let currentY = node.y;
          
          // Basic direction vector
          const dx = (otherNode.x - node.x) / segmentCount;
          const dy = (otherNode.y - node.y) / segmentCount;
          
          pathPoints.push({x: currentX, y: currentY});
          
          for (let i = 1; i < segmentCount; i++) {
            // Add some randomness to each segment
            const angleOffset = (Math.random() * 2 - 1) * angleVariation;
            const segLength = Math.hypot(dx, dy);
            const normalizedDx = dx / segLength;
            const normalizedDy = dy / segLength;
            
            // Rotate the segment
            const rotatedDx = normalizedDx * Math.cos(angleOffset) - normalizedDy * Math.sin(angleOffset);
            const rotatedDy = normalizedDx * Math.sin(angleOffset) + normalizedDy * Math.cos(angleOffset);
            
            currentX += rotatedDx * segLength;
            currentY += rotatedDy * segLength;
            
            pathPoints.push({x: currentX, y: currentY});
          }
          
          // Ensure final point connects to target
          pathPoints.push({x: otherNode.x, y: otherNode.y});
          
          node.connections.push({
            to: otherNode,
            width: Math.random() * 0.5 + 0.3,
            pathPoints,
            hasPulse: Math.random() < 0.3 // 30% chance of having pulse
          });
          connections++;
        }
      }
    }
    
    // Initialize data visualization graphs
    for (let i = 0; i < graphCount; i++) {
      const pointCount = Math.floor(Math.random() * 10) + 20;
      const points: number[] = [];
      const targetPoints: number[] = [];
      
      for (let j = 0; j < pointCount; j++) {
        points.push(Math.random());
        targetPoints.push(Math.random());
      }
      
      // Color in theme range
      const normalizedColor = Math.random();
      const r = Math.round(royalPlum.r + normalizedColor * (mustardYellow.r - royalPlum.r));
      const g = Math.round(royalPlum.g + normalizedColor * (mustardYellow.g - royalPlum.g));
      const b = Math.round(royalPlum.b + normalizedColor * (mustardYellow.b - royalPlum.b));
      
      graphs.push({
        x: Math.random() * (canvas.width - 300) + 150,
        points,
        targetPoints,
        width: Math.random() * 200 + 100,
        height: Math.random() * 60 + 30,
        speed: Math.random() * 0.02 + 0.01,
        color: `rgba(${r}, ${g}, ${b}, 0.2)`,
        lineWidth: Math.random() * 1 + 1
      });
    }
    
    // Initialize code rain
    for (let i = 0; i < columns; i++) {
      const symbolCount = Math.floor(Math.random() * 15) + 5;
      const symbols: string[] = [];
      
      for (let j = 0; j < symbolCount; j++) {
        symbols.push(codeSymbols[Math.floor(Math.random() * codeSymbols.length)]);
      }
      
      codeDrops.push({
        x: i * 20 + 10,
        y: Math.random() * canvas.height * 2 - canvas.height,
        speed: Math.random() * 2 + 1,
        symbols,
        opacity: Math.random() * 0.2 + 0.05
      });
    }
    
    const startTime = Date.now();
    
    let animationFrame: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // Draw code rain first (background layer)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      for (const drop of codeDrops) {
        ctx.font = "16px monospace";
        
        // Draw each symbol in the drop
        for (let i = 0; i < drop.symbols.length; i++) {
          // Fade opacity based on position in the stream
          const symbolOpacity = drop.opacity * (1 - i / drop.symbols.length);
          
          if (i === 0) {
            ctx.fillStyle = `rgba(255, 219, 88, ${symbolOpacity * 1.5})`; // First symbol brighter
          } else {
            ctx.fillStyle = `rgba(45, 0, 81, ${symbolOpacity})`;
          }
          
          ctx.fillText(
            drop.symbols[i],
            drop.x,
            drop.y - i * 20
          );
        }
        
        // Move drop down
        drop.y += drop.speed;
        
        // Reset when off screen
        if (drop.y - drop.symbols.length * 20 > canvas.height) {
          drop.y = -20;
          drop.speed = Math.random() * 2 + 1;
          
          // Chance to change symbols
          if (Math.random() < 0.2) {
            const symbolCount = Math.floor(Math.random() * 15) + 5;
            drop.symbols = [];
            
            for (let j = 0; j < symbolCount; j++) {
              drop.symbols.push(codeSymbols[Math.floor(Math.random() * codeSymbols.length)]);
            }
          }
        }
      }
      
      // Draw data visualization graphs
      for (const graph of graphs) {
        // Update points toward targets
        for (let i = 0; i < graph.points.length; i++) {
          if (Math.abs(graph.points[i] - graph.targetPoints[i]) < 0.01) {
            graph.targetPoints[i] = Math.random();
          } else {
            graph.points[i] += (graph.targetPoints[i] - graph.points[i]) * graph.speed;
          }
        }
        
        // Draw graph line
        ctx.strokeStyle = graph.color;
        ctx.lineWidth = graph.lineWidth;
        ctx.beginPath();
        
        const pointSpacing = graph.width / (graph.points.length - 1);
        
        for (let i = 0; i < graph.points.length; i++) {
          const x = graph.x - graph.width / 2 + i * pointSpacing;
          const y = graph.points[i] * graph.height;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        // Draw subtle fill
        const gradient = ctx.createLinearGradient(
          graph.x, 0,
          graph.x, graph.height
        );
        gradient.addColorStop(0, `${graph.color.slice(0, -4)}0.05)`);
        gradient.addColorStop(1, `${graph.color.slice(0, -4)}0.01)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(graph.x - graph.width / 2, graph.height);
        
        for (let i = 0; i < graph.points.length; i++) {
          const x = graph.x - graph.width / 2 + i * pointSpacing;
          const y = graph.points[i] * graph.height;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(graph.x + graph.width / 2, graph.height);
        ctx.closePath();
        ctx.fill();
      }
      
      // Draw circuit connections
      for (const node of nodes) {
        for (const connection of node.connections) {
          // Gradient for paths
          const gradient = ctx.createLinearGradient(
            node.x, node.y, 
            connection.to.x, connection.to.y
          );
          
          gradient.addColorStop(0, `rgba(45, 0, 81, 0.1)`);
          gradient.addColorStop(1, `rgba(255, 219, 88, 0.05)`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = connection.width;
          ctx.beginPath();
          
          // Draw path following points
          ctx.moveTo(connection.pathPoints[0].x, connection.pathPoints[0].y);
          for (let i = 1; i < connection.pathPoints.length; i++) {
            ctx.lineTo(connection.pathPoints[i].x, connection.pathPoints[i].y);
          }
          
          ctx.stroke();
          
          // Draw pulse animations on some connections
          if (connection.hasPulse && node.pulseActive) {
            const progress = node.pulseProgress;
            
            if (progress > 0 && progress < 1) {
              // Find position along the path based on progress
              const segmentCount = connection.pathPoints.length - 1;
              const segment = Math.floor(progress * segmentCount);
              const segmentProgress = (progress * segmentCount) % 1;
              
              const start = connection.pathPoints[segment];
              const end = connection.pathPoints[segment + 1];
              
              const pulseX = start.x + (end.x - start.x) * segmentProgress;
              const pulseY = start.y + (end.y - start.y) * segmentProgress;
              
              // Draw pulse
              const pulseSize = connection.width * 3;
              const pulseGlow = ctx.createRadialGradient(
                pulseX, pulseY, 0,
                pulseX, pulseY, pulseSize
              );
              
              pulseGlow.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
              pulseGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
              
              ctx.fillStyle = pulseGlow;
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      
      // Draw circuit nodes
      for (const node of nodes) {
        // Check if it's time to activate pulse
        if (!node.pulseActive && elapsed > node.activationTime) {
          node.pulseActive = true;
          node.pulseProgress = 0;
          
          // Set next activation time
          node.activationTime = elapsed + Math.random() * 5000 + 3000;
        }
        
        // Update pulse progress if active
        if (node.pulseActive) {
          node.pulseProgress += node.pulseSpeed;
          if (node.pulseProgress >= 1) {
            node.pulseActive = false;
          }
        }
        
        // Draw node
        ctx.fillStyle = node.pulseActive ? 
          `rgba(255, 219, 88, 0.2)` : 
          `rgba(45, 0, 81, 0.15)`;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw floating particles (foreground)
      for (const particle of particles) {
        // Move particle down
        particle.y += particle.speed;
        
        // Reset when off screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
          
          // Recalculate color based on new position
          const normalizedY = 0; // Top of screen
          particle.color = {
            r: Math.round(royalPlum.r + normalizedY * (mustardYellow.r - royalPlum.r)),
            g: Math.round(royalPlum.g + normalizedY * (mustardYellow.g - royalPlum.g)),
            b: Math.round(royalPlum.b + normalizedY * (mustardYellow.b - royalPlum.b))
          };
        } else {
          // Update color based on current y position
          const normalizedY = particle.y / canvas.height;
          particle.color = {
            r: Math.round(royalPlum.r + normalizedY * (mustardYellow.r - royalPlum.r)),
            g: Math.round(royalPlum.g + normalizedY * (mustardYellow.g - royalPlum.g)),
            b: Math.round(royalPlum.b + normalizedY * (mustardYellow.b - royalPlum.b))
          };
        }
        
        // Draw particle
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.7)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
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