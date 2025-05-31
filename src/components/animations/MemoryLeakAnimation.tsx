import React, { useRef, useEffect, useState } from "react";

// Define step explanations
const stepExplanations = [
  "Initial State: Server running, memory is empty, user is happy.",
  "Requests Arrive: Memory usage increases as requests come in.",
  "Memory Near Full: Memory almost full, server is worried.",
  "Server Crashes: Memory overflows, server crashes, user is confused.",
  "System Resets: System restarts, memory is cleared."
];

const TOTAL_STEPS = stepExplanations.length;

const MemoryLeakAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);

  // Draws the server with different faces based on step
  function drawServer(ctx: CanvasRenderingContext2D, x: number, y: number, step: number) {
    ctx.save();
    const crashed = step === 3;
    ctx.fillStyle = crashed ? "#f87171" : (step === 2 ? "#fde68a" : "#7dd3fc");
    ctx.strokeStyle = crashed ? "#b91c1c" : (step === 2 ? "#b45309" : "#0369a1");
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 40, y);
    ctx.lineTo(x + 40, y + 40);
    ctx.lineTo(x, y + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Face
    ctx.beginPath();
    ctx.arc(x + 20, y + 25, 7, 0, Math.PI * 2);
    ctx.fillStyle = crashed ? "#fff1f2" : (step === 2 ? "#fef3c7" : "#fff");
    ctx.fill();
    // Eyes & mouth
    ctx.save();
    ctx.strokeStyle = crashed ? "#b91c1c" : (step === 2 ? "#b45309" : "#0369a1");
    ctx.fillStyle = crashed ? "#f87171" : (step === 2 ? "#b45309" : "#0369a1");
    ctx.lineWidth = 1.5;
    if (crashed) {
      // X eyes
      ctx.beginPath();
      ctx.moveTo(x + 16, y + 24);
      ctx.lineTo(x + 18, y + 26);
      ctx.moveTo(x + 18, y + 24);
      ctx.lineTo(x + 16, y + 26);
      ctx.moveTo(x + 22, y + 24);
      ctx.lineTo(x + 24, y + 26);
      ctx.moveTo(x + 24, y + 24);
      ctx.lineTo(x + 22, y + 26);
      ctx.stroke();
      // Frown
      ctx.beginPath();
      ctx.arc(x + 20, y + 29, 3, Math.PI * 0.1, Math.PI * 0.9, false);
      ctx.stroke();
    } else if (step === 2) {
      // Worried eyes
      ctx.beginPath();
      ctx.arc(x + 17, y + 26, 1.2, 0, Math.PI * 2);
      ctx.arc(x + 23, y + 26, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Flat mouth
      ctx.beginPath();
      ctx.moveTo(x + 17, y + 30);
      ctx.lineTo(x + 23, y + 30);
      ctx.stroke();
    } else {
      // Happy eyes
      ctx.beginPath();
      ctx.arc(x + 17, y + 25, 1.2, 0, Math.PI * 2);
      ctx.arc(x + 23, y + 25, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.beginPath();
      ctx.arc(x + 20, y + 28, 3, Math.PI * 0.15, Math.PI * 0.85, false);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  // Draws the user icon with different faces based on step
  function drawUser(ctx: CanvasRenderingContext2D, x: number, y: number, step: number) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    if (step === 3) {
      ctx.fillText("?", x - 6, y + 6);
    } else {
      ctx.fillText("🙂", x - 11, y + 6);
    }
    ctx.restore();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Memory fill per step
    const maxMemory = canvas.height - 50;
    let memoryUsed = 0;
    if (step === 0) memoryUsed = 0;
    else if (step === 1) memoryUsed = Math.floor(maxMemory * 0.5);
    else if (step === 2) memoryUsed = Math.floor(maxMemory * 0.95);
    else if (step === 3) memoryUsed = maxMemory;
    else if (step === 4) memoryUsed = 0;

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw memory tank
    ctx.save();
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 30, 40, canvas.height - 50);
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Memory", 62, 22);
    ctx.restore();

    // Draw used memory
    ctx.save();
    ctx.fillStyle = step === 3 ? "#fca5a5" : (step === 2 ? "#fde68a" : "#60a5fa");
    ctx.fillRect(62, canvas.height - 20 - memoryUsed, 36, memoryUsed);
    ctx.restore();

    // Draw server
    drawServer(ctx, 130, 60, step);
    ctx.save();
    ctx.font = "14px monospace";
    ctx.fillStyle = step === 3 ? "#b91c1c" : (step === 2 ? "#b45309" : "#0369a1");
    ctx.fillText("Server", 129, 55);
    ctx.restore();

    // Draw request count
    ctx.save();
    ctx.font = "13px monospace";
    ctx.fillStyle = "#64748b";
    let requestCount = 0;
    if (step === 0) requestCount = 0;
    else if (step === 1) requestCount = 50;
    else if (step === 2) requestCount = 95;
    else if (step === 3) requestCount = 100;
    else if (step === 4) requestCount = 0;
    ctx.fillText(`Requests: ${requestCount}`, 10, canvas.height - 8);
    ctx.restore();

    // Draw user at bottom right
    drawUser(ctx, canvas.width - 35, canvas.height - 28, step);

    // Draw crash effect
    if (step === 3) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("CRASHED!", 110, 45);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }, [step]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col items-center my-4">
      <canvas
        ref={canvasRef}
        width={220}
        height={150}
        style={{ borderRadius: 12, background: "#fafdff", boxShadow: "0 2px 16px #e0e9f7" }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={prevStep} disabled={step === 0} style={{ marginRight: '10px' }}>Previous</button>
        <button onClick={nextStep} disabled={step === TOTAL_STEPS - 1}>Next</button>
        <span style={{ marginLeft: '16px' }}>Step {step + 1} of {TOTAL_STEPS}</span>
      </div>
      <div style={{ maxWidth: 280, marginTop: 10, textAlign: 'center', color: '#334155', fontSize: 14 }}>
        {stepExplanations[step]}
      </div>
    </div>
  );
};

export default MemoryLeakAnimation;
