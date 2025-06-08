'use client';

import TypewriterTagline from '@/components/TypewriterTagline';
import dynamic from 'next/dynamic';
import { BlogPost } from '@/lib/blog';
import { Project } from '@/lib/projects';

const AboutSection = dynamic(() => import('@/components/AboutSection'));
const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'));
const BlogSection = dynamic(() => import('@/components/BlogSection'));

interface HomePageContentProps {
  allPosts: BlogPost[];
  featuredProjects: Project[];
  featuredPost: BlogPost | null;
  recentPosts: BlogPost[];
}

export default function HomePageContent({ allPosts, featuredProjects, featuredPost, recentPosts }: HomePageContentProps) {
  return (
    <div className="relative">
      
      {/* Hero Section with Text */}
      <section className="relative h-screen w-full flex items-center justify-center z-10" aria-labelledby="hero-heading">
        <div className="text-center bg-black/30 backdrop-blur-lg rounded-xl p-10 relative border-2 border-white/50 animate-pulse-border">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6 text-white font-[family-name:var(--font-geist-sans)] py-4">
            Mohammed &quot;Flak&quot; Ali
          </h1>
          <TypewriterTagline />
          <div className="animate-bounce mt-10 opacity-50 hover:opacity-80 transition-opacity duration-300" role="img" aria-label="Scroll indicator">
            <p className="text-white/70 text-xs">Scroll to explore</p>
            <div className="mx-auto w-4 h-4 border-b border-r border-white/60 transform rotate-45 mt-1" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <AboutSection />
      <ProjectsSection featuredProjects={featuredProjects} />
      <BlogSection allPosts={allPosts} featuredPost={featuredPost} recentPosts={recentPosts} />
    </div>
  );
}
