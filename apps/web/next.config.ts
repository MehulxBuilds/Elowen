import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/db", "@repo/bot"],
  devIndicators: false,
};

export default nextConfig;
