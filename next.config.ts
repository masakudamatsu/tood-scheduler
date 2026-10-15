import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tests run their own dev server, so they use a separate build folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
};

export default nextConfig;
