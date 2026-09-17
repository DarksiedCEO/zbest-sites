import { NotFoundContent } from "@zbest/ui";
import type { Metadata } from "next";

// No robots entry: Next already emits noindex on a 404, and a second tag here
// only duplicated it. The gate asserts the noindex is present.
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return <NotFoundContent />;
}
