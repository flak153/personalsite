import React, { useRef, useEffect, useState } from "react";

const stepExplanations = [
  "Initial State: Both desks are empty.",
  "Filling Your Desk: Items are placed on your desk, no overflow yet.",
  "Buffer Full: Your desk is full, next item will overflow.",
  "Overflow Occurs: Extra items spill onto your neighbor's desk (buffer overflow)."
];

const TOTAL_STEPS = stepExplanations.length;

const BufferOverflowAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw two desks
    ctx.fillStyle = "#e4e1d0";
    ctx.fillRect(40, 90, 70, 18);
    ctx.fillRect(130, 90, 70, 18);
    ctx.strokeStyle = "#bba98c";
    ctx.strokeRect(40, 90, 70, 18);
    ctx.strokeRect(130, 90, 70, 18);

    // Draw items on your desk (max 8)
    let itemsOnDesk = 0;
    let overflowItems = 0;
    if (step === 1) {
      itemsOnDesk = 5;
    } else if (step === 2) {
      itemsOnDesk = 8;
    } else if (step === 3) {
      itemsOnDesk = 8;
      overflowItems = 2;
    }
    // Draw items on your desk
    for (let i = 0; i < itemsOnDesk; i++) {
      const x = 50 + (i % 5) * 12;
      const y = 80 - Math.floor(i / 5) * 18;
      ctx.fillStyle = "#a6c7e5";
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fill();
    }
    // Draw overflowed items on neighbor's desk
    if (overflowItems > 0) {
      for (let i = 0; i < overflowItems; i++) {
        const x = 140 + (i % 2) * 18;
        const y = 80 - Math.floor(i / 2) * 18;
        ctx.fillStyle = "#e7a9a9";
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw labels
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#666";
    ctx.fillText("Your desk", 45, 130);
    ctx.fillText("Neighbor", 145, 130);
    ctx.fillText("Items", 80, 30);

    // Draw overflow arrow and label in step 3
    if (step === 3) {
      ctx.save();
      ctx.strokeStyle = "#e11d48";
      ctx.fillStyle = "#e11d48";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 60);
      ctx.lineTo(160, 60);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(160, 60);
      ctx.lineTo(154, 56);
      ctx.lineTo(154, 64);
      ctx.closePath();
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillText("Overflow!", 110, 52);
      ctx.restore();
    }
  }, [step]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col items-center my-4">
      <canvas
        ref={canvasRef}
        width={240}
        height={140}
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

export default BufferOverflowAnimation;
