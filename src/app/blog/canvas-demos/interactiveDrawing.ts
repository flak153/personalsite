export const interactiveDrawingAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // Ensure height is reasonable, e.g., min 100px, max 500px, default 300px
  const canvasHeight = Math.max(100, Math.min(canvas.offsetHeight || 300, 500));
  canvas.height = canvasHeight;

  const width = canvas.width;
  const height = canvas.height; // Use the adjusted height

  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let hue = 0;

  ctx.fillStyle = "#1a1a1a"; // Dark background for the drawing canvas
  ctx.fillRect(0, 0, width, height);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5; // Initial line width

  function draw(e: MouseEvent) {
    if (!drawing) return;
    ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
    hue++;
    if (hue >= 360) {
      hue = 0;
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseout', () => drawing = false); // Stop drawing if mouse leaves canvas

  // Add a clear button functionality (optional, but good for usability)
  // This requires adding a button in the MDX or a more complex setup
  // For now, we'll keep it simple. To clear, the user would need to refresh or re-render.
  // Or, we can add a small text instruction.
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Click and drag to draw. Refresh page to clear.", width / 2, height - 10);
};
