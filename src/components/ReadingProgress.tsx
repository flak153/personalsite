"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progressPercentage = (scrollPosition / scrollHeight) * 100;
      setProgress(Math.min(progressPercentage, 100));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <>
      {/* Top progress bars */}
      <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
        {/* Left corner progress */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-lavender-bright rounded-r-full"
          style={{
            width: `${progress / 2}%`,
            boxShadow: "0 0 10px rgba(200, 177, 245, 1), 0 0 20px rgba(200, 177, 245, 0.6)",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="h-full w-[50%] bg-gradient-to-r from-transparent via-white to-transparent absolute right-0"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: 0.8,
              filter: "blur(2px)",
            }}
          />
        </motion.div>

        {/* Right corner progress */}
        <motion.div
          className="absolute top-0 right-0 h-0.5 bg-lavender-bright rounded-l-full"
          style={{
            width: `${progress / 2}%`,
            boxShadow: "0 0 10px rgba(200, 177, 245, 1), 0 0 20px rgba(200, 177, 245, 0.6)",
            transformOrigin: "right center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="h-full w-[50%] bg-gradient-to-r from-transparent via-white to-transparent absolute left-0"
            animate={{
              x: ["100%", "-100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: 0.8,
              filter: "blur(2px)",
            }}
          />
        </motion.div>
      </div>

      {/* Bottom progress bars */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
        {/* Left corner progress */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-lavender-bright rounded-r-full"
          style={{
            width: `${progress / 2}%`,
            boxShadow: "0 0 10px rgba(200, 177, 245, 1), 0 0 20px rgba(200, 177, 245, 0.6)",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="h-full w-[50%] bg-gradient-to-r from-transparent via-white to-transparent absolute right-0"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: 0.8,
              filter: "blur(2px)",
            }}
          />
        </motion.div>

        {/* Right corner progress */}
        <motion.div
          className="absolute bottom-0 right-0 h-0.5 bg-lavender-bright rounded-l-full"
          style={{
            width: `${progress / 2}%`,
            boxShadow: "0 0 10px rgba(200, 177, 245, 1), 0 0 20px rgba(200, 177, 245, 0.6)",
            transformOrigin: "right center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="h-full w-[50%] bg-gradient-to-r from-transparent via-white to-transparent absolute left-0"
            animate={{
              x: ["100%", "-100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: 0.8,
              filter: "blur(2px)",
            }}
          />
        </motion.div>
      </div>
    </>
  );
}