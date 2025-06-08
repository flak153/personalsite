"use client";

import React, { useEffect, useRef } from "react";
import { GameState } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

interface GameRendererProps {
  gameState: GameState;
  aiMode: boolean;
  aiActions: boolean[];
  episodeReward: number;
  bestReward: number;
}

export default function GameRenderer({
  gameState,
  aiMode,
  aiActions,
  episodeReward,
  bestReward,
}: GameRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const { ship, asteroids, bullets, enemyBullets, ufos, powerUps, particles, score, highScore, gameOver, generation, deaths, wave } = gameState;
    
    // Draw AI vision indicators when in AI mode
    if (aiMode) {
      // Find nearest asteroids for visualization
      const sortedAsteroids = asteroids
        .map(asteroid => {
          const dx = asteroid.position.x - ship.position.x;
          const dy = asteroid.position.y - ship.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return { asteroid, distance, dx, dy };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      
      // Draw lines to nearest asteroids
      sortedAsteroids.forEach((item, index) => {
        const opacity = 1 - index * 0.3;
        ctx.strokeStyle = `rgba(255, 100, 100, ${opacity * 0.3})`;
        ctx.lineWidth = 2 - index * 0.5;
        ctx.beginPath();
        ctx.moveTo(ship.position.x, ship.position.y);
        ctx.lineTo(item.asteroid.position.x, item.asteroid.position.y);
        ctx.stroke();
        
        // Draw danger zones
        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity * 0.2})`;
        ctx.beginPath();
        ctx.arc(item.asteroid.position.x, item.asteroid.position.y, item.asteroid.radius + 50, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      // Show AI actions
      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
      const actionY = CANVAS_HEIGHT - 100;
      if (aiActions[0]) ctx.fillText("← LEFT", 10, actionY);
      if (aiActions[1]) ctx.fillText("RIGHT →", 10, actionY + 15);
      if (aiActions[2]) ctx.fillText("↑ THRUST", 10, actionY + 30);
      if (aiActions[3]) ctx.fillText("• SHOOT", 10, actionY + 45);
    }
    
    // Draw shield if active
    if (ship.shields > 0) {
      ctx.strokeStyle = `rgba(0, 255, 0, ${0.3 + Math.sin(Date.now() * 0.01) * 0.2})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ship.position.x, ship.position.y, ship.radius + 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw ship
    ctx.save();
    ctx.translate(ship.position.x, ship.position.y);
    ctx.rotate(ship.rotation);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.stroke();
    
    if (ship.thrusting) {
      ctx.strokeStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(-5, -3);
      ctx.lineTo(-15, 0);
      ctx.lineTo(-5, 3);
      ctx.stroke();
    }
    ctx.restore();
    
    // Draw particles
    particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.lifetime / 50;
      ctx.beginPath();
      ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    
    // Draw power-ups
    powerUps.forEach(powerUp => {
      ctx.save();
      ctx.translate(powerUp.position.x, powerUp.position.y);
      ctx.rotate(Date.now() * 0.002);
      
      const colors = {
        shield: "#00ff00",
        rapidFire: "#ff9900",
        multiShot: "#ff00ff",
        slowTime: "#00ffff"
      };
      
      ctx.strokeStyle = colors[powerUp.type];
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // Draw star shape
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const radius = i % 2 === 0 ? powerUp.radius : powerUp.radius / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
    
    // Draw asteroids
    asteroids.forEach(asteroid => {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(asteroid.position.x, asteroid.position.y, asteroid.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    
    // Draw UFOs
    ufos.forEach(ufo => {
      ctx.save();
      ctx.translate(ufo.position.x, ufo.position.y);
      
      ctx.strokeStyle = "#ff00ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, ufo.radius, ufo.radius / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(0, -5, ufo.radius / 2, Math.PI, 0);
      ctx.stroke();
      
      // Health bar
      ctx.fillStyle = "red";
      ctx.fillRect(-ufo.radius, ufo.radius + 5, (ufo.radius * 2) * (ufo.health / 3), 3);
      
      ctx.restore();
    });
    
    // Draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw enemy bullets
    enemyBullets.forEach(bullet => {
      ctx.fillStyle = "#ff00ff";
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw UI
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
    ctx.fillText(`Wave: ${wave}`, 10, 90);
    ctx.fillText(`Generation: ${generation}`, 10, 120);
    ctx.fillText(`Deaths: ${deaths}`, 10, 150);
    ctx.fillText(`Mode: ${aiMode ? "AI" : "Manual"}`, 10, 180);
    
    // Draw power-up indicators
    if (ship.shields > 0) {
      ctx.fillStyle = "#00ff00";
      ctx.fillText(`Shield: ${ship.shields}`, 10, 210);
    }
    if (ship.rapidFire > 0) {
      ctx.fillStyle = "#ff9900";
      ctx.fillText(`Rapid Fire: ${Math.ceil(ship.rapidFire / 60)}s`, 10, 230);
    }
    if (ship.multiShot > 0) {
      ctx.fillStyle = "#ff00ff";
      ctx.fillText(`Multi Shot: ${Math.ceil(ship.multiShot / 60)}s`, 10, 250);
    }
    
    if (aiMode) {
      ctx.font = "16px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.textAlign = "right";
      ctx.fillText(`Episode Reward: ${episodeReward.toFixed(1)}`, CANVAS_WIDTH - 10, CANVAS_HEIGHT - 40);
      ctx.fillText(`Best Reward: ${bestReward.toFixed(1)}`, CANVAS_WIDTH - 10, CANVAS_HEIGHT - 20);
      ctx.textAlign = "left";
    }
    
    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "30px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Restarting...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = "left";
    }
  }, [gameState, aiMode, aiActions, episodeReward, bestReward]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-gray-300 rounded-lg shadow-lg"
    />
  );
}