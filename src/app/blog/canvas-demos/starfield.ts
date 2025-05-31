interface Star {
  x: number;
  y: number;
  z: number;
  pz: number; // previous z
}

export const starfieldAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  canvas.width = canvas.offsetWidth;
  // Ensure height is reasonable, e.g., min 150px, max 600px, default 300px
  const canvasHeight = Math.max(150, Math.min(canvas.offsetHeight || 300, 600));
  canvas.height = canvasHeight;

  const width = canvas.width;
  const height = canvas.height;
  const numStars = 500;
  const stars: Star[] = [];
  const speed = 5; // Speed of stars moving towards viewer

  // Initialize stars
  for (let i = 0; i < numStars; i++) {
    stars[i] = {
      x: Math.random() * width - width / 2, // Center origin x
      y: Math.random() * height - height / 2, // Center origin y
      z: Math.random() * width, // Initial depth
      pz: Math.random() * width,
    };
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.translate(width / 2, height / 2); // Move origin to center

  function draw() {
    if (!ctx) return;
    // Clear with a semi-transparent black for a trailing effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = "white";

    for (let i = 0; i < numStars; i++) {
      const star = stars[i];
      star.z -= speed; // Move star closer

      // Reset star if it goes behind the viewer
      if (star.z <= 0) {
        star.x = Math.random() * width - width / 2;
        star.y = Math.random() * height - height / 2;
        star.z = width;
        star.pz = width;
      }

      const sx = (star.x / star.z) * width; // Perspective projection x
      const sy = (star.y / star.z) * height; // Perspective projection y
      const r = Math.max(0, (1 - star.z / width) * 3); // Star size based on depth

      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();

      // Optional: Draw a line for a "warp speed" effect
      // const psx = (star.x / star.pz) * width;
      // const psy = (star.y / star.pz) * height;
      // ctx.strokeStyle = 'rgba(200, 200, 255, 0.5)';
      // ctx.beginPath();
      // ctx.moveTo(psx, psy);
      // ctx.lineTo(sx, sy);
      // ctx.stroke();

      star.pz = star.z; // Update previous z
    }

    requestAnimationFrame(draw);
  }

  draw();
};
