"use client";

import { useRef, useState } from "react";
import MazeBuilder, { type MazeBuilderRef } from "./MazeBuilder";
import MazeTraverser from "./MazeTraverser";

export default function CircuitBoardBackground() {
  const [mazeComplete, setMazeComplete] = useState(false);
  const mazeBuilderRef = useRef<MazeBuilderRef>(null);
  const cellSize = 40;
  
  return (
    <>
      <MazeBuilder 
        ref={mazeBuilderRef}
        cellSize={cellSize}
        onComplete={() => setMazeComplete(true)}
      />
      {mazeComplete && mazeBuilderRef.current && (
        <MazeTraverser 
          grid={mazeBuilderRef.current.getGrid()}
          cellSize={cellSize}
          enabled={mazeComplete}
          maxConcurrentPaths={1}
        />
      )}
    </>
  );
}
