import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Provide an empty turbopack config to satisfy Next.js 16's Turbopack-default check.
  // The @met4citizen/talkinghead library uses dynamic imports that are handled at runtime
  // (client-side only, via 'use client' + dynamic()), so Turbopack works fine for the build.
  turbopack: {},

  // Keep the webpack config for non-Turbopack builds / CI fallback.
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;
