"use client";

import React from "react";
import dynamic from "next/dynamic";
import MDXContent from "@/components/MDXContent";

// Dynamic import for TableOfContents
const TableOfContents = dynamic(() => import("@/components/TableOfContents"), {
  ssr: false,
});

interface BlogContentWithTOCProps {
  source: string;
}

export default function BlogContentWithTOC({ source }: BlogContentWithTOCProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="order-1 lg:order-1 lg:w-1/4">
        <TableOfContents />
      </div>
      
      <div className="order-2 lg:order-2 lg:w-3/4">
        <article className="prose prose-invert prose-lg prose-yellow max-w-none p-8 md:p-12 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="mx-auto">
            <MDXContent source={source} />
          </div>
        </article>
      </div>
    </div>
  );
}