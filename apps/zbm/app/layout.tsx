import type { Metadata } from "next";
import { GateNonce } from "@zbest/ui/gate";
import { zbmFontVariables } from "@zbest/ui/fonts/zbm";
import "./globals.css";

export const metadata: Metadata = {
  title: "Z Best Media",
  description: "Advertising you can audit.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-brand="zbm" className={zbmFontVariables}>
      <body className="bg-base font-sans text-text-primary antialiased">
        <GateNonce />
        {children}
      </body>
    </html>
  );
}
