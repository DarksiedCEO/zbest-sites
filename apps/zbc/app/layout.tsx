import type { Metadata } from "next";
import { GateNonce } from "@zbest/ui/gate";
import { zbcFontVariables } from "@zbest/ui/fonts/zbc";
import "./globals.css";

export const metadata: Metadata = {
  title: "Z Best Clips",
  description: "Z Best Clips, by Z Best Media.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-brand="zbc" className={zbcFontVariables}>
      <body className="bg-base font-sans text-text-primary antialiased">
        <GateNonce />
        {children}
      </body>
    </html>
  );
}
