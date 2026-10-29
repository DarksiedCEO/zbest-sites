import type { NextConfig } from "next";
import { securityHeaders } from "../../packages/ui/src/security-headers";

const nextConfig: NextConfig = {
  // The shared design system ships as TypeScript source, so Next compiles it.
  // This is also what lets next/font run from inside @zbest/ui. @zbest/lead
  // (the server-only lead pipeline) ships as TypeScript source too.
  transpilePackages: ["@zbest/ui", "@zbest/lead"],
  // CSP, HSTS and friends (packages/ui/src/security-headers.ts).
  async headers() {
    return securityHeaders();
  },
  // "/" serves How It Works (founder decision, Phase 4). The brief's own route
  // name still resolves, permanently, to the one canonical URL.
  async redirects() {
    return [{ source: "/how-it-works", destination: "/", permanent: true }];
  },
};

export default nextConfig;
