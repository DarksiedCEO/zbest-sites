import { pageMetadata } from "@zbest/ui";
import { LeadForm } from "@/components/lead-form";
import Link from "next/link";
import { Lead, PageHeader, PageSection } from "@/components/page";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Contact",
  description:
    "Tell us what’s actually going on. We’ll tell you honestly whether we’re the right fit.",
  path: "/contact",
  ogImage: "/contact/opengraph-image",
});

/** Contact (Brief §A4), form per §6.1 posting to the §6.2 lead route. */
export default function ContactPage() {
  return (
    <main>
      <PageHeader
        label="Contact"
        title="Tell us what’s actually going on. We’ll tell you honestly whether we’re the right fit."
      >
        <Lead>
          Whether it&rsquo;s a revenue leak, a media buy, a billboard campaign, or a
          content strategy — start with what&rsquo;s actually happening, not what you
          think the solution should be.
        </Lead>
        <Lead>
          Already know what you need?{" "}
          <Link href="/start" className="text-text-primary underline underline-offset-4">
            Start a project
          </Link>{" "}
          and pick every service in one form.
        </Lead>
      </PageHeader>

      <PageSection id="contact-form" label="Contact form">
        <div className="max-w-2xl">
          <LeadForm form="contact" submitLabel="Send" />
        </div>
      </PageSection>
    </main>
  );
}
