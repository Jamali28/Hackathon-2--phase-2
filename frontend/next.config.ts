import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Enable compression for production
  compress: true,
  // Turbopack configuration to handle node-specific packages
  turbopack: {},
  // Webpack configuration (will be ignored in Turbopack mode but kept for compatibility)
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};

export default nextConfig;
