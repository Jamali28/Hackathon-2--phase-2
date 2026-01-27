import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
  },
  // Enable compression for production
  compress: true,
  // Webpack configuration for node-specific packages
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  // Add empty turbopack config as suggested by the error message
  // This should resolve the Turbopack/webpack conflict
  turbopack: {},
};

export default nextConfig;
