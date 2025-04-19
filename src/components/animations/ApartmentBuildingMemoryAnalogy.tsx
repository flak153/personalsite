"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// --- Configuration ---
const TOTAL_STEPS = 5;
const STEP_TITLES = [
  "1. Memory Space: The Apartment Building",
  "2. Allocation: A Program Moves In",
  "3. Usage: Storing & Accessing Data",
  "4. Reservation: Holding the Lease",
  "5. Deallocation: Moving Out & Cleanup"
];
const STEP_DESCRIPTIONS = [
    "Think of RAM as prime real estate: an apartment building with units ready to be occupied by programs.",
    "A program requests memory. The OS (landlord) finds a vacant unit and grants access (allocation).",
    "The program uses its allocated space to store variables, objects, etc. (like furnishing the apartment).",
    "Even if temporarily idle, the program holds the lease. The memory remains allocated and unavailable to others.",
    "When finished, the program explicitly releases the memory (returns the key), making the unit available again."
];
const COLORS = {
    background: "hsl(222, 47%, 11%)", // Dark blue-gray
    ground: "hsl(160, 30%, 20%)",
    buildingFace: "hsl(215, 15%, 55%)",
    buildingSide: "hsl(215, 15%, 45%)",
    roof: "hsl(215, 15%, 35%)",
    windowFrame: "hsl(215, 10%, 70%)",
    windowGlass: "hsl(210, 30%, 15%)",
    windowLit: "hsl(45, 100%, 70%)", // Soft yellow light
    aptAvailable: "hsl(145, 63%, 49%)", // Vibrant Green
    aptAllocated: "hsl(340, 82%, 60%)", // Vibrant Pink/Rose
    aptHighlight: "hsl(50, 100%, 60%)", // Bright Yellow
    dataFill: "hsla(210, 80%, 70%, 0.8)", // Semi-transparent blue for data
    program1: "hsl(190, 80%, 55%)", // Cyan
    program2: "hsl(280, 80%, 65%)", // Purple
    key: "hsl(45, 90%, 55%)",
    keyShine: "hsl(50, 100%, 80%)",
    gcSweep: "hsla(180, 50%, 80%, 0.5)", // Translucent cyan for GC
    textLight: "hsl(210, 40%, 95%)",
    textDim: "hsl(210, 20%, 70%)",
    shadow: "hsla(0, 0%, 0%, 0.2)",
};

// --- SVG Components (for cleaner JSX) ---

const ProgramIcon = ({ id, color, x, y }: { id: string, color: string, x: number, y: number }) => (
    <g id={id} transform={`translate(${x}, ${y})`} className="program-icon" opacity="0" visibility="hidden">
        <rect x="-12" y="-12" width="24" height="24" rx="4" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <path d="M -6 -4 L 0 0 L -6 4 M 2 -6 L 8 0 L 2 6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

const KeyIcon = ({ id, x, y }: { id: string, x: number, y: number }) => (
    <g id={id} transform={`translate(${x}, ${y}) scale(0)`} opacity="0" visibility="hidden" className="key-icon">
        <defs>
            <filter id="key-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g style={{ filter: 'url(#key-glow)' }}>
            <circle cx="0" cy="-10" r="8" fill={COLORS.key} stroke={COLORS.textLight} strokeWidth="1"/>
            <rect x="-2" y="-4" width="4" height="18" fill={COLORS.key} />
            <rect x="-6" y="8" width="4" height="3" fill={COLORS.key}/>
            <rect x="2" y="5" width="4" height="3" fill={COLORS.key}/>
            {/* Shine */}
            <path d="M -4 -14 Q 0 -16 4 -14" stroke={COLORS.keyShine} strokeWidth="1.5" fill="none" />
        </g>
    </g>
);

// --- Main Component ---
export const ApartmentBuildingMemoryAnalogy = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const isInitialMount = useRef(true);

  // --- GSAP Setup ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!timelineRef.current) {
        timelineRef.current = gsap.timeline({ paused: true });
      }
      const tl = timelineRef.current;
      tl.clear(); // Clear previous timeline tweens if rebuilding

      // --- Initial Scene Setup ---
      gsap.set("#building-main", { opacity: 0, y: 30 });
      gsap.set(".apartment-unit", { opacity: 0, scale: 0.8, transformOrigin: "center" });
      gsap.set(".apartment-fill", { scaleY: 0, opacity: 0, fill: COLORS.aptAvailable, transformOrigin: "bottom center" });
      gsap.set(".window-light", { opacity: 0 });
      gsap.set(".data-element", { opacity: 0, scale: 0, transformOrigin: "center" });
      gsap.set(".program-icon", { opacity: 0, scale: 0.8, visibility: "hidden" });
      gsap.set(".key-icon", { opacity: 0, scale: 0, visibility: "hidden" });
      gsap.set(".gc-sweep-path", { opacity: 0, strokeDasharray: 1000, strokeDashoffset: 1000 });
      gsap.set(".step-label", { opacity: 0 });
      gsap.set(".reservation-indicator", { opacity: 0, scale: 0 });

      // --- Build Animation Sequence ---
      buildIntro(tl);
      buildAllocation(tl);
      buildUsage(tl);
      buildReservation(tl);
      buildDeallocation(tl);

      // --- Go to initial step ---
       if (isInitialMount.current) {
            gotoStep(0);
            isInitialMount.current = false;
        } else {
             gotoStep(activeStep); // Ensure correct state on re-renders
        }

    }, containerRef);

    return () => {
      ctx.revert();
      // timelineRef.current = null; // Consider if needed for full remounts
      isInitialMount.current = true;
    };
  }, []); // Run only once on mount

   // --- Step Navigation ---
    const gotoStep = (step: number) => {
        if (!timelineRef.current || step < 0 || step >= TOTAL_STEPS) return;
        const labels = ["intro", "allocation", "usage", "reservation", "deallocation"];
        timelineRef.current.seek(labels[step]).pause();
    };

    useEffect(() => {
        if (!isInitialMount.current) { // Don't seek on the initial mount render triggered by state change
           gotoStep(activeStep);
        }
    }, [activeStep]); // Depend only on activeStep

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));
    const resetAnimation = () => setActiveStep(0);

  // --- Animation Step Builders ---

  const buildIntro = (tl: gsap.core.Timeline) => {
    tl.addLabel("intro")
      .set(".apartment-fill", { fill: COLORS.aptAvailable }) // Ensure all start green
      .set(".data-element, .program-icon, .key-icon, .gc-sweep-path, .reservation-indicator", { opacity: 0 }) // Hide dynamic elements
      .to("#building-main", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
      .to(".apartment-unit", {
          opacity: 1,
          scale: 1,
          stagger: { grid: [3, 3], from: "center", amount: 0.5 },
          duration: 0.5,
          ease: "back.out(1.7)"
      }, "-=0.4")
      .to(".apartment-fill", { // Animate the green fill appearing
          scaleY: 1,
          opacity: 1,
          stagger: { grid: [3, 3], from: "center", amount: 0.5 },
          duration: 0.4,
          ease: "power1.out"
      }, "<") // Start at same time as units scaling
      .to("#label-intro", { opacity: 1, duration: 0.5 }, "-=0.2");
  };

  const buildAllocation = (tl: gsap.core.Timeline) => {
    const aptTarget = "#apt-unit-1";
    const fillTarget = "#apt-fill-1";
    const progTarget = "#program-1";

    tl.addLabel("allocation")
      .to("#label-intro", { opacity: 0, duration: 0.2 })
      .set(progTarget, { visibility: "visible", x: 50, y: 150, scale: 0.8, opacity: 0 }) // Reset position
      .set(fillTarget, { fill: COLORS.aptAvailable }) // Ensure it starts green if replaying

      .to(progTarget, { // Program flies in
          opacity: 1,
          scale: 1,
          x: 100,
          duration: 0.6,
          ease: "back.out(1.7)"
      })
      // Highlight target apartment
      .to(aptTarget, {
          keyframes: {
              "0%": { stroke: COLORS.windowFrame, strokeWidth: 0.5 },
              "50%": { stroke: COLORS.aptHighlight, strokeWidth: 2 },
              "100%": { stroke: COLORS.windowFrame, strokeWidth: 0.5 },
          },
          duration: 0.6
      }, "-=0.2")
       // Apartment fill color change (smooth transition)
      .to(fillTarget, {
          fill: COLORS.aptAllocated,
          duration: 0.5,
          ease: "power1.inOut"
      }, "-=0.3") // Overlap with highlight end
      // Program fades slightly after allocation
      .to(progTarget, { opacity: 0.5, scale: 0.9, x: 90, duration: 0.4 }, "+=0.2")
      .to("#label-alloc", { opacity: 1, duration: 0.5 });
  };

  const buildUsage = (tl: gsap.core.Timeline) => {
     // Allocate more apartments quickly
    const quickAlloc = ["#apt-fill-2", "#apt-fill-3", "#apt-fill-5"];
    const dataTargets = ["#apt-data-1", "#apt-data-2", "#apt-data-3", "#apt-data-5"]; // Match allocated apts

    tl.addLabel("usage")
      .to("#label-alloc", { opacity: 0, duration: 0.2 })
      .to("#program-1", { opacity: 0, duration: 0.2 }, "<") // Fade out old program
      .set(quickAlloc, { fill: COLORS.aptAvailable }) // Ensure start green if replaying

      .to(quickAlloc, { // Quick allocation animation
          fill: COLORS.aptAllocated,
          duration: 0.3,
          stagger: 0.1
      })
       // Animate data elements appearing inside allocated apartments
      .to(dataTargets, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: {
              each: 0.1,
              from: "random"
          }
      }, "-=0.1")
      // Light up a window to show activity
      .to("#win-light-1", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          repeatDelay: 0.1,
          duration: 0.15,
          ease: "power1.inOut"
      }, "+=0.3")
      .to("#label-usage", { opacity: 1, duration: 0.5 });
  };

  const buildReservation = (tl: gsap.core.Timeline) => {
    const reservedApt = "#apt-unit-3"; // Let's use apt 3 for this
    const reservedFill = "#apt-fill-3";
    const reservedData = "#apt-data-3";
    const indicatorTarget = "#res-indicator-3";

    tl.addLabel("reservation")
      .to("#label-usage", { opacity: 0, duration: 0.2 })
      .set(reservedFill, { fill: COLORS.aptAllocated }) // Ensure it's allocated color
      .set(indicatorTarget, { opacity: 0, scale: 0 }) // Ensure indicator hidden

      // Make data inside the reserved apartment fade slightly
      .to(reservedData, { opacity: 0.3, scale: 0.9, duration: 0.5, ease: "power1.inOut" })
      // Pulse the apartment border or show indicator
      .to(indicatorTarget, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)"
      }, "-=0.3") // Overlap slightly
      .to(indicatorTarget, { // Optional subtle pulse
          scale: 1.1,
          opacity: 0.8,
          repeat: 1,
          yoyo: true,
          duration: 0.6,
          ease:"power1.inOut"
      })
      .to("#label-reservation", { opacity: 1, duration: 0.5 });
  };

  const buildDeallocation = (tl: gsap.core.Timeline) => {
    const deallocApt = "#apt-unit-1"; // Deallocate the first one
    const deallocFill = "#apt-fill-1";
    const deallocData = "#apt-data-1";
    const keyTarget = "#key-icon-1";
    const progTarget = "#program-2"; // A new program icon represents the action
    const gcTarget = "#gc-sweep-path";

    tl.addLabel("deallocation")
      .to(["#label-reservation", "#res-indicator-3"], { opacity: 0, duration: 0.2 }) // Hide previous elements
      .set(deallocFill, { fill: COLORS.aptAllocated }) // Ensure it's red
      .set(progTarget, { visibility: "visible", x: 450, y: 300, scale: 0.8, opacity: 0 }) // Start pos for program 2
      .set(keyTarget, { visibility: "visible", scale: 0, opacity: 0, rotation: -30 }) // Start pos/state for key

      // Restore opacity of previously dimmed data in reserved apt (apt-3)
      .to("#apt-data-3", { opacity: 1, scale: 1, duration: 0.3})

      // Program 2 appears
      .to(progTarget, { opacity: 1, scale: 1, y: 250, duration: 0.5, ease: "back.out(1.7)" })

      // Key appears near program
      .to(keyTarget, {
          opacity: 1,
          scale: 1.5, // Make key large and visible
          x: 380,     // Move closer to center
          y: 200,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
      }, "-=0.2")

      // Data animates out of the target apartment
      .to(deallocData, {
          opacity: 0,
          scale: 0,
          duration: 0.4,
          ease: "power1.in"
      }, "+=0.2")

      // Key "flies" to the apartment door
       .to(keyTarget, {
            x: 260, // Target X near apt-1's center
            y: 150, // Target Y near apt-1's center
            scale: 0.8, // Shrink slightly as it reaches
            rotation: 45,
            duration: 0.7,
            ease: "power2.inOut"
       }, "-=0.1") // Start slightly after data starts fading

      // Apartment fill changes back to green AS key arrives
      .to(deallocFill, {
          fill: COLORS.aptAvailable,
          duration: 0.5,
          ease: "power1.inOut"
      }, "-=0.3") // Overlap significantly with key arrival

      // Key fades out after delivering
      .to(keyTarget, { opacity: 0, scale: 0, duration: 0.3 }, "-=0.1")
      // Program 2 fades out
      .to(progTarget, { opacity: 0, scale: 0.8, duration: 0.3 }, "<")

       // Optional: Garbage Collection Sweep Animation
       .set(gcTarget, { strokeDashoffset: 1000, opacity: 0.5 }) // Reset path drawing
       .to(gcTarget, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power1.out"
       }, "+=0.5") // Start after deallocation is visually complete
       .to(gcTarget, { opacity: 0, duration: 0.5 }) // Fade out sweep path

      .to("#label-dealloc", { opacity: 1, duration: 0.5 });
  };

  // --- Render JSX ---
  return (
    <div className="memory-analogy-container bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-6 rounded-lg border border-blue-900/30 shadow-2xl overflow-hidden" ref={containerRef}>
      <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-blue-200 tracking-tight">{STEP_TITLES[activeStep]}</h2>
      <p className="text-center text-blue-100/80 mb-5 h-12 flex items-center justify-center px-4 text-sm md:text-base leading-snug">{STEP_DESCRIPTIONS[activeStep]}</p>

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        {/* SVG Animation Area */}
        <div className="flex-1 w-full lg:w-2/3 bg-black/20 rounded-md p-1 border border-slate-700/50 overflow-hidden aspect-video lg:aspect-[4/3]">
           <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                    {/* Subtle shadow filter */}
                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                        <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                        <feMerge>
                            <feMergeNode in="offsetBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Elements */}
                <rect x="0" y="0" width="600" height="400" fill={COLORS.background} />
                <rect x="0" y="350" width="600" height="50" fill={COLORS.ground} />

                {/* Building */}
                <g id="building-main" filter="url(#dropShadow)">
                    {/* 3D-ish effect */}
                    <polygon points="150,350 150,80 300,20 450,80 450,350" fill={COLORS.buildingFace} />
                    <polygon points="450,80 450,350 500,320 500,50" fill={COLORS.buildingSide} /> {/* Side */}
                    <polygon points="300,20 450,80 500,50" fill={COLORS.roof} /> {/* Roof */}

                    {/* Apartments Grid */}
                    {[...Array(3)].map((_, row) =>
                        [...Array(3)].map((_, col) => {
                            const idNum = row * 3 + col + 1;
                            const aptId = `apt-unit-${idNum}`;
                            const fillId = `apt-fill-${idNum}`;
                            const dataId = `apt-data-${idNum}`;
                            const lightId = `win-light-${idNum}`;
                            const resId = `res-indicator-${idNum}`;
                            const baseX = 180 + col * 80;
                            const baseY = 100 + row * 80;
                            // Basic perspective approximation
                            const perspectiveX = baseX + col * 5 - 10;
                            const perspectiveY = baseY + row * 2;

                            return (
                                <g key={aptId} id={aptId} transform={`translate(${perspectiveX}, ${perspectiveY})`} className="apartment-unit">
                                    {/* Apartment Fill (for color animation) */}
                                    <rect id={fillId} className="apartment-fill" x="0" y="0" width="60" height="50" rx="2" />
                                     {/* Data representation (simple blocks) */}
                                     <g id={dataId} className="data-element">
                                        <rect x="5" y="30" width="15" height="15" fill={COLORS.dataFill} rx="1" />
                                        <rect x="25" y="30" width="10" height="15" fill={COLORS.dataFill} rx="1" />
                                        <rect x="40" y="30" width="15" height="15" fill={COLORS.dataFill} rx="1" />
                                     </g>
                                     {/* Window Frame */}
                                    <rect x="10" y="10" width="40" height="25" fill={COLORS.windowGlass} rx="1" stroke={COLORS.windowFrame} strokeWidth="0.5" />
                                    {/* Window Light */}
                                     <rect id={lightId} className="window-light" x="11" y="11" width="38" height="23" fill={COLORS.windowLit} rx="1" filter="blur(2px)"/>
                                     {/* Reservation Indicator */}
                                     <path id={resId} className="reservation-indicator" d="M 5 -5 L 15 -5 L 15 5 L 10 10 L 5 5 Z" fill={COLORS.aptHighlight} transform="translate(45, 5)" />

                                </g>
                            );
                        })
                    )}
                </g>

                {/* Dynamic Elements */}
                <ProgramIcon id="program-1" color={COLORS.program1} x={50} y={150} />
                <ProgramIcon id="program-2" color={COLORS.program2} x={450} y={300} />
                <KeyIcon id="key-icon-1" x={210} y={330} />

                 {/* GC Sweep Path */}
                <path id="gc-sweep-path" d="M 50 380 Q 300 300 550 380" stroke={COLORS.gcSweep} strokeWidth="6" fill="none" strokeLinecap="round"/>


                 {/* Step Labels (Positioned centrally at top) */}
                <text id="label-intro" className="step-label" x="300" y="45" textAnchor="middle" fill={COLORS.textDim} fontSize="12" fontWeight="bold">Building Ready</text>
                <text id="label-alloc" className="step-label" x="300" y="45" textAnchor="middle" fill={COLORS.aptAllocated} fontSize="12" fontWeight="bold">Apartment Allocated</text>
                <text id="label-usage" className="step-label" x="300" y="45" textAnchor="middle" fill={COLORS.dataFill} fontSize="12" fontWeight="bold">Data Stored & Accessed</text>
                <text id="label-reservation" className="step-label" x="300" y="45" textAnchor="middle" fill={COLORS.aptHighlight} fontSize="12" fontWeight="bold">Memory Reserved (Lease Held)</text>
                <text id="label-dealloc" className="step-label" x="300" y="45" textAnchor="middle" fill={COLORS.aptAvailable} fontSize="12" fontWeight="bold">Deallocated & Available</text>

            </svg>
        </div>

        {/* Legend/Info Panel */}
        <div className="w-full lg:w-1/3 p-3 md:p-4 bg-slate-800/50 rounded-md border border-slate-700/40 flex flex-col">
          <h4 className="text-base md:text-lg font-semibold mb-3 text-blue-200 flex-shrink-0">Legend</h4>
          <div className="space-y-1.5 md:space-y-2 flex-grow text-xs md:text-sm">
             <div className="flex items-center gap-2.5"> <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm flex-shrink-0 border border-green-300/50" style={{backgroundColor: COLORS.aptAvailable}}></div> <span className="text-green-300/90">Available Memory</span> </div>
             <div className="flex items-center gap-2.5"> <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm flex-shrink-0 border border-rose-300/50" style={{backgroundColor: COLORS.aptAllocated}}></div> <span className="text-rose-300/90">Allocated Memory</span> </div>
             <div className="flex items-center gap-2.5"> <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm flex-shrink-0 border border-blue-300/50 opacity-80" style={{backgroundColor: COLORS.dataFill}}></div> <span className="text-blue-300/90">Stored Data</span> </div>
             <div className="flex items-center gap-2.5"> <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm flex-shrink-0 border border-cyan-300/50" style={{backgroundColor: COLORS.program1}}></div> <span className="text-cyan-300/90">Program/Process</span> </div>
             <div className="flex items-center gap-2.5"> <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm flex-shrink-0 border border-yellow-300/50" style={{backgroundColor: COLORS.key}}></div> <span className="text-yellow-300/90">Release Action (Key)</span> </div>
             <div className="flex items-center gap-2.5"> <svg width="14" height="14" viewBox="0 0 14 14"><path d="M 1 13 C 7 1 7 1 13 13" stroke={COLORS.gcSweep} strokeWidth="2" fill="none"/></svg> <span className="text-teal-300/90 ml-[-2px]">Garbage Collection (Cleanup)</span> </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex justify-center items-center gap-3">
        <button onClick={prevStep} disabled={activeStep === 0} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-700"> Prev </button>
        <div className="flex gap-1.5"> {[...Array(TOTAL_STEPS)].map((_, i) => ( <span key={i} className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${activeStep === i ? 'bg-blue-400 scale-110' : 'bg-slate-600 hover:bg-slate-500'}`}></span> ))} </div>
        <button onClick={nextStep} disabled={activeStep === TOTAL_STEPS - 1} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-700"> Next </button>
        <button onClick={resetAnimation} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium transition-colors duration-150 ml-4" title="Reset Animation"> Reset </button>
      </div>
    </div>
  );
};

export default ApartmentBuildingMemoryAnalogy;