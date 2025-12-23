import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Existing config
  reactCompiler: true,
  serverExternalPackages: ["better-sqlite3"],

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: ["react-force-graph-2d"],
  },

  // Production optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

export default withBundleAnalyzer(nextConfig);
