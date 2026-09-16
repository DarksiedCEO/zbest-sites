/**
 * Phase 1 boot page (Brief §3.1): proves the app renders on the correct base
 * color with its headline face loading. Replaced by the real How It Works page
 * in Phase 4 (§B4).
 */
export default function Page() {
  return (
    <main
      data-testid="boot"
      className="flex min-h-dvh items-center px-6 md:px-16"
    >
      <h1 className="font-kinetic text-5xl tracking-tight md:text-7xl">
        Z Best Clips
      </h1>
    </main>
  );
}
