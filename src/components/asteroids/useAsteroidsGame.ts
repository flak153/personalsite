import { useState, useRef, useCallback, useEffect } from "react";
import { GameState, ExperienceBuffer, NetworkActivations } from "./types";
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  SHIP_SIZE, 
  SHIP_THRUST, 
  SHIP_ROTATION_SPEED,
  BULLET_SPEED,
  BULLET_LIFETIME
} from "./constants";
import { 
  wrapPosition, 
  checkCollision, 
  breakAsteroid, 
  calculateReward,
  createInitialAsteroids 
} from "./gamePhysics";
import { AsteroidsAI } from "./AsteroidsAI";

export function useAsteroidsGame() {
  const [gameState, setGameState] = useState<GameState>({
    ship: {
      position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      radius: SHIP_SIZE,
      thrusting: false,
      shields: 0,
      rapidFire: 0,
      multiShot: 0,
    },
    asteroids: [],
    bullets: [],
    enemyBullets: [],
    ufos: [],
    powerUps: [],
    particles: [],
    score: 0,
    highScore: 0,
    gameOver: false,
    generation: 1,
    deaths: 0,
    wave: 1,
    waveTimer: 0,
  });
  
  const [aiMode, setAiMode] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingHistory, setTrainingHistory] = useState<number[]>([]);
  const [weightChanges, setWeightChanges] = useState<number>(0);
  const [networkActivations, setNetworkActivations] = useState<NetworkActivations>({
    inputs: [],
    hidden: [],
    outputs: []
  });
  
  const aiRef = useRef<AsteroidsAI | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const aiActionsRef = useRef<boolean[]>([false, false, false, false]);
  const shouldResetRef = useRef(false);
  const lastStateRef = useRef<GameState | null>(null);
  const episodeRewardRef = useRef(0);
  const bestEpisodeRewardRef = useRef(0);
  
  const experienceBufferRef = useRef<ExperienceBuffer>({
    states: [],
    actions: [],
    rewards: []
  });

  // Initialize AI only once
  useEffect(() => {
    if (!aiRef.current) {
      aiRef.current = new AsteroidsAI();
    }
    return () => {
      if (aiRef.current) {
        aiRef.current.dispose();
        aiRef.current = null;
      }
    };
  }, []);

  const initializeGame = useCallback((keepScore = false) => {
    const wave = keepScore ? gameState.wave : 1;
    const asteroids = createInitialAsteroids(wave);

    setGameState(prevState => ({
      ...prevState,
      ship: {
        position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
        velocity: { x: 0, y: 0 },
        rotation: 0,
        radius: SHIP_SIZE,
        thrusting: false,
        shields: keepScore ? prevState.ship.shields : 0,
        rapidFire: keepScore ? prevState.ship.rapidFire : 0,
        multiShot: keepScore ? prevState.ship.multiShot : 0,
      },
      asteroids,
      bullets: [],
      enemyBullets: [],
      ufos: [],
      powerUps: [],
      particles: [],
      score: keepScore ? prevState.score : 0,
      highScore: keepScore ? prevState.highScore : 0,
      gameOver: false,
      generation: keepScore ? prevState.generation : 1,
      deaths: keepScore ? prevState.deaths : 0,
      wave: keepScore ? wave : 1,
      waveTimer: 0,
    }));
  }, [gameState.wave]);

  const updateGame = useCallback(() => {
    // Handle reset outside of state update
    if (shouldResetRef.current) {
      shouldResetRef.current = false;
      
      // Only process episode end once per episode
      if (episodeRewardRef.current === 0) return;
      
      // Log episode performance
      if (episodeRewardRef.current > bestEpisodeRewardRef.current) {
        bestEpisodeRewardRef.current = episodeRewardRef.current;
        console.log(`New best episode! Reward: ${episodeRewardRef.current.toFixed(2)}`);
      }
      
      // Track training history and train model
      if (isTraining && aiRef.current && experienceBufferRef.current.states.length > 0) {
        const finalEpisodeReward = episodeRewardRef.current;
        console.log(`Episode ended with reward: ${finalEpisodeReward}`);
        setTrainingHistory(prev => [...prev.slice(-49), finalEpisodeReward]);
        
        // Reset episode reward immediately to prevent duplicate processing
        episodeRewardRef.current = 0;
        
        // Train the model with collected experience
        aiRef.current.train(experienceBufferRef.current).then(() => {
          // Calculate weight changes after training
          aiRef.current?.calculateWeightChange().then(change => {
            setWeightChanges(change);
          });
          
          // Clear experience buffer after training
          experienceBufferRef.current = {
            states: [],
            actions: [],
            rewards: []
          };
          
          // Restart game after training is complete with a longer delay
          setTimeout(() => {
            // Reset AI actions to ensure movement resumes
            aiActionsRef.current = [false, false, false, false];
            initializeGame(true);
          }, 500);
        });
      } else {
        // Still track episode rewards even when not training
        if (aiMode && episodeRewardRef.current !== 0) {
          const finalEpisodeReward = episodeRewardRef.current;
          console.log(`Episode ended with reward (not training): ${finalEpisodeReward}`);
          setTrainingHistory(prev => [...prev.slice(-49), finalEpisodeReward]);
        }
        episodeRewardRef.current = 0;
        setTimeout(() => {
          initializeGame(true);
        }, 1000);
      }
      return;
    }

    setGameState(prevState => {
      if (prevState.gameOver) return prevState;
      
      const newState = { ...prevState };
      const { ship, asteroids, bullets } = newState;
      
      if (aiMode && aiRef.current) {
        // Use the stored AI actions
        const actions = aiActionsRef.current;
        if (actions[0]) ship.rotation -= SHIP_ROTATION_SPEED;
        if (actions[1]) ship.rotation += SHIP_ROTATION_SPEED;
        if (actions[2]) {
          ship.thrusting = true;
          ship.velocity.x += Math.cos(ship.rotation) * SHIP_THRUST;
          ship.velocity.y += Math.sin(ship.rotation) * SHIP_THRUST;
        } else {
          ship.thrusting = false;
        }
        if (actions[3] && bullets.length < 4) {
          bullets.push({
            position: { ...ship.position },
            velocity: {
              x: Math.cos(ship.rotation) * BULLET_SPEED + ship.velocity.x,
              y: Math.sin(ship.rotation) * BULLET_SPEED + ship.velocity.y,
            },
            lifetime: BULLET_LIFETIME,
            radius: 2,
          });
        }
        
        // Get next AI actions asynchronously (but not during training)
        if (!aiRef.current.getIsTraining()) {
          aiRef.current.getActionWithActivations(prevState, isTraining, episodeRewardRef.current).then(result => {
            aiActionsRef.current = result.actions;
            setNetworkActivations(result.activations);
          });
        }
      } else {
        // Manual controls
        if (keysPressed.current.has("ArrowLeft") || keysPressed.current.has("a") || keysPressed.current.has("A")) {
          ship.rotation -= SHIP_ROTATION_SPEED;
        }
        if (keysPressed.current.has("ArrowRight") || keysPressed.current.has("d") || keysPressed.current.has("D")) {
          ship.rotation += SHIP_ROTATION_SPEED;
        }
        if (keysPressed.current.has("ArrowUp") || keysPressed.current.has("w") || keysPressed.current.has("W")) {
          ship.thrusting = true;
          ship.velocity.x += Math.cos(ship.rotation) * SHIP_THRUST;
          ship.velocity.y += Math.sin(ship.rotation) * SHIP_THRUST;
        } else {
          ship.thrusting = false;
        }
        if ((keysPressed.current.has(" ") || keysPressed.current.has("Enter")) && bullets.length < 4) {
          keysPressed.current.delete(" ");
          keysPressed.current.delete("Enter");
          bullets.push({
            position: { ...ship.position },
            velocity: {
              x: Math.cos(ship.rotation) * BULLET_SPEED + ship.velocity.x,
              y: Math.sin(ship.rotation) * BULLET_SPEED + ship.velocity.y,
            },
            lifetime: BULLET_LIFETIME,
            radius: 2,
          });
        }
      }
      
      // Update physics
      ship.velocity.x *= 0.99;
      ship.velocity.y *= 0.99;
      
      ship.position.x += ship.velocity.x;
      ship.position.y += ship.velocity.y;
      ship.position = wrapPosition(ship.position);
      
      // Update asteroids
      asteroids.forEach(asteroid => {
        asteroid.position.x += asteroid.velocity.x;
        asteroid.position.y += asteroid.velocity.y;
        asteroid.position = wrapPosition(asteroid.position);
      });
      
      // Update bullets
      newState.bullets = bullets.filter(bullet => {
        bullet.position.x += bullet.velocity.x;
        bullet.position.y += bullet.velocity.y;
        bullet.position = wrapPosition(bullet.position);
        bullet.lifetime--;
        return bullet.lifetime > 0;
      });
      
      // Check collisions
      const newAsteroids: typeof asteroids = [];
      const remainingAsteroids: typeof asteroids = [];
      
      asteroids.forEach(asteroid => {
        let hit = false;
        
        bullets.forEach((bullet, bulletIndex) => {
          if (checkCollision(bullet, asteroid)) {
            newState.bullets.splice(bulletIndex, 1);
            hit = true;
            newState.score += asteroid.size === "large" ? 20 : asteroid.size === "medium" ? 50 : 100;
          }
        });
        
        if (hit) {
          newAsteroids.push(...breakAsteroid(asteroid));
        } else {
          remainingAsteroids.push(asteroid);
        }
        
        if (checkCollision(ship, asteroid)) {
          newState.deaths++;
          newState.generation++;
          
          if (newState.score > newState.highScore) {
            newState.highScore = newState.score;
          }
          
          newState.score = 0;
          newState.gameOver = true;
          shouldResetRef.current = true;
          
          // Add final death penalty to rewards if training
          if (isTraining && experienceBufferRef.current.states.length > experienceBufferRef.current.rewards.length) {
            experienceBufferRef.current.rewards.push(-10);
          }
        }
      });
      
      newState.asteroids = [...remainingAsteroids, ...newAsteroids];
      
      if (newState.asteroids.length === 0 && !shouldResetRef.current) {
        // Win condition - destroyed all asteroids
        newState.wave++;
        shouldResetRef.current = true;
        
        // Add win bonus to rewards
        if (isTraining && experienceBufferRef.current.states.length > experienceBufferRef.current.rewards.length) {
          experienceBufferRef.current.rewards.push(20); // Big bonus for clearing the wave
        }
      }
      
      // Store experience and calculate rewards if in training mode
      if (isTraining && aiMode && aiRef.current) {
        // First, store the current state and action
        const stateVector = aiRef.current.getGameStateVector(prevState);
        const actions = aiActionsRef.current.map(a => a ? 1 : 0);
        experienceBufferRef.current.states.push(stateVector);
        experienceBufferRef.current.actions.push(actions);
        
        // Then calculate and store reward based on the transition
        if (lastStateRef.current) {
          const reward = calculateReward(lastStateRef.current, newState);
          experienceBufferRef.current.rewards.push(reward);
          episodeRewardRef.current += reward;
        }
      } else if (aiMode && lastStateRef.current) {
        // Just track episode reward if not training
        const reward = calculateReward(lastStateRef.current, newState);
        episodeRewardRef.current += reward;
      }
      
      lastStateRef.current = { ...newState };
      
      return newState;
    });
  }, [aiMode, initializeGame, isTraining]);

  // Keyboard handling
  useEffect(() => {
    const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter", "w", "W", "a", "A", "s", "S", "d", "D"];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!aiMode && gameKeys.includes(e.key)) {
        e.preventDefault();
      }
      
      keysPressed.current.add(e.key);
      
      if (e.key === "r" || e.key === "R") {
        initializeGame(false);
      }
      
      if (e.key === "m" || e.key === "M") {
        setAiMode(prev => !prev);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!aiMode && gameKeys.includes(e.key)) {
        e.preventDefault();
      }
      
      keysPressed.current.delete(e.key);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [aiMode, initializeGame]);

  // Game loop
  useEffect(() => {
    let frameId: number;
    let mounted = true;
    
    const gameLoop = () => {
      if (!mounted) return;
      
      updateGame();
      
      frameId = requestAnimationFrame(gameLoop);
    };
    
    frameId = requestAnimationFrame(gameLoop);
    
    return () => {
      mounted = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [updateGame]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    gameState,
    aiMode,
    setAiMode,
    isTraining,
    setIsTraining,
    trainingHistory,
    weightChanges,
    aiActions: aiActionsRef.current,
    episodeReward: episodeRewardRef.current,
    bestEpisodeReward: bestEpisodeRewardRef.current,
    networkActivations,
    initializeGame,
  };
}