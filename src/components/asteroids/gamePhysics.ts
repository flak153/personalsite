import { Vector2D, Asteroid, GameState } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, ASTEROID_SIZES, ASTEROID_SPEEDS } from "./constants";

export const wrapPosition = (position: Vector2D): Vector2D => {
  return {
    x: (position.x + CANVAS_WIDTH) % CANVAS_WIDTH,
    y: (position.y + CANVAS_HEIGHT) % CANVAS_HEIGHT,
  };
};

export const checkCollision = (
  obj1: { position: Vector2D; radius: number },
  obj2: { position: Vector2D; radius: number }
): boolean => {
  const dx = obj1.position.x - obj2.position.x;
  const dy = obj1.position.y - obj2.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.radius + obj2.radius;
};

export const breakAsteroid = (asteroid: Asteroid): Asteroid[] => {
  if (asteroid.size === "small") return [];
  
  const newSize = asteroid.size === "large" ? "medium" : "small";
  const newRadius = ASTEROID_SIZES[newSize];
  const newSpeed = ASTEROID_SPEEDS[newSize];
  
  const asteroids: Asteroid[] = [];
  for (let i = 0; i < 2; i++) {
    const angle = Math.random() * Math.PI * 2;
    asteroids.push({
      position: { ...asteroid.position },
      velocity: {
        x: Math.cos(angle) * newSpeed + asteroid.velocity.x * 0.5,
        y: Math.sin(angle) * newSpeed + asteroid.velocity.y * 0.5,
      },
      radius: newRadius,
      size: newSize,
    });
  }
  
  return asteroids;
};

export const calculateReward = (prevState: GameState, newState: GameState): number => {
  let reward = 0;
  
  // Base survival reward
  reward += 0.1;
  
  // Score increase reward (big reward for destroying asteroids)
  if (newState.score > prevState.score) {
    reward += (newState.score - prevState.score) / 10; // 2-10 points per asteroid
  }
  
  // Movement reward - slight encouragement to move, but not too much
  const speed = Math.sqrt(newState.ship.velocity.x ** 2 + newState.ship.velocity.y ** 2);
  if (speed > 0.3) {
    reward += 0.01; // Small reward for moving
  } else if (speed < 0.1) {
    reward -= 0.01; // Very small penalty for being completely still
  }
  
  // Shooting reward - only penalize excessive shooting
  if (newState.bullets.length > prevState.bullets.length) {
    const { ship, asteroids } = newState;
    const nearbyAsteroid = asteroids.some(asteroid => {
      const dx = asteroid.position.x - ship.position.x;
      const dy = asteroid.position.y - ship.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 250; // Increased range
    });
    
    if (nearbyAsteroid) {
      reward += 0.02; // Small reward for shooting at asteroids
    } else if (newState.bullets.length >= 3) {
      reward -= 0.01; // Small penalty for spam shooting
    }
  }
  
  // Penalty for being too close to asteroids (danger avoidance)
  const { ship, asteroids } = newState;
  let closestDistance = Infinity;
  
  asteroids.forEach(asteroid => {
    const dx = asteroid.position.x - ship.position.x;
    const dy = asteroid.position.y - ship.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    closestDistance = Math.min(closestDistance, distance);
    
    if (distance < asteroid.radius + 30) {
      // Very close - high penalty
      reward -= 0.3;
    } else if (distance < asteroid.radius + 60) {
      // Moderate distance - smaller penalty
      reward -= 0.1;
    }
  });
  
  // Bonus for maintaining safe distance from closest asteroid
  if (closestDistance > 100 && closestDistance < 200) {
    reward += 0.05; // Reward for good positioning
  }
  
  // Death penalty
  if (newState.gameOver && !prevState.gameOver) {
    reward -= 10; // Significant penalty for dying
  }
  
  return reward;
};

export const createInitialAsteroids = (wave: number): Asteroid[] => {
  const asteroids: Asteroid[] = [];
  const asteroidCount = Math.min(5 + Math.floor(wave / 2), 10);
  
  for (let i = 0; i < asteroidCount; i++) {
    const angle = (Math.PI * 2 * i) / asteroidCount;
    const distance = 200 + Math.random() * 100;
    asteroids.push({
      position: {
        x: CANVAS_WIDTH / 2 + Math.cos(angle) * distance,
        y: CANVAS_HEIGHT / 2 + Math.sin(angle) * distance,
      },
      velocity: {
        x: (Math.random() - 0.5) * ASTEROID_SPEEDS.large * (1 + wave * 0.1),
        y: (Math.random() - 0.5) * ASTEROID_SPEEDS.large * (1 + wave * 0.1),
      },
      radius: ASTEROID_SIZES.large,
      size: "large",
    });
  }
  
  return asteroids;
};