import * as tf from "@tensorflow/tfjs";
import { GameState, ExperienceBuffer, NetworkActivations } from "./types";
import { NEURAL_NETWORK_CONFIG, CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export class AsteroidsAI {
  private model: tf.LayersModel | null = null;
  private isTraining = false;
  private previousWeights: tf.Tensor[] = [];
  private isDisposed = false;
  
  constructor() {
    this.createModel();
  }

  private createModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [NEURAL_NETWORK_CONFIG.inputSize],
          units: NEURAL_NETWORK_CONFIG.hiddenLayers[0],
          activation: "relu",
        }),
        tf.layers.dense({
          units: NEURAL_NETWORK_CONFIG.hiddenLayers[1],
          activation: "relu",
        }),
        tf.layers.dense({
          units: NEURAL_NETWORK_CONFIG.hiddenLayers[2],
          activation: "relu",
        }),
        tf.layers.dense({
          units: NEURAL_NETWORK_CONFIG.outputSize,
          activation: "sigmoid",
        }),
      ],
    });
    
    this.model.compile({
      optimizer: tf.train.adam(NEURAL_NETWORK_CONFIG.learningRate),
      loss: "meanSquaredError",
    });
    
    // Initialize previous weights for comparison
    this.previousWeights = this.model.getWeights().map(w => w.clone());
  }

  getGameStateVector(state: GameState): number[] {
    const { ship, asteroids, bullets, ufos, powerUps, enemyBullets } = state;
    
    // Find the 3 nearest threats (asteroids or UFOs)
    const threats = [...asteroids, ...ufos];
    const sortedThreats = threats
      .map(threat => {
        const dx = threat.position.x - ship.position.x;
        const dy = threat.position.y - ship.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { threat, distance, dx, dy };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    // Find nearest power-up
    const nearestPowerUp = powerUps.length > 0 ? powerUps
      .map(powerUp => {
        const dx = powerUp.position.x - ship.position.x;
        const dy = powerUp.position.y - ship.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { powerUp, distance, dx, dy };
      })
      .sort((a, b) => a.distance - b.distance)[0] : null;
    
    const inputs: number[] = [
      // Ship state (9 values)
      ship.position.x / CANVAS_WIDTH,
      ship.position.y / CANVAS_HEIGHT,
      ship.velocity.x / 10,
      ship.velocity.y / 10,
      Math.cos(ship.rotation),
      Math.sin(ship.rotation),
      ship.shields / 3,
      ship.rapidFire > 0 ? 1 : 0,
      ship.multiShot > 0 ? 1 : 0,
      
      // Distance to edges (4 values)
      ship.position.x / CANVAS_WIDTH,
      (CANVAS_WIDTH - ship.position.x) / CANVAS_WIDTH,
      ship.position.y / CANVAS_HEIGHT,
      (CANVAS_HEIGHT - ship.position.y) / CANVAS_HEIGHT,
    ];
    
    // Add info for up to 3 nearest threats (6 values each = 18 total)
    for (let i = 0; i < 3; i++) {
      if (i < sortedThreats.length) {
        const { threat, distance, dx, dy } = sortedThreats[i];
        const angleToThreat = Math.atan2(dy, dx);
        const relativeAngle = ((angleToThreat - ship.rotation + Math.PI) % (2 * Math.PI)) - Math.PI;
        const isUFO = "health" in threat ? 1 : 0;
        
        inputs.push(
          distance / Math.sqrt(CANVAS_WIDTH * CANVAS_WIDTH + CANVAS_HEIGHT * CANVAS_HEIGHT),
          Math.sin(relativeAngle),
          Math.cos(relativeAngle),
          threat.velocity.x / 5,
          threat.velocity.y / 5,
          isUFO,
        );
      } else {
        inputs.push(1, 0, 0, 0, 0, 0);
      }
    }
    
    // Power-up info (5 values)
    if (nearestPowerUp) {
      const { distance, dx, dy } = nearestPowerUp;
      const angleToP = Math.atan2(dy, dx);
      const relAngle = ((angleToP - ship.rotation + Math.PI) % (2 * Math.PI)) - Math.PI;
      inputs.push(
        distance / Math.sqrt(CANVAS_WIDTH * CANVAS_WIDTH + CANVAS_HEIGHT * CANVAS_HEIGHT),
        Math.sin(relAngle),
        Math.cos(relAngle),
        1,
        nearestPowerUp.powerUp.type === "shield" ? 0.25 : 
        nearestPowerUp.powerUp.type === "rapidFire" ? 0.5 :
        nearestPowerUp.powerUp.type === "multiShot" ? 0.75 : 1
      );
    } else {
      inputs.push(1, 0, 0, 0, 0);
    }
    
    // Game state (3 values)
    inputs.push(
      bullets.length / 4,
      enemyBullets.length / 10,
      state.wave / 10
    );
    
    return inputs;
  }

  async getAction(state: GameState, isTraining: boolean, episodeReward: number): Promise<boolean[]> {
    if (!this.model || this.model.isDisposed || this.isTraining) {
      return [false, false, false, false];
    }
    
    try {
      const stateVector = this.getGameStateVector(state);
      const stateTensor = tf.tensor2d([stateVector]);
      
      // Get prediction
      const prediction = this.model.predict(stateTensor) as tf.Tensor;
      const actions = await prediction.array() as number[][];
      
      // Cleanup
      stateTensor.dispose();
      prediction.dispose();
      
      // Add exploration noise during training
      const explorationRate = Math.max(0.1, 0.5 - episodeReward / 100);
      return actions[0].map(action => {
        if (Math.random() < explorationRate && isTraining) {
          return Math.random() > 0.5;
        }
        return action > 0.5;
      });
    } catch (error) {
      console.warn("AI prediction error:", error);
      return [false, false, false, false];
    }
  }


  async getActionWithActivations(state: GameState, isTraining: boolean, episodeReward: number): Promise<{ actions: boolean[]; activations: NetworkActivations }> {
    if (!this.model || this.model.isDisposed || this.isTraining) {
      return {
        actions: [false, false, false, false],
        activations: {
          inputs: [],
          hidden: [],
          outputs: [],
          weights: []
        }
      };
    }
    
    try {
      const stateVector = this.getGameStateVector(state);
      const stateTensor = tf.tensor2d([stateVector]);
      
      // Get activations from each layer
      const hiddenActivations: number[][] = [];
      const layerWeights: number[][][] = [];
      let currentInput: tf.Tensor = stateTensor;
      
      // Get model layers
      const layers = this.model.layers;
      
      // Get weights for each layer
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i] as tf.layers.Layer & { getWeights?: () => tf.Tensor[] };
        if (layer.getWeights && layer.getWeights().length > 0) {
          const weightTensor = layer.getWeights()[0];  // Get kernel weights (not biases)
          const weightArray = await weightTensor.array() as number[][];
          layerWeights.push(weightArray);
        }
      }
      
      // Process through each layer to capture activations
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const output = layer.apply(currentInput) as tf.Tensor;
        const outputArray = await output.array() as number[][];
        
        // Store hidden layer activations (all layers except the last one)
        if (i < layers.length - 1) {
          hiddenActivations.push(outputArray[0]);
        }
        
        // Clean up previous tensor if it's not the original input
        if (currentInput !== stateTensor) {
          currentInput.dispose();
        }
        
        currentInput = output;
      }
      
      // Get final prediction
      const finalOutput = await currentInput.array() as number[][];
      const outputActions = finalOutput[0];
      
      // Cleanup
      if (currentInput !== stateTensor) {
        currentInput.dispose();
      }
      stateTensor.dispose();
      
      // Add exploration noise during training
      const explorationRate = Math.max(0.1, 0.5 - episodeReward / 100);
      const actions = outputActions.map(action => {
        if (Math.random() < explorationRate && isTraining) {
          return Math.random() > 0.5;
        }
        return action > 0.5;
      });
      
      return {
        actions,
        activations: {
          inputs: stateVector,
          hidden: hiddenActivations,
          outputs: outputActions,
          weights: layerWeights
        }
      };
    } catch (error) {
      console.warn("AI prediction error:", error);
      return {
        actions: [false, false, false, false],
        activations: {
          inputs: [],
          hidden: [],
          outputs: [],
          weights: []
        }
      };
    }
  }

  async train(buffer: ExperienceBuffer): Promise<void> {
    if (!this.model || this.isTraining) {
      return;
    }
    
    if (buffer.states.length === 0) {
      // Silently skip if no data
      return;
    }
    
    this.isTraining = true;
    
    try {
      const minLength = Math.min(buffer.states.length, buffer.actions.length);
      if (minLength < 10) {
        console.log("Not enough experience for training");
        this.isTraining = false;
        return;
      }
      
      const states = buffer.states.slice(0, minLength);
      const actions = buffer.actions.slice(0, minLength);
      const rewards = buffer.rewards.slice(0, Math.min(minLength, buffer.rewards.length));
      
      // Calculate discounted rewards
      const discountedRewards: number[] = [];
      let runningReward = 0;
      
      for (let i = rewards.length - 1; i >= 0; i--) {
        runningReward = rewards[i] + NEURAL_NETWORK_CONFIG.discountFactor * runningReward;
        discountedRewards.unshift(runningReward);
      }
      
      // Normalize rewards
      const mean = discountedRewards.reduce((a, b) => a + b, 0) / discountedRewards.length;
      const std = Math.sqrt(discountedRewards.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / discountedRewards.length) || 1;
      const normalizedRewards = discountedRewards.map(r => (r - mean) / (std + 1e-8));
      
      // Modify actions based on rewards
      const modifiedActions = actions.map((action, i) => {
        const reward = normalizedRewards[i] || 0;
        return action.map(a => {
          if (reward > 0) {
            return a + (a > 0 ? 0.1 : -0.1) * reward;
          } else {
            return a * (1 + reward * 0.1);
          }
        });
      });
      
      // Check if model is still valid before training
      if (!this.model || this.isDisposed) {
        console.error("Model was disposed before training could start");
        this.isTraining = false;
        return;
      }
      
      // Train
      const statesTensor = tf.tensor2d(states);
      const actionsTensor = tf.tensor2d(modifiedActions);
      
      try {
        // Use tidy to ensure proper cleanup but don't await inside it
        await this.model.fit(statesTensor, actionsTensor, {
          epochs: 1,
          batchSize: Math.min(32, states.length),
          verbose: 0,
          shuffle: true,
        });
        
        console.log(`Training completed: ${states.length} samples, mean reward: ${mean.toFixed(2)}`);
      } catch (trainError) {
        console.error("Model fit error:", trainError);
      } finally {
        // Always cleanup tensors
        statesTensor.dispose();
        actionsTensor.dispose();
      }
      
    } catch (error) {
      console.error("Training error:", error);
    } finally {
      this.isTraining = false;
    }
  }

  async calculateWeightChange(): Promise<number> {
    if (!this.model || this.isDisposed) return 0;
    
    try {
      const currentWeights = this.model.getWeights();
      if (!currentWeights || currentWeights.length === 0) return 0;
      
      if (this.previousWeights.length === 0 || 
          this.previousWeights.length !== currentWeights.length) {
        // First time or structure changed - just store weights
        this.previousWeights.forEach(w => {
          try { w.dispose(); } catch { /* ignore */ }
        });
        this.previousWeights = currentWeights.map(w => w.clone());
        // Don't dispose currentWeights here as they're still being used by the model
        return 0;
      }
      
      let totalChange = 0;
      
      // Calculate changes
      for (let i = 0; i < currentWeights.length; i++) {
        const curr = currentWeights[i];
        const prev = this.previousWeights[i];
        
        const diff = tf.abs(tf.sub(curr, prev));
        const meanDiff = await diff.mean().data();
        totalChange += meanDiff[0];
        
        diff.dispose();
      }
      
      // Update stored weights
      this.previousWeights.forEach(w => {
        try { w.dispose(); } catch { /* ignore */ }
      });
      this.previousWeights = currentWeights.map(w => w.clone());
      
      return totalChange / this.previousWeights.length;
    } catch (error) {
      console.error("Error calculating weight change:", error);
      return 0;
    }
  }

  getIsTraining(): boolean {
    return this.isTraining;
  }

  dispose() {
    if (this.model && !this.isDisposed) {
      this.model.dispose();
      this.isDisposed = true;
    }
    this.previousWeights.forEach(w => {
      try { w.dispose(); } catch { /* ignore */ }
    });
  }
}