"use client";

import { useEffect, useRef } from "react";

export default function CircuitBoardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    
    // Set canvas size to match window
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Reset and clear the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    
    // Call initially and on resize
    setCanvasSize();
    
    // Use a debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
        // Regenerate the maze when resizing
        initializeMaze();
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    
    // Colors for the maze and pathfinding visualization
    const mazeColor = "rgba(10, 36, 99, 0.45)"; // Royal Blue with increased opacity
    const startColor = "rgba(75, 192, 192, 0.4)"; // Teal for start points with reduced opacity
    const endColor = "rgba(154, 3, 30, 0.35)"; // Deep Red for end points with reduced opacity
    const visitedColor = "rgba(50, 50, 200, 0.2)"; // Blue for visited cells (more transparent)
    const frontierColor = "rgba(159, 123, 216, 0.35)"; // Lavender for frontier (more transparent)
    const pathColor = "rgba(159, 123, 216, 0.8)"; // Lavender for final path (changed from gold)
    
    // Maze and grid properties
    const cellSize = 40; // Size of each grid cell
    let grid: Cell[][] = [];
    let mazePaths: PathfindingProcess[] = [];
    const maxConcurrentPaths = 5; // Maximum number of concurrent pathfinding visualizations
    
    // Cell class to represent each grid cell in the maze
    class Cell {
      row: number;
      col: number;
      x: number;
      y: number;
      walls: { top: boolean, right: boolean, bottom: boolean, left: boolean };
      visited: boolean = false;
      
      constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.x = col * cellSize;
        this.y = row * cellSize;
        // Start with all walls intact
        this.walls = { top: true, right: true, bottom: true, left: true };
      }
      
      // Draw the cell and its walls
      draw(ctx: CanvasRenderingContext2D) {
        const x = this.x;
        const y = this.y;
        
        ctx.strokeStyle = mazeColor;
        ctx.lineWidth = 1.5;
        
        // Draw walls
        if (this.walls.top) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
          ctx.stroke();
        }
        if (this.walls.right) {
          ctx.beginPath();
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }
        if (this.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }
        if (this.walls.left) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
          ctx.stroke();
        }
      }
      
      // Get the center coordinates of the cell
      getCenter(): { x: number, y: number } {
        return {
          x: this.x + cellSize / 2,
          y: this.y + cellSize / 2
        };
      }
    }
    
    // Class to represent the pathfinding process
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
      pulseDuration: number = 3000; // Duration of the pulse animation in ms
      startTime: number;
      animationSpeed: number;
      algorithmType: 'dijkstra' | 'astar';
      
      constructor(startCell: Cell, endCell: Cell, startTime: number) {
        this.startCell = startCell;
        this.endCell = endCell;
        this.startTime = startTime;
        this.frontier.push(startCell);
        this.costSoFar.set(startCell, 0);
        this.animationSpeed = Math.random() * 0.03 + 0.007; // Even slower animation speed (reduced by 3x)
        this.algorithmType = Math.random() > 0.5 ? 'dijkstra' : 'astar';
      }
      
      // Perform one step of the pathfinding algorithm
      step() {
        if (!this.active || this.pathFound || this.frontier.length === 0) return;
        
        // Slow down the algorithm - only proceed every few frames
        if (Math.random() > 0.1) return; // 90% chance to skip a step (was 70%)
        
        // Get the cell with the lowest cost (Dijkstra's) or lowest f-score (A*)
        let currentIndex = 0;
        if (this.algorithmType === 'astar') {
          // For A*, find the cell with the lowest f-score (cost + heuristic)
          let lowestFScore = Infinity;
          this.frontier.forEach((cell, index) => {
            const cost = this.costSoFar.get(cell) || 0;
            const heuristic = this.heuristic(cell, this.endCell);
            const fScore = cost + heuristic;
            if (fScore < lowestFScore) {
              lowestFScore = fScore;
              currentIndex = index;
            }
          });
        }
        
        // Get current cell and remove it from frontier
        const current = this.frontier.splice(currentIndex, 1)[0];
        this.visited.push(current);
        
        // Check if we reached the goal
        if (current === this.endCell) {
          this.pathFound = true;
          this.reconstructPath();
          return;
        }
        
        // Get neighbors that we can move to
        const neighbors = this.getNeighbors(current);
        
        for (const next of neighbors) {
          // Calculate the cost to reach the neighbor
          const newCost = (this.costSoFar.get(current) || 0) + 1;
          const existingCost = this.costSoFar.get(next);
          
          if (existingCost === undefined || newCost < existingCost) {
            // This path to the neighbor is better
            this.costSoFar.set(next, newCost);
            this.cameFrom.set(next, current);
            
            // Add to frontier if not already there
            if (!this.frontier.includes(next)) {
              this.frontier.push(next);
            }
          }
        }
      }
      
      // Get valid neighbors for a cell (respecting maze walls)
      getNeighbors(cell: Cell): Cell[] {
        const neighbors: Cell[] = [];
        const { row, col } = cell;
        
        // Check each direction and make sure there's no wall
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
      
      // Heuristic function for A* (Manhattan distance)
      heuristic(a: Cell, b: Cell): number {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
      }
      
      // Reconstruct the path from start to end using the cameFrom map
      reconstructPath() {
        let current = this.endCell;
        while (current !== this.startCell) {
          this.path.unshift(current);
          const prev = this.cameFrom.get(current);
          if (!prev) break;
          current = prev;
        }
        this.path.unshift(this.startCell);
      }
      
      // Draw the pathfinding visualization
      draw(ctx: CanvasRenderingContext2D, timestamp: number) {
        if (!this.active) return;
        
        const elapsed = timestamp - this.startTime;
        
        // Draw visited cells
        ctx.fillStyle = visitedColor;
        for (const cell of this.visited) {
          const center = cell.getCenter();
          ctx.beginPath();
          ctx.arc(center.x, center.y, cellSize / 8, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw frontier cells
        ctx.fillStyle = frontierColor;
        for (const cell of this.frontier) {
          const center = cell.getCenter();
          ctx.beginPath();
          ctx.arc(center.x, center.y, cellSize / 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw the path if found
        if (this.pathFound) {
          // Calculate how much of the path to show
          this.pathProgress = Math.min(1, this.pathProgress + this.animationSpeed * 0.02); // Reduced from 0.05 to 0.02
          const pathLength = this.path.length;
          const segmentsToShow = Math.floor(pathLength * this.pathProgress);
          
          // Draw path segments
          ctx.strokeStyle = pathColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          
          for (let i = 0; i < segmentsToShow - 1; i++) {
            const current = this.path[i].getCenter();
            const next = this.path[i + 1].getCenter();
            
            if (i === 0) {
              ctx.moveTo(current.x, current.y);
            }
            ctx.lineTo(next.x, next.y);
          }
          
          ctx.stroke();
          
          // Draw pulse along the path
          if (this.pathProgress === 1) {
            const pulsePos = (elapsed % this.pulseDuration) / this.pulseDuration;
            const pulseIndex = Math.min(Math.floor(pulsePos * pathLength), pathLength - 1);
            
            if (pulseIndex >= 0 && pulseIndex < pathLength) {
              const pulseCell = this.path[pulseIndex].getCenter();
              
              // Draw pulse
              const pulseSize = cellSize / 3;
              ctx.fillStyle = pathColor;
              ctx.beginPath();
              ctx.arc(pulseCell.x, pulseCell.y, pulseSize, 0, Math.PI * 2);
              ctx.fill();
              
              // Draw glow
              const gradient = ctx.createRadialGradient(
                pulseCell.x, pulseCell.y, 0,
                pulseCell.x, pulseCell.y, pulseSize * 2
              );
              gradient.addColorStop(0, pathColor);
              gradient.addColorStop(1, 'rgba(159, 123, 216, 0)'); // Updated to match lavender
              
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(pulseCell.x, pulseCell.y, pulseSize * 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        // Draw start and end "blobs"
        // Start blob
        drawBlob(ctx, this.startCell.getCenter(), cellSize / 2, startColor, elapsed);
        
        // End blob
        drawBlob(ctx, this.endCell.getCenter(), cellSize / 2, endColor, elapsed);
      }
    }
    
    // Draw a pulsing blob
    function drawBlob(ctx: CanvasRenderingContext2D, center: {x: number, y: number}, 
                     size: number, color: string, timestamp: number) {
      // Pulse effect - reduce the amount of pulsing
      const pulseScale = 1 + 0.1 * Math.sin(timestamp / 800); // Reduced pulse from 0.2 to 0.1, slowed frequency
      const actualSize = size * 0.7 * pulseScale; // Reduced base size by 30%
      
      // Draw the main blob
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(center.x, center.y, actualSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw glow with reduced size and intensity
      const gradient = ctx.createRadialGradient(
        center.x, center.y, 0,
        center.x, center.y, actualSize * 1.5 // Reduced glow radius from 2x to 1.5x
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color.replace(/[^,]+\)/, '0)'));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center.x, center.y, actualSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Initialize the maze grid
    function initializeMaze() {
      // Calculate grid dimensions
      if (!canvas) return; 
      const cols = Math.floor(canvas.width / cellSize);
      const rows = Math.floor(canvas.height / cellSize);
      
      // Create the grid
      grid = Array(rows).fill(null).map((_, row) => 
        Array(cols).fill(null).map((_, col) => new Cell(row, col))
      );
      
      // Generate maze using recursive backtracking
      generateMaze(0, 0);
      
      // Clear existing paths
      mazePaths = [];
    }
    
    // Generate maze using recursive backtracking
    function generateMaze(row: number, col: number) {
      // Mark current cell as visited
      grid[row][col].visited = true;
      
      // Define possible directions: [row offset, col offset, wall to remove in current, wall to remove in neighbor]
      const directions = [
        [-1, 0, 'top', 'bottom'],    // Top
        [0, 1, 'right', 'left'],     // Right
        [1, 0, 'bottom', 'top'],     // Bottom
        [0, -1, 'left', 'right']     // Left
      ] as [number, number, keyof Cell['walls'], keyof Cell['walls']][]; 
      
      // Shuffle directions for randomness
      shuffleArray(directions);
      
      // Try each direction
      for (const [rowOffset, colOffset, wallCurrent, wallNeighbor] of directions) {
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        
        // Check if the new position is valid and unvisited
        if (
          newRow >= 0 && newRow < grid.length &&
          newCol >= 0 && newCol < grid[0].length &&
          !grid[newRow][newCol].visited
        ) {
          // Remove walls between current cell and neighbor
          grid[row][col].walls[wallCurrent] = false;
          grid[newRow][newCol].walls[wallNeighbor] = false;
          
          // Continue maze generation from the neighbor
          generateMaze(newRow, newCol);
        }
      }
    }
    
    // Helper function to shuffle an array in place
    function shuffleArray<T>(array: T[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    // Get random cell from the grid
    function getRandomCell(): Cell {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid[0].length);
      return grid[row][col];
    }
    
    // Create a new pathfinding process
    function createNewPathfindingProcess(timestamp: number) {
      // If we've reached the max number of concurrent processes, return
      if (mazePaths.length >= maxConcurrentPaths) return;
      
      const startCell = getRandomCell();
      let endCell = getRandomCell();
      
      // Make sure start and end cells are far enough apart
      let distance = Math.abs(startCell.row - endCell.row) + Math.abs(startCell.col - endCell.col);
      while (distance < Math.max(grid.length, grid[0].length) / 3) {
        endCell = getRandomCell();
        distance = Math.abs(startCell.row - endCell.row) + Math.abs(startCell.col - endCell.col);
      }
      
      // Create and add the new process
      const newPath = new PathfindingProcess(startCell, endCell, timestamp);
      mazePaths.push(newPath);
    }
    
    // Initialize the maze
    initializeMaze();
    
    // Animation frame
    let animationFrame: number;
    let lastPathCreation = 0;
    
    // Animation loop
    const animate = (timestamp: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw maze grid
      for (const row of grid) {
        for (const cell of row) {
          cell.draw(ctx);
        }
      }
      
      // Create new pathfinding process occasionally
      if (timestamp - lastPathCreation > 6000 && mazePaths.length < maxConcurrentPaths) { // Increased delay from 3500ms to 6000ms
        createNewPathfindingProcess(timestamp);
        lastPathCreation = timestamp;
      }
      
      // Update and draw each pathfinding process
      for (let i = mazePaths.length - 1; i >= 0; i--) {
        const path = mazePaths[i];
        
        // Progress the algorithm
        if (!path.pathFound) {
          path.step();
        }
        
        // Draw the visualization
        path.draw(ctx, timestamp);
        
        // Remove completed paths that have been visible for a while
        if (path.pathFound && path.pathProgress === 1 && timestamp - path.startTime > 20000) {
          mazePaths.splice(i, 1);
        }
      }
      
      // Request next animation frame
      animationFrame = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0"
    />
  );
}