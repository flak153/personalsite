"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import type { Cell } from "./MazeBuilder";

export interface MazeTraverserRef {
  reset: () => void;
}

interface MazeTraverserProps {
  grid: Cell[][];
  cellSize: number;
  maxConcurrentPaths?: number;
  enabled?: boolean;
}

interface ElectricArc {
  from: Cell;
  to: Cell;
  strength: number;
  age: number;
  segments: Array<{x: number, y: number}>;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

// Performance configuration
const PERFORMANCE_CONFIG = {
  maxSparks: 100,
  shadowsEnabled: true, // Re-enable shadows for better visuals
  reducedEffects: false,
  arcUpdateInterval: 5, // Update arc segments every N frames
  minOpacityThreshold: 0.1, // Don't draw arcs below this opacity
  dynamicAdjustment: true,
  qualityLevel: 'high', // 'high', 'medium', 'low'
};

// Performance monitoring
const frameTimeHistory: number[] = [];
const FRAME_TIME_HISTORY_SIZE = 30;
const TARGET_FPS = 30;
const TARGET_FRAME_TIME = 1000 / TARGET_FPS;

class PathfindingProcess {
  startCell: Cell;
  endCell: Cell;
  visited: Cell[] = [];
  frontier: Cell[] = [];
  path: Cell[] = [];
  pathFound: boolean = false;
  pathProgress: number = 0;
  cameFrom: Map<Cell, Cell> = new Map();
  costSoFar: Map<Cell, number> = new Map();
  active: boolean = true;
  pulseDuration: number = 3000;
  startTime: number;
  pathFoundTime: number = 0;
  animationSpeed: number;
  algorithmType: 'dijkstra' | 'astar';
  electricArcs: ElectricArc[] = [];
  sparks: Spark[] = [];
  mainPathArcs: ElectricArc[] = [];
  deadEndCells: Set<Cell> = new Set();
  frameCount: number = 0;
  baseProbability: number;
  minProbability: number;
  priorityDecayFactor: number;
  
  constructor(startCell: Cell, endCell: Cell, startTime: number, config: {
    baseProbability: number;
    minProbability: number;
    priorityDecayFactor: number;
  }) {
    this.startCell = startCell;
    this.endCell = endCell;
    this.startTime = startTime;
    this.frontier.push(startCell);
    this.costSoFar.set(startCell, 0);
    this.animationSpeed = Math.random() * 0.03 + 0.007;
    this.algorithmType = 'astar'; // Always use A* with Manhattan distance
    this.baseProbability = config.baseProbability;
    this.minProbability = config.minProbability;
    this.priorityDecayFactor = config.priorityDecayFactor;
  }
  
  step(grid: Cell[][]) {
    if (!this.active || this.pathFound || this.frontier.length === 0) return;
    
    // Process multiple frontier cells per frame for more organic growth
    const cellsToProcess: Array<{cell: Cell, score: number, index: number}> = [];
    
    // Calculate scores for all frontier cells
    this.frontier.forEach((cell, index) => {
      const cost = this.costSoFar.get(cell) || 0;
      const heuristic = this.heuristic(cell, this.endCell);
      const fScore = cost + heuristic;
      cellsToProcess.push({cell, score: fScore, index});
    });
    
    // Sort by score (lowest first for A*)
    cellsToProcess.sort((a, b) => a.score - b.score);
    
    // Process cells based on their priority and probability
    const processedIndices: number[] = [];
    
    for (let i = 0; i < cellsToProcess.length; i++) {
      // Higher priority cells (lower index) have higher chance of expanding
      // Best paths have configured base probability, decreasing based on priority
      const priorityFactor = Math.exp(-i * this.priorityDecayFactor); // Exponential decay
      const expansionChance = this.baseProbability * priorityFactor;
      
      if (Math.random() < Math.max(expansionChance, this.minProbability)) {
        const {cell: current, index} = cellsToProcess[i];
        processedIndices.push(index);
        
        this.visited.push(current);
        
        // Create electric arc from parent to current
        const parent = this.cameFrom.get(current);
        if (parent && !this.deadEndCells.has(current)) {
          this.createElectricArc(parent, current, 0.7);
        }
        
        if (current === this.endCell) {
          this.pathFound = true;
          this.pathFoundTime = performance.now();
          this.reconstructPath();
          return;
        }
        
        // Expand this cell's neighbors
        this.expandCell(current, grid);
      }
    }
    
    // Remove processed cells from frontier (in reverse order to maintain indices)
    processedIndices.sort((a, b) => b - a);
    for (const index of processedIndices) {
      this.frontier.splice(index, 1);
    }
  }
  
  expandCell(current: Cell, grid: Cell[][]) {
    const neighbors = this.getNeighbors(current, grid);
    let addedNewNeighbors = false;
    
    for (const next of neighbors) {
      const newCost = (this.costSoFar.get(current) || 0) + 1;
      const existingCost = this.costSoFar.get(next);
      
      if (existingCost === undefined || newCost < existingCost) {
        this.costSoFar.set(next, newCost);
        this.cameFrom.set(next, current);
        
        if (!this.frontier.includes(next)) {
          this.frontier.push(next);
          addedNewNeighbors = true;
        }
      }
    }
    
    // Check if this is truly a dead end
    if (!addedNewNeighbors) {
      // Check if any neighbors are in the frontier
      let hasActiveNeighbor = false;
      for (const neighbor of neighbors) {
        if (this.frontier.includes(neighbor)) {
          hasActiveNeighbor = true;
          break;
        }
      }
      
      // Only mark as dead end if no neighbors are being explored
      if (!hasActiveNeighbor) {
        this.markDeadEndPath(current);
      }
    }
  }
  
  getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
    const neighbors: Cell[] = [];
    const { row, col } = cell;
    
    if (!cell.walls.top && row > 0) {
      neighbors.push(grid[row - 1][col]);
    }
    if (!cell.walls.right && col < grid[0].length - 1) {
      neighbors.push(grid[row][col + 1]);
    }
    if (!cell.walls.bottom && row < grid.length - 1) {
      neighbors.push(grid[row + 1][col]);
    }
    if (!cell.walls.left && col > 0) {
      neighbors.push(grid[row][col - 1]);
    }
    
    return neighbors;
  }
  
  heuristic(a: Cell, b: Cell): number {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }
  
  markDeadEndPath(cell: Cell) {
    let current = cell;
    const pathToMark: Cell[] = [];
    
    // Trace back until we find a branching point
    while (current !== this.startCell) {
      pathToMark.push(current);
      
      const parent = this.cameFrom.get(current);
      if (!parent) break;
      
      // Check if parent has other children that are still active
      let activeChildren = 0;
      for (const [child, p] of this.cameFrom) {
        if (p === parent && !this.deadEndCells.has(child) && child !== current) {
          // Check if this child is in frontier or has descendants in frontier
          if (this.frontier.includes(child) || this.hasActiveDescendants(child)) {
            activeChildren++;
          }
        }
      }
      
      // If parent has other active paths, stop here
      if (activeChildren > 0) break;
      
      current = parent;
    }
    
    // Now mark all cells in the path as dead ends
    for (const deadCell of pathToMark) {
      this.deadEndCells.add(deadCell);
    }
  }
  
  hasActiveDescendants(cell: Cell): boolean {
    // Check if any descendants of this cell are in the frontier
    for (const [child, parent] of this.cameFrom) {
      if (parent === cell && !this.deadEndCells.has(child)) {
        if (this.frontier.includes(child) || this.hasActiveDescendants(child)) {
          return true;
        }
      }
    }
    return false;
  }
  
  reconstructPath() {
    let current = this.endCell;
    while (current !== this.startCell) {
      this.path.unshift(current);
      const prev = this.cameFrom.get(current);
      if (!prev) break;
      current = prev;
    }
    this.path.unshift(this.startCell);
    
    // Mark all non-solution paths as dead ends to fade them out
    for (const cell of this.visited) {
      if (!this.path.includes(cell)) {
        this.deadEndCells.add(cell);
      }
    }
    
    // Don't create new arcs - we'll enhance the existing ones
  }
  
  createElectricArc(from: Cell, to: Cell, strength: number, isMainPath: boolean = false) {
    const fromCenter = from.getCenter();
    const toCenter = to.getCenter();
    
    // Generate lightning bolt segments with more detail for main path
    const segments: Array<{x: number, y: number}> = [];
    const steps = isMainPath ? 8 : 5;
    const distance = Math.sqrt((toCenter.x - fromCenter.x) ** 2 + (toCenter.y - fromCenter.y) ** 2);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = fromCenter.x + (toCenter.x - fromCenter.x) * t;
      const y = fromCenter.y + (toCenter.y - fromCenter.y) * t;
      
      // Add random displacement for lightning effect (except at endpoints)
      if (i > 0 && i < steps) {
        const perpX = -(toCenter.y - fromCenter.y) / distance;
        const perpY = (toCenter.x - fromCenter.x) / distance;
        
        // More dramatic displacement for main path
        const maxDisplacement = isMainPath ? 15 : 10;
        const displacement = (Math.random() - 0.5) * maxDisplacement * strength;
        
        segments.push({
          x: x + perpX * displacement,
          y: y + perpY * displacement
        });
      } else {
        segments.push({ x, y });
      }
    }
    
    const arc: ElectricArc = {
      from,
      to,
      strength,
      age: 0,
      segments
    };
    
    if (isMainPath) {
      this.mainPathArcs.push(arc);
    } else {
      this.electricArcs.push(arc);
    }
    
    // Create sparks with limit check
    const sparkCount = isMainPath ? 3 : 1;
    if (this.sparks.length < PERFORMANCE_CONFIG.maxSparks) {
      this.createSparks(fromCenter.x, fromCenter.y, sparkCount);
      this.createSparks(toCenter.x, toCenter.y, sparkCount);
    }
  }
  
  createSparks(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: `rgba(100, 200, 255, ${Math.random() * 0.5 + 0.5})`
      });
    }
  }
  
  draw(ctx: CanvasRenderingContext2D, timestamp: number, cellSize: number) {
    if (!this.active) return;
    
    const elapsed = timestamp - this.startTime;
    this.frameCount++;
    
    // Update and draw electric arcs
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Skip drawing visited cells glow - we'll only show the lines
    
    // Draw electric connections between visited cells
    for (const cell of this.visited) {
      if (this.deadEndCells.has(cell)) continue;
      
      const parent = this.cameFrom.get(cell);
      if (parent && !this.deadEndCells.has(parent)) {
        // Check if this connection is part of the final path
        const isPartOfSolution = this.pathFound && 
          this.path.includes(cell) && 
          this.path.includes(parent);
        
        if (isPartOfSolution) {
          // Draw enhanced version for solution path
          this.drawSolutionPath(ctx, parent, cell, elapsed);
        } else {
          // Draw normal active path
          this.drawActivePath(ctx, parent, cell, elapsed);
        }
      }
    }
    
    // Update exploration arcs
    for (let i = this.electricArcs.length - 1; i >= 0; i--) {
      const arc = this.electricArcs[i];
      arc.age += 0.01; // Slower aging
      
      // Remove very old arcs
      if (arc.age > 2) {
        this.electricArcs.splice(i, 1);
        continue;
      }
      
      // Draw arc with fading - skip if too faint
      const opacity = arc.age < 1 ? 1 : 2 - arc.age;
      if (opacity > PERFORMANCE_CONFIG.minOpacityThreshold) {
        this.drawElectricArc(ctx, arc, opacity * 0.7, false);
      }
    }
    
    // Create pulsing sparks along the solution path
    if (this.pathFound) {
      this.pathProgress = Math.min(1, this.pathProgress + this.animationSpeed * 0.02);
      
      // Create electric pulse along the path
      const pulsePos = (elapsed % this.pulseDuration) / this.pulseDuration;
      const pulseIndex = Math.min(Math.floor(pulsePos * this.path.length), this.path.length - 1);
      
      if (pulseIndex >= 0 && pulseIndex < this.path.length) {
        const pulseCell = this.path[pulseIndex].getCenter();
        
        // Adjust spark count based on quality level
        const sparkCount = PERFORMANCE_CONFIG.qualityLevel === 'high' ? 8 : 
                          PERFORMANCE_CONFIG.qualityLevel === 'medium' ? 5 : 3;
        
        // Only create sparks if we have room
        if (this.sparks.length < PERFORMANCE_CONFIG.maxSparks - sparkCount) {
          this.createSparks(pulseCell.x, pulseCell.y, sparkCount);
        }
      }
    }
    
    // Update and draw sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spark = this.sparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.life -= 0.02;
      
      if (spark.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }
      
      // Add glow effect to sparks
      if (PERFORMANCE_CONFIG.qualityLevel !== 'low') {
        ctx.shadowBlur = 4;
        ctx.shadowColor = spark.color;
      }
      
      ctx.fillStyle = spark.color.replace(/[\d.]+\)/, `${spark.life})`);
      ctx.fillRect(spark.x - 1, spark.y - 1, 2, 2);
      
      ctx.shadowBlur = 0;
    }
    
    // Draw electric nodes at start and end
    this.drawElectricNode(ctx, this.startCell.getCenter(), cellSize / 2, "rgba(75, 192, 192, 0.6)", elapsed);
    this.drawGroundNode(ctx, this.endCell.getCenter(), cellSize / 2, elapsed);
  }
  
  drawActivePath(ctx: CanvasRenderingContext2D, from: Cell, to: Cell, timestamp: number) {
    const fromCenter = from.getCenter();
    const toCenter = to.getCenter();
    
    // Animated electric effect
    const pulsePhase = (timestamp / 100) % 1;
    
    // Quality-based rendering
    if (PERFORMANCE_CONFIG.qualityLevel === 'high') {
      // Draw double bolts for better effect
      for (let bolt = 0; bolt < 2; bolt++) {
        ctx.strokeStyle = `rgba(120, 180, 255, ${0.3 + pulsePhase * 0.2})`;
        ctx.lineWidth = 1.5 + pulsePhase * 0.5;
        
        if (PERFORMANCE_CONFIG.shadowsEnabled) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(120, 180, 255, 0.8)";
        }
        
        ctx.beginPath();
        ctx.moveTo(fromCenter.x, fromCenter.y);
        
        // Create jagged lightning path
        const steps = 4;
        const distance = Math.sqrt((toCenter.x - fromCenter.x) ** 2 + (toCenter.y - fromCenter.y) ** 2);
        
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const baseX = fromCenter.x + (toCenter.x - fromCenter.x) * t;
          const baseY = fromCenter.y + (toCenter.y - fromCenter.y) * t;
          
          const offset = (Math.random() - 0.5) * 7;
          const perpX = -(toCenter.y - fromCenter.y) / distance;
          const perpY = (toCenter.x - fromCenter.x) / distance;
          
          ctx.lineTo(baseX + perpX * offset, baseY + perpY * offset);
        }
        
        ctx.lineTo(toCenter.x, toCenter.y);
        ctx.stroke();
      }
    } else {
      // Simplified version
      ctx.strokeStyle = `rgba(120, 180, 255, ${0.4 + pulsePhase * 0.2})`;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(fromCenter.x, fromCenter.y);
      ctx.lineTo(toCenter.x, toCenter.y);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
  
  drawSolutionPath(ctx: CanvasRenderingContext2D, from: Cell, to: Cell, timestamp: number) {
    const fromCenter = from.getCenter();
    const toCenter = to.getCenter();
    
    // Enhanced electric effect for solution
    const pulsePhase = (timestamp / 50) % 1;
    const intensity = 0.7 + pulsePhase * 0.3;
    
    // Restore the beautiful multi-layer effect for the solution path
    if (PERFORMANCE_CONFIG.qualityLevel === 'high') {
      // Outer glow
      ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
      ctx.lineWidth = 10;
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(100, 200, 255, 1)";
      
      ctx.beginPath();
      ctx.moveTo(fromCenter.x, fromCenter.y);
      
      // Create slightly jagged path
      const steps = 5;
      const distance = Math.sqrt((toCenter.x - fromCenter.x) ** 2 + (toCenter.y - fromCenter.y) ** 2);
      
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const baseX = fromCenter.x + (toCenter.x - fromCenter.x) * t;
        const baseY = fromCenter.y + (toCenter.y - fromCenter.y) * t;
        
        const offset = (Math.random() - 0.5) * 4;
        const perpX = -(toCenter.y - fromCenter.y) / distance;
        const perpY = (toCenter.x - fromCenter.x) / distance;
        
        ctx.lineTo(baseX + perpX * offset, baseY + perpY * offset);
      }
      
      ctx.lineTo(toCenter.x, toCenter.y);
      ctx.stroke();
      
      // Middle layer
      ctx.strokeStyle = `rgba(100, 200, 255, ${intensity})`;
      ctx.lineWidth = 5;
      ctx.shadowBlur = 15;
      ctx.stroke();
      
      // Inner core
      ctx.strokeStyle = `rgba(255, 255, 255, ${intensity})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.stroke();
    } else {
      // Simplified version for lower quality
      ctx.strokeStyle = `rgba(100, 200, 255, ${intensity})`;
      ctx.lineWidth = 4;
      
      if (PERFORMANCE_CONFIG.shadowsEnabled) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(100, 200, 255, 0.8)";
      }
      
      ctx.beginPath();
      ctx.moveTo(fromCenter.x, fromCenter.y);
      ctx.lineTo(toCenter.x, toCenter.y);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }
  }
  
  drawElectricArc(ctx: CanvasRenderingContext2D, arc: ElectricArc, opacity: number, isMainPath: boolean) {
    const segments = arc.segments;
    
    // Skip very faint arcs
    if (opacity < PERFORMANCE_CONFIG.minOpacityThreshold) return;
    
    // Simplified drawing for better performance
    ctx.strokeStyle = isMainPath 
      ? `rgba(100, 200, 255, ${opacity})`
      : `rgba(150, 180, 255, ${opacity * 0.5})`;
    ctx.lineWidth = isMainPath ? 3 : 1;
    
    ctx.beginPath();
    ctx.moveTo(segments[0].x, segments[0].y);
    for (let i = 1; i < segments.length; i++) {
      ctx.lineTo(segments[i].x, segments[i].y);
    }
    ctx.stroke();
  }
  
  regenerateArcSegments(arc: ElectricArc) {
    const fromCenter = arc.from.getCenter();
    const toCenter = arc.to.getCenter();
    const steps = 5;
    
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = fromCenter.x + (toCenter.x - fromCenter.x) * t;
      const y = fromCenter.y + (toCenter.y - fromCenter.y) * t;
      
      const perpX = -(toCenter.y - fromCenter.y) / Math.sqrt((toCenter.x - fromCenter.x) ** 2 + (toCenter.y - fromCenter.y) ** 2);
      const perpY = (toCenter.x - fromCenter.x) / Math.sqrt((toCenter.x - fromCenter.x) ** 2 + (toCenter.y - fromCenter.y) ** 2);
      const displacement = (Math.random() - 0.5) * 10 * arc.strength;
      
      arc.segments[i].x = x + perpX * displacement;
      arc.segments[i].y = y + perpY * displacement;
    }
  }
  
  drawElectricNode(ctx: CanvasRenderingContext2D, center: {x: number, y: number}, 
                   size: number, color: string, timestamp: number) {
    const pulseScale = 1 + 0.1 * Math.sin(timestamp / 400);
    const actualSize = size * 0.6 * pulseScale;
    
    // Simple colored circle instead of gradient for performance
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(center.x, center.y, actualSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Occasional simple sparks (reduced frequency)
    if (this.frameCount % 20 === 0 && Math.random() < 0.3) {
      const angle = Math.random() * Math.PI * 2;
      const distance = actualSize + Math.random() * 15;
      const endX = center.x + Math.cos(angle) * distance;
      const endY = center.y + Math.sin(angle) * distance;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
  
  drawGroundNode(ctx: CanvasRenderingContext2D, center: {x: number, y: number}, 
                 size: number, timestamp: number) {
    const pulseScale = 1 + 0.05 * Math.sin(timestamp / 700);
    
    // Simple faint circle for ground node
    ctx.fillStyle = "rgba(190, 190, 220, 0.2)";
    ctx.beginPath();
    ctx.arc(center.x, center.y, size * 0.8 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the "G" letter
    ctx.font = `${size * 0.9}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const opacity = 0.4 + 0.1 * Math.sin(timestamp / 900);
    ctx.fillStyle = `rgba(220, 220, 240, ${opacity})`;
    
    ctx.fillText("G", center.x, center.y);
    
    // Reduced frequency ground sparks
    if (this.frameCount % 30 === 0 && Math.random() < 0.2) {
      const angle = Math.random() * Math.PI * 2;
      const distance = size * 0.5 + Math.random() * size * 0.5;
      const sparkX = center.x + Math.cos(angle) * distance;
      const sparkY = center.y + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(sparkX, sparkY);
      ctx.strokeStyle = "rgba(190, 190, 220, 0.3)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
  
}

const MazeTraverser = forwardRef<MazeTraverserRef, MazeTraverserProps>(({ 
  grid, 
  cellSize, 
  maxConcurrentPaths = 3,
  enabled = true 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<PathfindingProcess[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPathCreationRef = useRef(0);
  
  // Default pathfinding config - can be overridden by settings
  const [pathfindingConfig] = useState({
    baseProbability: 0.25,  // Matching the settings.json value
    minProbability: 0.01,   // Matching the settings.json value
    priorityDecayFactor: 0.3
  });
  
  useImperativeHandle(ref, () => ({
    reset: () => {
      pathsRef.current = [];
      lastPathCreationRef.current = 0;
    }
  }));
  
  useEffect(() => {
    const getRandomCell = (): Cell | null => {
      if (!grid || grid.length === 0 || grid[0].length === 0) return null;
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid[0].length);
      return grid[row][col];
    };
    
    const createNewPathfindingProcess = (timestamp: number) => {
      if (pathsRef.current.length >= maxConcurrentPaths) return;
      
      const startCell = getRandomCell();
      if (!startCell) return;
      
      let endCell = getRandomCell();
      if (!endCell) return;
      
      let distance = Math.abs(startCell.row - endCell.row) + Math.abs(startCell.col - endCell.col);
      while (distance < Math.max(grid.length, grid[0].length) / 3) {
        endCell = getRandomCell();
        if (!endCell) return;
        distance = Math.abs(startCell.row - endCell.row) + Math.abs(startCell.col - endCell.col);
      }
      
      const newPath = new PathfindingProcess(startCell, endCell, timestamp, pathfindingConfig);
      pathsRef.current.push(newPath);
    };
    
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    
    setCanvasSize();
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    
    let lastFrameTime = 0;
    
    const animate = (timestamp: number) => {
      // Performance monitoring
      if (lastFrameTime !== 0 && PERFORMANCE_CONFIG.dynamicAdjustment) {
        const frameTime = timestamp - lastFrameTime;
        frameTimeHistory.push(frameTime);
        if (frameTimeHistory.length > FRAME_TIME_HISTORY_SIZE) {
          frameTimeHistory.shift();
        }
        
        // Check average frame time
        if (frameTimeHistory.length >= 10) {
          const avgFrameTime = frameTimeHistory.reduce((a, b) => a + b) / frameTimeHistory.length;
          
          // Adjust performance settings based on frame time
          if (avgFrameTime > TARGET_FRAME_TIME * 1.5) {
            // Performance is poor, reduce effects
            PERFORMANCE_CONFIG.maxSparks = Math.max(30, PERFORMANCE_CONFIG.maxSparks - 10);
            PERFORMANCE_CONFIG.minOpacityThreshold = Math.min(0.3, PERFORMANCE_CONFIG.minOpacityThreshold + 0.05);
            // Downgrade quality level
            if (PERFORMANCE_CONFIG.qualityLevel === 'high' && avgFrameTime > TARGET_FRAME_TIME * 2) {
              PERFORMANCE_CONFIG.qualityLevel = 'medium';
              PERFORMANCE_CONFIG.shadowsEnabled = false;
            } else if (PERFORMANCE_CONFIG.qualityLevel === 'medium' && avgFrameTime > TARGET_FRAME_TIME * 2.5) {
              PERFORMANCE_CONFIG.qualityLevel = 'low';
            }
          } else if (avgFrameTime < TARGET_FRAME_TIME * 0.8) {
            // Performance is good, can increase effects slightly
            PERFORMANCE_CONFIG.maxSparks = Math.min(150, PERFORMANCE_CONFIG.maxSparks + 5);
            PERFORMANCE_CONFIG.minOpacityThreshold = Math.max(0.05, PERFORMANCE_CONFIG.minOpacityThreshold - 0.02);
            // Upgrade quality level
            if (PERFORMANCE_CONFIG.qualityLevel === 'low') {
              PERFORMANCE_CONFIG.qualityLevel = 'medium';
            } else if (PERFORMANCE_CONFIG.qualityLevel === 'medium' && avgFrameTime < TARGET_FRAME_TIME * 0.6) {
              PERFORMANCE_CONFIG.qualityLevel = 'high';
              PERFORMANCE_CONFIG.shadowsEnabled = true;
            }
          }
        }
      }
      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (timestamp - lastPathCreationRef.current > 2000 && pathsRef.current.length < maxConcurrentPaths) {
        createNewPathfindingProcess(timestamp);
        lastPathCreationRef.current = timestamp;
      }
      
      for (let i = pathsRef.current.length - 1; i >= 0; i--) {
        const path = pathsRef.current[i];
        
        if (!path.pathFound) {
          path.step(grid);
        }
        
        path.draw(ctx, timestamp, cellSize);
        
        // Remove completed paths 5 seconds after solution was found
        if (path.pathFound && path.pathFoundTime > 0 && timestamp - path.pathFoundTime > 5000) {
          pathsRef.current.splice(i, 1);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [grid, cellSize, maxConcurrentPaths, enabled, pathfindingConfig]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
});

MazeTraverser.displayName = "MazeTraverser";

export default MazeTraverser;