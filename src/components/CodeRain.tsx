"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type TextCollider = {
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
};

type TextColliders = {
  name: TextCollider;
  subtitle: TextCollider;
} | null;

interface CodeRainProps {
  textColliders?: TextColliders;
}

export default function CodeRain({ textColliders }: CodeRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log("CodeRain initializing");
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Custom shader for gradient transition
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        // Use RGB values directly to ensure accurate colors
        colorTop: { value: new THREE.Color(45/255, 0/255, 81/255) },    // Royal Plum RGB(45,0,81)
        colorBottom: { value: new THREE.Color(255/255, 219/255, 88/255) }, // Mustard Yellow RGB(255,219,88)
        viewHeight: { value: window.innerHeight }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform vec3 colorTop;
        uniform vec3 colorBottom;
        uniform float viewHeight;

        void main() {
          // Calculate world position
          vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 projectedPosition = projectionMatrix * worldPosition;
          gl_Position = projectedPosition;
          
          // Size based on perspective
          gl_PointSize = size * (300.0 / -worldPosition.z);
          
          // Get y position in world space (ranges from -10 to 10 in our scene)
          float y = position.y;
          
          // Normalize y from our range (-10 to 10) to 0-1 range for color mixing
          // y = 10 (top) should be 0, y = -10 (bottom) should be 1
          float normalizedY = clamp((10.0 - y) / 20.0, 0.0, 1.0);
          
          // Assign color based on y position - ensure we're using the exact colors
          vColor = mix(colorTop, colorBottom, normalizedY);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular particles
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceToCenter > 0.5) {
            discard;
          }
          
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      transparent: true
    });
    
    // Create particles
    const particlesCount = 7000;
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const velocities = new Float32Array(particlesCount * 2); // x and y velocities
    
    for (let i = 0; i < particlesCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = Math.random() * 20 - 10; // y (full range -10 to 10)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      
      // Size
      sizes[i] = Math.random() * 0.2 + 0.05;
      
      // Initial velocities
      velocities[i * 2] = 0; // x velocity
      velocities[i * 2 + 1] = -(Math.random() * 0.05 + 0.02); // y velocity (downward)
    }
    
    // Create geometry and material
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle system
    const particles = new THREE.Points(particleGeometry, shaderMaterial);
    scene.add(particles);
    
    // Mouse interaction
    const mouse = new THREE.Vector2();
    
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener("mousemove", onMouseMove);
    
    // Check collision with text elements
    const checkTextCollision = (
      x: number, 
      y: number, 
      z: number
    ): { collision: boolean; normal?: { x: number; y: number } } => {
      // Use the current value from props, not the closure value
      const currentTextColliders = textColliders;
      if (!currentTextColliders) return { collision: false };
      
      // Convert particle position to screen coordinates
      const particle = new THREE.Vector3(x, y, z);
      const particleScreenPos = particle.clone().project(camera);
      const screenX = (particleScreenPos.x + 1) / 2 * window.innerWidth;
      const screenY = -(particleScreenPos.y - 1) / 2 * window.innerHeight;
      
      // Check collision with each text element
      const textElements = [currentTextColliders.name, currentTextColliders.subtitle];
      
      for (const element of textElements) {
        const { width, height, position } = element;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        // Calculate box boundaries - more generous collision area
        const left = position.x - halfWidth;
        const right = position.x + halfWidth;
        const top = position.y - halfHeight;
        const bottom = position.y + halfHeight;
        
        // Check if particle is inside the box
        if (screenX > left && screenX < right && screenY > top && screenY < bottom) {
          // Calculate normal for collision response
          let nx = 0, ny = 0;
          
          // Find the closest edge and determine normal
          const distToLeft = Math.abs(screenX - left);
          const distToRight = Math.abs(screenX - right);
          const distToTop = Math.abs(screenY - top);
          const distToBottom = Math.abs(screenY - bottom);
          
          const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
          
          if (minDist === distToLeft) nx = -1;
          else if (minDist === distToRight) nx = 1;
          else if (minDist === distToTop) ny = -1;
          else if (minDist === distToBottom) ny = 1;
          
          return { 
            collision: true, 
            normal: { x: nx, y: ny } 
          };
        }
      }
      
      return { collision: false };
    };
    
    const gravity = 0.0015;  // Slightly stronger gravity
    const elasticity = 0.8;   // More bouncy
    const friction = 0.97;    // Slightly more friction
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const positions = particleGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particlesCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        const vix = i * 2;
        const viy = i * 2 + 1;
        
        // Apply gravity
        velocities[viy] -= gravity;
        
        // Update position based on velocity
        positions[ix] += velocities[vix];
        positions[iy] += velocities[viy];
        
        // Text collision
        const collision = checkTextCollision(
          positions[ix], 
          positions[iy], 
          positions[iz]
        );
        
        if (collision.collision && collision.normal) {
          // Reflect velocity based on collision normal
          const nx = collision.normal.x;
          const ny = collision.normal.y;
          
          // Calculate dot product of velocity and normal
          const dot = velocities[vix] * nx + velocities[viy] * ny;
          
          // Calculate reflection
          velocities[vix] = elasticity * (velocities[vix] - 2 * dot * nx);
          velocities[viy] = elasticity * (velocities[viy] - 2 * dot * ny);
          
          // Add some random motion for visual interest
          velocities[vix] += (Math.random() - 0.5) * 0.02;
          velocities[viy] += (Math.random() - 0.5) * 0.02;
        }
        
        // Mouse repulsion
        const dx = positions[ix] - mouse.x * 5;
        const dy = positions[iy] - mouse.y * 5;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
          velocities[vix] += dx * 0.01;
          velocities[viy] += dy * 0.01;
        }
        
        // Apply friction
        velocities[vix] *= friction;
        velocities[viy] *= friction;
        
        // Reset when far below the screen (much lower than before)
        if (positions[iy] < -100) {
          positions[iy] = 10;
          positions[ix] = (Math.random() - 0.5) * 20;
          velocities[vix] = 0;
          velocities[viy] = -(Math.random() * 0.05 + 0.02);
        }
        
        // Keep particles within horizontal bounds
        if (positions[ix] < -10) {
          positions[ix] = -10;
          velocities[vix] *= -elasticity;
        } else if (positions[ix] > 10) {
          positions[ix] = 10;
          velocities[vix] *= -elasticity;
        }
      }
      
      particleGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update viewport height in shader
      shaderMaterial.uniforms.viewHeight.value = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    
    animate();
    
    // Cleanup
    return () => {
      console.log("CodeRain cleanup");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.error("Error removing canvas:", e);
        }
      }
      particleGeometry.dispose();
      shaderMaterial.dispose();
    };
  // Only re-initialize when the component mounts, not when textColliders change
  }, [textColliders]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-hidden absolute top-0 left-0"
    />
  );
}