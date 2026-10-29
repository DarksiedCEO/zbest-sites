/**
 * SANDBOX-ONLY override (not the gate). The cloud sandbox has Chromium only —
 * no WebKit — and cannot reach Google Fonts. This reuses the gate config
 * unchanged except: both projects run on the preinstalled Chromium, and the
 * mobile project emulates iPhone 14 (viewport, DPR, touch, UA) in Chromium
 * instead of WebKit. Screenshots it produces are labeled as such. The
 * canonical gate is playwright.config.ts on a machine with WebKit.
 */
import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

const chromium = { executablePath: "/opt/pw-browsers/chromium" };
const iphone = devices["iPhone 14"];

export default defineConfig({
  ...base,
  projects: [
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions: chromium },
    },
    {
      name: "mobile-390",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: iphone.deviceScaleFactor,
        isMobile: true,
        hasTouch: true,
        userAgent: iphone.userAgent,
        launchOptions: chromium,
      },
    },
  ],
});
