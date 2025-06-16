import { TreeNode } from "@/components/DecisionTree";

export const engineeringDecisionTreeData: Record<string, TreeNode> = {
  start: {
    id: "start",
    type: "decision" as const,
    question: "What's your primary constraint?",
    description: "Every engineering decision starts with understanding your most pressing limitation. This will guide all subsequent trade-offs.",
    options: [
      { label: "Time to Market", nextId: "timeConstraint", impact: "Speed is critical" },
      { label: "System Performance", nextId: "performanceConstraint", impact: "Scale matters most" },
      { label: "Team Resources", nextId: "teamConstraint", impact: "People are the bottleneck" },
      { label: "Technical Debt", nextId: "debtConstraint", impact: "Maintenance is drowning us" }
    ]
  },
  
  timeConstraint: {
    id: "timeConstraint",
    type: "decision" as const,
    question: "How critical is the deadline?",
    description: "Understanding the business impact helps calibrate the technical trade-offs. Missing deadlines has different consequences in different contexts.",
    options: [
      { label: "Business-critical (competitor threat, market window)", nextId: "criticalDeadline", impact: "Company survival may depend on it" },
      { label: "Important but flexible (internal milestone)", nextId: "flexibleDeadline", impact: "Some negotiation room exists" },
      { label: "Experimental (testing an idea)", nextId: "experimentalDeadline", impact: "Learning is the primary goal" }
    ]
  },
  
  performanceConstraint: {
    id: "performanceConstraint",
    type: "decision" as const,
    question: "What's your current scale?",
    description: "The right solution at 1x scale is often wrong at 100x scale. Understanding where you are helps avoid both under-engineering and over-engineering.",
    options: [
      { label: "Startup (<1K users)", nextId: "startupScale", impact: "Focus on product-market fit" },
      { label: "Growing (1K-100K users)", nextId: "growthScale", impact: "Scaling challenges emerging" },
      { label: "Scale (100K+ users)", nextId: "atScale", impact: "Every decision has massive impact" }
    ]
  },
  
  teamConstraint: {
    id: "teamConstraint",
    type: "decision" as const,
    question: "What's your team's biggest challenge?",
    description: "People problems often manifest as technical problems. Understanding the root cause leads to better solutions.",
    options: [
      { label: "Too few engineers", nextId: "fewEngineers", impact: "Need maximum leverage" },
      { label: "Skill gaps", nextId: "skillGaps", impact: "Missing key expertise" },
      { label: "Communication overhead", nextId: "communicationOverhead", impact: "Coordination is expensive" }
    ]
  },
  
  debtConstraint: {
    id: "debtConstraint",
    type: "decision" as const,
    question: "What type of debt is slowing you down?",
    description: "Not all technical debt is created equal. Different types require different remediation strategies.",
    options: [
      { label: "Architectural (wrong abstractions)", nextId: "architecturalDebt", impact: "Fundamental design issues" },
      { label: "Code quality (bugs, lack of tests)", nextId: "qualityDebt", impact: "Death by a thousand cuts" },
      { label: "Dependency rot (outdated libraries)", nextId: "dependencyDebt", impact: "Security and compatibility risks" }
    ]
  },
  
  // Enhanced Outcomes with all features
  criticalDeadline: {
    id: "criticalDeadline",
    type: "outcome" as const,
    title: "Ship Fast, Plan to Refactor",
    description: "When facing a critical deadline, controlled technical debt is often the right choice. The key is making it truly controlled.",
    sections: [
      {
        title: "Immediate Actions",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Cut scope ruthlessly - ship only MVP",
          "Use proven, boring technology",
          "Skip nice-to-haves like animations",
          "Hardcode configuration values"
        ],
        icon: "⚡"
      },
      {
        title: "What You'll Gain",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Capture market opportunity before competitors",
          "Get real user feedback to validate assumptions",
          "Maintain business momentum and morale",
          "Learn what actually matters to users"
        ],
        icon: "✓"
      },
      {
        title: "What You'll Pay For Later",
        type: "list" as const,
        variant: "error" as const,
        content: [
          "3-5x more time to add features later",
          "Increased bug rate (expect 2-3x normal)",
          "Team morale hit from working in messy code",
          "Potential security vulnerabilities from shortcuts"
        ],
        icon: "✗"
      },
      {
        title: "Critical Success Factors",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Document all shortcuts taken",
          "Create refactoring tickets immediately",
          "Set a hard deadline for paying down debt",
          "Communicate transparently with the team"
        ],
        icon: "⚠️"
      },
      {
        title: "Recommended Approach",
        type: "text" as const,
        variant: "info" as const,
        content: "Take the debt, but time-box it. Create refactoring tickets immediately and schedule them for the next sprint. Be transparent with the team about why you're making this choice. Most importantly, actually follow through on the refactoring—broken promises destroy trust."
      },
      {
        title: "Real-World Example",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Facebook's famous 'Move Fast and Break Things' era (2004-2014) helped them dominate social networking by shipping features faster than competitors. However, by 2014, the accumulated debt was so severe that they had to change their motto and spend years on infrastructure improvements. The lesson: the strategy worked, but only because they eventually paid the price."
      }
    ],
    footer: "Remember: Technical debt is like financial debt—it can be a powerful tool when used wisely, but it must be repaid with interest."
  },
  
  flexibleDeadline: {
    id: "flexibleDeadline",
    type: "outcome" as const,
    title: "Invest in the Right Foundation",
    description: "With some deadline flexibility, you can balance speed with sustainability. This is the sweet spot for long-term success.",
    sections: [
      {
        title: "Where to Invest Time",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Core domain model and APIs",
          "Automated testing for critical paths",
          "Basic monitoring and observability",
          "Documentation for complex decisions"
        ],
        icon: "🎯"
      },
      {
        title: "Benefits",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "50% faster feature development after initial investment",
          "90% fewer production incidents",
          "New team members productive in days, not weeks",
          "Confident refactoring when requirements change"
        ],
        icon: "✓"
      },
      {
        title: "Trade-offs",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "20-30% slower initial delivery",
          "Risk of over-engineering if not careful",
          "Opportunity cost of delayed user feedback",
          "Requires discipline to not gold-plate"
        ],
        icon: "⚠️"
      },
      {
        title: "Strategic Recommendation",
        type: "text" as const,
        variant: "info" as const,
        content: "Negotiate for 20-30% more time to do it right. Focus on the core architecture and skimp on nice-to-haves. Write tests for the happy path and critical edge cases, but not every possible scenario. This small investment typically pays for itself within 2-3 months."
      },
      {
        title: "Success Story",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Stripe's API design philosophy: They spent extra time upfront designing clean, extensible APIs with excellent documentation. This enabled them to add new features rapidly without breaking existing integrations, becoming the developer-favorite payment platform despite entering a crowded market."
      },
      {
        title: "Key Metrics to Track",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Lead time for changes", "Deployment frequency", "Mean time to recovery"],
          alternatives: ["Code coverage", "Technical debt ratio"]
        }
      }
    ],
    footer: "The best code is code that's easy to change. Invest in changeability, not perfection."
  },
  
  experimentalDeadline: {
    id: "experimentalDeadline",
    type: "outcome" as const,
    title: "Prototype and Learn",
    description: "For experiments, optimize for learning speed over code quality. The goal is to validate or invalidate hypotheses as quickly as possible.",
    sections: [
      {
        title: "Rapid Prototyping Tactics",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Use no-code tools where possible",
          "Leverage existing SaaS for non-core features",
          "Skip automated tests entirely",
          "Use SQLite or flat files for data"
        ],
        icon: "🚀"
      },
      {
        title: "What You're Optimizing For",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Time to first user feedback (aim for days, not weeks)",
          "Minimal resource investment (both time and money)",
          "Maximum learning per dollar spent",
          "Freedom to pivot or abandon without sunk cost fallacy"
        ],
        icon: "🎯"
      },
      {
        title: "Acceptable Trade-offs",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Code is completely throwaway",
          "Can't scale beyond ~100 users",
          "Security is basic at best",
          "No automated testing or CI/CD"
        ],
        icon: "⚠️"
      },
      {
        title: "Critical Rules",
        type: "grid" as const,
        variant: "error" as const,
        content: [
          "Set a hard experiment deadline",
          "Define success metrics upfront",
          "Never let prototypes become production",
          "Document what you learned"
        ],
        icon: "🚨"
      },
      {
        title: "Implementation Strategy",
        type: "text" as const,
        variant: "info" as const,
        content: "Use high-level languages and frameworks. Skip tests. Hard-code values. Use managed services for everything. But SET A HARD DEADLINE for the experiment (usually 2-4 weeks) and stick to it. If successful, rebuild properly; if not, throw it away and move on."
      },
      {
        title: "Classic Example",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Groupon started as a simple WordPress blog called 'The Point' with completely manual processes. They validated the group-buying business model before building any real infrastructure. This MVP approach let them test and pivot quickly, leading to one of the fastest-growing companies in history."
      },
      {
        title: "Tools for Rapid Experimentation",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Vercel/Netlify", "Supabase/Firebase", "Retool", "Zapier/Make"],
          alternatives: ["WordPress", "Bubble.io", "Airtable"]
        }
      }
    ],
    footer: "Kill your prototypes before they kill your productivity. The hardest part is having the discipline to throw away working code."
  },
  
  startupScale: {
    id: "startupScale",
    type: "outcome" as const,
    title: "Monolith First, Always",
    description: "At startup scale, simplicity beats sophistication every time. Don't solve problems you don't have yet.",
    sections: [
      {
        title: "Why Monoliths Win Early",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "10x faster to develop new features",
          "Trivial debugging with single process",
          "One codebase = one mental model",
          "Transaction consistency is free"
        ],
        icon: "🏆"
      },
      {
        title: "Benefits You'll Experience",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Deploy entire app in under 5 minutes",
          "Debug with simple print statements",
          "Refactor across boundaries easily",
          "Single database = consistent data"
        ],
        icon: "✓"
      },
      {
        title: "Future Challenges to Prepare For",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Will hit scaling ceiling around 10K users",
          "Team coupling as codebase grows",
          "Deployment becomes riskier with size",
          "Database becomes bottleneck"
        ],
        icon: "⚠️"
      },
      {
        title: "Monolith Best Practices",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Use clear module boundaries",
          "Separate business logic from framework",
          "Design APIs as if they were remote",
          "Keep the option to extract services later"
        ],
        icon: "📋"
      },
      {
        title: "Strategic Guidance",
        type: "text" as const,
        variant: "info" as const,
        content: "Build a well-structured monolith with clear module boundaries. Use namespaces/packages to separate concerns. Design internal APIs as if they might become service boundaries someday. You can extract services later when you actually need them—and you'll know exactly where to cut."
      },
      {
        title: "Monolith Success Story",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Shopify ran their entire platform on a Ruby on Rails monolith until well past $1B in GMV. They only started extracting services when specific scaling bottlenecks emerged. Even today, their core commerce platform remains largely monolithic. The lesson: monoliths can scale much further than most people think."
      },
      {
        title: "Tech Stack Recommendations",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Rails + PostgreSQL", "Django + PostgreSQL", "Laravel + MySQL"],
          alternatives: ["Next.js + Prisma", "Spring Boot", ".NET Core"]
        }
      }
    ],
    footer: "Start with a monolith. You'll know when it's time to break it up—the pain will be obvious and specific."
  },
  
  growthScale: {
    id: "growthScale",
    type: "outcome" as const,
    title: "Selective Service Extraction",
    description: "At growth stage, extract only the services that provide clear benefits. Most of your app should still be monolithic.",
    sections: [
      {
        title: "When to Extract a Service",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Different scaling requirements",
          "Different team ownership",
          "Different deployment cadence",
          "Different technology needs"
        ],
        icon: "🎯"
      },
      {
        title: "First Services to Extract",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Authentication/User service (security boundary)",
          "Email/Notification service (different SLA)",
          "Payment processing (compliance isolation)",
          "File upload/processing (resource intensive)"
        ],
        icon: "1️⃣"
      },
      {
        title: "Extraction Complexities",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Distributed transactions become difficult",
          "Need service discovery and routing",
          "Debugging across services is harder",
          "Data consistency requires careful design"
        ],
        icon: "⚠️"
      },
      {
        title: "Critical Infrastructure Needs",
        type: "grid" as const,
        variant: "error" as const,
        content: [
          "Centralized logging (ELK/Datadog)",
          "Distributed tracing (Jaeger/X-Ray)",
          "Service mesh (Istio/Linkerd)",
          "API gateway for routing"
        ],
        icon: "🛠️"
      },
      {
        title: "Migration Strategy",
        type: "text" as const,
        variant: "info" as const,
        content: "Extract services along team boundaries, not technical ones. Start with the service that's blocking everyone else. Use the Strangler Fig pattern: build the new service alongside the monolith, gradually migrate functionality, then remove the old code. Always maintain backwards compatibility during migration."
      },
      {
        title: "Real-World Example",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Uber's marketplace split: They separated rider and driver systems when team coordination became the bottleneck, not for technical reasons. The split allowed teams to work independently and deploy at different cadences. Key insight: Conway's Law is real—optimize for team productivity, not theoretical purity."
      },
      {
        title: "Service Boundaries That Work",
        type: "pills" as const,
        variant: "success" as const,
        content: {
          primary: ["User/Auth", "Payments", "Notifications", "Analytics"],
          alternatives: ["Search", "Recommendations", "Media processing"]
        }
      }
    ],
    footer: "Extract services to solve specific problems, not because it's 'modern.' Every service adds operational overhead."
  },
  
  atScale: {
    id: "atScale",
    type: "outcome" as const,
    title: "Full Service Architecture",
    description: "At scale, organizational flexibility becomes more important than technical simplicity. You're optimizing for hundreds of engineers working in parallel.",
    sections: [
      {
        title: "Why Services Become Necessary",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "100+ engineers can't coordinate",
          "Different parts need different SLAs",
          "Blast radius must be contained",
          "Technology diversity is required"
        ],
        icon: "🏢"
      },
      {
        title: "Organizational Benefits",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Teams deploy independently (100+ deploys/day)",
          "Failures isolated to single services",
          "Each team owns their tech stack",
          "Horizontal scaling is unlimited"
        ],
        icon: "✓"
      },
      {
        title: "Operational Complexity",
        type: "list" as const,
        variant: "error" as const,
        content: [
          "Need 24/7 ops team for infrastructure",
          "Debugging requires distributed tracing",
          "Data consistency is extremely hard",
          "Testing requires sophisticated mocking"
        ],
        icon: "⚠️"
      },
      {
        title: "Required Platform Capabilities",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Service mesh for communication",
          "Container orchestration (K8s)",
          "Observability platform",
          "CI/CD for 100s of services",
          "Chaos engineering tools",
          "Cost allocation and monitoring"
        ],
        icon: "🛠️"
      },
      {
        title: "Platform Investment Required",
        type: "text" as const,
        variant: "info" as const,
        content: "Invest heavily in platform tooling—you need world-class observability, deployment, and service mesh capabilities. Expect to dedicate 20-30% of engineering to platform teams. Without this investment, microservices become a productivity disaster rather than an enabler."
      },
      {
        title: "Service Architecture at Scale",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Netflix's full microservices architecture: They invested millions in tooling (Hystrix for circuit breaking, Eureka for service discovery, Zuul for routing, etc.) to make it manageable. Key insight: at their scale, the cost of this infrastructure is worth it for developer productivity. Below 100 engineers, it's usually not."
      },
      {
        title: "Essential Platform Tools",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Kubernetes", "Istio/Linkerd", "Prometheus + Grafana", "ELK Stack"],
          alternatives: ["Consul", "Envoy", "Jaeger", "ArgoCD"]
        }
      }
    ],
    footer: "Microservices are an organizational solution, not a technical one. Use them when coordination costs exceed operational costs."
  },
  
  fewEngineers: {
    id: "fewEngineers",
    type: "outcome" as const,
    title: "Maximize Leverage",
    description: "With limited engineers, choose boring technology and buy over build. Your scarcest resource is engineering time.",
    sections: [
      {
        title: "High-Leverage Decisions",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "Use managed services for everything",
          "Choose popular, stable frameworks",
          "Buy SaaS for non-core features",
          "Hire specialists for one-off tasks"
        ],
        icon: "🚀"
      },
      {
        title: "What You Gain",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "10x higher output per engineer",
          "Near-zero operational overhead",
          "Focus entirely on core business logic",
          "Predictable costs and scaling"
        ],
        icon: "✓"
      },
      {
        title: "Trade-offs to Accept",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Higher monetary costs (3-5x self-hosted)",
          "Less customization flexibility",
          "Vendor lock-in risks",
          "Limited debugging capabilities"
        ],
        icon: "💰"
      },
      {
        title: "Recommended Stack",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Vercel/Netlify", "Supabase/Firebase", "Stripe", "SendGrid"],
          alternatives: ["Railway", "PlanetScale", "Clerk", "Resend"]
        }
      },
      {
        title: "Strategic Approach",
        type: "text" as const,
        variant: "info" as const,
        content: "Use managed services (RDS over self-hosted Postgres, Vercel over self-managed K8s). Choose popular frameworks with large communities. Outsource non-core functionality (use Stripe for payments, Auth0 for authentication). Your engineers should write business logic, not infrastructure code."
      },
      {
        title: "Efficiency Example",
        type: "text" as const,
        variant: "neutral" as const,
        content: "WhatsApp served 900M users with 50 engineers by using Erlang (proven telecom tech) and keeping the product extremely focused. They used FreeBSD instead of trendy technologies, bought rather than built whenever possible, and said no to features that would require linear scaling of engineers."
      },
      {
        title: "Cost-Benefit Analysis",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Managed DB: $500/mo saves 20 hrs/mo",
          "Auth SaaS: $300/mo saves 200 hrs upfront",
          "Monitoring SaaS: $200/mo saves 10 hrs/mo",
          "Engineer time: $150/hr fully loaded"
        ],
        icon: "💵"
      }
    ],
    footer: "With few engineers, boring technology and managed services are your superpowers. Complexity is your enemy."
  },
  
  skillGaps: {
    id: "skillGaps",
    type: "outcome" as const,
    title: "Upskill or Simplify",
    description: "Either invest in training or choose technology that matches current skills. Don't let skill gaps drive architectural decisions.",
    sections: [
      {
        title: "Critical Skill Assessment",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "What skills are core to your business?",
          "What can you outsource or avoid?",
          "Where would training pay dividends?",
          "What skills are readily available to hire?"
        ],
        icon: "🎯"
      },
      {
        title: "When to Invest in Training",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Core business differentiators",
          "Skills that compound over time",
          "Technologies with long-term staying power",
          "Areas where hiring is extremely difficult"
        ],
        icon: "📚"
      },
      {
        title: "When to Simplify Instead",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Peripheral technical needs",
          "Rapidly evolving technologies",
          "One-time or rare requirements",
          "Areas with abundant SaaS solutions"
        ],
        icon: "🔧"
      },
      {
        title: "Training Investment Strategy",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Dedicate 20% time for learning",
          "Pair programming with experts",
          "Conference attendance + workshop",
          "Internal tech talks and demos"
        ],
        icon: "🎓"
      },
      {
        title: "Decision Framework",
        type: "text" as const,
        variant: "info" as const,
        content: "For core competencies, invest in training—it pays compound interest. For peripheral needs, choose simpler solutions or hire specialists. Don't build a Kubernetes cluster because it's cool if your team doesn't understand distributed systems. Don't use NoCode if your differentiator is technical excellence."
      },
      {
        title: "Case Study: Success and Failure",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Airbnb's React Native journey: They invested heavily in training their web engineers on React Native to share code between platforms. Initially promising, but the skill gap proved too large—debugging required deep iOS/Android knowledge their web engineers lacked. They eventually abandoned it. Lesson: some skill gaps are too fundamental to bridge quickly."
      },
      {
        title: "Skill Investment Priorities",
        type: "pills" as const,
        variant: "success" as const,
        content: {
          primary: ["Cloud/AWS", "Observability", "Security basics", "Data modeling"],
          alternatives: ["Kubernetes", "ML/AI", "Blockchain", "Mobile development"]
        }
      }
    ],
    footer: "Skill gaps are temporary, but architectural decisions are long-lived. Don't make permanent choices based on temporary constraints."
  },
  
  communicationOverhead: {
    id: "communicationOverhead",
    type: "outcome" as const,
    title: "Conway's Law in Action",
    description: "Your architecture will mirror your organization. Design accordingly, or reorganize to match your desired architecture.",
    sections: [
      {
        title: "Communication Bottlenecks",
        type: "grid" as const,
        variant: "error" as const,
        content: [
          "Too many stakeholders in decisions",
          "Cross-team dependencies for features",
          "Unclear ownership boundaries",
          "Meetings eating up coding time"
        ],
        icon: "🚧"
      },
      {
        title: "Organizational Solutions",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Restructure teams around business capabilities",
          "Give teams full ownership of their services",
          "Minimize cross-team dependencies",
          "Clear interfaces between teams"
        ],
        icon: "✓"
      },
      {
        title: "Technical Enablers",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "API contracts between teams",
          "Separate deployment pipelines",
          "Team-specific tech choices",
          "Independent databases"
        ],
        icon: "🛠️"
      },
      {
        title: "Warning Signs",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Features require 3+ teams to coordinate",
          "Deployments need multiple team approvals",
          "Shared codebases with unclear ownership",
          "Architecture meetings with 15+ people"
        ],
        icon: "⚠️"
      },
      {
        title: "Restructuring Strategy",
        type: "text" as const,
        variant: "info" as const,
        content: "Restructure teams around business capabilities, not technical layers. A 'User Team' that owns database, API, and frontend is better than separate Database, Backend, and Frontend teams. Give teams full ownership of their services, including deployment and operations. This reduces coordination needs dramatically."
      },
      {
        title: "Transformation Example",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Amazon's two-pizza teams: They restructured from functional teams (DB team, frontend team) to service teams (Checkout team, Search team). Each team got complete ownership of their service. The result: they went from monthly releases requiring massive coordination to thousands of daily deployments. Architecture followed organization."
      },
      {
        title: "Team Topology Patterns",
        type: "pills" as const,
        variant: "success" as const,
        content: {
          primary: ["Stream-aligned teams", "Platform teams", "Enabling teams"],
          alternatives: ["Complicated subsystem teams", "Feature teams"]
        }
      }
    ],
    footer: "You can't fight Conway's Law. Either design your architecture to match your organization, or change your organization to enable your desired architecture."
  },
  
  architecturalDebt: {
    id: "architecturalDebt",
    type: "outcome" as const,
    title: "Incremental Migration",
    description: "Big bang rewrites fail. Always. Migrate incrementally using proven patterns like Strangler Fig.",
    sections: [
      {
        title: "Why Big Rewrites Fail",
        type: "grid" as const,
        variant: "error" as const,
        content: [
          "Requirements change during rewrite",
          "Hidden complexity emerges late",
          "Business can't wait 12+ months",
          "Team morale crashes halfway"
        ],
        icon: "💥"
      },
      {
        title: "Strangler Fig Pattern Steps",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "1. Build new functionality in new architecture",
          "2. Route traffic gradually to new system",
          "3. Migrate old features piece by piece",
          "4. Keep both systems running in parallel",
          "5. Sunset old system only when fully migrated"
        ],
        icon: "🌿"
      },
      {
        title: "Migration Challenges",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Maintaining two systems temporarily",
          "Data synchronization complexity",
          "Feature parity pressure",
          "Rollback strategy complexity"
        ],
        icon: "⚠️"
      },
      {
        title: "Success Factors",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Clear migration boundaries",
          "Automated data sync",
          "Feature flags for gradual rollout",
          "Excellent monitoring"
        ],
        icon: "✅"
      },
      {
        title: "Migration Strategy",
        type: "text" as const,
        variant: "info" as const,
        content: "Start with new features in the new architecture—don't migrate existing ones first. Use API gateways to route traffic. Implement bidirectional sync for data. Migrate read paths before write paths. Always maintain the ability to roll back. Celebrate small wins to maintain morale."
      },
      {
        title: "Success Story",
        type: "text" as const,
        variant: "neutral" as const,
        content: "LinkedIn's migration from Rails to Node.js took 2 years but maintained 99.9% uptime throughout. They used the Strangler Fig pattern, migrating one page at a time. Key insight: they started with low-traffic pages to learn, then tackled critical paths. The gradual approach let them learn and adjust without betting the company."
      },
      {
        title: "Migration Patterns",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Strangler Fig", "Branch by Abstraction", "Parallel Run"],
          alternatives: ["Blue-Green", "Canary", "Dark Launch"]
        }
      }
    ],
    footer: "The only thing worse than living with architectural debt is a failed rewrite. Migrate incrementally or live with it."
  },
  
  qualityDebt: {
    id: "qualityDebt",
    type: "outcome" as const,
    title: "Stop the Bleeding First",
    description: "Before fixing old bugs, prevent new ones. Quality is a ratchet—always improving, never declining.",
    sections: [
      {
        title: "Quality Ratchet Implementation",
        type: "grid" as const,
        variant: "success" as const,
        content: [
          "All new code requires tests",
          "No commits without code review",
          "Boy Scout Rule: leave it better",
          "Fix bugs in touched code"
        ],
        icon: "🔧"
      },
      {
        title: "Immediate Improvements",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "50% fewer bugs in new features",
          "Team confidence increases immediately",
          "Knowledge sharing through reviews",
          "Gradual improvement in old code"
        ],
        icon: "📈"
      },
      {
        title: "Cultural Changes Required",
        type: "list" as const,
        variant: "warning" as const,
        content: [
          "Slower initial feature delivery",
          "Pushback from deadline pressure",
          "Need management buy-in",
          "Requires consistent enforcement"
        ],
        icon: "🔄"
      },
      {
        title: "Quality Metrics to Track",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Defect escape rate",
          "Mean time to resolution",
          "Code coverage trend",
          "Review coverage %"
        ],
        icon: "📊"
      },
      {
        title: "Implementation Plan",
        type: "text" as const,
        variant: "info" as const,
        content: "Implement CI/CD with quality gates. Require code review for all changes. Set test coverage requirements for new code (start at 60%, increase over time). Use linters and formatters to eliminate style debates. Fix old bugs opportunistically when touching related code. Most importantly: never compromise on new code quality to fix old code problems."
      },
      {
        title: "Transformation Example",
        type: "text" as const,
        variant: "neutral" as const,
        content: "Microsoft's Windows Vista to Windows 7 transformation: After Vista's quality disaster, they instituted strict quality gates, automated testing, and code review requirements. Development initially slowed by 40%, but within 6 months, bug rates dropped by 75%. Windows 7 became one of their most stable releases. The lesson: quality processes pay for themselves quickly."
      },
      {
        title: "Quality Tools & Practices",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["GitHub Actions CI", "Codecov", "ESLint/Prettier", "PR Reviews"],
          alternatives: ["SonarQube", "Cypress", "Dependabot", "Error tracking"]
        }
      }
    ],
    footer: "You can't fix all quality issues at once. But you can stop creating new ones immediately."
  },
  
  dependencyDebt: {
    id: "dependencyDebt",
    type: "outcome" as const,
    title: "Systematic Dependency Management",
    description: "Outdated dependencies are ticking time bombs. Develop a systematic approach to keeping them current.",
    sections: [
      {
        title: "Dependency Risks",
        type: "grid" as const,
        variant: "error" as const,
        content: [
          "Security vulnerabilities (CVEs)",
          "Breaking changes accumulate",
          "Performance improvements missed",
          "Community support ends"
        ],
        icon: "🚨"
      },
      {
        title: "Update Strategy",
        type: "list" as const,
        variant: "success" as const,
        content: [
          "Automated minor/patch updates weekly",
          "Manual major updates monthly",
          "Security updates within 48 hours",
          "Framework updates quarterly"
        ],
        icon: "🔄"
      },
      {
        title: "Automation Tools",
        type: "pills" as const,
        variant: "info" as const,
        content: {
          primary: ["Dependabot", "Renovate", "Snyk", "npm audit"],
          alternatives: ["OWASP Dependency Check", "WhiteSource", "Libraries.io"]
        }
      },
      {
        title: "Update Process",
        type: "grid" as const,
        variant: "info" as const,
        content: [
          "Automated PR creation",
          "CI runs full test suite",
          "Staged rollout to production",
          "Quick rollback capability"
        ],
        icon: "⚙️"
      },
      {
        title: "Management Approach",
        type: "text" as const,
        variant: "info" as const,
        content: "Automate dependency updates with tools like Dependabot. Have a monthly 'dependency day' where the team handles breaking changes together. Create a security response plan for critical vulnerabilities. Track technical debt in your issue tracker. Most importantly: update regularly to avoid painful big-bang updates."
      },
      {
        title: "Automation Success",
        type: "text" as const,
        variant: "neutral" as const,
        content: "GitHub's automated security updates: They use their own Dependabot to keep thousands of repositories updated. By automating minor updates and quickly addressing security issues, they've reduced security incidents by 90% and spend 75% less time on dependency management. The key: making updates routine rather than heroic."
      },
      {
        title: "Dependency Health Metrics",
        type: "grid" as const,
        variant: "warning" as const,
        content: [
          "Average dependency age",
          "Known vulnerabilities count",
          "Update lag time",
          "Breaking change frequency"
        ],
        icon: "📊"
      }
    ],
    footer: "Dependencies age like milk, not wine. Update regularly or face exponentially growing pain."
  }
};