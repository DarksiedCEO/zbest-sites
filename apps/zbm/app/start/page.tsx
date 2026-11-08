import { pageMetadata } from "@zbest/ui";
import { LeadForm } from "@/components/lead-form";
import { Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { INTAKE_SERVICE_VALUES } from "@/content/services";
import { SOURCE_TAG } from "@/lib/lead";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Start a Project",
  description:
    "Billboards, TV, radio, social, ads, creative, a website, or a revenue leak — one form reaches every team at Z Best Media.",
  path: "/start",
  ogImage: "/start/opengraph-image",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const KNOWN = new Set<string>(INTAKE_SERVICE_VALUES);

/**
 * `?service=tv-streaming` or `?service=tv-streaming,social-media` (or the
 * param repeated) pre-ticks those services. Unknown values are ignored, so a
 * mistyped campaign link still lands on a working form.
 */
function preselected(raw: string | string[] | undefined): string[] {
  const values = (Array.isArray(raw) ? raw : raw ? [raw] : []).flatMap((v) => v.split(","));
  return [...new Set(values.map((v) => v.trim().toLowerCase()).filter((v) => KNOWN.has(v)))];
}

/** `?src=` wins over `?utm_campaign=`; anything that isn't a plain tag is dropped. */
function sourceTag(params: Record<string, string | string[] | undefined>): string {
  for (const key of ["src", "utm_campaign"]) {
    const value = params[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first && SOURCE_TAG.test(first)) return first.toLowerCase();
  }
  return "";
}

/**
 * Universal intake (amendment Oct 4, 2026; docs/FULL-SERVICE-DESIGN.md).
 *
 * Every campaign, service page and nav CTA lands here. One form, every
 * service: the visitor ticks what they need, and the submission carries the
 * service list plus the campaign tag so it can be routed to the team that runs
 * it. Posts to the same §6.2 route as the other forms, which stores the lead
 * (services[] and source as columns) and notifies the founder.
 */
export default async function StartPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const services = preselected(params.service);
  const source = sourceTag(params);

  return (
    <main id="main">
      <PageHeader label="Start a Project" title="Tell us what you need. One form reaches every team.">
        <Lead>
          Billboards, TV, radio, social, ads, creative, a website, a revenue leak, or a
          clipping campaign — pick everything that applies. We&rsquo;ll come back with a
          plan and a quote, or tell you honestly if we&rsquo;re not the right fit.
        </Lead>
      </PageHeader>

      <PageSection id="intake" label="Your project">
        <div className="max-w-3xl">
          <LeadForm form="start" submitLabel="Send" defaults={{ services, source }} />
        </div>
      </PageSection>

      <PageSection label="What happens next">
        <RuledList
          items={[
            "We read it — a person, not an autoresponder — and reply using the contact you gave us.",
            "If anything’s unclear, we ask before we quote.",
            "You get a written plan and quote for exactly what you picked: what we’ll do, what it costs, and how we’ll measure it.",
            "Nothing starts until you approve it in writing.",
          ]}
        />
      </PageSection>
    </main>
  );
}
