import { IllustrativeBadge } from "../components/illustrative-badge";

/** The two approved distribution models, with account ownership explicit. */
export function DistributionDiagram() {
  return <figure className="w-full max-w-[360px]">
    <svg role="img" aria-label="Two distribution models: entertainment clips use creator accounts; brand clips use brand accounts." viewBox="0 0 360 300" className="block w-full border border-text-secondary/25 bg-panel text-text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
      {[{ y: 24, model: "Rented distribution", source: "Entertainment", account: "Creator accounts" }, { y: 166, model: "Owned distribution", source: "Brands", account: "Brand accounts" }].map(({ y, model, source, account }) => <g key={model} transform={`translate(18 ${y})`}>
        <text x="0" y="13" fill="currentColor" stroke="none" fontSize="16">{model}</text>
        <rect y="30" width="118" height="66" rx="3" />
        <text x="59" y="68" fill="currentColor" stroke="none" textAnchor="middle" fontSize="15">{source}</text>
        <path d="M122 63H165M158 56L165 63L158 70" className="text-accent" />
        <rect x="171" y="30" width="153" height="66" rx="3" />
        <text x="247" y="68" fill="currentColor" stroke="none" textAnchor="middle" fontSize="15">{account}</text>
      </g>)}
    </svg>
    <figcaption className="mt-2"><IllustrativeBadge>Distribution illustration</IllustrativeBadge></figcaption>
  </figure>;
}
