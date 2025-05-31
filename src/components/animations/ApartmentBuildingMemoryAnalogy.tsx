import React, { useState, useEffect } from "react";

// Apartment/unit states
type ApartmentState = "free" | "active" | "inactive";

interface Apartment {
  id: number;
  state: ApartmentState;
  label: string;
}

const FLOORS = 4;
const UNITS_PER_FLOOR = 6;
const TOTAL_UNITS = FLOORS * UNITS_PER_FLOOR;

const initialApartments: Apartment[] = Array.from({ length: TOTAL_UNITS }, (_, i) => ({
  id: i,
  state: "free",
  label: `Unit ${i + 1}`,
}));

const PHASES = [
  "allocation",
  "usage",
  "collection",
  "compaction"
] as const;
type Phase = typeof PHASES[number];

const ApartmentBuildingMemoryAnalogy: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
  const [phase, setPhase] = useState<Phase>("allocation");
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Reset on phase change
  useEffect(() => {
    if (phase === "allocation") {
      setApartments(initialApartments);
      setStep(0);
    }
  }, [phase]);

  // Animation for each phase
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (animating) {
      if (phase === "allocation" && step < 10) {
        timeout = setTimeout(() => {
          setApartments((prev) => {
            const idx = prev.findIndex((a) => a.state === "free");
            if (idx === -1) return prev;
            const updated = [...prev];
            updated[idx] = { ...updated[idx], state: "active" };
            return updated;
          });
          setStep((s) => s + 1);
        }, 400);
      } else if (phase === "usage" && step < 6) {
        timeout = setTimeout(() => {
          // Randomly deactivate some apartments
          setApartments((prev) => {
            const candidates = prev.filter((a) => a.state === "active");
            if (candidates.length === 0) return prev;
            const idx = prev.findIndex((a) => a.id === candidates[Math.floor(Math.random() * candidates.length)].id);
            if (idx === -1) return prev;
            const updated = [...prev];
            updated[idx] = { ...updated[idx], state: "inactive" };
            return updated;
          });
          setStep((s) => s + 1);
        }, 500);
      } else if (phase === "collection" && step < 6) {
        timeout = setTimeout(() => {
          setApartments((prev) => {
            const idx = prev.findIndex((a) => a.state === "inactive");
            if (idx === -1) return prev;
            const updated = [...prev];
            updated[idx] = { ...updated[idx], state: "free" };
            return updated;
          });
          setStep((s) => s + 1);
        }, 400);
      } else if (phase === "compaction" && step < 1) {
        timeout = setTimeout(() => {
          setApartments((prev) => {
            // Move all active units to the lowest indices
            const actives = prev.filter((a) => a.state === "active");
            const rest = prev.filter((a) => a.state !== "active");
            return [
              ...actives.map((a, i) => ({ ...a, id: i })),
              ...rest.map((a, i) => ({ ...a, id: actives.length + i })),
            ];
          });
          setStep((s) => s + 1);
        }, 700);
      } else {
        setAnimating(false);
      }
    }
    return () => clearTimeout(timeout);
  }, [animating, phase, step]);

  // Phase transitions
  const nextPhase = () => {
    setAnimating(false);
    setStep(0);
    const idx = PHASES.indexOf(phase);
    setPhase(PHASES[(idx + 1) % PHASES.length]);
  };

  const prevPhase = () => {
    setAnimating(false);
    setStep(0);
    const idx = PHASES.indexOf(phase);
    setPhase(PHASES[(idx - 1 + PHASES.length) % PHASES.length]);
  };

  const play = () => {
    setAnimating(true);
    setStep(0);
  };
  const pause = () => setAnimating(false);

  // Color logic
  const getColor = (state: ApartmentState) => {
    switch (state) {
      case "active":
        return "#6ee7b7"; // green
      case "inactive":
        return "#fca5a5"; // red
      case "free":
      default:
        return "#e5e7eb"; // gray
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: "32px auto", textAlign: "center" }}>
      <h2 className="text-xl font-bold mb-2">Apartment Building Memory Analogy</h2>
      <div className="mb-3 text-yellow-200 text-sm">
        <b>Phase:</b> {phase.charAt(0).toUpperCase() + phase.slice(1)}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${UNITS_PER_FLOOR}, 48px)`,
          gap: 8,
          background: "#18181b",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 12px #0002"
        }}
        aria-label="Apartment building memory grid"
      >
        {apartments.map((apt) => (
          <div
            key={apt.id}
            tabIndex={0}
            aria-label={`${apt.label}, ${apt.state}`}
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: getColor(apt.state),
              border: apt.state === "active" ? "2px solid #14b8a6" : apt.state === "inactive" ? "2px solid #f87171" : "2px solid #d1d5db",
              boxShadow: apt.state === "active" ? "0 0 8px #6ee7b7cc" : apt.state === "inactive" ? "0 0 6px #fca5a5bb" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
              color: "#18181b",
              transition: "all 0.35s cubic-bezier(.4,2,.6,1)",
              outline: "none"
            }}
          >
            {apt.state === "free" ? "" : apt.state === "active" ? "🟢" : "🔴"}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 mt-5">
        <button onClick={prevPhase} disabled={animating} className="px-2 py-1 rounded bg-gray-700 text-white">Prev Phase</button>
        {animating ? (
          <button onClick={pause} className="px-2 py-1 rounded bg-yellow-500 text-black">Pause</button>
        ) : (
          <button onClick={play} className="px-2 py-1 rounded bg-green-500 text-black">Play</button>
        )}
        <button onClick={nextPhase} disabled={animating} className="px-2 py-1 rounded bg-gray-700 text-white">Next Phase</button>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        <b>Legend:</b> 🟢 Active &nbsp; 🔴 Inactive &nbsp; <span style={{color: '#e5e7eb'}}>⬜ Free</span>
      </div>
      <div className="mt-2 text-xs text-white/60">
        {phase === "allocation" && "Programs are allocated to free apartments (memory slots)."}
        {phase === "usage" && "Some programs become inactive (unreachable)."}
        {phase === "collection" && "Garbage collector sweeps and frees inactive apartments."}
        {phase === "compaction" && "Active programs are compacted to eliminate fragmentation."}
      </div>
    </div>
  );
};

export default ApartmentBuildingMemoryAnalogy;