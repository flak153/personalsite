export const pulsingCircleAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const width = canvas.width;
  const height = canvas.height;

  let radius = 50;
  let growing = true;
  const maxRadius = 70;
  const minRadius = 30;
  const pulseSpeed = 0.5;

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Update radius
    if (growing) {
      radius += pulseSpeed;
      if (radius >= maxRadius) {
        growing = false;
      }
    } else {
      radius -= pulseSpeed;
      if (radius <= minRadius) {
        growing = true;
      }
    }

    // Draw circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 150, 255, ${radius / maxRadius})`; // Blue, opacity linked to radius
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 100, 200, 0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    requestAnimationFrame(draw);
  }
  draw();
};
