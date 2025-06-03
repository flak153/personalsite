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
    const startColor = "rgba(75, 192, 192, 0.4)"; // Teal for start points with reduced opacity
    const endColor = "rgba(154, 3, 30, 0.35)"; // Deep Red for end points with reduced opacity
    const visitedColor = "rgba(50, 50, 200, 0.2)"; // Blue for visited cells (more transparent)
    const frontierColor = "rgba(159, 123, 216, 0.35)"; // Lavender for frontier (more transparent)
    const pathColor = "rgba(159, 123, 216, 0.8)"; // Lavender for final path (changed from gold)
    
    // Maze and grid properties
    const cellSize = 40; // Size of each grid cell
    let grid: Cell[][] = [];
    let mazePaths: PathfindingProcess[] = [];
    const maxConcurrentPaths = 3; // Maximum number of concurrent pathfinding visualizations
    
    // Maze generation animation state
    let mazeGenerationComplete = false;
    
    // Cell class to represent each grid cell in the maze
    class Cell {
      row: number;
      col: number;
      x: number;
      y: number;
      walls: { top: boolean, right: boolean, bottom: boolean, left: boolean };
      visited: boolean = false;
      animationProgress: number = 0; // 0 to 1, controls wall fade-in
      generationTime: number = 0; // When this cell was added to the maze
      enteredFrom: 'top' | 'right' | 'bottom' | 'left' | null = null; // Direction cell was entered from
      
      constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.x = col * cellSize;
        this.y = row * cellSize;
        // Start with all walls intact
        this.walls = { top: true, right: true, bottom: true, left: true };
      }
      
      // Draw the cell and its walls
      draw(ctx: CanvasRenderingContext2D, currentTime: number) {
        // Only draw if cell has been visited
        if (!this.visited) return;
        
        const x = this.x;
        const y = this.y;
        
        // Update animation progress
        if (this.animationProgress < 1 && this.generationTime > 0) {
          const elapsed = currentTime - this.generationTime;
          this.animationProgress = Math.min(1, elapsed / 100); // 100ms for wall growth
        }
        
        // Color transition from bright lavender to dark blue (3 seconds)
        const colorElapsed = currentTime - this.generationTime;
        const colorProgress = Math.min(1, colorElapsed / 3000); // 3 second color transition
        const r = 200 - (200 - 10) * colorProgress;  // Start at bright lavender red
        const g = 150 - (150 - 36) * colorProgress;  // Lavender green
        const b = 255 - (255 - 99) * colorProgress;  // Lavender blue
        const opacity = 0.9 - (0.9 - 0.45) * colorProgress;
        
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * this.animationProgress})`;
        ctx.lineWidth = 2 - 0.5 * colorProgress; // Start thicker, end thinner
        
        // Draw walls with growth animation
        const drawWall = (wall: 'top' | 'right' | 'bottom' | 'left', startX: number, startY: number, endX: number, endY: number) => {
          const progress = this.animationProgress;
          
          // If this is the first cell (no parent), grow from center
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
          
          // Determine the connection point based on where we entered from
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
          
          // Calculate the closest point on the wall to the connection point
          let growthStartX = connectionX;
          let growthStartY = connectionY;
          
          // For each wall, find where it should start growing from
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
          
          // Draw the wall growing from the growth point outward
          ctx.beginPath();
          
          // Calculate the two end points relative to the growth start
          const dx1 = startX - growthStartX;
          const dy1 = startY - growthStartY;
          const dx2 = endX - growthStartX;
          const dy2 = endY - growthStartY;
          
          // Draw from growth point to both ends
          ctx.moveTo(growthStartX + dx1 * progress, growthStartY + dy1 * progress);
          ctx.lineTo(growthStartX, growthStartY);
          ctx.lineTo(growthStartX + dx2 * progress, growthStartY + dy2 * progress);
          ctx.stroke();
        };
        
        // Draw walls
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
        if (!this.active || this.pathFound || this.frontier.length === 0) return; // Reverted to original condition
        
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
      
      // Reset generation state
      mazeGenerationComplete = false;
      
      // Start maze generation from a random position
      const startPositions = [
        { row: Math.floor(rows / 2), col: Math.floor(cols / 2) }, // Center
        { row: Math.floor(rows / 4), col: Math.floor(cols / 4) }, // Top-left quadrant
        { row: Math.floor(rows * 3 / 4), col: Math.floor(cols / 4) }, // Bottom-left quadrant
        { row: Math.floor(rows / 4), col: Math.floor(cols * 3 / 4) }, // Top-right quadrant
        { row: Math.floor(rows * 3 / 4), col: Math.floor(cols * 3 / 4) }, // Bottom-right quadrant
        { row: 0, col: Math.floor(cols / 2) }, // Top edge center
        { row: rows - 1, col: Math.floor(cols / 2) }, // Bottom edge center
        { row: Math.floor(rows / 2), col: 0 }, // Left edge center
        { row: Math.floor(rows / 2), col: cols - 1 }, // Right edge center
      ];
      
      const randomStart = startPositions[Math.floor(Math.random() * startPositions.length)];
      const startCell = grid[randomStart.row][randomStart.col];
      
      // Pre-compute the entire maze structure invisibly
      generateMazeStructure(startCell.row, startCell.col);
      
      // Clear existing paths
      mazePaths = [];
    }
    
    // Generate the maze structure using BFS for more uniform growth
    function generateMazeStructure(startRow: number, startCol: number) {
      const queue: Cell[] = [];
      const growthOrder: Cell[] = []; // Track order of cell visits
      const allCells: Cell[] = []; // All cells to visit
      
      // Collect all cells
      for (const row of grid) {
        for (const cell of row) {
          allCells.push(cell);
        }
      }
      
      const startCell = grid[startRow][startCol];
      startCell.visited = true;
      queue.push(startCell);
      growthOrder.push(startCell);
      
      // BFS-based maze generation
      while (growthOrder.length < allCells.length) {
        // Pick a random visited cell that has unvisited neighbors
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
        
        // Pick a random cell from those with unvisited neighbors
        const current = visitedWithUnvisited[Math.floor(Math.random() * visitedWithUnvisited.length)];
        
        // Get all unvisited neighbors
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
          
          // Remove walls
          current.walls[dir.wall] = false;
          next.walls[dir.opposite] = false;
          
          // Track parent relationship and growth order
          next.enteredFrom = dir.opposite;
          next.visited = true;
          growthOrder.push(next);
        }
      }
      
      // Reset visited flags and set up animation timing based on distance from start
      for (const row of grid) {
        for (const cell of row) {
          cell.visited = false;
        }
      }
      
      // BFS to calculate distances from start for proper animation timing
      const distanceQueue: Array<{cell: Cell, distance: number}> = [];
      startCell.generationTime = performance.now();
      startCell.visited = true;
      distanceQueue.push({cell: startCell, distance: 0});
      
      while (distanceQueue.length > 0) {
        const {cell: current, distance} = distanceQueue.shift()!;
        
        // Check all neighbors that are connected (no wall between)
        const directions = [
          { row: -1, col: 0, wall: 'top' },
          { row: 0, col: 1, wall: 'right' },
          { row: 1, col: 0, wall: 'bottom' },
          { row: 0, col: -1, wall: 'left' }
        ] as const;
        
        for (const dir of directions) {
          if (!current.walls[dir.wall]) { // Only if there's no wall
            const newRow = current.row + dir.row;
            const newCol = current.col + dir.col;
            
            if (
              newRow >= 0 && newRow < grid.length &&
              newCol >= 0 && newCol < grid[0].length &&
              !grid[newRow][newCol].visited
            ) {
              const neighbor = grid[newRow][newCol];
              neighbor.visited = true;
              neighbor.generationTime = performance.now() + (distance + 1) * 100; // 100ms per level
              distanceQueue.push({cell: neighbor, distance: distance + 1});
            }
          }
        }
      }
      
      // Reset visited flags for animation
      for (const row of grid) {
        for (const cell of row) {
          cell.visited = false;
        }
      }
    }
    
    // Step function for animated maze generation
    function stepMazeGeneration(currentTime: number) {
      if (mazeGenerationComplete) return;
      
      // Check all cells and mark them as visible if their time has come
      let allVisible = true;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.generationTime > 0 && cell.generationTime <= currentTime && !cell.visited) {
            cell.visited = true;
          }
          if (cell.generationTime > 0 && !cell.visited) {
            allVisible = false;
          }
        }
      }
      
      if (allVisible) {
        mazeGenerationComplete = true;
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
      
      // Step maze generation
      if (!mazeGenerationComplete) {
        stepMazeGeneration(timestamp);
      }
      
      // Draw maze grid
      for (const row of grid) {
        for (const cell of row) {
          cell.draw(ctx, timestamp);
        }
      }
      
      
      // Only start pathfinding after maze is complete
      if (mazeGenerationComplete) {
        // Create new pathfinding process occasionally
        if (timestamp - lastPathCreation > 8000 && mazePaths.length < maxConcurrentPaths) {
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
