export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  imageUrl?: string; // Optional image for the project card
  demoUrl?: string; // Optional link to a live demo
  repoUrl?: string; // Optional link to the code repository
  featured?: boolean; // To mark projects for the homepage
}

// Placeholder project data - you can replace this with your actual projects
const allProjectsData: Project[] = [
  {
    slug: "clean-canvas-demo",
    title: "Clean Canvas Demo",
    description: "An interactive demonstration of advanced garbage collection concepts, built with Next.js and Framer Motion.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    imageUrl: "/project-images/clean-canvas.jpg", // Example path, replace with actual
    demoUrl: "/blog/clean-canvas-demo", // Or an external link
    repoUrl: "https://github.com/yourusername/yourprojectrepo", // Example
    featured: true,
  },
  {
    slug: "holy-grail-c4",
    title: "C4 Model for GC",
    description: "Exploring the C4 model for visualizing the architecture of a garbage collection system.",
    tech: ["Diagrams", "Software Architecture", "C4 Model"],
    imageUrl: "/project-images/c4-model.jpg", // Example path
    // demoUrl: "#",
    // repoUrl: "#",
    featured: true,
  },
  {
    slug: "portfolio-site-v2",
    title: "Personal Portfolio v2",
    description: "The very site you are on! Built with Next.js, Tailwind CSS, and MDX for blog content.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    // imageUrl: "/project-images/portfolio.jpg",
    // demoUrl: "/",
    // repoUrl: "https://github.com/yourusername/personalsite",
    featured: false,
  },
];

export function getAllProjects(): Project[] {
  // In a real scenario, this might read from MDX files or a database
  return allProjectsData.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(project => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find(project => project.slug === slug);
}
