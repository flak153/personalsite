import React, { useEffect, useRef } from "react";

// Double Free Animation: Safe Deposit Box (Bank) Analogy with Call Stack
const DoubleFreeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Layout constants
    const BOX_Y = 70;
    const BOX_W = 52;
    const BOX_H = 38;
    const BOX1_X = 80;
    const CLERK_X = 40;
    const CLERK_Y = 120;
    const COUNTER_Y = 115;
    const COUNTER_H = 18;
    const KEY_W = 24;
    const KEY_H = 10;
    const STACK_X = 320;
    const STACK_Y = 40;
    const STACK_W = 80;
    const STACK_H = 28;
    const STACK_GAP = 8;

    // Animation phase durations (2s = 120 frames)
    const ALLOC_FRAMES = 120;
    const FREE_FRAMES = 120;
    const DOUBLE_FREE_FRAMES = 120;
    const ERROR_FRAMES = 120;
    const RESET_FRAMES = 60;

    // Animation state
    let phase = 0;
    let t = 0;
    let animationFrameId: number;
    let keyX = 30;
    let keyY = 150;
    let boxState: "allocated" | "freed" | "error" = "allocated";
    let showKey = true;
    let errorFlash = false;
    let stack = ["main()"];
    let stackHighlight = -1;
    let errorMessage = "";
    let customerFace = "🙂";
    let clerkFace = "😐";

    function drawBox(x: number, y: number, label: string, state: string) {
      ctx.save();
      ctx.lineWidth = 3;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = state === "allocated" ? "#059669" : state === "freed" ? "#b91c1c" : errorFlash ? "#dc2626" : "#b91c1c";
      ctx.fillStyle = state === "allocated" ? "#d1fae5" : state === "freed" ? "#fca5a5" : errorFlash ? "#fee2e2" : "#f3f4f6";
      ctx.beginPath();
      ctx.rect(x, y, BOX_W, BOX_H);
      ctx.fill();
      ctx.stroke();
      ctx.font = "12px monospace";
      ctx.fillStyle = "#334155";
      ctx.fillText(label, x + 10, y + BOX_H/2 + 5);
      ctx.font = "11px monospace";
      ctx.fillStyle = state === "allocated" ? "#059669" : state === "freed" ? "#b91c1c" : errorFlash ? "#dc2626" : "#64748b";
      ctx.fillText(state === "allocated" ? "Allocated" : state === "freed" ? "Freed" : "Double Free!", x + 1, y + BOX_H + 14);
      ctx.restore();
    }

    function drawKey(x: number, y: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(-KEY_W/2, -KEY_H/2, KEY_W, KEY_H);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(KEY_W/2, -KEY_H/4);
      ctx.lineTo(KEY_W/2 + 6, -KEY_H/4);
      ctx.lineTo(KEY_W/2 + 6, KEY_H/4);
      ctx.lineTo(KEY_W/2, KEY_H/4);
      ctx.stroke();
      ctx.font = "10px monospace";
      ctx.fillStyle = "#b45309";
      ctx.fillText("Key", -13, -12);
      ctx.restore();
    }

    function drawClerk(face: string) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(CLERK_X, CLERK_Y, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(face, CLERK_X - 7, CLERK_Y + 7);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Clerk", CLERK_X - 18, CLERK_Y + 24);
      ctx.restore();
    }

    function drawCustomer(face: string) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(keyX, keyY + 30, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(face, keyX - 7, keyY + 37);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Customer", keyX - 28, keyY + 50);
      ctx.restore();
    }

    function drawCounter() {
      ctx.save();
      ctx.fillStyle = "#e4e1d0";
      ctx.fillRect(0, COUNTER_Y, 350, COUNTER_H);
      ctx.strokeStyle = "#bba98c";
      ctx.strokeRect(0, COUNTER_Y, 350, COUNTER_H);
      ctx.restore();
    }

    function drawStack() {
      ctx.save();
      ctx.font = "13px monospace";
      for (let i = 0; i < stack.length; ++i) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = i === stackHighlight ? (boxState === "error" ? "#dc2626" : "#0ea5e9") : "#f1f5f9";
        ctx.strokeStyle = i === stackHighlight ? (boxState === "error" ? "#dc2626" : "#0ea5e9") : "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(STACK_X, STACK_Y + i * (STACK_H + STACK_GAP), STACK_W, STACK_H);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = i === stackHighlight ? "#fff" : "#334155";
        ctx.fillText(stack[i], STACK_X + 10, STACK_Y + i * (STACK_H + STACK_GAP) + 20);
      }
      ctx.font = "12px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Call Stack", STACK_X + 4, STACK_Y - 8);
      ctx.restore();
    }

    function drawStatus() {
      ctx.save();
      ctx.font = "15px monospace";
      ctx.fillStyle = boxState === "error" ? "#dc2626" : "#64748b";
      ctx.textAlign = "center";
      let msg = "";
      if (phase === 0) msg = "Pointer allocates safe deposit box";
      else if (phase === 1) msg = "Pointer frees the box (returns key)";
      else if (phase === 2) msg = "Pointer tries to free again (double free)";
      else if (phase === 3) msg = errorMessage;
      ctx.fillText(msg, 175, 32);
      ctx.textAlign = "start";
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCounter();
      drawBox(BOX1_X, BOX_Y, "Box 42", boxState);
      drawClerk(clerkFace);
      drawStack();
      drawStatus();
      if (showKey) drawKey(keyX, keyY);
      drawCustomer(customerFace);

      // Animation sequence
      if (phase === 0) {
        // Allocation: key moves to box
        stack = ["main()"];
        stackHighlight = 0;
        boxState = "allocated";
        errorMessage = "";
        customerFace = "🙂";
        clerkFace = "😐";
        showKey = true;
        keyX = 30 + (BOX1_X + BOX_W/2 - 30) * (t / ALLOC_FRAMES);
        keyY = 150 - (80 * (t / ALLOC_FRAMES));
        if (t++ > ALLOC_FRAMES) {
          phase = 1;
          t = 0;
        }
      } else if (phase === 1) {
        // First free
        stack = ["main()", "free(box)"];
        stackHighlight = 1;
        customerFace = "🙂";
        clerkFace = "😐";
        if (t < FREE_FRAMES / 2) {
          // Key moves to clerk
          keyX = BOX1_X + BOX_W/2 + (CLERK_X - (BOX1_X + BOX_W/2)) * (t / (FREE_FRAMES / 2));
          keyY = BOX_Y + BOX_H + 10 + (CLERK_Y - (BOX_Y + BOX_H + 10)) * (t / (FREE_FRAMES / 2));
        } else {
          keyX = CLERK_X;
          keyY = CLERK_Y;
          showKey = false;
          boxState = "freed";
        }
        if (t++ > FREE_FRAMES) {
          phase = 2;
          t = 0;
          showKey = true;
          keyX = CLERK_X;
          keyY = CLERK_Y;
        }
      } else if (phase === 2) {
        // Double free attempt
        stack = ["main()", "free(box)"];
        stackHighlight = 1;
        customerFace = "😐";
        clerkFace = "😐";
        // Key moves from clerk to box and back (simulates attempt)
        if (t < DOUBLE_FREE_FRAMES / 2) {
          keyX = CLERK_X + (BOX1_X + BOX_W/2 - CLERK_X) * (t / (DOUBLE_FREE_FRAMES / 2));
          keyY = CLERK_Y + (BOX_Y + BOX_H + 10 - CLERK_Y) * (t / (DOUBLE_FREE_FRAMES / 2));
        } else {
          keyX = BOX1_X + BOX_W/2 + (CLERK_X - (BOX1_X + BOX_W/2)) * ((t - DOUBLE_FREE_FRAMES / 2) / (DOUBLE_FREE_FRAMES / 2));
          keyY = BOX_Y + BOX_H + 10 + (CLERK_Y - (BOX_Y + BOX_H + 10)) * ((t - DOUBLE_FREE_FRAMES / 2) / (DOUBLE_FREE_FRAMES / 2));
        }
        if (t++ > DOUBLE_FREE_FRAMES) {
          phase = 3;
          t = 0;
        }
      } else if (phase === 3) {
        // Error/crash
        stack = ["main()", "free(box)"];
        stackHighlight = 1;
        boxState = "error";
        errorMessage = "Double Free! Error";
        customerFace = "❓";
        clerkFace = "😳";
        errorFlash = t % 20 < 10;
        showKey = false;
        if (t++ > ERROR_FRAMES) {
          phase = 4;
          t = 0;
        }
      } else if (phase === 4) {
        // Reset
        stack = ["main()"];
        stackHighlight = 0;
        boxState = "allocated";
        errorMessage = "";
        customerFace = "🙂";
        clerkFace = "😐";
        showKey = true;
        keyX = 30;
        keyY = 150;
        errorFlash = false;
        if (t++ > RESET_FRAMES) {
          phase = 0;
          t = 0;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <canvas ref={canvasRef} width={420} height={200} style={{ borderRadius: 12, background: "#fafdff", boxShadow: "0 2px 16px #e0e9f7" }} />
    </div>
  );
};

export default DoubleFreeAnimation;
