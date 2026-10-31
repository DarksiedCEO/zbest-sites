import type { NextConfig } from "next";
import { securityHeaders } from "../../packages/ui/src/security-headers";

// /dev/system (the design-system gallery) lives in page.dev.tsx files, which
// are routes only under `next dev` or when ZBEST_DEV_ROUTES=1 (set by the e2e
// gate). Production and preview builds do not contain them (Phase 6 step 4).
const devRoutes = process.env.NODE_ENV === "development" || process.env.ZBEST_DEV_ROUTES === "1";
const EXTENSIONS = ["tsx", "ts", "jsx", "js"];

const nextConfig: NextConfig = {
  pageExtensions: devRoutes ? [...EXTENSIONS.map((e) => `dev.${e}`), ...EXTENSIONS] : EXTENSIONS,
  // The shared design system ships as TypeScript source, so Next compiles it.
  // This is also what lets next/font run from inside @zbest/ui. @zbest/lead
  // (the server-only lead pipeline) ships as TypeScript source too.
  transpilePackages: ["@zbest/ui", "@zbest/lead"],
  // FD-VISUAL-01 §4.5: images AVIF or WebP through next/image (AVIF first).
  images: { formats: ["image/avif", "image/webp"] },
  // CSP, HSTS and friends (packages/ui/src/security-headers.ts).
  async headers() {
    return securityHeaders();
  },
};

export default nextConfig;
