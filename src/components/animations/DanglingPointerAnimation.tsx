import React, { useEffect, useRef } from "react";

// Dangling Pointer Analogy: Key (pointer) tries to use memory that's been freed and reused
const DanglingPointerAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;
    let t = 0;
    let pointerX = 75;
    let pointerY = 115;
    let pointerAngle = 0;
    let pointerColor = "#38bdf8";
    let doorAX = 200; // shift doors further right for more space
    let doorBX = 200;
    let doorAAlpha = 1;
    let doorBAlpha = 0;
    let doorAState: "allocated" | "freed" | "gone" = "allocated";
    let crashFrame = 0;
    const DOOR_Y = 55;
    const DOOR_W = 38;
    const DOOR_H = 60;
    const KEY_W = 30;
    const KEY_H = 12;

    // Animation timing (assuming 60fps, so 120 frames = 2s)
    const KEY_SPEED = (doorAX + DOOR_W/2 - 2 - pointerX) / 120; // reach door in 2s
    const DOOR_FADE_FRAMES = 120; // 2s fade
    const DOOR_B_APPEAR_FRAMES = 120; // 2s for B to appear
    const CRASH_FRAMES = 120; // 2s crash
    const PHASE1_PAUSE = 120; // 2s pause at door before freeing
    const PHASE2_PAUSE = 120; // 2s pause after B appears
    const PHASE3_ROTATE_FRAMES = 120; // 2s pointer rotates before crash

    function drawKey(x: number, y: number, angle: number, color: string) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.strokeStyle = "#0e7490";
      ctx.lineWidth = 2;
      // Key body
      ctx.beginPath();
      ctx.rect(-KEY_W/2, -KEY_H/2, KEY_W, KEY_H);
      ctx.fill();
      ctx.stroke();
      // Key teeth
      ctx.beginPath();
      ctx.moveTo(KEY_W/2, -KEY_H/4);
      ctx.lineTo(KEY_W/2 + 8, -KEY_H/4);
      ctx.lineTo(KEY_W/2 + 8, KEY_H/4);
      ctx.lineTo(KEY_W/2, KEY_H/4);
      ctx.stroke();
      // Pointer label
      ctx.font = "11px monospace";
      ctx.fillStyle = "#0e7490";
      ctx.rotate(-angle);
      ctx.fillText("Pointer", -18, -14);
      ctx.restore();
    }

    function drawDoor(x: number, y: number, label: string, highlight: boolean, alpha: number, state: "allocated" | "freed" | "gone") {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = state === "allocated" ? "#d1fae5" : state === "freed" ? "#fca5a5" : "#f3f4f6";
      ctx.strokeStyle = highlight ? "#b91c1c" : state === "allocated" ? "#059669" : "#b91c1c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(x, y, DOOR_W, DOOR_H);
      ctx.fill();
      ctx.stroke();
      // Door label
      ctx.fillStyle = "#334155";
      ctx.font = "13px monospace";
      ctx.fillText(label, x + 7, y + DOOR_H/2 + 5);
      // State label
      ctx.font = "11px monospace";
      ctx.fillStyle = state === "allocated" ? "#059669" : state === "freed" ? "#b91c1c" : "#64748b";
      ctx.fillText(state === "allocated" ? "Allocated" : state === "freed" ? "Freed" : "Reused", x + 1, y + DOOR_H + 13);
      ctx.restore();
    }

    function drawUser(face: string) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(60, canvas.height - 30, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(face, 54, canvas.height - 20);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText("User", 45, canvas.height - 2);
      ctx.restore();
    }

    function drawCrash(x: number, y: number) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 10);
      ctx.lineTo(x + 10, y + 10);
      ctx.moveTo(x + 10, y - 10);
      ctx.lineTo(x - 10, y + 10);
      ctx.stroke();
      ctx.font = "bold 15px monospace";
      ctx.fillStyle = "#dc2626";
      ctx.fillText("Segfault!", x - 30, y - 18 + Math.sin(crashFrame/2)*2);
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw doors
      if (phase < 3) {
        drawDoor(doorAX, DOOR_Y, "A", phase === 1, doorAAlpha, doorAState);
      } else {
        // Door A is gone or reused
        drawDoor(doorAX, DOOR_Y, "A", false, doorAAlpha, doorAState);
        drawDoor(doorBX, DOOR_Y, "B", true, doorBAlpha, "allocated");
      }
      // Draw key
      drawKey(pointerX, pointerY, pointerAngle, pointerColor);
      // Draw user
      drawUser(phase === 4 ? "?" : phase === 2 ? "🙂" : "🙂");
      // Step-by-step labels
      ctx.save();
      ctx.font = "12px monospace";
      ctx.fillStyle = "#64748b";
      if (phase === 0) ctx.fillText("Pointer references Door A", 140, 28);
      if (phase === 1) ctx.fillText("Door A is freed", 170, 28);
      if (phase === 2) ctx.fillText("Door B now reuses memory", 150, 28);
      if (phase === 3) ctx.fillText("Pointer tries to use old memory", 130, 28);
      if (phase === 4) ctx.fillText("Crash/confusion!", 180, 28);
      ctx.restore();
      // Crash effect
      if (phase === 4) {
        drawCrash(doorAX + DOOR_W/2, DOOR_Y + DOOR_H/2);
        crashFrame++;
        if (crashFrame > CRASH_FRAMES) {
          // Restart
          phase = 0;
          t = 0;
          pointerX = 75;
          pointerY = 115;
          pointerAngle = 0;
          pointerColor = "#38bdf8";
          doorAX = 200;
          doorBX = 200;
          doorAAlpha = 1;
          doorBAlpha = 0;
          doorAState = "allocated";
          crashFrame = 0;
        }
      }
      // Animation sequence
      if (phase === 0) {
        // Key moves to door A
        if (pointerX < doorAX + DOOR_W/2 - 2) {
          pointerX += KEY_SPEED;
        } else {
          phase = 1;
          t = 0;
        }
      } else if (phase === 1) {
        // Pause at door before freeing
        t++;
        if (t < PHASE1_PAUSE) {
          // pause
        } else if (t < PHASE1_PAUSE + DOOR_FADE_FRAMES) {
          doorAAlpha = 1 - (t - PHASE1_PAUSE)/DOOR_FADE_FRAMES;
          doorAState = "freed";
        } else {
          doorAAlpha = 0.3;
          doorAState = "gone";
          phase = 2;
          t = 0;
        }
      } else if (phase === 2) {
        // Door B appears (reuse)
        if (doorBAlpha < 1) {
          doorBAlpha += 1/DOOR_B_APPEAR_FRAMES;
        } else {
          doorBAlpha = 1;
          t++;
          if (t > PHASE2_PAUSE) {
            phase = 3;
            t = 0;
          }
        }
      } else if (phase === 3) {
        // Key tries to use old memory (door A)
        pointerAngle += Math.PI/PHASE3_ROTATE_FRAMES;
        pointerColor = "#f87171";
        t++;
        if (t > PHASE3_ROTATE_FRAMES) {
          phase = 4;
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
      <canvas ref={canvasRef} width={350} height={150} style={{ borderRadius: 12, background: "#fafdff", boxShadow: "0 2px 16px #e0e9f7" }} />
    </div>
  );
};

export default DanglingPointerAnimation;
