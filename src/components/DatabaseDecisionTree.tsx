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
  recommendation: string;
  databases: {
    primary: string[];
    alternatives: string[];
  };
  keyPoints: string[];
  example?: string;
}

type TreeNode = Decision | Outcome;

const databaseDecisionTree: Record<string, TreeNode> = {
  start: {
    id: "start",
    question: "What's your primary data access pattern?",
    description: "Understanding how you'll query your data is crucial for database selection.",
    options: [
      { label: "Key-based lookups with predictable queries", nextId: "keyBased", impact: "NoSQL territory" },
      { label: "Complex queries with JOINs and transactions", nextId: "relational", impact: "SQL databases excel here" },
      { label: "Time-series or sequential data", nextId: "timeSeries", impact: "Specialized solutions available" },
      { label: "Full-text search and analytics", nextId: "searchAnalytics", impact: "Search-optimized stores" }
    ]
  },
  
  keyBased: {
    id: "keyBased",
    question: "What's your scale requirement?",
    description: "Scale determines whether you need a distributed solution.",
    options: [
      { label: "Millions of ops/second, global scale", nextId: "massiveScale", impact: "Need serious firepower" },
      { label: "Moderate scale with cost sensitivity", nextId: "moderateScale", impact: "Balance performance and cost" },
      { label: "Small to medium, simplicity matters", nextId: "smallScale", impact: "Managed solutions work well" }
    ]
  },
  
  massiveScale: {
    id: "massiveScale",
    question: "What's more important: consistency or availability?",
    description: "CAP theorem trade-offs become critical at scale.",
    options: [
      { label: "Maximum availability and partition tolerance", nextId: "scyllaRecommendation" },
      { label: "Strong consistency with some availability trade-offs", nextId: "cockroachRecommendation" },
      { label: "Tunable consistency based on use case", nextId: "cassandraRecommendation" }
    ]
  },
  
  relational: {
    id: "relational",
    question: "Do you need horizontal scaling?",
    options: [
      { label: "Yes, across multiple regions", nextId: "distributedSQL" },
      { label: "No, vertical scaling is sufficient", nextId: "traditionalSQL" },
      { label: "Maybe in the future", nextId: "postgresRecommendation" }
    ]
  },
  
  timeSeries: {
    id: "timeSeries",
    question: "What's your data retention and query pattern?",
    options: [
      { label: "High ingestion rate, recent data queries", nextId: "scyllaTimeSeriesRecommendation" },
      { label: "Long-term storage with complex analytics", nextId: "clickhouseRecommendation" },
      { label: "Metrics and monitoring focus", nextId: "prometheusRecommendation" }
    ]
  },
  
  // Outcome nodes
  scyllaRecommendation: {
    id: "scyllaRecommendation",
    title: "ScyllaDB is Your Best Choice",
    description: "For massive scale key-value/wide-column workloads with predictable access patterns, ScyllaDB delivers unmatched performance.",
    recommendation: "ScyllaDB",
    databases: {
      primary: ["ScyllaDB"],
      alternatives: ["Cassandra (if you need Java ecosystem)", "DynamoDB (if you're AWS-locked)"]
    },
    keyPoints: [
      "Handles millions of ops/second on modest hardware",
      "Predictable low latency even under load",
      "Cost-effective at scale compared to DynamoDB",
      "Compatible with Cassandra (easy migration)"
    ],
    example: "Discord migrated from Cassandra to ScyllaDB and reduced their database fleet from 177 to 72 nodes while improving performance."
  },
  
  scyllaTimeSeriesRecommendation: {
    id: "scyllaTimeSeriesRecommendation",
    title: "ScyllaDB for Time-Series Data",
    description: "ScyllaDB excels at time-series workloads with its efficient clustering keys and compression.",
    recommendation: "ScyllaDB",
    databases: {
      primary: ["ScyllaDB"],
      alternatives: ["InfluxDB (purpose-built for time-series)", "TimescaleDB (if you need SQL)"]
    },
    keyPoints: [
      "Natural time-based partitioning with clustering keys",
      "Excellent compression ratios for time-series data",
      "Sub-millisecond queries for recent data",
      "Scales horizontally as data grows"
    ],
    example: "IoT platforms ingesting millions of sensor readings per second use ScyllaDB's time-based clustering for efficient range queries."
  },
  
  cassandraRecommendation: {
    id: "cassandraRecommendation",
    title: "Apache Cassandra",
    description: "When you need tunable consistency and have Java expertise in-house.",
    recommendation: "Cassandra",
    databases: {
      primary: ["Cassandra"],
      alternatives: ["ScyllaDB (for better performance)", "DataStax Astra (managed Cassandra)"]
    },
    keyPoints: [
      "Mature ecosystem with extensive tooling",
      "Tunable consistency levels",
      "Strong community support",
      "Works well with Java applications"
    ]
  },
  
  cockroachRecommendation: {
    id: "cockroachRecommendation",
    title: "CockroachDB for Distributed SQL",
    description: "When you need ACID transactions at global scale.",
    recommendation: "CockroachDB",
    databases: {
      primary: ["CockroachDB"],
      alternatives: ["Spanner (on Google Cloud)", "YugabyteDB"]
    },
    keyPoints: [
      "Distributed ACID transactions",
      "PostgreSQL compatibility",
      "Automatic sharding and rebalancing",
      "Multi-region deployments"
    ]
  },
  
  postgresRecommendation: {
    id: "postgresRecommendation",
    title: "PostgreSQL - The Reliable Choice",
    description: "When in doubt, PostgreSQL is rarely the wrong choice for relational data.",
    recommendation: "PostgreSQL",
    databases: {
      primary: ["PostgreSQL"],
      alternatives: ["MySQL", "MariaDB"]
    },
    keyPoints: [
      "Rich feature set with extensions",
      "Excellent performance for single-node deployments",
      "Can scale quite far with read replicas",
      "Migration path to distributed solutions exists"
    ]
  },
  
  moderateScale: {
    id: "moderateScale",
    title: "MongoDB or Managed Solutions",
    description: "For moderate scale with developer-friendly features.",
    recommendation: "MongoDB or Cloud-Managed Databases",
    databases: {
      primary: ["MongoDB", "Amazon DynamoDB", "Azure CosmosDB"],
      alternatives: ["ScyllaDB Cloud", "DataStax Astra"]
    },
    keyPoints: [
      "Good balance of features and performance",
      "Managed services reduce operational overhead",
      "Flexible data models",
      "Built-in scaling capabilities"
    ]
  },
  
  smallScale: {
    id: "smallScale",
    title: "Keep It Simple - PostgreSQL or SQLite",
    description: "Don't over-engineer. Start simple and migrate when needed.",
    recommendation: "PostgreSQL or SQLite",
    databases: {
      primary: ["PostgreSQL", "SQLite"],
      alternatives: ["MySQL", "Managed RDS"]
    },
    keyPoints: [
      "Battle-tested and reliable",
      "Extensive documentation and community",
      "Easy to hire developers",
      "Clear migration path when you outgrow it"
    ]
  },
  
  distributedSQL: {
    id: "distributedSQL",
    title: "Distributed SQL Databases",
    description: "For global scale with SQL semantics.",
    recommendation: "CockroachDB or Spanner",
    databases: {
      primary: ["CockroachDB", "Google Spanner", "YugabyteDB"],
      alternatives: ["Vitess (for MySQL)", "Citus (for PostgreSQL)"]
    },
    keyPoints: [
      "Horizontal scaling with SQL",
      "ACID transactions across regions",
      "Higher complexity than single-node",
      "Consider managed offerings"
    ]
  },
  
  traditionalSQL: {
    id: "traditionalSQL",
    title: "Traditional Relational Databases",
    description: "Proven, reliable, and well-understood.",
    recommendation: "PostgreSQL or MySQL",
    databases: {
      primary: ["PostgreSQL", "MySQL", "SQL Server"],
      alternatives: ["MariaDB", "Oracle"]
    },
    keyPoints: [
      "Mature ecosystems",
      "Excellent tooling",
      "Can scale vertically quite far",
      "Consider managed services (RDS, Cloud SQL)"
    ]
  },
  
  searchAnalytics: {
    id: "searchAnalytics",
    title: "Search and Analytics Engines",
    description: "Optimized for full-text search and analytical queries.",
    recommendation: "Elasticsearch or ClickHouse",
    databases: {
      primary: ["Elasticsearch", "ClickHouse", "Apache Druid"],
      alternatives: ["Solr", "Splunk", "BigQuery"]
    },
    keyPoints: [
      "Purpose-built for search/analytics",
      "Often used alongside primary databases",
      "Consider data freshness requirements",
      "Resource-intensive but powerful"
    ]
  },
  
  clickhouseRecommendation: {
    id: "clickhouseRecommendation",
    title: "ClickHouse for Analytics",
    description: "When you need blazing-fast analytical queries on large datasets.",
    recommendation: "ClickHouse",
    databases: {
      primary: ["ClickHouse"],
      alternatives: ["Apache Druid", "Amazon Redshift", "Snowflake"]
    },
    keyPoints: [
      "Columnar storage for compression",
      "Excellent for time-series analytics",
      "SQL interface",
      "Can handle petabytes of data"
    ]
  },
  
  prometheusRecommendation: {
    id: "prometheusRecommendation",
    title: "Prometheus for Metrics",
    description: "The de-facto standard for metrics and monitoring.",
    recommendation: "Prometheus + Remote Storage",
    databases: {
      primary: ["Prometheus", "VictoriaMetrics"],
      alternatives: ["InfluxDB", "TimescaleDB"]
    },
    keyPoints: [
      "Purpose-built for metrics",
      "Excellent ecosystem (Grafana, etc.)",
      "Consider remote storage for scale",
      "Pull-based model works well for monitoring"
    ]
  }
};

function isDecision(node: TreeNode): node is Decision {
  return "options" in node;
}

export default function DatabaseDecisionTree() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState<string[]>([]);
  
  const currentNode = databaseDecisionTree[currentNodeId];
  
  const handleOptionClick = (nextId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextId);
  };
  
  const handleBack = () => {
    if (history.length > 0) {
      const previousNodeId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(previousNodeId);
    }
  };
  
  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId("start");
  };
  
  return (
    <div className="my-8 p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Database Selection Guide</h3>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
          )}
          {currentNodeId !== "start" && (
            <button
              onClick={handleRestart}
              className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
            >
              ↺ Restart
            </button>
          )}
        </div>
      </div>
      
      {isDecision(currentNode) ? (
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">{currentNode.question}</h4>
          {currentNode.description && (
            <p className="text-gray-400 mb-4">{currentNode.description}</p>
          )}
          <div className="space-y-2">
            {currentNode.options.map((option) => (
              <button
                key={option.nextId}
                onClick={() => handleOptionClick(option.nextId)}
                className="w-full text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{option.label}</span>
                  <span className="text-gray-500 group-hover:text-gray-400">→</span>
                </div>
                {option.impact && (
                  <p className="text-sm text-gray-500 mt-1">{option.impact}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-semibold text-green-400 mb-2">{currentNode.title}</h4>
          <p className="text-gray-300 mb-4">{currentNode.description}</p>
          
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h5 className="text-white font-semibold mb-2">Recommended Databases:</h5>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Primary choices:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {currentNode.databases.primary.map((db) => (
                  <span key={db} className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                    {db}
                  </span>
                ))}
              </div>
            </div>
            {currentNode.databases.alternatives.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Alternatives:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentNode.databases.alternatives.map((db) => (
                    <span key={db} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {db}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <h5 className="text-white font-semibold mb-2">Key Points:</h5>
            <ul className="list-disc list-inside space-y-1">
              {currentNode.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-300 text-sm">{point}</li>
              ))}
            </ul>
          </div>
          
          {currentNode.example && (
            <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
              <h5 className="text-blue-400 font-semibold mb-1">Real-World Example:</h5>
              <p className="text-gray-300 text-sm">{currentNode.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}