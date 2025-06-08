"use client";

import React from "react";
import { useAsteroidsGame } from "./asteroids/useAsteroidsGame";
import GameRenderer from "./asteroids/GameRenderer";
import NeuralNetworkVisualizer from "./asteroids/NeuralNetworkVisualizer";

export default function AsteroidsGame() {
  const {
    gameState,
    aiMode,
    setAiMode,
    isTraining,
    setIsTraining,
    trainingHistory,
    weightChanges,
    aiActions,
    episodeReward,
    bestEpisodeReward,
    networkActivations,
    initializeGame,
  } = useAsteroidsGame();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-center">Game</h3>
        <GameRenderer
          gameState={gameState}
          aiMode={aiMode}
          aiActions={aiActions}
          episodeReward={episodeReward}
          bestReward={bestEpisodeReward}
        />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => setAiMode(!aiMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {aiMode ? "Switch to Manual" : "Switch to AI"}
        </button>
        
        <button
          onClick={() => setIsTraining(!isTraining)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          disabled={!aiMode}
        >
          {isTraining ? "Stop Training" : "Start Training"}
        </button>
        
        <button
          onClick={() => initializeGame(false)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reset Game
        </button>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        <p>Controls: Arrow keys or WASD to move, Space or Enter to shoot</p>
        <p>R to restart, M to toggle AI mode</p>
      </div>
      
      {aiMode && (
        <div className="w-full max-w-5xl">
          <NeuralNetworkVisualizer
            activations={networkActivations}
            width={1000}
            height={600}
          />
        </div>
      )}
      
      {aiMode && (
        <div className="w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">AI Performance</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-4">
            {trainingHistory.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Episode Rewards</h4>
                <div className="h-32 flex items-end gap-1">
                  {trainingHistory.slice(-50).map((reward, i) => {
                    // Find min and max for proper scaling
                    const visibleHistory = trainingHistory.slice(-50);
                    const maxReward = Math.max(...visibleHistory, 1);
                    const minReward = Math.min(...visibleHistory, -1);
                    const range = maxReward - minReward;
                    
                    // Normalize based on actual range
                    const normalized = range > 0 
                      ? (reward - minReward) / range 
                      : 0.5;
                    
                    return (
                      <div
                        key={i}
                        className={reward >= 0 ? "bg-green-600" : "bg-red-600"}
                        style={{ 
                          height: `${Math.max(2, normalized * 100)}%`,
                          width: `${100 / Math.min(50, trainingHistory.length)}%`
                        }}
                        title={`Reward: ${reward.toFixed(1)}`}
                      />
                    );
                  })}
                </div>
                <div className="text-sm mt-2 space-y-1">
                  <p>Average: {trainingHistory.length > 0 ? (trainingHistory.reduce((a, b) => a + b, 0) / trainingHistory.length).toFixed(1) : "0"}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Min: {trainingHistory.length > 0 ? Math.min(...trainingHistory).toFixed(1) : "0"} | 
                    Max: {trainingHistory.length > 0 ? Math.max(...trainingHistory).toFixed(1) : "0"}
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Training Status:</p>
                <p className={isTraining ? "text-green-600" : "text-gray-600"}>
                  {isTraining ? "Active" : "Paused"}
                </p>
              </div>
              <div>
                <p className="font-semibold">Weight Changes:</p>
                <p className="text-blue-600">
                  {weightChanges > 0 ? weightChanges.toExponential(2) : "No changes yet"}
                </p>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>Training uses policy gradient reinforcement learning.</p>
              <p>The AI learns from rewards after each episode.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}