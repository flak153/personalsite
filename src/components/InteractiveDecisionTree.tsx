"use client";

import React, { useState } from "react";

interface Decision {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    nextId: string;
    impact?: string;
  }[];
}

interface Outcome {
  id: string;
  title: string;
  description: string;
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
  recommendation: string;
  realWorldExample?: string;
}

type TreeNode = Decision | Outcome;

const decisionTree: Record<string, TreeNode> = {
  start: {
    id: "start",
    question: "What's your primary constraint?",
    description: "Every engineering decision starts with understanding your most pressing limitation.",
    options: [
      { label: "Time to Market", nextId: "timeConstraint", impact: "Speed is critical" },
      { label: "System Performance", nextId: "performanceConstraint", impact: "Scale matters most" },
      { label: "Team Resources", nextId: "teamConstraint", impact: "People are the bottleneck" },
      { label: "Technical Debt", nextId: "debtConstraint", impact: "Maintenance is drowning us" }
    ]
  },
  
  timeConstraint: {
    id: "timeConstraint",
    question: "How critical is the deadline?",
    description: "Understanding the business impact helps calibrate the technical trade-offs.",
    options: [
      { label: "Business-critical (competitor threat, market window)", nextId: "criticalDeadline" },
      { label: "Important but flexible (internal milestone)", nextId: "flexibleDeadline" },
      { label: "Experimental (testing an idea)", nextId: "experimentalDeadline" }
    ]
  },
  
  performanceConstraint: {
    id: "performanceConstraint",
    question: "What's your current scale?",
    description: "The right solution at 1x scale is often wrong at 100x scale.",
    options: [
      { label: "Startup (<1K users)", nextId: "startupScale" },
      { label: "Growing (1K-100K users)", nextId: "growthScale" },
      { label: "Scale (100K+ users)", nextId: "atScale" }
    ]
  },
  
  teamConstraint: {
    id: "teamConstraint",
    question: "What's your team's biggest challenge?",
    options: [
      { label: "Too few engineers", nextId: "fewEngineers" },
      { label: "Skill gaps", nextId: "skillGaps" },
      { label: "Communication overhead", nextId: "communicationOverhead" }
    ]
  },
  
  debtConstraint: {
    id: "debtConstraint",
    question: "What type of debt is slowing you down?",
    options: [
      { label: "Architectural (wrong abstractions)", nextId: "architecturalDebt" },
      { label: "Code quality (bugs, lack of tests)", nextId: "qualityDebt" },
      { label: "Dependency rot (outdated libraries)", nextId: "dependencyDebt" }
    ]
  },
  
  // Outcomes
  criticalDeadline: {
    id: "criticalDeadline",
    title: "Ship Fast, Plan to Refactor",
    description: "When facing a critical deadline, controlled technical debt is often the right choice.",
    tradeoffs: {
      pros: [
        "Capture market opportunity",
        "Get real user feedback quickly",
        "Maintain business momentum"
      ],
      cons: [
        "Increased bug risk",
        "Future development will be slower",
        "Team morale may suffer from shortcuts"
      ]
    },
    recommendation: "Take the debt, but time-box it. Create refactoring tickets immediately and schedule them for the next sprint. Be transparent with the team about why you're making this choice.",
    realWorldExample: "Facebook's 'Move Fast and Break Things' era - they prioritized speed to dominate social networking, then spent years fixing the accumulated debt."
  },
  
  flexibleDeadline: {
    id: "flexibleDeadline",
    title: "Invest in the Right Foundation",
    description: "With some deadline flexibility, you can balance speed with sustainability.",
    tradeoffs: {
      pros: [
        "Better long-term velocity",
        "Higher team satisfaction",
        "Lower maintenance burden"
      ],
      cons: [
        "Slower initial delivery",
        "Risk of over-engineering",
        "Opportunity cost"
      ]
    },
    recommendation: "Negotiate for 20-30% more time to do it right. Focus on the core architecture and skimp on nice-to-haves. This small investment pays dividends.",
    realWorldExample: "Stripe's API design - they took extra time upfront to design extensible APIs, which enabled rapid feature development later."
  },
  
  experimentalDeadline: {
    id: "experimentalDeadline",
    title: "Prototype and Learn",
    description: "For experiments, optimize for learning speed over code quality.",
    tradeoffs: {
      pros: [
        "Rapid validation of ideas",
        "Minimal resource investment",
        "Freedom to explore"
      ],
      cons: [
        "Code is throwaway",
        "Can't scale without rewrite",
        "Risk of prototype becoming production"
      ]
    },
    recommendation: "Use high-level languages and frameworks. Skip tests. Hard-code values. But SET A DEADLINE for the experiment and stick to it.",
    realWorldExample: "Groupon started as a WordPress blog with manual processes - they validated the business model before building real infrastructure."
  },
  
  startupScale: {
    id: "startupScale",
    title: "Monolith First",
    description: "At startup scale, simplicity beats sophistication every time.",
    tradeoffs: {
      pros: [
        "Simple deployment and debugging",
        "Fast development iteration",
        "Easy onboarding"
      ],
      cons: [
        "Will hit scaling limits",
        "Team coupling as you grow",
        "Big bang migration later"
      ]
    },
    recommendation: "Build a well-structured monolith. Use clear module boundaries. You can extract services later when you actually need them.",
    realWorldExample: "Shopify ran on a Ruby on Rails monolith until well past $1B in GMV - they only split services when absolutely necessary."
  },
  
  growthScale: {
    id: "growthScale",
    title: "Selective Service Extraction",
    description: "At growth stage, extract only the services that provide clear benefits.",
    tradeoffs: {
      pros: [
        "Gradual migration path",
        "Learn as you go",
        "Maintain velocity"
      ],
      cons: [
        "Increased complexity",
        "Need better tooling",
        "Distributed system challenges"
      ]
    },
    recommendation: "Extract services along team boundaries, not technical ones. Start with the highest-value extractions (e.g., the service that's blocking everyone).",
    realWorldExample: "Uber's marketplace split - they separated rider and driver systems when team coordination became the bottleneck, not for technical reasons."
  },
  
  atScale: {
    id: "atScale",
    title: "Full Service Architecture",
    description: "At scale, organizational flexibility becomes more important than technical simplicity.",
    tradeoffs: {
      pros: [
        "Independent team velocity",
        "Fault isolation",
        "Technology flexibility"
      ],
      cons: [
        "Massive operational overhead",
        "Complex debugging",
        "Data consistency challenges"
      ]
    },
    recommendation: "Invest heavily in platform tooling. You need world-class observability, deployment, and service mesh capabilities to make this work.",
    realWorldExample: "Netflix's full microservices architecture - they invested millions in tooling (Hystrix, Eureka, etc.) to make it manageable."
  },
  
  fewEngineers: {
    id: "fewEngineers",
    title: "Maximize Leverage",
    description: "With limited engineers, choose boring technology and buy over build.",
    tradeoffs: {
      pros: [
        "Higher output per engineer",
        "Less maintenance burden",
        "Proven solutions"
      ],
      cons: [
        "Less customization",
        "Vendor lock-in risk",
        "Higher monetary cost"
      ]
    },
    recommendation: "Use managed services (RDS over self-hosted Postgres). Choose popular frameworks with large communities. Outsource non-core functionality.",
    realWorldExample: "WhatsApp served 900M users with 50 engineers by using Erlang (proven telecom tech) and keeping the product extremely focused."
  },
  
  skillGaps: {
    id: "skillGaps",
    title: "Upskill or Simplify",
    description: "Either invest in training or choose technology that matches current skills.",
    tradeoffs: {
      pros: [
        "Team growth opportunity",
        "Better long-term capability",
        "Hiring becomes easier"
      ],
      cons: [
        "Slower initial progress",
        "Risk of failure",
        "Training costs"
      ]
    },
    recommendation: "For core competencies, invest in training. For peripheral needs, choose simpler solutions or hire specialists.",
    realWorldExample: "Airbnb's investment in React Native training vs. their decision to abandon it when the skill gap proved too large."
  },
  
  communicationOverhead: {
    id: "communicationOverhead",
    title: "Conway's Law in Action",
    description: "Your architecture will mirror your organization. Design accordingly.",
    tradeoffs: {
      pros: [
        "Reduced coordination needs",
        "Clear ownership",
        "Faster decisions"
      ],
      cons: [
        "Potential duplication",
        "Integration challenges",
        "Siloed knowledge"
      ]
    },
    recommendation: "Restructure teams around business capabilities, not technical layers. Give teams full ownership of their services.",
    realWorldExample: "Amazon's two-pizza teams - they restructured the entire organization to reduce communication overhead."
  },
  
  architecturalDebt: {
    id: "architecturalDebt",
    title: "Incremental Migration",
    description: "Big bang rewrites fail. Migrate incrementally using the Strangler Fig pattern.",
    tradeoffs: {
      pros: [
        "Lower risk",
        "Continuous delivery",
        "Learn and adjust"
      ],
      cons: [
        "Longer total timeline",
        "Duplicate systems temporarily",
        "Complex routing"
      ]
    },
    recommendation: "Build new functionality in the new architecture. Migrate old functionality piece by piece. Keep both systems running until complete.",
    realWorldExample: "LinkedIn's migration from Rails to Node.js - took 2 years but maintained uptime throughout."
  },
  
  qualityDebt: {
    id: "qualityDebt",
    title: "Stop the Bleeding First",
    description: "Before fixing old bugs, prevent new ones with better practices.",
    tradeoffs: {
      pros: [
        "Immediate impact",
        "Team morale boost",
        "Sustainable improvement"
      ],
      cons: [
        "Old bugs remain",
        "Slower feature delivery",
        "Culture change required"
      ]
    },
    recommendation: "Implement CI/CD, code review, and testing requirements for new code. Gradually increase coverage. Fix old bugs opportunistically.",
    realWorldExample: "Microsoft's Windows Vista to Windows 7 transformation - they instituted strict quality gates that initially slowed development but resulted in a much more stable product."
  },
  
  dependencyDebt: {
    id: "dependencyDebt",
    title: "Systematic Dependency Management",
    description: "Outdated dependencies are security risks and productivity drains.",
    tradeoffs: {
      pros: [
        "Security improvements",
        "Access to new features",
        "Better performance"
      ],
      cons: [
        "Breaking changes",
        "Testing overhead",
        "Potential instability"
      ]
    },
    recommendation: "Automate dependency updates with tools like Dependabot. Have a monthly 'dependency day' to handle breaking changes as a team.",
    realWorldExample: "GitHub's automated security updates - they dogfood their own Dependabot to keep thousands of repositories updated."
  }
};

export default function InteractiveDecisionTree() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState<string[]>([]);
  
  const currentNode = decisionTree[currentNodeId];
  const isDecision = "options" in currentNode;
  
  const handleChoice = (nextId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextId);
  };
  
  const handleBack = () => {
    if (history.length > 0) {
      const previousId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(previousId);
    }
  };
  
  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId("start");
  };
  
  return (
    <div className="my-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-100">Interactive Decision Tree</h3>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
            >
              ← Back
            </button>
          )}
          {currentNodeId !== "start" && (
            <button
              onClick={handleRestart}
              className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
            >
              Restart
            </button>
          )}
        </div>
      </div>
      
      {isDecision ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-2">
              {(currentNode as Decision).question}
            </h4>
            {(currentNode as Decision).description && (
              <p className="text-gray-400 text-sm mb-4">
                {(currentNode as Decision).description}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            {(currentNode as Decision).options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option.nextId)}
                className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-100 font-medium">{option.label}</span>
                  <span className="text-gray-500 group-hover:text-gray-300 transition-colors">→</span>
                </div>
                {option.impact && (
                  <p className="text-sm text-gray-500 mt-1">{option.impact}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-lg font-semibold text-gray-100 mb-2">
              {(currentNode as Outcome).title}
            </h4>
            <p className="text-gray-300">
              {(currentNode as Outcome).description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
              <h5 className="font-semibold text-green-400 mb-2">Pros</h5>
              <ul className="space-y-1">
                {(currentNode as Outcome).tradeoffs.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
              <h5 className="font-semibold text-red-400 mb-2">Cons</h5>
              <ul className="space-y-1">
                {(currentNode as Outcome).tradeoffs.cons.map((con, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
            <h5 className="font-semibold text-blue-400 mb-2">Recommendation</h5>
            <p className="text-sm text-gray-300">
              {(currentNode as Outcome).recommendation}
            </p>
          </div>
          
          {(currentNode as Outcome).realWorldExample && (
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800">
              <h5 className="font-semibold text-purple-400 mb-2">Real-World Example</h5>
              <p className="text-sm text-gray-300">
                {(currentNode as Outcome).realWorldExample}
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Navigate through the decision tree to explore different engineering trade-offs based on your constraints.
        </p>
      </div>
    </div>
  );
}