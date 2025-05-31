"use client";

import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(
  () => import("@/components/MermaidDiagram"),
  { 
    ssr: false,
    loading: () => <div>Loading diagram...</div>
  }
);

export default function TestMermaidPage() {
  const testDiagram = `
    graph TD
      A[Start] --> B{Is it working?}
      B -->|Yes| C[Great!]
      B -->|No| D[Debug more]
      C --> E[End]
      D --> E[End]
  `;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Mermaid Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">Test Diagram:</h2>
        <MermaidDiagram code={testDiagram} />
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h3 className="text-lg mb-2">Diagram Code:</h3>
        <pre className="text-sm overflow-x-auto">
          <code>{testDiagram}</code>
        </pre>
      </div>
    </div>
  );
}