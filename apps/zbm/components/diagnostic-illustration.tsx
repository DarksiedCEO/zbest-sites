import { IllustrativeBadge } from "@zbest/ui";

export type DiagnosticKind = "profile" | "consistency" | "reviews" | "crawl" | "structure" | "answers" | "citations" | "listings" | "traffic" | "conversion" | "offer" | "followup" | "tracking" | "creative";

const descriptions: Record<DiagnosticKind, string> = {
  profile: "A business profile with missing fields beside a completed profile.",
  consistency: "Different business records connect to one consistent business identity.",
  reviews: "A customer review connects to a business response.",
  crawl: "A crawler path reaches a barrier before the website's pages.",
  structure: "Website facts connect to labeled machine-readable fields.",
  answers: "A customer question connects to a direct answer on a page.",
  citations: "Independent websites link to a business page, with one missing connection.",
  listings: "A business location connects to several local directory listings.",
  traffic: "Search, ads and social paths converge on a website, with an acquisition gap.",
  conversion: "A visitor path reaches an incomplete form before the next step.",
  offer: "An unclear offer connects to a page with a defined next step.",
  followup: "An incoming lead reaches a pause before the next contact.",
  tracking: "An advertisement and a lead are separated by a missing attribution link.",
  creative: "Creative, offer and landing page align along one connected path.",
};

/** Explanatory drawings of the adjacent approved copy; no measured results. */
export function DiagnosticIllustration({ kind }: { kind: DiagnosticKind }) {
  const card = (x: number, label: string, incomplete = false) => (
    <g transform={`translate(${x} 45)`}>
      <rect width="108" height="112" rx="4" />
      <path d="M0 27H108" />
      <text x="54" y="19" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16">{label}</text>
      <path d="M16 43H90 M16 61H77 M16 79H87" opacity=".6" />
      {incomplete ? <rect x="16" y="91" width="76" height="12" strokeDasharray="4 4" className="text-accent" /> : <path d="M16 96H69" className="text-accent" />}
    </g>
  );
  const arrow = <path d="M144 103H190 M183 96L190 103L183 110" className="text-accent" />;
  return <figure className="mt-5 w-full max-w-[360px]">
    <svg role="img" aria-label={descriptions[kind]} viewBox="0 0 360 200" className="block w-full border border-text-secondary/25 bg-panel text-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5">
      {(["profile", "structure", "answers", "conversion", "offer", "tracking"] as DiagnosticKind[]).includes(kind) ? <>
        {card(18, ({ profile: "Profile", structure: "Website", answers: "Question", conversion: "Form", offer: "Offer", tracking: "Campaign" } as Partial<Record<DiagnosticKind, string>>)[kind]!, true)}
        {arrow}
        {card(210, ({ profile: "Complete", structure: "Facts", answers: "Answer", conversion: "Next step", offer: "Next step", tracking: "Lead" } as Partial<Record<DiagnosticKind, string>>)[kind]!)}
        {kind === "structure" ? <text x="164" y="145" fill="currentColor" stroke="none" fontSize="20">{'{ }'}</text> : null}
        {kind === "tracking" ? <path d="M166 91L175 115M175 91L166 115" className="text-accent" strokeWidth="3" /> : null}
      </> : kind === "reviews" || kind === "followup" ? <>
        <path d="M22 35H154V105H63L43 123V105H22Z" />
        <path d="M206 80H338V150H313V168L292 150H206Z" strokeDasharray={kind === "followup" ? "5 5" : undefined} />
        <path d="M43 60H129M43 78H110M227 106H313M227 125H287" />
        <text x="88" y="25" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16">{kind === "reviews" ? "Review" : "Incoming lead"}</text>
        <text x="272" y="190" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16">{kind === "reviews" ? "Response" : "Follow-up"}</text>
        <path d="M159 68H180V116H199M192 109L199 116L192 123" className="text-accent" />
        {kind === "followup" ? <path d="M173 85V100M187 85V100" strokeWidth="4" className="text-accent" /> : null}
      </> : kind === "creative" ? <>
        {["Creative", "Offer", "Landing page"].map((label, i) => <g key={label} transform={`translate(${15 + i * 118} 48)`}><rect width="94" height="100" rx="3" /><path d="M12 25L35 57L53 40L82 78H12Z" opacity={i === 0 ? 1 : .2} /><text x="47" y="123" fill="currentColor" stroke="none" textAnchor="middle" fontSize="16">{label}</text>{i < 2 ? <path d="M97 48H116M109 41L116 48L109 55" className="text-accent" /> : null}</g>)}
      </> : <>
        <rect x="135" y="66" width="90" height="70" rx="4" />
        <text x="180" y="107" fill="currentColor" stroke="none" textAnchor="middle" fontSize="16">{kind === "crawl" ? "Site pages" : kind === "traffic" ? "Website" : "Business"}</text>
        {[{ x: 18, y: 18 }, { x: 270, y: 18 }, { x: 18, y: 135 }, { x: 270, y: 135 }].map(({x,y},i) => <g key={i}>
          <rect x={x} y={y} width="72" height="46" rx="3" />
          {kind === "traffic" ? <text x={x + 36} y={y + 28} fill="currentColor" stroke="none" textAnchor="middle" fontSize="14">{["Search", "Ads", "Referrals", "Social"][i]}</text> : <path d={`M${x + 12} ${y + 14}h48m-48 12h${kind === "consistency" ? 20 + i * 7 : 35}`} />}
          <path d={`M${x < 100 ? x + 72 : x} ${y + 23}L${x < 100 ? 135 : 225} 101`} className="text-accent" strokeDasharray={(kind === "crawl" || kind === "citations" || kind === "traffic") && i === 0 ? "4 5" : undefined} />
          {kind === "listings" ? <circle cx={x + 60} cy={y + 34} r="4" className="text-accent" /> : null}
        </g>)}
        {kind === "crawl" ? <path d="M103 43L121 67M121 43L103 67" strokeWidth="4" className="text-accent" /> : null}
      </>}
    </svg>
    <figcaption className="mt-2"><IllustrativeBadge>Illustrative diagram — not measured data</IllustrativeBadge></figcaption>
  </figure>;
}
