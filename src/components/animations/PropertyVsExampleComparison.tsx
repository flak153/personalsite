"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle, Bug, Sparkles, RefreshCw } from "lucide-react";

interface TestCase {
  input: string;
  expected?: string;
  actual?: string;
  passed?: boolean;
  property?: string;
}

export function PropertyVsExampleComparison() {
  const [activeTab, setActiveTab] = useState<"example" | "property">("example");
  const [exampleTests, setExampleTests] = useState<TestCase[]>([
    { input: "hello", expected: "HELLO" },
    { input: "World", expected: "WORLD" },
    { input: "123", expected: "123" },
    { input: "", expected: "" },
  ]);
  const [propertyTests, setPropertyTests] = useState<TestCase[]>([]);
  const [showBug, setShowBug] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(-1);

  // Buggy implementation - doesn't handle Unicode properly
  const toUpperCase = (str: string): string => {
    if (showBug) {
      // Bug: doesn't handle non-ASCII characters
      return str.replace(/[a-z]/g, char => String.fromCharCode(char.charCodeAt(0) - 32));
    }
    return str.toUpperCase(); // Correct implementation
  };

  const runExampleTests = () => {
    setExampleTests(prev => prev.map(test => ({
      ...test,
      actual: toUpperCase(test.input),
      passed: toUpperCase(test.input) === test.expected
    })));
  };

  const generatePropertyTests = async () => {
    setIsGenerating(true);
    setPropertyTests([]);
    
    const testCases: TestCase[] = [
      { input: "simple" },
      { input: "ALREADY UPPER" },
      { input: "MiXeD cAsE" },
      { input: "with-symbols!@#" },
      { input: "café" }, // This will fail with the bug
      { input: "naïve" }, // Another Unicode case
      { input: "Привет" }, // Cyrillic
      { input: "你好" }, // Chinese
      { input: "🎉 emoji!" },
      { input: "tab\ttab" },
      { input: "multi\nline" },
      { input: "trailing " },
    ];

    // Simulate Hypothesis generating tests one by one
    for (let i = 0; i < testCases.length; i++) {
      setCurrentGeneratingIndex(i);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const test = testCases[i];
      const result = toUpperCase(test.input);
      const passed = checkUpperCaseProperty(test.input, result);
      const propertyViolated = !passed ? getViolatedProperty(test.input, result) : undefined;
      
      setPropertyTests(prev => [...prev, {
        ...test,
        actual: result,
        passed,
        property: propertyViolated
      }]);
      
      // Stop generating if we found a failure
      if (!passed && i > 4) {
        break;
      }
    }
    
    setIsGenerating(false);
    setCurrentGeneratingIndex(-1);
  };

  const checkUpperCaseProperty = (original: string, uppercased: string): boolean => {
    // Property 1: Length should be preserved
    if (original.length !== uppercased.length) return false;
    
    // Property 2: Already uppercase strings should be unchanged
    if (original === original.toUpperCase() && original !== uppercased) return false;
    
    // Property 3: Applying twice should be idempotent
    if (toUpperCase(uppercased) !== uppercased) return false;
    
    // Property 4: Should actually be uppercase (using correct implementation)
    if (uppercased !== original.toUpperCase()) return false;
    
    return true;
  };

  const getViolatedProperty = (original: string, uppercased: string): string => {
    if (original.length !== uppercased.length) return "Length not preserved";
    if (original === original.toUpperCase() && original !== uppercased) return "Already uppercase string modified";
    if (toUpperCase(uppercased) !== uppercased) return "Not idempotent";
    if (uppercased !== original.toUpperCase()) return "Incorrect uppercase conversion";
    return "Unknown property violation";
  };

  const resetTests = () => {
    setExampleTests(prev => prev.map(test => ({
      input: test.input,
      expected: test.expected
    })));
    setPropertyTests([]);
    setIsGenerating(false);
  };

  useEffect(() => {
    resetTests();
  }, [showBug]);

  return (
    <div className="border-2 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Interactive Testing Comparison</h3>
        <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <Bug className={`w-5 h-5 ${showBug ? 'text-red-500' : 'text-gray-400'}`} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBug}
              onChange={(e) => setShowBug(e.target.checked)}
              className="rounded cursor-pointer"
            />
            <span className="text-sm font-medium">Enable Unicode Bug</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "example" 
              ? "bg-blue-500 text-white shadow-lg transform scale-105" 
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("example")}
        >
          📝 Example-Based
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "property" 
              ? "bg-purple-500 text-white shadow-lg transform scale-105" 
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("property")}
        >
          ✨ Property-Based
        </button>
      </div>

      {activeTab === "example" && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How Example-Based Testing Works:</h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              You manually write specific test cases with known inputs and expected outputs.
            </p>
          </div>

          <div className="space-y-2">
            {exampleTests.map((test, idx) => (
              <div 
                key={idx} 
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all
                  ${test.passed === undefined ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}
                  ${test.passed === true ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700' : ''}
                  ${test.passed === false ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700' : ''}
                `}
              >
                <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                  &quot;{test.input}&quot;
                </code>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                  &quot;{test.expected}&quot;
                </code>
                {test.actual !== undefined && (
                  <>
                    <span className="text-xs text-gray-500">→</span>
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      &quot;{test.actual}&quot;
                    </code>
                  </>
                )}
                {test.passed !== undefined && (
                  test.passed ? 
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> :
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={runExampleTests} 
            className="w-full px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={exampleTests.some(t => t.passed !== undefined)}
          >
            Run Example Tests
          </button>

          {showBug && exampleTests.every(t => t.passed === true) && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-300 dark:border-orange-700">
              <p className="text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>False confidence!</strong> All tests pass, but the implementation has a bug 
                  with Unicode characters. Example-based tests only check what you thought to test.
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "property" && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">How Property-Based Testing Works:</h4>
            <p className="text-sm text-purple-800 dark:text-purple-300 mb-3">
              You define properties that should always be true, then the framework generates many test cases automatically.
            </p>
            <div className="space-y-1 text-xs font-mono text-purple-700 dark:text-purple-300">
              <div>✓ Length preserved: len(input) == len(output)</div>
              <div>✓ Idempotent: toUpper(toUpper(x)) == toUpper(x)</div>
              <div>✓ Correct result: output == expected_uppercase</div>
            </div>
          </div>

          {propertyTests.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ready to generate random test cases and check properties?
              </p>
              <button 
                onClick={generatePropertyTests} 
                className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGenerating}
              >
                Generate & Test Properties
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {propertyTests.map((test, idx) => (
                  <div 
                    key={idx} 
                    className={`
                      flex items-center gap-3 p-3 rounded-lg transition-all
                      ${idx === currentGeneratingIndex ? 'ring-2 ring-purple-400 animate-pulse' : ''}
                      ${test.passed ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700' : 
                        'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700'}
                    `}
                  >
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded flex-1">
                      &quot;{test.input}&quot;
                    </code>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded flex-1">
                      &quot;{test.actual}&quot;
                    </code>
                    {test.passed ? 
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> :
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    }
                    {test.property && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {test.property}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={generatePropertyTests} 
                  className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 flex items-center text-sm"
                  disabled={isGenerating}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
                <button 
                  onClick={() => setPropertyTests([])} 
                  className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 flex items-center text-sm"
                >
                  Clear
                </button>
              </div>

              {showBug && propertyTests.some(t => !t.passed) && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                  <p className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Bug found!</strong> Property-based testing discovered the Unicode handling bug 
                      by automatically generating test cases with special characters.
                    </span>
                  </p>
                </div>
              )}

              {!showBug && propertyTests.length > 0 && propertyTests.every(t => t.passed) && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700">
                  <p className="text-sm">
                    All properties satisfied! The implementation appears correct.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}