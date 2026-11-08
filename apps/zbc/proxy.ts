import { NextResponse, type NextRequest } from "next/server";
import { malformedPath, malformedPathResponse } from "../../packages/ui/src/security-headers";

/**
 * Red team RTS-9. A request whose path is not valid percent-encoding
 * (/legal/%E0%A4%A) is answered here, 400 with every security header,
 * instead of reaching the dynamic route and ending in a bare 500 without
 * them. Everything else passes through untouched; next.config.ts still sets
 * the headers on normal responses.
 */
export function proxy(request: NextRequest) {
  const raw = request.url.slice(request.url.indexOf("/", request.url.indexOf("//") + 2)).split(/[?#]/)[0] ?? "/";
  if (malformedPath(raw)) return malformedPathResponse();
  return NextResponse.next();
}

export const config = {
  // Static assets and the image optimiser are not routes with dynamic segments.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
