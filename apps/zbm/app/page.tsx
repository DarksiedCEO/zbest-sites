/**
 * Phase 1 boot page (Brief §3.1): proves the app renders on the correct base
 * color with its headline face loading. Replaced by the real homepage in
 * Phase 4 (§A4 Home).
 */
export default function Page() {
  return (
    <main
      data-testid="boot"
      className="flex min-h-dvh items-center px-6 md:px-16"
    >
      <h1 className="font-display text-5xl tracking-tight md:text-7xl">
        Z Best Media
      </h1>
    </main>
  );
}
