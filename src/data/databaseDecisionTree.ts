import { TreeNode } from "@/components/DecisionTree";

export const databaseDecisionTreeData: Record<string, TreeNode> = {
  start: {
    id: "start",
    type: "decision" as const,
    question: "What type of data system do you need?",
    description: "First, let's determine if you need a primary database, a caching layer, or a complete application backend platform.",
    options: [
      { label: "Application backend with managed services", nextId: "backendServices", impact: "Full-stack platforms" },
      { label: "Caching, sessions, queues, or pub/sub", nextId: "operationalData", impact: "In-memory systems" },
      { label: "Primary database for application data", nextId: "primaryDatabase", impact: "Traditional database selection" }
    ]
  },
  
  primaryDatabase: {
    id: "primaryDatabase",
    type: "decision" as const,
    question: "What's your primary data access pattern?",
    description: "Understanding how you'll query your data is crucial for database selection. Different patterns require fundamentally different architectures.",
    options: [
      { label: "Key-based lookups with predictable queries", nextId: "keyBased", impact: "NoSQL territory" },
      { label: "Complex queries with JOINs and transactions", nextId: "relational", impact: "SQL databases excel here" },
      { label: "Time-series or sequential data", nextId: "timeSeries", impact: "Specialized solutions available" },
      { label: "Full-text search and analytics", nextId: "searchAnalytics", impact: "Search-optimized stores" },
      { label: "Graph relationships and connected data", nextId: "graphDatabases", impact: "Neo4j leads this space" }
    ]
  },
  
  backendServices: {
    id: "backendServices",
    type: "decision" as const,
    question: "What type of backend platform do you need?",
    description: "Modern backend-as-a-service platforms provide databases, authentication, and APIs out of the box.",
    options: [
      { label: "Realtime updates with NoSQL flexibility", nextId: "firebaseRecommendation", impact: "Google's ecosystem" },
      { label: "PostgreSQL with instant APIs", nextId: "supabaseRecommendation", impact: "Open source alternative" },
      { label: "Traditional database with more control", nextId: "primaryDatabase", impact: "Back to database selection" }
    ]
  },
  
  operationalData: {
    id: "operationalData",
    type: "decision" as const,
    question: "What's your primary use case?",
    description: "In-memory databases serve different purposes - from simple caching to complex data structures and messaging.",
    options: [
      { label: "Caching, sessions, or simple key-value", nextId: "redisRecommendation", impact: "Redis dominates here" },
      { label: "High-throughput with persistence", nextId: "aerospikeRecommendation", impact: "Hybrid memory/disk" },
      { label: "Message queues or pub/sub only", nextId: "redisRecommendation", impact: "Redis or dedicated MQ" }
    ]
  },
  
  keyBased: {
    id: "keyBased",
    type: "decision" as const,
    question: "What's your scale requirement?",
    description: "Scale determines whether you need a distributed solution. Each 10x in scale often requires architectural changes.",
    options: [
      { label: "Millions of ops/second, global scale", nextId: "massiveScale", impact: "Need serious firepower" },
      { label: "Moderate scale with cost sensitivity", nextId: "moderateScale", impact: "Balance performance and cost" },
      { label: "Small to medium, simplicity matters", nextId: "smallScale", impact: "Managed solutions work well" }
    ]
  },
  
  massiveScale: {
    id: "massiveScale",
    type: "decision" as const,
    question: "What's more important: consistency or availability?",
    description: "CAP theorem trade-offs become critical at scale. You can have at most two of: Consistency, Availability, Partition tolerance.",
    options: [
      { label: "Maximum availability and partition tolerance", nextId: "scyllaRecommendation" },
      { label: "Strong consistency with some availability trade-offs", nextId: "cockroachRecommendation" },
      { label: "Tunable consistency based on use case", nextId: "cassandraRecommendation" },
      { label: "Foundation layer for building databases", nextId: "foundationdbRecommendation", impact: "Apple's choice" }
    ]
  },
  
  relational: {
    id: "relational",
    type: "decision" as const,
    question: "Do you need horizontal scaling?",
    description: "Traditional SQL databases scale vertically (bigger machines). Modern distributed SQL databases scale horizontally (more machines).",
    options: [
      { label: "Yes, across multiple regions", nextId: "distributedSQL" },
      { label: "Yes, with online schema changes", nextId: "modernSQL", impact: "Serverless MySQL" },
      { label: "No, vertical scaling is sufficient", nextId: "traditionalSQL" },
      { label: "Maybe in the future", nextId: "postgresRecommendation" }
    ]
  },
  
  modernSQL: {
    id: "modernSQL",
    type: "decision" as const,
    question: "What's most important for your SQL workload?",
    description: "Modern SQL platforms offer different advantages - from serverless scaling to global distribution.",
    options: [
      { label: "Zero-downtime schema changes", nextId: "planetscaleRecommendation", impact: "Database branching" },
      { label: "True global consistency", nextId: "spannerRecommendation", impact: "Google's solution" },
      { label: "PostgreSQL compatibility", nextId: "cockroachRecommendation", impact: "Distributed PostgreSQL" }
    ]
  },
  
  timeSeries: {
    id: "timeSeries",
    type: "decision" as const,
    question: "What's your data retention and query pattern?",
    description: "Time-series data has unique characteristics: write-once, query by time range, natural ordering. Choose based on your specific needs.",
    options: [
      { label: "High ingestion rate, recent data queries", nextId: "scyllaTimeSeriesRecommendation" },
      { label: "Long-term storage with complex analytics", nextId: "clickhouseRecommendation" },
      { label: "Metrics and monitoring focus", nextId: "prometheusRecommendation" }
    ]
  },
  
  searchAnalytics: {
    id: "searchAnalytics",
    type: "decision" as const,
    question: "What type of search and analytics do you need?",
    description: "Search and analytics span a wide spectrum from simple text matching to complex aggregations and machine learning.",
    options: [
      { label: "Full-text search with relevance scoring", nextId: "elasticsearchRecommendation" },
      { label: "Real-time analytics on large datasets", nextId: "clickhouseAnalyticsRecommendation" },
      { label: "Log analysis and observability", nextId: "opensearchRecommendation" }
    ]
  },
  
  graphDatabases: {
    id: "graphDatabases",
    type: "decision" as const,
    question: "What type of graph workload do you have?",
    description: "Graph databases excel at relationship-heavy queries like social networks, recommendations, and knowledge graphs.",
    options: [
      { label: "Complex graph traversals and analytics", nextId: "neo4jRecommendation", impact: "Industry standard" },
      { label: "Simple relationships with SQL", nextId: "postgresRecommendation", impact: "PostgreSQL can handle it" },
      { label: "Massive scale graph processing", nextId: "neo4jRecommendation", impact: "Need specialized tools" }
    ]
  },
  
  // Enhanced Outcome nodes with all features
  
  // Backend Platform Recommendations
  firebaseRecommendation: {
    id: "firebaseRecommendation",
    type: "outcome" as const,
    title: "Firebase - Google's App Development Platform",
    description: "Firebase provides a complete backend solution with realtime database, authentication, hosting, and more. Perfect for rapid app development.",
    sections: [
      {
        title: "Why Firebase Dominates Mobile/Web Apps",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Realtime sync out of the box",
          "Authentication in minutes",
          "Auto-scaling serverless",
          "Integrated analytics"
        ],
        icon: "🔥"
      },
      {
        title: "Key Features",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Firestore - NoSQL document database with offline sync",
          "Realtime Database - JSON tree with millisecond sync",
          "Authentication - Social logins, phone auth, anonymous",
          "Cloud Functions - Serverless backend logic",
          "Hosting - CDN-backed static hosting",
          "Cloud Messaging - Push notifications"
        ],
        icon: "✓"
      },
      {
        title: "Limitations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Vendor lock-in to Google Cloud",
          "Limited query capabilities compared to SQL",
          "Can get expensive at scale",
          "No full-text search without Algolia/ElasticSearch"
        ],
        icon: "⚠️"
      },
      {
        title: "Perfect Use Cases",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Mobile apps (iOS/Android)",
          "Real-time collaboration apps",
          "MVP and prototypes",
          "Chat applications"
        ],
        icon: "🎯"
      },
      {
        title: "Who's Using Firebase",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Duolingo", "The New York Times", "Alibaba", "Lyft"],
          alternatives: ["NPR", "Halfbrick (Fruit Ninja)", "Shazam"]
        }
      },
      {
        title: "Cost Optimization",
        type: "text" as const,
        variant: "info" as const,
        content: "Start with Spark (free) plan. Use Firestore over Realtime DB for better pricing at scale. Implement data aggregation to reduce reads. Cache frequently accessed data. Be careful with Cloud Functions invocations."
      },
      {
        title: "Migration Path",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Firebase is great for starting fast, but plan your exit strategy. Firestore data can be exported to BigQuery. Authentication can be migrated to Auth0 or Supabase. Consider abstracting Firebase services behind your own API layer to ease future migration."
      }
    ],
    footer: "Firebase: When you need to ship an app yesterday. Just have a plan for when you outgrow it."
  },

  supabaseRecommendation: {
    id: "supabaseRecommendation",
    type: "outcome" as const,
    title: "Supabase - The Open Source Firebase Alternative",
    description: "Supabase gives you a PostgreSQL database with instant APIs, authentication, and realtime subscriptions. All open source.",
    sections: [
      {
        title: "Why Developers Love Supabase",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Full PostgreSQL power",
          "Instant REST & GraphQL APIs",
          "Row Level Security (RLS)",
          "Open source, no lock-in"
        ],
        icon: "⚡"
      },
      {
        title: "Killer Features",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "PostgreSQL - Full SQL power with extensions",
          "Auto-generated APIs - REST and GraphQL instantly",
          "Realtime - Subscribe to database changes",
          "Auth - JWT-based with social providers",
          "Storage - S3-compatible object storage",
          "Edge Functions - Deno-based serverless"
        ],
        icon: "✓"
      },
      {
        title: "Advantages Over Firebase",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "SQL queries with JOINs and transactions",
          "Row Level Security for fine-grained access",
          "PostGIS for geospatial queries",
          "Full-text search built-in",
          "Open source - can self-host"
        ],
        icon: "🎯"
      },
      {
        title: "Trade-offs",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "No offline sync (unlike Firebase)",
          "Smaller ecosystem than Firebase",
          "PostgreSQL knowledge required",
          "Realtime subscriptions can be complex"
        ],
        icon: "⚠️"
      },
      {
        title: "Who's Using Supabase",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Mozilla (MDN)", "Replicate", "Cal.com", "Mobbin"],
          alternatives: ["Peerlist", "Commandbar", "Onemodel"]
        }
      },
      {
        title: "Best Practices",
        type: "text" as const,
        variant: "info" as const,
        content: "Use Row Level Security (RLS) from day one. Design your schema carefully - it's PostgreSQL, not NoSQL. Use database functions for complex logic. Enable connection pooling for serverless. Monitor your database size - storage pricing can surprise you."
      },
      {
        title: "When to Choose Over Firebase",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Need relational data with JOINs",
          "Want to avoid vendor lock-in",
          "Require complex queries",
          "Team knows PostgreSQL"
        ],
        icon: "💡"
      }
    ],
    footer: "Supabase: Firebase features with PostgreSQL power. The best of both worlds for many apps."
  },

  // Operational Data Stores
  redisRecommendation: {
    id: "redisRecommendation",
    type: "outcome" as const,
    title: "Redis - The Swiss Army Knife of Databases",
    description: "Redis is the world's most popular in-memory data structure store. Use it for caching, sessions, queues, leaderboards, and more.",
    sections: [
      {
        title: "Why Redis Rules In-Memory",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Sub-millisecond latency",
          "Rich data structures",
          "Atomic operations",
          "Lua scripting"
        ],
        icon: "⚡"
      },
      {
        title: "Common Use Cases",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Caching - Reduce database load by 10-100x",
          "Session Storage - Fast user session management",
          "Rate Limiting - Sliding window counters",
          "Pub/Sub - Real-time messaging",
          "Queues - Job queues with reliability",
          "Leaderboards - Sorted sets for rankings"
        ],
        icon: "🎯"
      },
      {
        title: "Data Structures Available",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Strings - Simple key-value",
          "Lists - Queues and stacks",
          "Sets - Unique collections",
          "Sorted Sets - Leaderboards",
          "Hashes - Objects/documents",
          "Streams - Event sourcing",
          "Bitmaps - Efficient flags",
          "HyperLogLog - Cardinality"
        ],
        icon: "📊"
      },
      {
        title: "Production Considerations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Data is memory-resident (plan capacity)",
          "Persistence is optional (RDB/AOF)",
          "Single-threaded (use Redis Cluster for scale)",
          "No complex queries (it's not a database)"
        ],
        icon: "⚠️"
      },
      {
        title: "Who's Using Redis at Scale",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Twitter", "GitHub", "Stack Overflow", "Instagram"],
          alternatives: ["Uber", "Airbnb", "Pinterest", "Snapchat"]
        }
      },
      {
        title: "Deployment Options",
        type: "text" as const,
        variant: "info" as const,
        content: "Use managed Redis for production: AWS ElastiCache, Redis Cloud, or Upstash for serverless. For high availability, use Redis Sentinel or Redis Cluster. Consider KeyDB (multi-threaded fork) for better single-instance performance."
      },
      {
        title: "Cost Optimization",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Use TTLs aggressively",
          "Compress large values",
          "Monitor memory usage",
          "Consider Upstash for pay-per-request"
        ],
        icon: "💰"
      }
    ],
    footer: "Redis: Not just a cache. The most versatile tool in your data infrastructure toolkit."
  },

  aerospikeRecommendation: {
    id: "aerospikeRecommendation",
    type: "outcome" as const,
    title: "Aerospike - Hybrid Memory Architecture for Scale",
    description: "When Redis isn't enough, Aerospike provides predictable performance at scale with its unique hybrid memory/SSD architecture.",
    sections: [
      {
        title: "Aerospike's Secret Sauce",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Indexes in RAM, data on SSD",
          "1M+ ops/sec per node",
          "Strong consistency option",
          "Cross-datacenter replication"
        ],
        icon: "🚀"
      },
      {
        title: "Performance Characteristics",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Predictable <1ms latency at 99%ile",
          "Scales to petabytes of data",
          "Handles 10M+ ops/sec on a cluster",
          "Flash-optimized storage engine",
          "No garbage collection pauses"
        ],
        icon: "📈"
      },
      {
        title: "When to Choose Over Redis",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Dataset larger than RAM (terabytes)",
          "Need persistence without performance hit",
          "Require strong consistency",
          "Want automatic sharding and rebalancing"
        ],
        icon: "🎯"
      },
      {
        title: "Common Use Cases",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "AdTech - User profiles & targeting",
          "Fraud Detection - Real-time scoring",
          "Gaming - Player state & sessions",
          "Financial - Risk calculations"
        ],
        icon: "💼"
      },
      {
        title: "Who's Using Aerospike",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["PayPal", "Snap", "Wayfair", "Adobe"],
          alternatives: ["AppNexus", "Nielsen", "Barclays", "Flipkart"]
        }
      },
      {
        title: "Architecture Insight",
        type: "text" as const,
        variant: "info" as const,
        content: "Aerospike keeps indexes in RAM (64 bytes per record) while storing data on SSDs. This hybrid approach delivers near-RAM speeds at SSD costs. The Aerospike Defragmenter continuously optimizes SSD usage, maintaining consistent performance."
      },
      {
        title: "Cost Comparison",
        type: "text" as const,
        variant: "warning" as const,
        content: "At scale, Aerospike can be 10x cheaper than pure in-memory solutions. Example: 1TB dataset needs 1TB RAM for Redis ($$$) vs 64GB RAM + 1TB SSD for Aerospike ($). PayPal saved 80% switching from a RAM-only solution."
      }
    ],
    footer: "Aerospike: When you need Redis-like speed at petabyte scale. The AdTech industry's secret weapon."
  },

  // Modern SQL Databases
  planetscaleRecommendation: {
    id: "planetscaleRecommendation",
    type: "outcome" as const,
    title: "PlanetScale - Serverless MySQL for the Modern Web",
    description: "Built on Vitess (YouTube's sharding solution), PlanetScale brings database branching and zero-downtime schema changes to MySQL.",
    sections: [
      {
        title: "Why PlanetScale Changes the Game",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Database branching like Git",
          "Zero-downtime schema changes",
          "Automatic sharding",
          "Serverless scaling"
        ],
        icon: "🌍"
      },
      {
        title: "Killer Features",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Branching - Test schema changes safely",
          "Deploy requests - Schema changes with review",
          "Insights - Query performance analytics",
          "Non-blocking schema changes - No table locks",
          "Connection pooling - Built-in and automatic",
          "Read replicas - Automatic failover"
        ],
        icon: "✓"
      },
      {
        title: "Perfect For",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "High-velocity development",
          "Large tables (billions of rows)",
          "Teams needing schema review",
          "Serverless architectures"
        ],
        icon: "🎯"
      },
      {
        title: "Limitations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "No foreign key constraints",
          "Some MySQL features unsupported",
          "Can't query across shards with JOINs",
          "More expensive than raw RDS"
        ],
        icon: "⚠️"
      },
      {
        title: "Who's Using PlanetScale",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["GitHub Copilot", "Barstool Sports", "Sourcegraph", "Figma"],
          alternatives: ["Square", "Slack", "YouTube (via Vitess)"]
        }
      },
      {
        title: "Migration Strategy",
        type: "text" as const,
        variant: "info" as const,
        content: "PlanetScale provides import tools for existing MySQL databases. The branching feature lets you test the migration safely. Start with a single database, then leverage sharding as you grow. The query insights help optimize problematic queries during migration."
      },
      {
        title: "Cost Optimization",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Use scaler plan for variable workloads",
          "Enable connection pooling",
          "Optimize queries with Insights",
          "Delete unused branches"
        ],
        icon: "💰"
      }
    ],
    footer: "PlanetScale: MySQL with superpowers. Database branching will change how you think about schema evolution."
  },

  spannerRecommendation: {
    id: "spannerRecommendation",
    type: "outcome" as const,
    title: "Google Spanner - The Impossible Database",
    description: "Spanner delivers the 'impossible': global consistency, horizontal scaling, and 99.999% availability. It literally uses atomic clocks.",
    sections: [
      {
        title: "How Spanner Breaks CAP Theorem",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "TrueTime API with atomic clocks",
          "Global consistency at scale",
          "5 nines availability",
          "Automatic sharding"
        ],
        icon: "⚛️"
      },
      {
        title: "Unmatched Capabilities",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "External consistency - Globally synchronized",
          "Multi-region transactions - ACID across continents",
          "99.999% availability SLA - Industry leading",
          "Automatic resharding - Zero-downtime scaling",
          "SQL interface - ANSI 2011 compatible",
          "Change streams - CDC for downstream systems"
        ],
        icon: "✓"
      },
      {
        title: "When Only Spanner Will Do",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Global financial systems",
          "Multi-region inventory",
          "Advertising platforms",
          "Gaming - global state"
        ],
        icon: "🌍"
      },
      {
        title: "The Price of Perfection",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Expensive - Starts at $65/month per 100GB",
          "Google Cloud only (vendor lock-in)",
          "Minimum 3 nodes per region",
          "Complex pricing model"
        ],
        icon: "💰"
      },
      {
        title: "Who's Running on Spanner",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Google Ads", "Google Play", "Snap", "Square"],
          alternatives: ["Home Depot", "Mercado Libre", "Optiva"]
        }
      },
      {
        title: "Architecture Deep Dive",
        type: "text" as const,
        variant: "info" as const,
        content: "Spanner uses GPS and atomic clocks in Google data centers to establish a global notion of time (TrueTime). This allows it to order transactions globally without coordination. It's the only database that can give you linearizability at global scale."
      },
      {
        title: "Migration Considerations",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Migrating to Spanner requires rethinking your schema for distribution. Use interleaved tables for locality. Design primary keys for even distribution. The Harbourbridge tool can migrate from MySQL/PostgreSQL. Start with a single region and expand globally as needed."
      }
    ],
    footer: "Spanner: When you absolutely need global consistency. The technical marvel that powers Google's $200B ad business."
  },

  scyllaRecommendation: {
    id: "scyllaRecommendation",
    type: "outcome" as const,
    title: "ScyllaDB is Your Best Choice",
    description: "For massive scale key-value/wide-column workloads with predictable access patterns, ScyllaDB delivers unmatched performance.",
    sections: [
      {
        title: "Why ScyllaDB Dominates at Scale",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "C++ rewrite of Cassandra (no JVM overhead)",
          "Shard-per-core architecture",
          "Predictable <1ms latencies",
          "Linear scaling to 1000+ nodes"
        ],
        icon: "🚀"
      },
      {
        title: "Key Strengths",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Handles millions of ops/second on modest hardware",
          "Predictable low latency even at P99",
          "Cost-effective at scale (5-10x cheaper than DynamoDB)",
          "Compatible with Cassandra (easy migration path)"
        ],
        icon: "✓"
      },
      {
        title: "Limitations to Consider",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "No ACID transactions across partitions",
          "Limited query flexibility (must know partition key)",
          "Eventually consistent by default",
          "Steep learning curve for data modeling"
        ],
        icon: "⚠️"
      },
      {
        title: "Ideal Use Cases",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Time-series data (IoT, metrics)",
          "User activity feeds",
          "Session stores",
          "Real-time personalization"
        ],
        icon: "🎯"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["ScyllaDB"],
          alternatives: ["Cassandra (if you need Java ecosystem)", "DynamoDB (if you're AWS-locked)", "Bigtable (on GCP)"]
        }
      },
      {
        title: "Migration Success Story",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Discord migrated from Cassandra to ScyllaDB and reduced their database fleet from 177 to 72 nodes while improving P99 latency by 10x. They now handle billions of messages with a fraction of the infrastructure. Key insight: ScyllaDB's architecture eliminates JVM garbage collection pauses that plagued their Cassandra deployment."
      },
      {
        title: "Getting Started",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Start with ScyllaDB Cloud for PoC",
          "Use cqlsh for Cassandra compatibility",
          "Design partition keys carefully",
          "Monitor with built-in dashboards"
        ],
        icon: "🏁"
      }
    ],
    footer: "ScyllaDB shines when you need extreme performance at scale with predictable access patterns. It's overkill for small applications."
  },
  
  scyllaTimeSeriesRecommendation: {
    id: "scyllaTimeSeriesRecommendation",
    type: "outcome" as const,
    title: "ScyllaDB for Time-Series Data",
    description: "ScyllaDB excels at time-series workloads with its efficient clustering keys and compression. Perfect for IoT and monitoring.",
    sections: [
      {
        title: "Time-Series Optimization",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Natural time-based partitioning",
          "Efficient range queries",
          "Built-in TTL support",
          "Excellent compression ratios"
        ],
        icon: "⏰"
      },
      {
        title: "Performance Characteristics",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Sub-millisecond queries for recent data",
          "Handles millions of data points per second",
          "Linear scaling with data volume",
          "Automatic data expiration with TTL"
        ],
        icon: "📈"
      },
      {
        title: "Data Modeling Best Practices",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Partition by time bucket + entity",
          "Use clustering columns for time",
          "Set appropriate compaction strategy",
          "Consider downsampling old data"
        ],
        icon: "📊"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["ScyllaDB"],
          alternatives: ["InfluxDB (purpose-built for time-series)", "TimescaleDB (if you need SQL)", "Prometheus (for metrics)"]
        }
      },
      {
        title: "Example Schema Design",
        type: "text" as const,
        variant: "info" as const,
        content: "CREATE TABLE sensor_data (sensor_id text, date text, timestamp timestamp, value double, PRIMARY KEY ((sensor_id, date), timestamp)) WITH CLUSTERING ORDER BY (timestamp DESC) AND compaction = {'class': 'TimeWindowCompactionStrategy'};"
      },
      {
        title: "Real-World Application",
        type: "text" as const,
        variant: "neutral" as const,
        content: "IoT platforms ingesting millions of sensor readings per second use ScyllaDB's time-based clustering for efficient range queries. By partitioning on sensor_id + date, they can query any sensor's data for any day with a single disk seek, while writes remain distributed across the cluster."
      }
    ],
    footer: "For time-series data at massive scale, ScyllaDB's architecture provides unbeatable price-performance."
  },
  
  cassandraRecommendation: {
    id: "cassandraRecommendation",
    type: "outcome" as const,
    title: "Apache Cassandra - The Proven Choice",
    description: "When you need tunable consistency, have Java expertise in-house, and value ecosystem maturity over raw performance.",
    sections: [
      {
        title: "Cassandra's Strengths",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Mature ecosystem (10+ years)",
          "Extensive tooling",
          "Tunable consistency",
          "Large community"
        ],
        icon: "🏛️"
      },
      {
        title: "When to Choose Cassandra",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Your team has strong Java expertise",
          "You need specific Cassandra-only features",
          "You value ecosystem maturity over performance",
          "You're already invested in JVM infrastructure"
        ],
        icon: "🎯"
      },
      {
        title: "Performance Considerations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "JVM garbage collection causes latency spikes",
          "Requires 3-5x more hardware than ScyllaDB",
          "Complex tuning for optimal performance",
          "Memory management overhead"
        ],
        icon: "⚠️"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Apache Cassandra"],
          alternatives: ["ScyllaDB (for better performance)", "DataStax Astra (managed Cassandra)", "Amazon Keyspaces"]
        }
      },
      {
        title: "Operational Requirements",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Regular compaction tuning",
          "JVM heap management",
          "Repair operations",
          "Monitoring GC pauses"
        ],
        icon: "🔧"
      }
    ],
    footer: "Cassandra remains a solid choice when performance isn't critical and you value ecosystem maturity."
  },
  
  cockroachRecommendation: {
    id: "cockroachRecommendation",
    type: "outcome" as const,
    title: "CockroachDB for Distributed SQL",
    description: "When you need ACID transactions at global scale with PostgreSQL compatibility. The best of both SQL and NoSQL worlds.",
    sections: [
      {
        title: "Unique Capabilities",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Distributed ACID transactions",
          "PostgreSQL wire protocol",
          "Automatic sharding",
          "Multi-region deployment"
        ],
        icon: "🌍"
      },
      {
        title: "Key Benefits",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "No manual sharding required",
          "Survives zone/region failures automatically",
          "Strong consistency without sacrificing availability",
          "Familiar SQL interface for developers"
        ],
        icon: "✓"
      },
      {
        title: "Trade-offs",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Higher latency than single-node databases",
          "Complex transaction retry logic",
          "Not all PostgreSQL features supported",
          "Requires careful schema design for performance"
        ],
        icon: "⚠️"
      },
      {
        title: "Ideal Scenarios",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Global financial applications",
          "Multi-region e-commerce",
          "Regulatory compliance needs",
          "Zero-downtime requirements"
        ],
        icon: "🎯"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["CockroachDB"],
          alternatives: ["Google Spanner", "YugabyteDB", "TiDB"]
        }
      },
      {
        title: "Architecture Insight",
        type: "text" as const,
        variant: "info" as const,
        content: "CockroachDB uses a distributed consensus protocol (Raft) to maintain consistency across nodes. Every write is replicated to multiple nodes before acknowledging, ensuring durability even during failures. The cost: every write has network overhead."
      }
    ],
    footer: "Choose CockroachDB when you need global scale with strong consistency. It's complex but powerful."
  },
  
  postgresRecommendation: {
    id: "postgresRecommendation",
    type: "outcome" as const,
    title: "PostgreSQL - The Reliable Workhorse",
    description: "When in doubt, PostgreSQL is rarely the wrong choice. It's the Swiss Army knife of databases with incredible depth.",
    sections: [
      {
        title: "Why PostgreSQL Dominates",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "30+ years of battle-testing",
          "Incredible feature depth",
          "Extensions for everything",
          "Rock-solid reliability"
        ],
        icon: "🐘"
      },
      {
        title: "Standout Features",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Advanced indexing (B-tree, GIN, GiST, BRIN)",
          "Full-text search built-in",
          "JSON/JSONB for document storage",
          "PostGIS for geospatial data",
          "Foreign data wrappers",
          "Powerful query planner"
        ],
        icon: "🎯"
      },
      {
        title: "Scaling Strategies",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Read replicas for queries",
          "Partitioning for large tables",
          "Connection pooling (PgBouncer)",
          "Citus for sharding"
        ],
        icon: "📈"
      },
      {
        title: "When It's Not Enough",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Need to scale writes beyond ~50K/sec",
          "Require multi-master replication",
          "Need automatic sharding",
          "Want zero-downtime major version upgrades"
        ],
        icon: "⚠️"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["PostgreSQL"],
          alternatives: ["MySQL", "MariaDB", "CockroachDB (distributed)", "Neon (serverless)"]
        }
      },
      {
        title: "Pro Tip",
        type: "text" as const,
        variant: "info" as const,
        content: "Start with PostgreSQL. You can scale surprisingly far with read replicas, partitioning, and caching. When you hit real limits, you'll understand your data patterns well enough to choose the right specialized database. Most applications never outgrow a well-tuned PostgreSQL instance."
      },
      {
        title: "Deployment Options",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Amazon RDS", "Google Cloud SQL", "Azure Database"],
          alternatives: ["Supabase", "Neon", "Self-hosted"]
        }
      }
    ],
    footer: "PostgreSQL: Come for the features, stay for the reliability. It's the default choice for good reason."
  },
  
  moderateScale: {
    id: "moderateScale",
    type: "outcome" as const,
    title: "Balance Performance and Operational Overhead",
    description: "At moderate scale, you want good performance without the complexity of running distributed systems yourself.",
    sections: [
      {
        title: "The Sweet Spot",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Managed services reduce ops burden",
          "Proven scaling patterns",
          "Predictable costs",
          "Good documentation"
        ],
        icon: "🎯"
      },
      {
        title: "Top Choices by Use Case",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "MongoDB Atlas - Flexible document model",
          "DynamoDB - Predictable performance on AWS",
          "Azure CosmosDB - Multi-model with global distribution",
          "ScyllaDB Cloud - When you need more performance"
        ],
        icon: "🏆"
      },
      {
        title: "Cost Optimization Tips",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Use reserved capacity",
          "Implement caching aggressively",
          "Archive old data to cold storage",
          "Monitor and optimize queries"
        ],
        icon: "💰"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["MongoDB Atlas", "Amazon DynamoDB", "Azure CosmosDB"],
          alternatives: ["ScyllaDB Cloud", "DataStax Astra", "FaunaDB"]
        }
      },
      {
        title: "Decision Framework",
        type: "text" as const,
        variant: "info" as const,
        content: "Choose based on your cloud provider and data model. If on AWS, DynamoDB offers unbeatable integration. For flexible queries, MongoDB Atlas provides the best developer experience. Need extreme performance? ScyllaDB Cloud delivers 10x the ops/second at similar cost."
      }
    ],
    footer: "At moderate scale, optimize for developer productivity. Choose managed services that let you focus on your application."
  },
  
  smallScale: {
    id: "smallScale",
    type: "outcome" as const,
    title: "Keep It Simple - Start Small",
    description: "Don't over-engineer. Start with simple, proven solutions and migrate when you have real scaling problems.",
    sections: [
      {
        title: "Simplicity Wins",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "One database to manage",
          "Tons of documentation",
          "Easy hiring",
          "Clear migration paths"
        ],
        icon: "✨"
      },
      {
        title: "Best Starting Points",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "PostgreSQL - Best all-around choice",
          "SQLite - Perfect for embedded/edge cases",
          "MySQL - Great for web applications",
          "Supabase - PostgreSQL + instant APIs"
        ],
        icon: "🚀"
      },
      {
        title: "When to Use Each",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "PostgreSQL: Complex queries, JSON data",
          "SQLite: Single-user apps, embedded",
          "MySQL: Simple web apps, WordPress",
          "Supabase: Need APIs immediately"
        ],
        icon: "🎯"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["PostgreSQL", "SQLite", "MySQL"],
          alternatives: ["Supabase", "PlanetScale", "Neon"]
        }
      },
      {
        title: "Growth Strategy",
        type: "text" as const,
        variant: "info" as const,
        content: "Start with PostgreSQL on a managed service. You can scale vertically to surprisingly large instances, add read replicas, and implement caching. By the time you need to migrate, you'll understand your access patterns and can make an informed choice."
      },
      {
        title: "Deployment Recommendations",
        type: "pills" as const,
        variant: "success" as const,
        content: {
          primary: ["Supabase", "Railway", "Render"],
          alternatives: ["Heroku Postgres", "DigitalOcean Managed", "AWS RDS"]
        }
      }
    ],
    footer: "Perfect is the enemy of good. Start simple, measure everything, and evolve based on real needs."
  },
  
  distributedSQL: {
    id: "distributedSQL",
    type: "outcome" as const,
    title: "Global Scale with SQL Semantics",
    description: "Modern distributed SQL databases offer horizontal scaling while maintaining ACID guarantees and SQL compatibility.",
    sections: [
      {
        title: "The New Generation",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Horizontal scaling like NoSQL",
          "ACID transactions like SQL",
          "Geo-distribution built-in",
          "Familiar SQL interface"
        ],
        icon: "🌐"
      },
      {
        title: "Leading Solutions",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "CockroachDB - PostgreSQL compatible, strong consistency",
          "Google Spanner - The original, unmatched at scale",
          "YugabyteDB - PostgreSQL + Cassandra compatibility",
          "TiDB - MySQL compatible, strong analytical capabilities"
        ],
        icon: "🏆"
      },
      {
        title: "Architectural Trade-offs",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Higher latency per operation",
          "Complex failure modes",
          "Requires 3x replication minimum",
          "Network partition handling"
        ],
        icon: "⚠️"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["CockroachDB", "Google Spanner", "YugabyteDB"],
          alternatives: ["TiDB", "Vitess (MySQL)", "Citus (PostgreSQL)"]
        }
      },
      {
        title: "Implementation Guidance",
        type: "text" as const,
        variant: "info" as const,
        content: "Start with CockroachDB or YugabyteDB for PostgreSQL compatibility. Design your schema to minimize cross-shard transactions. Use batch operations where possible. Implement retry logic for transaction conflicts. Most importantly: test failure scenarios extensively."
      },
      {
        title: "Success Metrics",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "P99 latency under load",
          "Transaction retry rate",
          "Cross-region latency",
          "Failover time (RTO)"
        ],
        icon: "📊"
      }
    ],
    footer: "Distributed SQL is complex but powerful. Make sure you actually need global scale before adopting it."
  },
  
  traditionalSQL: {
    id: "traditionalSQL",
    type: "outcome" as const,
    title: "Traditional Relational Databases",
    description: "Proven, reliable, and well-understood. Sometimes boring is exactly what you need.",
    sections: [
      {
        title: "Why They Still Dominate",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "40+ years of optimization",
          "ACID guarantees",
          "Incredible tooling",
          "Universal SQL knowledge"
        ],
        icon: "🏛️"
      },
      {
        title: "The Big Three",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "PostgreSQL - Open source champion, feature-rich",
          "MySQL - Web application favorite, simple and fast",
          "SQL Server - Enterprise standard, excellent tooling",
          "Oracle - When you need every feature imaginable"
        ],
        icon: "💎"
      },
      {
        title: "Scaling Patterns",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Vertical scaling (bigger hardware)",
          "Read replicas for queries",
          "Partitioning for large tables",
          "Caching layers (Redis)"
        ],
        icon: "📈"
      },
      {
        title: "Modern Enhancements",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "JSON support for flexibility",
          "Full-text search capabilities",
          "Geospatial extensions",
          "Time-series optimizations"
        ],
        icon: "✨"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["PostgreSQL", "MySQL", "SQL Server"],
          alternatives: ["MariaDB", "Oracle", "DB2"]
        }
      },
      {
        title: "Deployment Best Practices",
        type: "text" as const,
        variant: "info" as const,
        content: "Use managed services (RDS, Cloud SQL, Azure SQL) to eliminate operational overhead. They handle backups, updates, and failover automatically. Reserve self-hosting for cases where you need specific configurations or have regulatory requirements."
      }
    ],
    footer: "Traditional doesn't mean outdated. These databases power the majority of applications for good reason."
  },
  
  elasticsearchRecommendation: {
    id: "elasticsearchRecommendation",
    type: "outcome" as const,
    title: "Elasticsearch for Full-Text Search",
    description: "When you need powerful full-text search with complex scoring, faceting, and aggregations, Elasticsearch is the gold standard.",
    sections: [
      {
        title: "Search Superpowers",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Sub-second full-text search",
          "Complex relevance scoring",
          "Faceted search and filtering",
          "Real-time indexing"
        ],
        icon: "🔍"
      },
      {
        title: "Beyond Basic Search",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Geospatial queries and aggregations",
          "Time-series analytics with rollups",
          "Machine learning for anomaly detection",
          "Distributed aggregations at scale",
          "Percolator for reverse search"
        ],
        icon: "🚀"
      },
      {
        title: "Operational Considerations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Memory hungry (needs heap + OS cache)",
          "Complex cluster management",
          "Careful capacity planning required",
          "Not a primary data store"
        ],
        icon: "⚠️"
      },
      {
        title: "Common Architectures",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Primary DB + ES for search",
          "Kafka → Logstash → ES",
          "Application → ES → Kibana",
          "ES + Redis cache layer"
        ],
        icon: "🏗️"
      },
      {
        title: "Recommended Solutions",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Elasticsearch", "Elastic Cloud"],
          alternatives: ["OpenSearch", "Algolia (SaaS)", "Typesense", "Meilisearch"]
        }
      },
      {
        title: "Best Practices",
        type: "text" as const,
        variant: "info" as const,
        content: "Use Elasticsearch as a secondary index, not primary storage. Keep your source of truth in a traditional database. Index only what you need to search. Use index lifecycle management to control costs. Consider managed services like Elastic Cloud to reduce operational burden."
      }
    ],
    footer: "Elasticsearch is powerful but complex. Start with a managed service and grow into self-hosting if needed."
  },
  
  clickhouseRecommendation: {
    id: "clickhouseRecommendation",
    type: "outcome" as const,
    title: "ClickHouse for Analytics",
    description: "When you need blazing-fast analytical queries on massive datasets, ClickHouse's columnar architecture delivers unmatched performance.",
    sections: [
      {
        title: "Analytics Performance",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Processes billions of rows/sec",
          "Columnar storage = 10x compression",
          "Vectorized query execution",
          "Real-time data ingestion"
        ],
        icon: "⚡"
      },
      {
        title: "Killer Features",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "SQL interface (mostly standard)",
          "Materialized views for pre-aggregation",
          "Distributed queries across clusters",
          "Excellent compression algorithms",
          "Time-series optimizations built-in"
        ],
        icon: "💎"
      },
      {
        title: "Typical Use Cases",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Web analytics (like Google Analytics)",
          "Time-series metrics storage",
          "Log analysis at scale",
          "Real-time dashboards"
        ],
        icon: "📊"
      },
      {
        title: "Operational Reality",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Not ACID compliant",
          "Eventually consistent replication",
          "Complex cluster management",
          "Limited UPDATE/DELETE support"
        ],
        icon: "⚠️"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["ClickHouse"],
          alternatives: ["Apache Druid", "Amazon Redshift", "Snowflake", "BigQuery"]
        }
      },
      {
        title: "Architecture Tip",
        type: "text" as const,
        variant: "info" as const,
        content: "ClickHouse excels at append-only workloads. Design your schema for write-once, query-many patterns. Use materialized views to pre-calculate common aggregations. Partition by date for efficient data retention. Remember: it's an OLAP database, not OLTP."
      },
      {
        title: "Performance Numbers",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Query billions of rows in seconds",
          "Ingest millions of rows/second",
          "10-100x compression ratios",
          "Linear scaling with nodes"
        ],
        icon: "🚀"
      }
    ],
    footer: "ClickHouse: When every millisecond counts in your analytics queries. Not for transactional workloads."
  },
  
  clickhouseAnalyticsRecommendation: {
    id: "clickhouseAnalyticsRecommendation",
    type: "outcome" as const,
    title: "Real-Time Analytics with ClickHouse",
    description: "For real-time analytics on streaming data, ClickHouse provides the perfect balance of ingestion speed and query performance.",
    sections: [
      {
        title: "Real-Time Capabilities",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Sub-second data availability",
          "Streaming ingestion support",
          "Live query updates",
          "Minimal ingestion latency"
        ],
        icon: "⚡"
      },
      {
        title: "Integration Patterns",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Kafka → ClickHouse for event streams",
          "Direct HTTP inserts for simplicity",
          "Batch loading from S3/GCS",
          "CDC from transactional databases"
        ],
        icon: "🔄"
      },
      {
        title: "Recommended Databases",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["ClickHouse"],
          alternatives: ["Apache Pinot", "Apache Druid", "Rockset", "Tinybird"]
        }
      },
      {
        title: "Success Story",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Cloudflare uses ClickHouse to process 30 million HTTP requests per second, providing real-time analytics to customers. They ingest over 15 million rows per second while simultaneously serving complex analytical queries with sub-second response times."
      }
    ],
    footer: "For real-time analytics at scale, ClickHouse's architecture is purpose-built for the challenge."
  },
  
  prometheusRecommendation: {
    id: "prometheusRecommendation",
    type: "outcome" as const,
    title: "Prometheus for Metrics and Monitoring",
    description: "The de-facto standard for metrics collection and monitoring in cloud-native environments. Purpose-built for observability.",
    sections: [
      {
        title: "Why Prometheus Dominates",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Pull-based model scales",
          "Powerful query language",
          "Native Kubernetes support",
          "Huge ecosystem"
        ],
        icon: "📊"
      },
      {
        title: "Ecosystem Strengths",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Grafana for visualization",
          "AlertManager for notifications",
          "Hundreds of exporters available",
          "PromQL for complex queries",
          "Service discovery built-in"
        ],
        icon: "🎯"
      },
      {
        title: "Scaling Strategies",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Federation for multiple clusters",
          "Remote storage for long-term",
          "Thanos for global view",
          "Cortex for multi-tenancy"
        ],
        icon: "📈"
      },
      {
        title: "Limitations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Not for event logging",
          "15-day default retention",
          "Single-node bottleneck",
          "Cardinality limits"
        ],
        icon: "⚠️"
      },
      {
        title: "Recommended Stack",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["Prometheus", "Grafana", "AlertManager"],
          alternatives: ["VictoriaMetrics", "Thanos", "Cortex", "Mimir"]
        }
      },
      {
        title: "Best Practices",
        type: "text" as const,
        variant: "info" as const,
        content: "Use Prometheus for metrics only, not logs or events. Keep cardinality under control by avoiding high-variance labels. Use recording rules for expensive queries. For long-term storage, use remote write to object storage. Consider VictoriaMetrics for better resource efficiency."
      }
    ],
    footer: "Prometheus + Grafana is the industry standard for metrics. Start here for observability."
  },
  
  opensearchRecommendation: {
    id: "opensearchRecommendation",
    type: "outcome" as const,
    title: "OpenSearch for Log Analysis",
    description: "The open-source fork of Elasticsearch, perfect for log analysis, security analytics, and observability use cases.",
    sections: [
      {
        title: "OpenSearch Advantages",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "True open source (Apache 2.0)",
          "Drop-in Elasticsearch replacement",
          "Security features included free",
          "AWS-backed development"
        ],
        icon: "🔓"
      },
      {
        title: "Log Analysis Features",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Anomaly detection for logs",
          "Trace analytics for distributed systems",
          "Security analytics with SIEM features",
          "PPL (Piped Processing Language) for analysis",
          "Observability plugins included"
        ],
        icon: "📋"
      },
      {
        title: "Recommended Solutions",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["OpenSearch", "Amazon OpenSearch Service"],
          alternatives: ["Elasticsearch", "Splunk", "Datadog Logs", "Grafana Loki"]
        }
      },
      {
        title: "Migration Path",
        type: "text" as const,
        variant: "info" as const,
        content: "OpenSearch maintains compatibility with Elasticsearch 7.10 APIs. Most applications can switch by changing the endpoint URL. The query DSL, index APIs, and ingestion methods remain the same. Main differences are in advanced features and security configuration."
      }
    ],
    footer: "For log analysis and observability, OpenSearch provides enterprise features without license concerns."
  },

  foundationdbRecommendation: {
    id: "foundationdbRecommendation",
    type: "outcome" as const,
    title: "FoundationDB - The Database Construction Kit",
    description: "FoundationDB is Apple's distributed key-value store that provides ACID transactions at scale. It's the foundation layer for building other databases.",
    sections: [
      {
        title: "Why FoundationDB is Unique",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "ACID transactions at any scale",
          "Ordered key-value API",
          "Multi-model via layers",
          "Deterministic testing"
        ],
        icon: "🏗️"
      },
      {
        title: "Core Capabilities",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Serializable isolation - Strongest consistency guarantee",
          "Multi-key transactions - ACID across any keys",
          "Automatic sharding - Transparent data distribution",
          "Self-healing - Automatic failure recovery",
          "Simulation testing - Deterministic failure testing",
          "Layer concept - Build any data model on top"
        ],
        icon: "✓"
      },
      {
        title: "Who Uses FoundationDB",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Apple - Powers iCloud",
          "Snowflake - Metadata layer",
          "Wavefront - Time-series layer",
          "FoundationDB Record Layer"
        ],
        icon: "🏢"
      },
      {
        title: "When to Use FoundationDB",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Building a custom database or storage system",
          "Need ACID transactions with massive scale",
          "Require strict serializable isolation",
          "Want to build domain-specific data models"
        ],
        icon: "🎯"
      },
      {
        title: "The Layer Concept",
        type: "text" as const,
        variant: "info" as const,
        content: "FoundationDB provides a minimal ordered key-value API. 'Layers' built on top provide higher-level data models: Document Layer (MongoDB compatible), Record Layer (Protocol Buffers), SQL Layer, and more. This separation enables innovation at the data model level while keeping the storage engine rock-solid."
      },
      {
        title: "Production Considerations",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Low-level API requires building abstractions",
          "Limited to 10MB transactions",
          "5-second transaction time limit",
          "Requires careful key design"
        ],
        icon: "⚠️"
      },
      {
        title: "Why Apple Chose FoundationDB",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Apple acquired FoundationDB in 2015 to power iCloud. The deterministic simulation testing was key - it can simulate years of failure scenarios in minutes. This gives Apple confidence in storing billions of users' data. The simple API also allowed them to build exactly what they needed on top."
      }
    ],
    footer: "FoundationDB: When you need to build a database, not just use one. The foundation that powers some of the world's largest systems."
  },

  neo4jRecommendation: {
    id: "neo4jRecommendation",
    type: "outcome" as const,
    title: "Neo4j - The Graph Database Leader",
    description: "Neo4j is the world's leading graph database, purpose-built for connected data and complex relationship queries.",
    sections: [
      {
        title: "Why Neo4j Dominates Graphs",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Native graph storage",
          "Cypher query language",
          "ACID transactions",
          "Graph algorithms library"
        ],
        icon: "🕸️"
      },
      {
        title: "Perfect Use Cases",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Social Networks - Friend relationships and recommendations",
          "Fraud Detection - Complex pattern matching",
          "Knowledge Graphs - Connected information",
          "Recommendation Engines - Collaborative filtering",
          "Network & IT Operations - Dependency mapping",
          "Identity & Access Management - Permission hierarchies"
        ],
        icon: "🎯"
      },
      {
        title: "Key Advantages",
        type: "list" as const,
        variant: "info" as const,
        content: [
          "Index-free adjacency - O(1) relationship traversal",
          "Cypher - Intuitive graph query language",
          "Graph algorithms - PageRank, community detection, etc.",
          "Visualization tools - See your data connections",
          "ACID compliance - Full transaction support"
        ],
        icon: "✓"
      },
      {
        title: "When NOT to Use Neo4j",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Simple tabular data without relationships",
          "High-volume time-series data",
          "Large binary object storage",
          "When eventual consistency is acceptable"
        ],
        icon: "⚠️"
      },
      {
        title: "Who's Using Neo4j",
        type: "pills" as const,
        variant: "neutral" as const,
        content: {
          primary: ["eBay", "Walmart", "LinkedIn", "Airbnb"],
          alternatives: ["NASA", "UBS", "Cisco", "HP"]
        }
      },
      {
        title: "Cypher Example",
        type: "text" as const,
        variant: "info" as const,
        content: "MATCH (user:User)-[:FRIEND]->(friend)-[:LIKES]->(restaurant) WHERE user.name = 'Alice' AND NOT (user)-[:VISITED]->(restaurant) RETURN restaurant.name, COUNT(friend) AS recommendations ORDER BY recommendations DESC"
      },
      {
        title: "Scaling Considerations",
        type: "text" as const,
        variant: "warning" as const,
        content: "Neo4j scales vertically well but horizontal scaling requires Neo4j Enterprise with causal clustering. For massive graphs (billions of edges), consider graph processing frameworks like Apache Spark GraphX or Pregel for batch analytics alongside Neo4j for real-time queries."
      }
    ],
    footer: "Neo4j: When your queries start with 'find all friends of friends who...', you need a graph database."
  }
};