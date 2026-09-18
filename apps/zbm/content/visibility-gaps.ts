/**
 * The Visibility Gap Library — Backend Spec v0.4 §12.4, founder decision 11.
 *
 * Certified site copy: approved by the founder and certified by the auditor at
 * 2758bfb. This file was GENERATED from the §12.4 table so it cannot drift from
 * it by hand, and the Phase 5 gate asserts the rendered page equals that table
 * character for character.
 *
 * It is published on the Search Intelligence page, and it is the ONE source the
 * readiness check's rule set derives its copy from (§12.2, §12.8). That
 * derivation is step 2 of the build, not done here. To change what a result
 * says, change this library through a spec revision — never a rule set.
 *
 * Vocabulary: "gap", never "leak" (§12.1).
 */
export const VISIBILITY_GAP_LIBRARY = {
  title: "Visibility Gap Library",
  intro: "Eight visibility gaps, and what fixing each one looks like.",
  gaps: [
    {
      key: "business_profile",
      name: "Business Profile Gap",
      description: "The basic facts about your business — what you do, where, and when you’re open — are incomplete or out of date on your business profile on maps and in search.",
      fix: "Claim your business profile on maps and in search, complete every field, and keep it current.",
    },
    {
      key: "entity_consistency",
      name: "Entity Consistency Gap",
      description: "Your business name, address, phone number or description reads differently from one place to the next.",
      fix: "Use one exact name, address, phone number and description everywhere your business appears.",
    },
    {
      key: "reviews",
      name: "Reviews Gap",
      description: "You have few recent reviews, or the reviews you get go unanswered.",
      fix: "Ask every satisfied customer for a review, and respond to the reviews you receive.",
    },
    {
      key: "crawlability",
      name: "Crawlability Gap",
      description: "Automated crawlers may not be able to reach or read the pages that matter most on your site.",
      fix: "Check your site’s crawler rules and sitemap so your key pages can be reached and read.",
    },
    {
      key: "structured_data",
      name: "Structured Data Gap",
      description: "Your website doesn’t label its key facts in a machine-readable way.",
      fix: "Add structured data for your business, your services and your most-asked questions.",
    },
    {
      key: "answer_content",
      name: "Answer Content Gap",
      description: "Your website doesn’t directly answer the questions customers actually ask.",
      fix: "Publish clear, specific answers to the questions your customers ask most.",
    },
    {
      key: "brand_citations",
      name: "Brand Citations Gap",
      description: "Few other credible websites mention or link to your business.",
      fix: "Earn mentions on credible local and industry websites.",
    },
    {
      key: "local_listings",
      name: "Local Listings Gap",
      description: "Your business is missing from the directories and map apps beyond your business profile on maps and in search.",
      fix: "Get listed in the directories and map apps that matter for your area and industry.",
    },
  ],
} as const;
