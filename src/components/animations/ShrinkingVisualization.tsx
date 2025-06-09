"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface ShrinkStep {
  value: number[];
  operation: string;
  explanation: string;
  candidates?: number[][];
}

export function ShrinkingVisualization() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [shrinkSteps, setShrinkSteps] = useState<ShrinkStep[]>([]);
  const [showCandidates, setShowCandidates] = useState(false);
  const [currentCandidates, setCurrentCandidates] = useState<number[][]>([]);

  // Function that we're testing - has a bug with lists containing negative numbers
  const buggySort = (arr: number[]): number[] => {
    // Bug: doesn't handle negative numbers correctly
    return arr.filter(n => n >= 0).sort((a, b) => a - b);
  };

  // Property: sorted list should contain all original elements
  const testProperty = (arr: number[]): boolean => {
    const sorted = buggySort(arr);
    return sorted.length === arr.length;
  };

  const generateShrinkSteps = useCallback(() => {
    const steps: ShrinkStep[] = [];
    
    // Initial failing case
    const initial = [42, -17, 0, 23, -5, 99, -1, 7, -33, 15];
    steps.push({
      value: initial,
      operation: "Initial failing test case",
      explanation: "Hypothesis found this failing example. Now it will try to simplify it."
    });

    // Step 1: Try removing elements
    steps.push({
      value: initial,
      operation: "Strategy 1: Remove elements",
      explanation: "First, try removing each element one by one to see if we still get a failure.",
      candidates: [
        [-17, 0, 23, -5, 99, -1, 7, -33, 15],
        [42, 0, 23, -5, 99, -1, 7, -33, 15],
        [42, -17, 23, -5, 99, -1, 7, -33, 15],
      ]
    });

    // Step 2: Found simpler failure
    const step2 = [42, -17, 0, 23, -5];
    steps.push({
      value: step2,
      operation: "Removed unnecessary elements",
      explanation: "Found that [42, -17, 0, 23, -5] still fails. Continue shrinking."
    });

    // Step 3: Try simplifying numbers
    steps.push({
      value: step2,
      operation: "Strategy 2: Simplify numbers",
      explanation: "Try making numbers smaller (divide by 2, or replace with 0).",
      candidates: [
        [21, -17, 0, 23, -5],
        [42, -8, 0, 23, -5],
        [0, -17, 0, 23, -5],
      ]
    });

    // Step 4: Further simplified
    const step4 = [0, -1];
    steps.push({
      value: step4,
      operation: "Aggressively simplified",
      explanation: "After many iterations, found [0, -1] still fails the property."
    });

    // Step 5: Try final simplification
    steps.push({
      value: step4,
      operation: "Final simplification attempt",
      explanation: "Can we make this even simpler?",
      candidates: [
        [-1],
        [0],
        [0, 0],
      ]
    });

    // Final minimal case
    steps.push({
      value: [-1],
      operation: "Minimal failing example found!",
      explanation: "The simplest input that still fails: a list with just one negative number."
    });

    return steps;
  }, []);

  const initializeDemo = useCallback(() => {
    const steps = generateShrinkSteps();
    setShrinkSteps(steps);
    setCurrentStep(0);
    setCurrentArray(steps[0].value);
    setShowCandidates(false);
    setIsPlaying(false);
  }, [generateShrinkSteps]);

  const nextStep = useCallback(() => {
    if (currentStep < shrinkSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setCurrentArray(shrinkSteps[nextStepIndex].value);
      setShowCandidates(false);
      
      if (shrinkSteps[nextStepIndex].candidates) {
        setTimeout(() => {
          setCurrentCandidates(shrinkSteps[nextStepIndex].candidates || []);
          setShowCandidates(true);
        }, 500);
      }
    }
  }, [currentStep, shrinkSteps]);

  useEffect(() => {
    initializeDemo();
  }, [initializeDemo]);

  useEffect(() => {
    if (!isPlaying || currentStep >= shrinkSteps.length - 1) {
      if (currentStep >= shrinkSteps.length - 1) {
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, shrinkSteps.length, nextStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    initializeDemo();
  };

  const handleSkip = () => {
    nextStep();
  };

  const isMinimal = currentStep === shrinkSteps.length - 1;

  return (
    <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-4">How Hypothesis Shrinking Works</h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm mb-2">
          <strong>Property:</strong> buggySort(list) should preserve all elements
        </p>
        <p className="text-sm">
          <strong>Bug:</strong> The function filters out negative numbers
        </p>
      </div>

      {/* Current state display */}
      <div className="mb-6">
        <div className={`
          p-6 rounded-lg border-2 transition-all duration-500
          ${isMinimal ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}
        `}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-lg">Current Test Case</h4>
            <span className="text-sm text-red-600 dark:text-red-400">
              ❌ Fails property
            </span>
          </div>
          
          <div className="font-mono text-2xl text-center mb-4">
            [{currentArray.join(", ")}]
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {shrinkSteps[currentStep]?.operation}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {shrinkSteps[currentStep]?.explanation}
            </p>
          </div>
        </div>

        {/* Show candidates being tried */}
        {showCandidates && currentCandidates.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-semibold mb-2">Trying these simpler inputs:</p>
            <div className="space-y-1">
              {currentCandidates.map((candidate, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-sm">[{candidate.join(", ")}]</span>
                  <span className="text-xs text-gray-500">
                    {!testProperty(candidate) ? "✓ Still fails" : "✗ Passes (not useful)"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Step {currentStep + 1} of {shrinkSteps.length}</span>
          <span>Simplification Progress</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / shrinkSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {isMinimal && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">
            🎯 Minimal failing example found!
          </p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            The simplest input that demonstrates the bug: a list with any negative number.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handlePlayPause}
          disabled={currentStep >= shrinkSteps.length - 1}
          className="px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isPlaying ? "Pause" : "Auto Play"}
        </button>
        <button
          onClick={handleSkip}
          disabled={currentStep >= shrinkSteps.length - 1}
          className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
        >
          <SkipForward className="w-4 h-4 mr-1" />
          Next Step
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 flex items-center text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>
    </div>
  );
}