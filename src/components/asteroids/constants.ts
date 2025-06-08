export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const SHIP_SIZE = 10;
export const BULLET_SPEED = 5;
export const BULLET_LIFETIME = 60;
export const ASTEROID_SPEEDS = { large: 0.3, medium: 0.5, small: 0.8 };
export const ASTEROID_SIZES = { large: 40, medium: 20, small: 10 };
export const SHIP_THRUST = 0.08;
export const SHIP_ROTATION_SPEED = 0.05;

// Neural Network Configuration
export const NEURAL_NETWORK_CONFIG = {
  inputSize: 39,
  hiddenLayers: [128, 64, 32],
  outputSize: 4,
  learningRate: 0.001,
  discountFactor: 0.95,
};