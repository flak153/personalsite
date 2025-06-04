"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface MazeBuilderRef {
  isComplete: boolean;
  getGrid: () => Cell[][];
  reset: () => void;
}

export interface Cell {
  row: number;
  col: number;
  x: number;
  y: number;
  walls: { top: boolean, right: boolean, bottom: boolean, left: boolean };
  visited: boolean;
  animationProgress: number;
  generationTime: number;
  enteredFrom: 'top' | 'right' | 'bottom' | 'left' | null;
  
  draw(ctx: CanvasRenderingContext2D, currentTime: number): void;
  getCenter(): { x: number, y: number };
}

interface MazeBuilderProps {
  cellSize: number;
  onComplete?: () => void;
}

const MazeBuilder = forwardRef<MazeBuilderRef, MazeBuilderProps>(({ cellSize, onComplete }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Cell[][]>([]);
  const isCompleteRef = useRef(false);
  const animationFrameRef = useRef<number>(0);
  
  // Cell class to represent each grid cell in the maze
  class CellImpl implements Cell {
    row: number;
    col: number;
    x: number;
    y: number;
    walls: { top: boolean, right: boolean, bottom: boolean, left: boolean };
    visited: boolean = false;
    animationProgress: number = 0;
    generationTime: number = 0;
    enteredFrom: 'top' | 'right' | 'bottom' | 'left' | null = null;
    
    constructor(row: number, col: number) {
      this.row = row;
      this.col = col;
      this.x = col * cellSize;
      this.y = row * cellSize;
      this.walls = { top: true, right: true, bottom: true, left: true };
    }
    
    draw(ctx: CanvasRenderingContext2D, currentTime: number) {
      if (!this.visited) return;
      
      const x = this.x;
      const y = this.y;
      
      if (this.animationProgress < 1 && this.generationTime > 0) {
        const elapsed = currentTime - this.generationTime;
        this.animationProgress = Math.min(1, elapsed / 100);
      }
      
      const colorElapsed = currentTime - this.generationTime;
      const colorProgress = Math.min(1, colorElapsed / 3000);
      const r = 200 - (200 - 10) * colorProgress;
      const g = 150 - (150 - 36) * colorProgress;
      const b = 255 - (255 - 99) * colorProgress;
      const opacity = 0.9 - (0.9 - 0.45) * colorProgress;
      
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * this.animationProgress})`;
      ctx.lineWidth = 2 - 0.5 * colorProgress;
      
      const drawWall = (wall: 'top' | 'right' | 'bottom' | 'left', startX: number, startY: number, endX: number, endY: number) => {
        const progress = this.animationProgress;
        
        if (this.enteredFrom === null) {
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          
          ctx.beginPath();
          ctx.moveTo(
            midX - (midX - startX) * progress,
            midY - (midY - startY) * progress
          );
          ctx.lineTo(
            midX + (endX - midX) * progress,
            midY + (endY - midY) * progress
          );
          ctx.stroke();
          return;
        }
        
        let connectionX = x + cellSize / 2;
        let connectionY = y + cellSize / 2;
        
        if (this.enteredFrom === 'top') {
          connectionY = y;
        } else if (this.enteredFrom === 'bottom') {
          connectionY = y + cellSize;
        } else if (this.enteredFrom === 'left') {
          connectionX = x;
        } else if (this.enteredFrom === 'right') {
          connectionX = x + cellSize;
        }
        
        let growthStartX = connectionX;
        let growthStartY = connectionY;
        
        if (wall === 'top') {
          growthStartY = y;
          growthStartX = Math.max(x, Math.min(x + cellSize, connectionX));
        } else if (wall === 'bottom') {
          growthStartY = y + cellSize;
          growthStartX = Math.max(x, Math.min(x + cellSize, connectionX));
        } else if (wall === 'left') {
          growthStartX = x;
          growthStartY = Math.max(y, Math.min(y + cellSize, connectionY));
        } else if (wall === 'right') {
          growthStartX = x + cellSize;
          growthStartY = Math.max(y, Math.min(y + cellSize, connectionY));
        }
        
        ctx.beginPath();
        
        const dx1 = startX - growthStartX;
        const dy1 = startY - growthStartY;
        const dx2 = endX - growthStartX;
        const dy2 = endY - growthStartY;
        
        ctx.moveTo(growthStartX + dx1 * progress, growthStartY + dy1 * progress);
        ctx.lineTo(growthStartX, growthStartY);
        ctx.lineTo(growthStartX + dx2 * progress, growthStartY + dy2 * progress);
        ctx.stroke();
      };
      
      if (this.walls.top) {
        drawWall('top', x, y, x + cellSize, y);
      }
      if (this.walls.right) {
        drawWall('right', x + cellSize, y, x + cellSize, y + cellSize);
      }
      if (this.walls.bottom) {
        drawWall('bottom', x, y + cellSize, x + cellSize, y + cellSize);
      }
      if (this.walls.left) {
        drawWall('left', x, y, x, y + cellSize);
      }
    }
    
    getCenter(): { x: number, y: number } {
      return {
        x: this.x + cellSize / 2,
        y: this.y + cellSize / 2
      };
    }
  }
  
  useImperativeHandle(ref, () => ({
    isComplete: isCompleteRef.current,
    getGrid: () => gridRef.current,
    reset: () => {
      isCompleteRef.current = false;
      initializeMaze();
    }
  }));
  
  const generateMazeStructure = (startRow: number, startCol: number) => {
    const grid = gridRef.current;
    const queue: Cell[] = [];
    const growthOrder: Cell[] = [];
    const allCells: Cell[] = [];
    
    for (const row of grid) {
      for (const cell of row) {
        allCells.push(cell);
      }
    }
    
    const startCell = grid[startRow][startCol];
    startCell.visited = true;
    queue.push(startCell);
    growthOrder.push(startCell);
    
    while (growthOrder.length < allCells.length) {
      const visitedWithUnvisited: Cell[] = [];
      
      for (const cell of growthOrder) {
        const directions = [
          { row: -1, col: 0, wall: 'top', opposite: 'bottom' },
          { row: 0, col: 1, wall: 'right', opposite: 'left' },
          { row: 1, col: 0, wall: 'bottom', opposite: 'top' },
          { row: 0, col: -1, wall: 'left', opposite: 'right' }
        ] as const;
        
        let hasUnvisited = false;
        for (const dir of directions) {
          const newRow = cell.row + dir.row;
          const newCol = cell.col + dir.col;
          if (
            newRow >= 0 && newRow < grid.length &&
            newCol >= 0 && newCol < grid[0].length &&
            !grid[newRow][newCol].visited
          ) {
            hasUnvisited = true;
            break;
          }
        }
        
        if (hasUnvisited) {
          visitedWithUnvisited.push(cell);
        }
      }
      
      if (visitedWithUnvisited.length === 0) break;
      
      const current = visitedWithUnvisited[Math.floor(Math.random() * visitedWithUnvisited.length)];
      
      const unvisited = [];
      const directions = [
        { row: -1, col: 0, wall: 'top', opposite: 'bottom' },
        { row: 0, col: 1, wall: 'right', opposite: 'left' },
        { row: 1, col: 0, wall: 'bottom', opposite: 'top' },
        { row: 0, col: -1, wall: 'left', opposite: 'right' }
      ] as const;
      
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        if (
          newRow >= 0 && newRow < grid.length &&
          newCol >= 0 && newCol < grid[0].length &&
          !grid[newRow][newCol].visited
        ) {
          unvisited.push({ cell: grid[newRow][newCol], dir });
        }
      }
      
      if (unvisited.length > 0) {
        const { cell: next, dir } = unvisited[Math.floor(Math.random() * unvisited.length)];
        
        current.walls[dir.wall] = false;
        next.walls[dir.opposite] = false;
        
        next.enteredFrom = dir.opposite;
        next.visited = true;
        growthOrder.push(next);
      }
    }
    
    for (const row of grid) {
      for (const cell of row) {
        cell.visited = false;
      }
    }
    
    const distanceQueue: Array<{cell: Cell, distance: number}> = [];
    startCell.generationTime = performance.now();
    startCell.visited = true;
    distanceQueue.push({cell: startCell, distance: 0});
    
    while (distanceQueue.length > 0) {
      const {cell: current, distance} = distanceQueue.shift()!;
      
      const directions = [
        { row: -1, col: 0, wall: 'top' },
        { row: 0, col: 1, wall: 'right' },
        { row: 1, col: 0, wall: 'bottom' },
        { row: 0, col: -1, wall: 'left' }
      ] as const;
      
      for (const dir of directions) {
        if (!current.walls[dir.wall]) {
          const newRow = current.row + dir.row;
          const newCol = current.col + dir.col;
          
          if (
            newRow >= 0 && newRow < grid.length &&
            newCol >= 0 && newCol < grid[0].length &&
            !grid[newRow][newCol].visited
          ) {
            const neighbor = grid[newRow][newCol];
            neighbor.visited = true;
            neighbor.generationTime = performance.now() + (distance + 1) * 100;
            distanceQueue.push({cell: neighbor, distance: distance + 1});
          }
        }
      }
    }
    
    for (const row of grid) {
      for (const cell of row) {
        cell.visited = false;
      }
    }
  };
  
  const initializeMaze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    
    gridRef.current = Array(rows).fill(null).map((_, row) => 
      Array(cols).fill(null).map((_, col) => new CellImpl(row, col))
    );
    
    isCompleteRef.current = false;
    
    const startPositions = [
      { row: Math.floor(rows / 2), col: Math.floor(cols / 2) },
      { row: Math.floor(rows / 4), col: Math.floor(cols / 4) },
      { row: Math.floor(rows * 3 / 4), col: Math.floor(cols / 4) },
      { row: Math.floor(rows / 4), col: Math.floor(cols * 3 / 4) },
      { row: Math.floor(rows * 3 / 4), col: Math.floor(cols * 3 / 4) },
      { row: 0, col: Math.floor(cols / 2) },
      { row: rows - 1, col: Math.floor(cols / 2) },
      { row: Math.floor(rows / 2), col: 0 },
      { row: Math.floor(rows / 2), col: cols - 1 },
    ];
    
    const randomStart = startPositions[Math.floor(Math.random() * startPositions.length)];
    generateMazeStructure(randomStart.row, randomStart.col);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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
        initializeMaze();
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    
    // Only initialize if grid is empty
    if (gridRef.current.length === 0) {
      initializeMaze();
    }
    
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isCompleteRef.current) {
        let allVisible = true;
        const grid = gridRef.current;
        
        for (const row of grid) {
          for (const cell of row) {
            if (cell.generationTime > 0 && cell.generationTime <= timestamp && !cell.visited) {
              cell.visited = true;
            }
            if (cell.generationTime > 0 && !cell.visited) {
              allVisible = false;
            }
          }
        }
        
        if (allVisible) {
          isCompleteRef.current = true;
          onComplete?.();
        }
      }
      
      for (const row of gridRef.current) {
        for (const cell of row) {
          cell.draw(ctx, timestamp);
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
  }, [cellSize, onComplete]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0"
    />
  );
});

MazeBuilder.displayName = "MazeBuilder";

export default MazeBuilder;