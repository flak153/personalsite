export const physicsDemoAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const width = canvas.width;
  const height = canvas.height;

  const boxes: {x: number, y: number, width: number, height: number, vx: number, vy: number, color: string}[] = [];
  for (let i = 0; i < 10; i++) {
    boxes.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      width: 20 + Math.random() * 30,
      height: 20 + Math.random() * 30,
      vx: -1 + Math.random() * 2,
      vy: -1 + Math.random() * 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  }

  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // Draw a ground platform
    ctx.fillStyle = "#333"; // Dark grey platform
    ctx.fillRect(0, height - 20, width, 20);

    boxes.forEach(box => {
      box.vy += 0.1; // Gravity
      box.x += box.vx;
      box.y += box.vy;

      // Wall collisions
      if (box.x < 0 || box.x + box.width > width) {
        box.vx *= -0.8; // Bounce with some energy loss
        box.x = box.x < 0 ? 0 : width - box.width; // Correct position
      }

      // Ground collision
      if (box.y + box.height > height - 20) {
        box.vy *= -0.8; // Bounce with some energy loss
        box.y = height - 20 - box.height; // Correct position
        box.vx *= 0.95; // Friction
      }

      ctx.fillStyle = box.color;
      ctx.fillRect(box.x, box.y, box.width, box.height);
    });
    requestAnimationFrame(update);
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    boxes.push({
      x: clickX - 15, y: clickY - 15, width: 30, height: 30,
      vx: -2 + Math.random() * 4, vy: -2, // Give it some initial velocity
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  });

  update();
};
