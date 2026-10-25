import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared design system ships as TypeScript source, so Next compiles it.
  // This is also what lets next/font run from inside @zbest/ui. @zbest/lead
  // (the server-only lead pipeline) ships as TypeScript source too.
  transpilePackages: ["@zbest/ui", "@zbest/lead"],
};

export default nextConfig;
