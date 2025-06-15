"use client";

import React, { useState, useEffect } from 'react';

interface DatabaseMetrics {
  name: string;
  color: string;
  latencyBase: number;
  latencyVariance: number;
  throughputMax: number;
  costPerMillion: number;
  nodeEfficiency: number;
}

const databases = {
  scylladb: {
    name: "ScyllaDB",
    color: "#FFD700",
    latencyBase: 1,
    latencyVariance: 0.5,
    throughputMax: 2000000,
    costPerMillion: 0.12,
    nodeEfficiency: 0.90
  },
  cassandra: {
    name: "Cassandra",
    color: "#3B82F6",
    latencyBase: 8,
    latencyVariance: 4,
    throughputMax: 200000,
    costPerMillion: 0.40,
    nodeEfficiency: 0.35
  },
  dynamodb: {
    name: "DynamoDB",
    color: "#10B981",
    latencyBase: 5,
    latencyVariance: 2,
    throughputMax: 1000000,
    costPerMillion: 0.65,
    nodeEfficiency: 0.60
  }
} as const;

export default function DatabasePerformanceComparison() {
  const [activeView, setActiveView] = useState<'latency' | 'throughput' | 'cost'>('latency');
  const [load, setLoad] = useState(50);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getLatency = (db: DatabaseMetrics, currentLoad: number) => {
    const loadFactor = currentLoad / 100;
    const variance = Math.sin(animationFrame * 0.1) * db.latencyVariance * loadFactor;
    return db.latencyBase * (1 + loadFactor * 2) + variance;
  };

  const getThroughput = (db: DatabaseMetrics, currentLoad: number) => {
    const efficiency = db.nodeEfficiency;
    const maxThroughput = db.throughputMax;
    return maxThroughput * (currentLoad / 100) * efficiency;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toFixed(0);
  };

  return (
    <div className="my-12 p-8 bg-gradient-to-b from-gray-900/50 to-black/50 rounded-2xl border border-gray-800">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Real-Time Performance Comparison
      </h3>

      {/* View Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        {(['latency', 'throughput', 'cost'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeView === view
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Load Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">System Load</span>
          <span className="text-yellow-400 font-mono">{load}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={load}
          onChange={(e) => setLoad(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${load}%, #374151 ${load}%, #374151 100%)`
          }}
        />
      </div>

      {/* Latency View */}
      {activeView === 'latency' && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">Lower is better (P99 Latency in ms)</p>
          </div>
          {Object.values(databases).map((db) => {
            const latency = getLatency(db, load);
            const barWidth = Math.min((latency / 50) * 100, 100);
            
            return (
              <div key={db.name} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{db.name}</span>
                  <span className="text-gray-300 font-mono">
                    {latency.toFixed(1)}ms
                  </span>
                </div>
                <div className="h-8 bg-gray-800/50 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-300 relative overflow-hidden"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: db.color,
                      boxShadow: `0 0 20px ${db.color}50`
                    }}
                  >
                    {/* Animated pulse effect */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, white, transparent)`,
                        transform: `translateX(${(animationFrame * 2) % 200 - 100}%)`
                      }}
                    />
                  </div>
                </div>
                {/* Performance indicator */}
                {db.name === 'ScyllaDB' && latency < 5 && (
                  <span className="absolute -top-1 right-0 text-xs text-green-400">
                    ✨ Sub-5ms!
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Throughput View */}
      {activeView === 'throughput' && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">Higher is better (Operations/sec)</p>
          </div>
          {Object.values(databases).map((db) => {
            const throughput = getThroughput(db, load);
            const barWidth = (throughput / databases.scylladb.throughputMax) * 100;
            
            return (
              <div key={db.name} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{db.name}</span>
                  <span className="text-gray-300 font-mono">
                    {formatNumber(throughput)} ops/s
                  </span>
                </div>
                <div className="h-8 bg-gray-800/50 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-300 relative overflow-hidden"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: db.color,
                      boxShadow: `0 0 20px ${db.color}50`
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, white, transparent)`,
                        transform: `translateX(${(animationFrame * 2) % 200 - 100}%)`
                      }}
                    />
                  </div>
                </div>
                {/* Efficiency indicator */}
                <span className="absolute -bottom-5 left-0 text-xs text-gray-500">
                  {(db.nodeEfficiency * 100).toFixed(0)}% CPU efficiency
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Cost View */}
      {activeView === 'cost' && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">Cost per Million Operations ($)</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.values(databases).map((db) => {
              const monthlyOps = load * 10000000; // 10M base ops
              const monthlyCost = (monthlyOps / 1000000) * db.costPerMillion;
              
              return (
                <div
                  key={db.name}
                  className="relative p-6 rounded-xl border-2 transition-all duration-300 text-center"
                  style={{
                    borderColor: db.color + '40',
                    backgroundColor: db.color + '10',
                    transform: db.name === 'ScyllaDB' ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <h4 className="text-lg font-bold mb-2" style={{ color: db.color }}>
                    {db.name}
                  </h4>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${monthlyCost.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-400">
                    per month
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ${db.costPerMillion}/M ops
                  </div>
                  {db.name === 'ScyllaDB' && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                      Best Value
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400 text-center">
              At {load}% load: ScyllaDB saves{' '}
              <span className="font-bold">
                ${((load * 10000000 / 1000000) * (databases.dynamodb.costPerMillion - databases.scylladb.costPerMillion)).toFixed(0)}/month
              </span>{' '}
              vs DynamoDB
            </p>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="text-yellow-400 text-2xl mb-2">10-37×</div>
          <div className="text-sm text-gray-400">Better performance than Cassandra</div>
        </div>
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="text-yellow-400 text-2xl mb-2">5-40×</div>
          <div className="text-sm text-gray-400">Lower cost than DynamoDB</div>
        </div>
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="text-yellow-400 text-2xl mb-2">90%</div>
          <div className="text-sm text-gray-400">CPU utilization efficiency</div>
        </div>
      </div>
    </div>
  );
}