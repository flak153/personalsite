export const BLOG_CATEGORIES = {
  SOFTWARE_ENGINEERING: "Software Engineering",
  WEB_DEVELOPMENT: "Web Development",
  DATABASE_ENGINEERING: "Databases",
  DATA_AI: "Data Science & AI",
  DEVOPS_SECURITY: "DevOps & Security",
  SYSTEM_ARCHITECTURE: "System Architecture",
  COMPUTER_SCIENCE: "Computer Science",
  CAREER: "Career",
  PERSONAL: "Personal",
  TECH_MARKET: "Technology & Market Analysis"
} as const;

export const BLOG_TAGS = {
  // Programming Languages & Core Tech
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  FUNCTIONAL_PROGRAMMING: "Functional Programming",
  ALGORITHMS: "Algorithms",
  RECURSION: "Recursion",
  
  // Architecture & Systems
  ARCHITECTURE: "Architecture",
  SYSTEM_DESIGN: "System Design",
  DISTRIBUTED_SYSTEMS: "Distributed Systems",
  PERFORMANCE: "Performance",
  
  // Data & Databases
  DATABASE: "Database",
  DATA_SCIENCE: "Data Science",
  STATISTICS: "Statistics",
  
  // ML & Fraud
  MACHINE_LEARNING: "Machine Learning",
  FRAUD_DETECTION: "Fraud Detection",
  
  // Engineering Practices
  SOFTWARE_ENGINEERING: "Software Engineering",
  TESTING: "Testing",
  SECURITY: "Security",
  SOFTWARE_QUALITY: "Software Quality",
  QUALITY_ASSURANCE: "Quality Assurance",
  BEST_PRACTICES: "Best Practices",
  DEVOPS: "DevOps",
  
  // Frontend & Web
  FRONTEND: "Frontend",
  FRAMEWORKS: "Frameworks",
  
  // Career & Business
  CAREER_DEVELOPMENT: "Career Development",
  STARTUPS: "Startups",
  MANAGEMENT: "Management",
  PRODUCTIVITY: "Productivity",
  TEAM_DYNAMICS: "Team Dynamics",
  PROJECT_MANAGEMENT: "Project Management",
  
  // Theory & Concepts
  COMPUTER_SCIENCE: "Computer Science",
  PROGRAMMING_THEORY: "Programming Theory",
  PHILOSOPHY_MENTAL_MODELS: "Philosophy & Mental Models",
  
  // Infrastructure
  GARBAGE_COLLECTION: "Garbage Collection",
  METRICS: "Metrics",
  
  // Industry & Society
  MARKET_ANALYSIS: "Market Analysis",
  HARDWARE: "Hardware",
  ETHICS: "Ethics",
  POLITICS: "Politics",
  RANT: "Rant",
  
  // Personal
  PERSONAL: "Personal",
  IMMIGRATION: "Immigration"
} as const;

export type BlogCategory = typeof BLOG_CATEGORIES[keyof typeof BLOG_CATEGORIES];
export type BlogTag = typeof BLOG_TAGS[keyof typeof BLOG_TAGS];