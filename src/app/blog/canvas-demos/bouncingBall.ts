export const bouncingBallAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const width = canvas.width;
  const height = canvas.height;

  // Ball properties
  let x = width / 2;
  let y = height / 2;
  let dx = 2;
  let dy = -2;
  const radius = 20;

  // Animation function
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFF00"; // Yellow ball
    ctx.fill();
    ctx.closePath();
    if (x + dx > width - radius || x + dx < radius) {
      dx = -dx;
    }
    if (y + dy > height - radius || y + dy < radius) {
      dy = -dy;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  }
  draw();
};
