import { pageMetadata } from "@zbest/ui";
import { FaqList, PageHeader, PageSection } from "@/components/page";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "FAQ",
  description:
    "What a clipping campaign is, how it’s priced, Entertainment vs Brands, how clippers get paid, and who Z Best Clips is for.",
  path: "/faq",
  ogImage: "/faq/opengraph-image",
});

/**
 * FAQ (Brief §B4). Questions and answers verbatim.
 *
 * "How do clippers get paid?" names the payout STRUCTURE only, as §B4 writes
 * it — no rates — so no clipper payout figures reach this buyer-facing page (§9).
 */
const ITEMS = [
  {
    question: "What is a clipping campaign?",
    answer:
      "Turns one piece of long-form content into dozens of short-form clips, posted across TikTok, Reels, and Shorts by our creator network.",
  },
  {
    question: "How much does a campaign cost?",
    answer:
      "Set by target reach and budget, scoped individually before launch. No separate line-item fees.",
  },
  {
    question: "What’s the difference between Entertainment and Brands campaigns?",
    answer:
      "Entertainment = rented distribution (our network’s accounts, new-audience discovery). Brands = owned distribution (client’s own account, compounding local reach).",
  },
  {
    question: "Do I only pay for views that actually happen?",
    answer: "Yes — every submission reviewed before it counts.",
  },
  {
    question: "How fast can a campaign launch?",
    answer: "Typically within a few days of the scoping call.",
  },
  {
    question: "Is Z Best Clips a new company?",
    answer: "Yes — built on proven industry-wide mechanics, building our own case studies now.",
  },
  {
    question: "How do clippers get paid?",
    answer:
      "Entertainment: per 1,000 verified views. Brands: guaranteed flat fee + performance bonus.",
  },
  {
    question: "Do I need a large following to become a clipper?",
    answer: "No — based on content quality and guideline adherence, not follower count.",
  },
  {
    question: "What platforms do you post to?",
    answer: "TikTok, Instagram Reels, YouTube Shorts.",
  },
  {
    question: "Who is Z Best Clips for?",
    answer:
      "Independent artists/labels, filmmakers, streamers, podcasters, sports organizations, auto dealerships, med spas.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <PageHeader label="FAQ" title="Frequently asked questions" />
      <PageSection id="faq" label="Questions">
        <FaqList items={ITEMS} />
      </PageSection>
    </main>
  );
}
