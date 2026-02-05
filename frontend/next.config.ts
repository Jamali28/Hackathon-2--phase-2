import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Enable compression for production
  compress: true,
  // Webpack configuration for node-specific packages
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  // Remove turbopack config as it may conflict with experimental server actions
};

export default nextConfig;
