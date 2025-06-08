export interface Vector2D {
  x: number;
  y: number;
}

export interface Ship {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  radius: number;
  thrusting: boolean;
}

export interface Asteroid {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  size: "large" | "medium" | "small";
}

export interface Bullet {
  position: Vector2D;
  velocity: Vector2D;
  lifetime: number;
  radius: number;
}

export interface PowerUp {
  position: Vector2D;
  type: "shield" | "rapidFire" | "multiShot" | "slowTime";
  radius: number;
  lifetime: number;
}

export interface UFO {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  lastShot: number;
  health: number;
}

export interface Particle {
  position: Vector2D;
  velocity: Vector2D;
  lifetime: number;
  color: string;
  size: number;
}

export interface GameState {
  ship: Ship & {
    shields: number;
    rapidFire: number;
    multiShot: number;
  };
  asteroids: Asteroid[];
  bullets: Bullet[];
  enemyBullets: Bullet[];
  ufos: UFO[];
  powerUps: PowerUp[];
  particles: Particle[];
  score: number;
  highScore: number;
  gameOver: boolean;
  generation: number;
  deaths: number;
  wave: number;
  waveTimer: number;
}

export interface ExperienceBuffer {
  states: number[][];
  actions: number[][];
  rewards: number[];
}

export interface NetworkActivations {
  inputs: number[];
  hidden: number[][];
  outputs: number[];
  weights?: number[][][];  // Optional weights for each layer connection
}