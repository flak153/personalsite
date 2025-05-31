import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  output: 'export',
  
  // Ensure mermaid is properly bundled
  transpilePackages: ['mermaid'],
  
  // Webpack configuration to handle mermaid
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure mermaid is included in the client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
