import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared design system ships as TypeScript source, so Next compiles it.
  // This is also what lets next/font run from inside @zbest/ui.
  transpilePackages: ["@zbest/ui"],
  // "/" serves How It Works (founder decision, Phase 4). The brief's own route
  // name still resolves, permanently, to the one canonical URL.
  async redirects() {
    return [{ source: "/how-it-works", destination: "/", permanent: true }];
  },
};

export default nextConfig;
