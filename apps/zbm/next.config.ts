import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared design system ships as TypeScript source, so Next compiles it.
  // This is also what lets next/font run from inside @zbest/ui.
  transpilePackages: ["@zbest/ui"],
};

export default nextConfig;
