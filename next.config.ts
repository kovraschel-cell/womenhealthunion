import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Turbopack's persistent build cache records the environment values it reads,
    // which put RESEND_API_KEY into .next/cache and tripped Netlify's secrets scanner.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
