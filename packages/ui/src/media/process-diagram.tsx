import { IllustrativeBadge } from "../components/illustrative-badge";

/** A reading aid for an existing sequence, never a performance chart. */
export function ProcessDiagram({ title, steps }: { title: string; steps: string[] }) {
  const row = 86;
  return <figure className="w-full max-w-[360px]">
    <svg role="img" aria-label={`${title}: ${steps.join(" → ")}`} viewBox={`0 0 360 ${steps.length * row + 20}`} className="block w-full border border-text-secondary/25 bg-panel text-text-primary">
      {steps.map((step, i) => {
        const words = step.split(" ");
        const lines = [""];
        for (const word of words) {
          if ((lines[lines.length - 1]!.length + word.length) > 25) lines.push(word);
          else lines[lines.length - 1] += `${lines[lines.length - 1] ? " " : ""}${word}`;
        }
        return <g key={step} transform={`translate(22 ${i * row + 16})`}>
          <rect x="0" y="0" width="316" height="62" rx="3" fill="none" stroke="currentColor" opacity=".5" />
          <circle cx="28" cy="31" r="14" className="text-accent" fill="none" stroke="currentColor" />
          <text x="28" y="36" textAnchor="middle" fill="currentColor" fontSize="14">{i + 1}</text>
          <text x="54" y={lines.length === 1 ? 37 : 26} fill="currentColor" fontSize="16">{lines.map((line, j) => <tspan key={j} x="54" dy={j ? 20 : 0}>{line}</tspan>)}</text>
          {i < steps.length - 1 ? <path d="M158 62V82M151 75L158 82L165 75" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent" /> : null}
        </g>;
      })}
    </svg>
    <figcaption className="mt-2"><IllustrativeBadge>Process illustration</IllustrativeBadge></figcaption>
  </figure>;
}
