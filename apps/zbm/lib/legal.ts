import { legalDocumentStrings, legalPlaceholders, type ConsentCategory, type InEffectLegalDocument } from "@zbest/ui";

/**
 * Z Best Media legal documents — IN EFFECT (founder decision, Oct 30 2026).
 *
 * Privacy, Terms and Cookie documents are published and in effect.
 * Z Best Clips is unchanged: its pages are
 * still LegalShell outlines with the draft banner (CLAUDE.md).
 *
 * EVERY FACTUAL STATEMENT HERE MUST MATCH THE CODE. Before changing what the
 * site collects, stores, sends or sets in the browser, change this file in the
 * same commit. The evidence for each statement (file:line) is in the drafting
 * notes that came with this change. In particular:
 *   - lead fields:     apps/zbm/lib/lead.ts, lib/assessment/contract.ts,
 *                      lib/visibility/contract.ts
 *   - what is stored:  packages/lead/sql/001_leads.sql, 002_retention.sql,
 *                      003_region.sql, src/pipeline.ts
 *   - retention:       packages/lead/src/retention.ts + /api/cron/purge-leads
 *                      (730 days rows, 90 days user agent: the env defaults)
 *   - IP handling:     packages/lead/src/ip.ts (no IP or IP hash stored with a
 *                      lead; rate-limit key is the keyed HMAC, ~10-minute life)
 *   - service area:    packages/lead/src/region.ts (country, province)
 *
 * These statements describe the code AFTER site-hardening-2026-10-30
 * (1a96d3e, d04aa17, 3e29c3b, 37b67dc), which merges before this text ships.
 *   - email:           packages/lead/src/resend.ts, src/email.ts
 *   - browser storage: packages/ui/src/components/cookie-consent.tsx
 *   - no analytics, no ad pixels, self-hosted fonts, CSP 'self':
 *                      packages/ui/src/security-headers.ts, src/fonts/*
 *
 * [UPPER CASE] tokens are facts Andre has not supplied yet. They render
 * visibly marked, and a Vercel production build refuses to ship while any
 * remain (app/legal/[document]/page.tsx).
 */

/** Shown on every document. Replace both tokens when the documents go live. */
export const LEGAL_ISSUER = "[LEGAL ENTITY NAME], doing business as Z Best Media";
export const LEGAL_EFFECTIVE_DATE = "[EFFECTIVE DATE]";
export const LEGAL_LAST_UPDATED = "[EFFECTIVE DATE]";

const PRIVACY_EMAIL = "[PRIVACY EMAIL]";
const LEGAL_EMAIL = "[LEGAL NOTICES EMAIL]";
const MAILING_ADDRESS = "[BUSINESS MAILING ADDRESS]";
const ACCESSIBILITY_EMAIL = "[ACCESSIBILITY EMAIL — CONFIRM]";
const UK_REPRESENTATIVE = "[UK REPRESENTATIVE]";

/* -------------------------------------------------------------------------- */
/* Privacy Policy                                                             */
/* -------------------------------------------------------------------------- */

const privacyPolicy: InEffectLegalDocument = {
  title: "Privacy Policy",
  subtitle:
    "How Z Best Media handles the information you give us on zbestmedia.com, what we do with it, and the choices you have.",
  summary: [
    "We collect what you type into our forms — your name, your business, how to reach you, and your answers — so we can reply and, for the free assessment, show you a result.",
    "We don’t sell or share your personal information for advertising. The site has no analytics, no advertising pixels and no third-party tracking scripts.",
    "We don’t store your IP address, or any code made from it, with what you send us. To stop spam, a keyed one-way code made from it is kept for about 10 minutes. Our hosting provider’s request logs record IP addresses for a short period.",
    "A small number of service providers help us run the site and deliver your message to us. They may use your information only to do that work for us.",
    `You can ask to see, correct or delete your information at any time by emailing ${PRIVACY_EMAIL}. We give these rights to everyone, wherever you live.`,
  ],
  sections: [
    {
      id: "scope",
      heading: "Who we are and what this policy covers",
      blocks: [
        {
          p: `This policy is issued by ${LEGAL_ISSUER} (“Z Best Media”, “we”, “us”). It covers personal information we collect through our website at zbestmedia.com (the “site”), including its contact form, project intake form and free assessment tools.`,
        },
        {
          p: "It does not cover information we receive while doing paid work for a client. That information is governed by the contract with that client. It also does not cover Z Best Clips (zbestclips.com), which is a separate website with its own policies.",
        },
        {
          p: "We are a business-to-business advertising agency. Most people who contact us do so on behalf of a business. We still treat what you tell us about yourself — your name, email address or phone number — as personal information and protect it as described here.",
        },
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      blocks: [
        { p: "Information you give us. We collect only what you choose to enter:" },
        {
          table: {
            caption: "Forms on the site and what each one collects",
            head: ["Form", "What you enter", "Why we ask"],
            rows: [
              [
                "Contact form",
                "Your name, your business name, what you’re looking to solve, the best way to reach you (for example an email address or phone number), and your country (and province or territory, if you’re in Canada).",
                "To read your message and reply.",
              ],
              [
                "Start a Project (intake form)",
                "The services you’re interested in, your name, business name, the best way to reach you, and your country (and province or territory, if you’re in Canada). Optionally: your website, a budget range, a timing range and any other details you add.",
                "To understand the project and reply with a useful next step.",
              ],
              [
                "Free assessments (for example the Revenue Recovery assessment)",
                "Your name, business name, business website, the best way to reach you and your country (and province or territory, if you’re in Canada), plus your answers to the assessment’s multiple-choice questions.",
                "To score your answers, show you the result, and follow up with you about it.",
              ],
            ],
          },
        },
        {
          p: "We ask for your country because we only serve businesses in the United States, the United Kingdom and Canada (outside Quebec). If you choose a place outside that area, the form tells you so and nothing you entered is stored or sent to us.",
        },
        {
          p: "Please don’t put sensitive personal information — such as health information, financial account numbers, government ID numbers or passwords — into a free-text box. We don’t ask for it and don’t need it.",
        },
        { p: "Information collected automatically when you submit a form. With each submission we also record:" },
        {
          list: [
            "Nothing about your IP address is stored with your submission. To limit how often forms can be sent, a keyed one-way code (an HMAC-SHA-256 hash) made from your IP address is held for about 10 minutes and then discarded.",
            "Your browser’s user-agent string (it names your browser and operating system), shortened to 500 characters and deleted automatically after 90 days, so we can investigate spam and fix problems that affect particular browsers.",
            "The date and time of the submission, and a random submission ID your browser creates so a double-click doesn’t send the same form twice.",
            "If you reached the intake form from one of our campaign links, the short campaign tag in that link (for example from a billboard or an ad), so we know which campaign brought you. It identifies the campaign, not you.",
          ],
        },
        {
          p: "While you simply browse, our site does not use analytics, advertising pixels, session recording or fingerprinting, and it loads no scripts, fonts or images from third parties. Our hosting provider, like every web host, processes your IP address and basic request details in order to deliver the pages to you and protect the service; see “Who we share it with”.",
        },
        {
          p: "We do not buy personal information, and we do not collect information about you from data brokers or social networks.",
        },
      ],
    },
    {
      id: "use",
      heading: "How we use it",
      blocks: [
        {
          list: [
            "To respond to you: read your message, reply, and talk with you about the work you asked about. A person reads every submission.",
            "To deliver the free assessment: your answers are scored automatically against a fixed set of rules — no AI model is involved — and you see the result on screen. The result describes your business, not you, and it isn’t used to make any decision about you that has a legal or similarly significant effect.",
            "To follow up: we may contact you about your request and the services you asked about. We won’t add you to a newsletter or marketing list without your permission, and if you tell us to stop contacting you, we will.",
            "To keep the site secure: limit how often forms can be submitted, block spam and abuse, and investigate misuse.",
            "To understand which of our own campaigns bring people to us, using the campaign tag described above.",
            "To meet legal obligations and to establish, exercise or defend legal claims.",
          ],
        },
        {
          p: "We don’t use your information for any purpose that isn’t reasonably compatible with these. If we ever want to, we’ll tell you first and, where the law requires it, ask for your consent.",
        },
      ],
    },
    {
      id: "share",
      heading: "Who we share it with",
      blocks: [
        {
          p: "We share personal information only with service providers that help us run the site and handle your request, under contracts or terms that limit their use of it to providing their service to us:",
        },
        {
          table: {
            caption: "Service providers that handle personal information from the site",
            head: ["Provider type", "What they do for us", "What they receive"],
            rows: [
              ["Website hosting (Vercel)", "Serves the site, runs the code that receives form submissions, and keeps short-lived request logs.", "Your requests to the site, including your IP address, browser details and the page addresses you visit, and the content of any form you submit."],
              ["Database hosting", "Stores form submissions.", "The form contents, country, user-agent string, campaign tag, submission ID and time listed under “What we collect”. No IP address."],
              ["Email delivery (Resend)", "Delivers each new submission to our inbox as an email.", "The content of your submission."],
              ["Business email (our email provider)", "Holds the notification emails and our correspondence with you.", "The content of your submission and any emails you exchange with us."],
              ["Rate-limit store (if enabled)", "Counts submissions per source to stop floods of spam.", "Only a keyed, one-way hash of your IP address, kept for about 10 minutes to limit abuse."],
            ],
          },
        },
        {
          p: "We may also disclose information if the law requires it (for example a valid subpoena), to protect the rights, property or safety of Z Best Media, our clients or others, or as part of a merger, acquisition or sale of all or part of our business — in which case the buyer must keep honoring this policy for the information it receives.",
        },
        {
          p: "We do not sell personal information, and we do not “share” it for cross-context behavioral advertising, as those terms are defined by California law. We have not done either in the past 12 months. We do not disclose personal information to third parties for their own direct marketing.",
        },
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      blocks: [
        {
          table: {
            caption: "Retention by type of information",
            head: ["Information", "How long we keep it"],
            rows: [
              [
                "Form submissions, including anything stored with them",
                "Deleted automatically 24 months after you send them, or sooner if you ask us to delete them.",
              ],
              [
                "Records of work for clients",
                "If you become a client, the records of our work together are kept as your client agreement says.",
              ],
              [
                "Your browser’s user-agent string, stored with a submission",
                "Deleted automatically 90 days after you send the form.",
              ],
              [
                "Notification emails about your submission",
                "We delete them from our inbox on the same 24-month schedule. Our email-delivery provider keeps its own copy under its retention terms.",
              ],
              ["Rate-limit counters", "A keyed, one-way hash of your IP address, kept for about 10 minutes to limit abuse."],
              ["Request logs at our hosting provider (IP address, browser details, page address)", "Available to us for no more than 30 days, depending on our hosting plan, then deleted from our view. The provider handles its own operational records under its privacy policy."],
              ["Your cookie-banner choice", "Stored only in your own browser until you clear it. We never receive it."],
              ["Records of privacy requests", "24 months, to show we handled them as the law requires."],
            ],
          },
        },
        {
          p: "Legal holds: if we must keep specific information to comply with the law, or because of a dispute, an investigation or a claim, we may pause deletion of that information only, and only for as long as the hold lasts. We then delete it on the normal schedule.",
        },
      ],
    },
    {
      id: "rights",
      heading: "Your rights and choices",
      blocks: [
        { p: "Wherever you live, you can ask us to:" },
        {
          list: [
            "Tell you what personal information we have about you, where it came from, why we have it and who we’ve disclosed it to, and give you a copy in a portable format.",
            "Correct information that is inaccurate.",
            "Delete your information, subject to the narrow exceptions the law allows (for example, if we need it to complete a transaction you asked for or to comply with a legal obligation).",
            "Stop contacting you.",
          ],
        },
        {
          p: `How to ask: email ${PRIVACY_EMAIL} with the subject “Privacy request” and tell us what you’d like, or write to us at ${MAILING_ADDRESS}. You don’t need an account.`,
        },
        {
          p: "Verification: to protect you, we confirm a request comes from the person the information is about. Usually we do this by contacting you at the email address or phone number you gave us in your submission. We ask only for what we need to verify you and use it only for that.",
        },
        {
          p: "Agents: you can have someone else make a request for you. We may ask for your signed permission and confirm your identity directly with you, unless the agent holds a valid power of attorney.",
        },
        {
          p: "Timing: we confirm receipt within 10 business days and respond within 30 days (one month for UK residents). If a request is complex and we need more time, we’ll tell you why within that period; the extension never goes beyond what the law where you live allows.",
        },
        {
          p: `Appeals: if we decline your request in whole or part, we’ll explain why. You can appeal by replying with the subject “Privacy appeal” within 60 days. We’ll answer within 60 days of receiving the appeal. If you’re not satisfied, you may contact your state attorney general (and, in California, the California Privacy Protection Agency).`,
        },
        {
          p: "No discrimination: we will never deny you service, charge you a different price or treat you differently because you exercised a privacy right.",
        },
      ],
    },
    {
      id: "california",
      heading: "California residents",
      blocks: [
        {
          p: "The California Consumer Privacy Act, as amended by the California Privacy Rights Act (together, the “CCPA”), applies to for-profit companies that meet any one of these thresholds: annual gross revenue above $26,625,000 (the 2025 inflation-adjusted figure); buying, selling or sharing the personal information of 100,000 or more California consumers or households a year; or earning half or more of annual revenue from selling or sharing personal information. Based on our size, Z Best Media does not currently meet any of them. We follow the CCPA’s rules anyway, and the rights in “Your rights and choices” are the CCPA rights to know, delete and correct.",
        },
        { p: "Notice at collection and disclosures for the past 12 months, using the CCPA’s categories:" },
        {
          table: {
            caption: "Categories of personal information we collect",
            head: ["CCPA category", "Examples from our forms", "Source", "Disclosed for a business purpose to"],
            rows: [
              ["Identifiers", "Name, email address or phone number you give us, submission ID; IP address in our hosting provider’s short-lived request logs", "You; your browser", "Hosting, database, email delivery and business email providers"],
              ["Customer records (Cal. Civ. Code § 1798.80(e))", "Name, contact details", "You", "Same as above"],
              ["Commercial information", "Services you’re interested in, budget and timing ranges", "You", "Same as above"],
              ["Geolocation (coarse, self-declared)", "Your country, and province or territory in Canada — never a precise location", "You", "Same as above"],
              ["Professional information", "Your business name and website", "You", "Same as above"],
              ["Internet or network activity", "Browser user-agent, campaign tag in the link you followed", "Your browser", "Hosting and database providers"],
              ["Inferences", "Your free assessment result, which describes your business", "Our scoring of your answers", "Hosting, database, email delivery and business email providers"],
            ],
          },
        },
        {
          p: "We do not collect sensitive personal information as the CCPA defines it, so the right to limit its use does not apply. We have not sold or shared any category of personal information, and we have no actual knowledge of selling or sharing information about anyone under 16. Purposes and retention for each category are described in “How we use it” and “How long we keep it”.",
        },
        {
          p: "California’s “Shine the Light” law (Civil Code § 1798.83) lets California residents ask which personal information a business disclosed to third parties for their direct marketing. We don’t make such disclosures.",
        },
      ],
    },
    {
      id: "other-states",
      heading: "Residents of other US states",
      blocks: [
        {
          p: "Virginia, Colorado, Connecticut, Texas, Oregon and more than a dozen other states have comprehensive privacy laws. Most apply only above a volume threshold — commonly 100,000 residents of that state a year (35,000 in Connecticut since July 1, 2026, and in Maryland, Delaware, New Hampshire and Rhode Island; 25,000 in Montana) — or to companies that sell personal data. Texas and Nebraska don’t apply to small businesses, apart from a rule against selling sensitive data without consent. Most of these laws also don’t cover people acting in a business capacity, which is how most people contact us.",
        },
        {
          p: "We don’t believe any of these laws currently applies to us, but we honor the same rights for everyone: access, correction, deletion, a portable copy, and an appeal, through the single process in “Your rights and choices”. We don’t sell personal data, use it for targeted advertising, or use it for profiling that produces legal or similarly significant effects, so there is nothing to opt out of.",
        },
      ],
    },
    {
      id: "united-kingdom",
      heading: "Visitors in the United Kingdom",
      blocks: [
        {
          p: `If you are in the United Kingdom, the UK General Data Protection Regulation and the Data Protection Act 2018 apply. ${LEGAL_ISSUER} is the controller of your personal data, and you can reach us at ${PRIVACY_EMAIL} or ${MAILING_ADDRESS}.`,
        },
        {
          p: `Because we offer our services to businesses in the United Kingdom and are not established there, we have appointed a representative under Article 27 of the UK GDPR: ${UK_REPRESENTATIVE}. You or the Information Commissioner’s Office can contact our representative instead of, or as well as, us about anything to do with how we handle your personal data.`,
        },
        {
          table: {
            caption: "Why we use your information, and our lawful basis (UK)",
            head: ["Purpose", "Lawful basis"],
            rows: [
              ["Replying to your message and following up on it", "Our legitimate interests in answering business enquiries and developing our business"],
              ["Scoping a project you ask about, or giving you a free assessment you request", "Taking steps at your request before entering into a contract"],
              ["Keeping the site and our forms secure, and preventing spam and abuse", "Our legitimate interests in protecting our systems and the people who use them"],
              ["Meeting legal obligations, and establishing or defending legal claims", "Legal obligation, or our legitimate interests"],
            ],
          },
        },
        {
          p: "Giving us your details is voluntary, but we can’t reply without a way to reach you. We don’t make decisions about you based solely on automated processing that have legal or similarly significant effects; the free assessment scores your business’s answers and a person reviews every submission.",
        },
        {
          p: "Your rights: you can ask to access, correct or erase your personal data, to restrict how we use it, to object to our use of it — including an absolute right to object to direct marketing — and to receive it in a portable format. Use the process in “Your rights and choices”; we respond within one month. You also have the right to complain to the Information Commissioner’s Office (ico.org.uk), though we’d appreciate the chance to put things right first.",
        },
        {
          p: "Transfers to the United States: our hosting and email-delivery providers process UK data under the UK International Data Transfer Addendum to the European Commission’s Standard Contractual Clauses, and our email-delivery provider also participates in the UK Extension to the EU-US Data Privacy Framework. We require the same, or another safeguard recognized under UK law, from any other provider that handles your data. You can ask us for a copy of the relevant safeguards.",
        },
        { p: "Retention is described in “How long we keep it”." },
      ],
    },
    {
      id: "canada",
      heading: "Visitors in Canada",
      blocks: [
        {
          p: `If you are in Canada (outside Quebec, where we don’t offer services), the Personal Information Protection and Electronic Documents Act (PIPEDA) applies. Our founder is the person accountable for our compliance and can be reached at ${PRIVACY_EMAIL} or ${MAILING_ADDRESS}.`,
        },
        {
          p: "Consent and purposes: by submitting a form you consent to our collecting and using your information for the purposes in “How we use it” — mainly to reply to you. You can withdraw your consent at any time by telling us, subject to legal or contractual restrictions; we may then be unable to respond to your request. We collect only what we need for those purposes.",
        },
        {
          p: "Cross-border processing: your information is stored and processed in the United States by us and our service providers, and may be accessible to courts, law-enforcement and national-security authorities there under US law.",
        },
        {
          p: "Access and correction: you can ask to see the personal information we hold about you and to have it corrected, using the process in “Your rights and choices”; we respond within 30 days. If you’re not satisfied with our answer, you can complain to the Office of the Privacy Commissioner of Canada (priv.gc.ca).",
        },
        {
          p: "Commercial email: when you send us an enquiry, Canada’s Anti-Spam Legislation lets us send you commercial messages about it for six months. After those six months we send commercial messages only if you have agreed to receive them. Every message identifies us, includes our contact details and lets you unsubscribe, and we honor any request to stop within 10 business days. Replies to your own questions are not limited by this.",
        },
      ],
    },
    {
      id: "your-privacy-choices",
      heading: "Do Not Track and Global Privacy Control",
      blocks: [
        {
          p: "Some browsers send a “Do Not Track” (DNT) or Global Privacy Control (GPC) signal. Our site does not track you across other websites over time, does not allow other companies to do so through our site, and does not sell or share personal information, so there is nothing for these signals to switch off today. If your browser sends Global Privacy Control, our cookie banner records “Reject non-essential” for you automatically, doesn’t ask, and doesn’t offer “Accept all”.",
        },
        {
          p: "If we ever add an advertising or analytics tool that would sell or share personal information, we will treat a GPC signal as a valid request to opt out of selling and sharing for that browser, and we will update this policy before the tool goes live.",
        },
      ],
    },
    {
      id: "children",
      heading: "Children",
      blocks: [
        {
          p: "Our site is for businesses and is not directed to children. Our forms are for adults acting for a business: you must be 18 or older to submit them. We don’t knowingly collect personal information from anyone under 18, including children under 13 as covered by the federal Children’s Online Privacy Protection Act. If we learn that we have, we will delete it promptly. If you believe a child has sent us information, email us at the address below.",
        },
      ],
    },
    {
      id: "security",
      heading: "How we protect it",
      blocks: [
        {
          list: [
            "The site is served only over encrypted HTTPS connections, and browsers are told to refuse unencrypted connections to it (HSTS).",
            "A strict content security policy allows the site to load scripts, styles, fonts and images only from our own domain.",
            "Our database stores no IP addresses, and our application logs record event codes and IDs, never form contents, IP addresses or email addresses.",
            "Form submissions are sent to the database over encrypted connections, and access to them is limited to the people at Z Best Media who need it to respond to you.",
            "Forms are protected against automated abuse with rate limits and spam traps.",
          ],
        },
        {
          p: "No method of transmission or storage is completely secure, so we can’t guarantee absolute security. If a breach affects your personal information, we will notify you and the authorities as the law requires.",
        },
      ],
    },
    {
      id: "international",
      heading: "Where we operate and international transfers",
      blocks: [
        {
          p: "We are based in California and serve businesses in the United States, the United Kingdom and Canada (outside Quebec). We don’t offer our services to people or businesses in France or Quebec, or to anyone in a country subject to comprehensive US sanctions, and we decline enquiries from elsewhere (see our [Terms of Service](/legal/terms-of-service#service-area)).",
        },
        {
          p: "Information you send us is stored and processed in the United States, and may also be processed in other countries where our service providers operate. Data-protection laws there may differ from those where you live. The sections for the United Kingdom and Canada explain how we protect information that comes from those countries.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        {
          p: "When we change this policy, we post the new version here and update the “Last updated” date at the top. If a change is material — for example, a new kind of information collected, a new purpose, or any sale or sharing — we will also put a notice on the site before it takes effect and, where we have your email address and the change affects information you already gave us, email you. We won’t apply a material change to information we already hold in a way that is less protective of you without your consent.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      blocks: [
        {
          p: `Questions, requests or complaints about privacy: email ${PRIVACY_EMAIL} or write to ${LEGAL_ISSUER}, ${MAILING_ADDRESS}. We aim to answer every message within 10 business days.`,
        },
        { p: "Related: our [Cookie Policy](/legal/cookie-policy) and [Terms of Service](/legal/terms-of-service)." },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Terms of Service (website terms of use)                                    */
/* -------------------------------------------------------------------------- */

const termsOfService: InEffectLegalDocument = {
  title: "Terms of Service",
  subtitle:
    "The rules for using zbestmedia.com and its free tools. Paid work is covered by a separate client agreement.",
  summary: [
    "These terms cover using our website and its free tools. They don’t cover paid services — those are governed by the written agreement we sign with each client.",
    "Free assessments are informational estimates based on your answers. They aren’t a guarantee of results and aren’t legal, tax, accounting or financial advice.",
    "We serve clients in the United States, the United Kingdom and Canada (excluding Quebec), and not in France, Quebec or sanctioned countries.",
    "Use the site lawfully and don’t try to break, overload or scrape it.",
    "California law applies, and disputes go to the courts in Los Angeles County — or small claims court. There is no mandatory arbitration and no class-action waiver.",
  ],
  sections: [
    {
      id: "agreement",
      heading: "Who we are and how these terms work",
      blocks: [
        {
          p: `These terms are an agreement between you and ${LEGAL_ISSUER} (“Z Best Media”, “we”, “us”). They apply when you visit zbestmedia.com or use anything on it, including the contact and intake forms and the free assessment tools (together, the “site”). By using the site you agree to them. If you don’t agree, please don’t use the site.`,
        },
        {
          p: "If you use the site for a business, you confirm that you may act for that business, and “you” includes it.",
        },
      ],
    },
    {
      id: "client-agreements",
      heading: "Paid services are governed by a separate agreement",
      blocks: [
        {
          p: "Nothing on the site is an offer to provide services, and submitting a form doesn’t create a client relationship or oblige either of us to do business. Any paid work — advertising, media buying, out-of-home placements, revenue recovery audits or anything else — happens only under a written agreement signed by both of us, such as a master services agreement and a statement of work (a “client agreement”).",
        },
        {
          p: "Prices, deliverables, payment terms, ownership of work product and our responsibilities for paid work are set by the client agreement, not by these terms or by statements on the site. If a client agreement conflicts with these terms, the client agreement controls.",
        },
      ],
    },
    {
      id: "service-area",
      heading: "Service area",
      blocks: [
        {
          p: "We serve clients in the United States, the United Kingdom and Canada (excluding Quebec). We do not offer our services to people or businesses located in France or the Province of Quebec, or to anyone who is located in, or organized or ordinarily resident in, a country or region subject to comprehensive US sanctions, or who is named on — or owned or controlled by someone named on — a US sanctions list. We decline enquiries from outside our service area, and we may ask where you or your business is located before replying.",
        },
        {
          p: "By submitting a form you confirm that you and the business you represent are within our service area and are not a sanctioned person as described above.",
        },
      ],
    },
    {
      id: "eligibility",
      heading: "Who may use the site",
      blocks: [
        {
          p: "The site is meant for businesses and the people who work for them. You must be at least 18 years old to submit a form. You must not use the site if the law forbids you from doing so.",
        },
      ],
    },
    {
      id: "free-tools",
      heading: "Free assessments and other tools",
      blocks: [
        { p: "Our free assessment tools score the answers you give against a fixed set of rules and show you a result. Please understand what that result is and isn’t:" },
        {
          list: [
            "It is an estimate based only on your own answers. We don’t check those answers, and we don’t look at your business’s systems or data to produce it.",
            "It is general, informational guidance. It is not legal, tax, accounting, financial or other professional advice, and it doesn’t create a professional or advisory relationship.",
            "It is not a promise or prediction of any result. We don’t guarantee that following it will increase revenue, recover lost revenue, generate leads or produce any other outcome.",
            "Before you make a business decision, use your own judgment and, where appropriate, ask a qualified professional.",
          ],
        },
        {
          p: "We may change a tool’s questions or rules at any time. If they change while you’re filling one in, the tool tells you, saves nothing and asks you to reload the current version, rather than scoring you against rules you weren’t shown. The tools are free, and we may change, suspend or retire them at any time.",
        },
        {
          p: "Examples, figures and scenarios on the site are illustrative unless we say otherwise. Results described anywhere on the site are not typical or guaranteed.",
        },
      ],
    },
    {
      id: "submissions",
      heading: "What you send us",
      blocks: [
        {
          list: [
            "Give accurate information, and send only information you have the right to share.",
            "Don’t send confidential information belonging to someone else, or sensitive personal information (for example health information, account numbers or passwords). We don’t need it, and we can’t treat a website form as a confidential channel.",
            "You keep ownership of what you send. You let us use it to respond to you, deliver the tool you used, follow up with you and run the site, as described in our [Privacy Policy](/legal/privacy-policy).",
          ],
        },
        {
          p: "If you send us ideas or suggestions about our site or services, we may use them without any obligation to you. This doesn’t give us any right to your confidential information or to anything covered by a client agreement.",
        },
      ],
    },
    {
      id: "acceptable-use",
      heading: "Acceptable use",
      blocks: [
        { p: "You agree not to:" },
        {
          list: [
            "use the site for anything unlawful, fraudulent or deceptive, or to impersonate anyone;",
            "submit forms automatically, in bulk or with false information, or send spam, malware or harmful code;",
            "get around rate limits, spam protections or other security measures, or try to access systems or data you aren’t authorized to access;",
            "probe or test the site’s security without our written permission (if you’ve found a vulnerability, please tell us at the address below — we’ll be grateful);",
            "scrape, crawl or copy the site in a way that places an unreasonable load on it, or use its content to build a competing product;",
            "interfere with anyone else’s use of the site.",
          ],
        },
        {
          p: "We may block access, refuse submissions or take other reasonable steps if we believe these terms are being broken.",
        },
      ],
    },
    {
      id: "ip",
      heading: "Our content and trademarks",
      blocks: [
        {
          p: "The site and its content — text, design, graphics, the assessment questions and scoring rules, and the software — belong to Z Best Media or our licensors and are protected by intellectual property laws. You may view the site and print or save pages for your own internal business use in deciding whether to work with us. Any other copying, republishing or commercial use needs our written permission.",
        },
        {
          p: "“Z Best Media”, “Z Best Clips” and our logos are our trademarks. You may not use them in a way that suggests we endorse you or are affiliated with you without our written permission.",
        },
      ],
    },
    {
      id: "links",
      heading: "Other websites",
      blocks: [
        {
          p: "The site links to other websites, including Z Best Clips (zbestclips.com), which has its own terms and policies. We aren’t responsible for other websites’ content or practices, and a link isn’t an endorsement.",
        },
      ],
    },
    {
      id: "disclaimers",
      heading: "Disclaimers",
      blocks: [
        {
          p: "We work hard to keep the site accurate and available, but we provide it and its free tools “as is” and “as available”. To the fullest extent the law allows, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement, and we don’t promise the site will be uninterrupted, error-free or free of harmful components.",
        },
        {
          p: "Nothing in these terms limits any warranty or right that the law does not allow to be limited.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      blocks: [
        {
          p: "To the fullest extent the law allows, Z Best Media will not be liable for any indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue, data or business opportunity, arising out of or relating to the site or these terms. Our total liability for all claims arising out of or relating to the site or these terms is limited to one hundred US dollars (US$100). This reflects that the site and its tools are provided free of charge.",
        },
        {
          p: "These limits do not apply to liability for fraud, for willful injury to a person or property, for gross negligence, for violation of law, for death or personal injury caused by negligence, or to any other liability that California Civil Code § 1668 or other applicable law does not allow to be excluded or limited. They also don’t limit anything in a client agreement, which has its own terms.",
        },
      ],
    },
    {
      id: "indemnity",
      heading: "Your responsibility for misuse",
      blocks: [
        {
          p: "If a third party brings a claim against Z Best Media because you broke these terms, broke the law or infringed someone’s rights through what you submitted to the site, you will cover the reasonable costs and losses (including reasonable attorneys’ fees) that result, to the extent the law allows. We’ll tell you promptly about the claim, let you participate in the defense with counsel of your choice at your expense, and won’t settle in a way that admits fault on your behalf without your consent.",
        },
      ],
    },
    {
      id: "disputes",
      heading: "Governing law and resolving disputes",
      blocks: [
        {
          p: `Talk to us first. Most problems can be fixed quickly. Before starting any legal proceeding about the site or these terms, please send a written description of the problem and what you want to ${LEGAL_EMAIL} or ${MAILING_ADDRESS}, and give us 30 days to try to resolve it with you. This doesn’t stop either of us from seeking urgent court orders to prevent immediate harm, and any deadline for bringing a claim is paused during those 30 days.`,
        },
        {
          p: "Governing law. These terms and any dispute about the site are governed by the laws of the State of California and applicable US federal law, without regard to conflict-of-law rules.",
        },
        {
          p: "Where disputes go. Any dispute that isn’t resolved informally will be heard only in the state or federal courts located in Los Angeles County, California, and you and we consent to their jurisdiction. Either of us may instead bring an individual claim in small claims court if it qualifies.",
        },
        {
          p: "No mandatory arbitration. These terms do not require arbitration and do not waive your right to bring or join a class action or to a jury trial.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      blocks: [
        {
          p: "We may update these terms. The new version takes effect when we post it here with a new “Last updated” date, and applies only to use of the site from then on. If a change is material, we’ll also put a notice on the site. A change never applies to a dispute that either of us had already raised in writing.",
        },
      ],
    },
    {
      id: "general",
      heading: "General",
      blocks: [
        {
          list: [
            "These terms, together with our [Privacy Policy](/legal/privacy-policy) and [Cookie Policy](/legal/cookie-policy), are the entire agreement between us about the site. A client agreement governs paid services.",
            "If any part of these terms is found unenforceable, that part is limited to the minimum extent necessary and the rest stays in effect.",
            "If we don’t enforce a term right away, we haven’t waived it.",
            "You may not transfer these terms. We may transfer them to a company that acquires all or part of our business.",
            "We may suspend or end access to the site at any time. The sections on what you send us, our content, disclaimers, limitation of liability, your responsibility for misuse, and disputes survive.",
            "We may send you notices about these terms by email to the address you gave us or by posting them on the site.",
          ],
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      blocks: [
        {
          p: `${LEGAL_ISSUER} · ${MAILING_ADDRESS} · ${LEGAL_EMAIL}`,
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Cookie Policy                                                              */
/* -------------------------------------------------------------------------- */

/** The banner's text on ZBM — must say the same thing as the Cookie Policy. */
export const CONSENT_SUMMARY =
  "This site doesn’t use analytics or advertising cookies. We keep one setting in your browser to remember this choice. Optional tools, if we ever add them, stay off unless you accept them.";

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    name: "Strictly necessary",
    body: "One item in your browser’s local storage that remembers your choice on this banner. It never leaves your browser.",
  },
  { name: "Analytics", body: "Not used on this site." },
  { name: "Advertising", body: "Not used on this site." },
];

const cookiePolicy: InEffectLegalDocument = {
  title: "Cookie Policy",
  subtitle: "Exactly what zbestmedia.com stores in your browser, and how to control it.",
  summary: [
    "Our site sets no cookies of its own.",
    "It stores one item in your browser — your choice on the cookie banner — so the banner doesn’t ask again on every page.",
    "There are no analytics, advertising or social-media cookies, pixels or tracking scripts, and our fonts are served from our own domain.",
    "If we ever add an optional tool, it will stay off until you accept it, and we’ll ask you again first.",
  ],
  sections: [
    {
      id: "what",
      heading: "Cookies and similar technologies",
      blocks: [
        {
          p: "A cookie is a small text file a website saves in your browser. “Local storage” is a similar browser feature that lets a site save a small piece of information on your device. This policy covers both, and any similar technology, on zbestmedia.com. Our [Privacy Policy](/legal/privacy-policy) explains how we handle personal information more generally.",
        },
      ],
    },
    {
      id: "what-we-use",
      heading: "What we use",
      blocks: [
        {
          table: {
            caption: "Everything the site stores in your browser",
            head: ["Name", "Type", "Set by", "Purpose", "What it holds", "How long"],
            rows: [
              [
                "zbest-cookie-consent",
                "Local storage (not a cookie)",
                "Z Best Media (first party)",
                "Strictly necessary. Remembers your choice on the cookie banner so it isn’t shown on every page.",
                "Your choice (“accepted-all” or “rejected-non-essential”), the time it was made, and whether your browser’s Global Privacy Control signal made it for you.",
                "Until you clear your browser’s site data. It is never sent to us.",
              ],
            ],
          },
        },
        {
          p: "That is the complete list for the public site. Strictly necessary storage doesn’t need your consent, because the site can’t remember your choice without it.",
        },
        {
          p: "Our hosting provider’s security systems may, rarely and only during an attack on the site, set a short-lived strictly necessary cookie to check that a visitor is a person rather than a bot. Preview versions of the site used by our own team can load our hosting provider’s collaboration toolbar; it isn’t on the public site.",
        },
      ],
    },
    {
      id: "what-we-dont",
      heading: "What we don’t use",
      blocks: [
        {
          list: [
            "No analytics cookies or traffic-measurement scripts.",
            "No advertising cookies, retargeting pixels or conversion tags (for example from Google or Meta).",
            "No social-media widgets, embedded videos or third-party chat tools that set their own cookies.",
            "No session recording and no device fingerprinting.",
            "No third-party fonts: our typefaces are served from our own domain, so loading a page doesn’t contact a font provider.",
          ],
        },
        {
          p: "The site’s security policy instructs your browser to load scripts, styles, fonts and images only from our own domain, which also stops third-party trackers from loading.",
        },
      ],
    },
    {
      id: "choices",
      heading: "Your choices",
      blocks: [
        {
          p: "The cookie banner lets you “Accept all” or “Reject non-essential”, with equal prominence. Because the site has no non-essential cookies today, both choices currently lead to the same experience; we record your choice so it is ready to apply if that ever changes. You can change it at any time with the “Change cookie settings” button on this page, or through “Cookie Settings” in the site footer.",
        },
        {
          p: "If we ever add an optional analytics or advertising tool, we will update this policy before it goes live, keep it switched off unless you accept it, and ask you again — an earlier “Accept all”, given before the tool existed, won’t count as consent to it. If your browser sends Global Privacy Control, we record “Reject non-essential” for you automatically and don’t show the banner; that will also count as a request to opt out of any selling or sharing of personal information.",
        },
        {
          p: "You can also use your browser’s settings to block cookies or clear site data. Clearing site data for zbestmedia.com removes your banner choice, and the banner will ask again on your next visit. Blocking storage entirely won’t stop the site from working; the banner may just appear more often.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        {
          p: "We’ll update this policy, and the “Last updated” date at the top, whenever we change what the site stores in your browser.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      blocks: [{ p: `Questions about this policy: ${PRIVACY_EMAIL} or ${MAILING_ADDRESS}.` }],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Accessibility Statement                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Source: the independent WCAG 2.2 AA audit of main 6960b6b, Oct 30 2026
 * (drafting notes). Each "known limitation" below is a finding from it. When a
 * fix lands, remove its line here in the same commit, and update the date.
 */
const accessibilityStatement: InEffectLegalDocument = {
  title: "Accessibility Statement",
  subtitle: "How accessible zbestmedia.com is today, what we’re fixing, and how to tell us about a problem.",
  summary: [
    "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.",
    "Today the site partially conforms. An audit on October 30, 2026 found a few problems, listed below, and we are fixing them.",
    "We don’t use accessibility overlays. We fix the site itself.",
    `If anything is hard to use, email ${ACCESSIBILITY_EMAIL} and we’ll help another way while we fix it.`,
  ],
  sections: [
    {
      id: "commitment",
      heading: "Our commitment",
      blocks: [
        {
          p: "We want everyone to be able to use this website, including people who use screen readers, keyboard navigation, magnification, voice control or other assistive technology.",
        },
        {
          p: "Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. We check the site with automated tools and by hand, including keyboard-only navigation and reflow at 320 pixels wide, and we treat accessibility failures as bugs.",
        },
      ],
    },
    {
      id: "status",
      heading: "Conformance status",
      blocks: [
        {
          p: "This site partially conforms to WCAG 2.2 Level AA: some parts of the content don’t yet fully meet the standard. An accessibility audit on October 30, 2026 found no blocking issues, and automated scans found no color-contrast, labeling, name or role failures. It did find the limitations below.",
        },
      ],
    },
    {
      id: "limitations",
      heading: "Known limitations",
      blocks: [
        {
          list: [
            "While the cookie notice is open, it can cover the item you have tabbed to. Choosing an option in the notice removes the problem. Tabbing backward can also place the focused item under the top navigation bar.",
            "When the site is zoomed to 400%, the opened mobile menu can’t scroll to its lower links. Every page is also linked from the footer.",
            "Form field outlines are lower in contrast than the standard requires.",
            "After you submit a form, keyboard focus returns to the top of the page instead of moving to the first error or to the confirmation.",
            "Some section titles are styled as headings but are not coded as headings.",
            "The opening text on the homepage fades as you scroll. Turning on “reduce motion” in your device settings turns this off.",
          ],
        },
        {
          p: "We have not yet completed testing with the NVDA, JAWS, VoiceOver or TalkBack screen readers. The site has no video or audio content today; when it does, we will provide captions and transcripts.",
        },
      ],
    },
    {
      id: "feedback",
      heading: "Tell us about a problem",
      blocks: [
        {
          p: `If anything on this site is hard to use, email ${ACCESSIBILITY_EMAIL} or write to us at ${MAILING_ADDRESS}. Tell us the page and what happened. We aim to reply within two business days, and we will provide the information or service another way while we work on a fix.`,
        },
      ],
    },
    {
      id: "approach",
      heading: "How we work on accessibility",
      blocks: [
        {
          list: [
            "Pages are built with semantic HTML: a page language, one main heading per page, landmarks, labeled form fields and real buttons and links.",
            "The site respects your device’s “reduce motion” setting.",
            "We don’t use accessibility overlays or widgets that change the page for you; we fix the underlying code.",
            "We review this statement whenever we fix a limitation or find a new one, and update the date at the top.",
          ],
        },
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
  "cookie-policy": cookiePolicy,
  accessibility: accessibilityStatement,
} satisfies Record<string, InEffectLegalDocument>;

export type LegalDocument = keyof typeof LEGAL_DOCUMENTS;

/**
 * Every fact still to be supplied, across all three documents and the header
 * lines. Empty means the documents are ready to ship.
 */
export function unfilledLegalPlaceholders(): string[] {
  return legalPlaceholders([
    LEGAL_ISSUER,
    LEGAL_EFFECTIVE_DATE,
    LEGAL_LAST_UPDATED,
    ...Object.values(LEGAL_DOCUMENTS).flatMap(legalDocumentStrings),
  ]);
}
