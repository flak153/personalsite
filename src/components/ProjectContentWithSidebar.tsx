"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MDXContent from "@/components/MDXContent";

// Dynamic imports for project-specific sidebars
const projectSidebars: Record<string, React.ComponentType> = {
  "did-vc-explorer": dynamic(() => import("../app/projects/did-vc-explorer-sidebar"), { ssr: false })
};

interface ProjectContentWithSidebarProps {
  source: string;
  slug?: string;
}

export default function ProjectContentWithSidebar({ source, slug }: ProjectContentWithSidebarProps) {
  const [SidebarComponent, setSidebarComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (slug && projectSidebars[slug]) {
      setSidebarComponent(() => projectSidebars[slug]);
    }
  }, [slug]);

  const sidebar = SidebarComponent ? <SidebarComponent /> : null;
  if (!sidebar) {
    // No sidebar, render content full width
    return (
      <article className="prose prose-invert prose-lg prose-yellow max-w-none p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
        <MDXContent source={source} />
      </article>
    );
  }

  // With sidebar, use flex layout
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="order-1 lg:order-1 lg:w-80 flex-shrink-0">
        <div className="lg:sticky lg:top-24">
          {sidebar}
        </div>
      </div>
      
      <div className="order-2 lg:order-2 lg:flex-1 min-w-0">
        <article className="prose prose-invert prose-lg prose-yellow max-w-none p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="overflow-x-hidden">
            <MDXContent source={source} />
          </div>
        </article>
      </div>
    </div>
  );
}