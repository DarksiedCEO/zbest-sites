import type { FaqItem } from "@zbest/ui";

/**
 * Full-service catalog — the one source for the Services nav dropdown, the
 * footer Services column, the /services hub, the /start intake options, and the
 * six catalog-rendered service pages.
 *
 * WHY THIS EXISTS (founder direction, Oct 4 2026; recorded in
 * docs/BRIEF-AMENDMENT-2026-10-04-full-service.md): Z Best Media is a
 * full-service advertising agency and the site must show everything it sells
 * from day one — billboards, TV, radio, social, creative, influencer, websites,
 * revenue recovery, and clipping — so a campaign can send any prospect straight
 * to the service they came for. This supersedes the Brief's four-discipline
 * navigation (§A2/§A3) and the "Four disciplines" home section (§A4).
 *
 * COPY RULES carried over from the Brief and the Sep 17 founder rulings, and
 * applied to every new entry here:
 *   - No statistics, outcome numbers, client names, case studies, partner or
 *     certification claims. Nothing on these pages is presented as a result.
 *   - No named station groups, networks or platforms implied as buying
 *     relationships; channels are described generically.
 *   - Prices are not invented. New services say how they are scoped; the only
 *     published figures remain the Brief's own (Digital Advertising).
 *   - Measurement is described with its limits stated (TV and audio
 *     attribution is directional and the copy says so).
 *
 * Pages whose copy predates this file (Digital Advertising, Out-of-Home,
 * Revenue Recovery) keep their verified copy in their own route files; they
 * appear here only as catalog entries (name, summary, href).
 */

export type ServiceGroup = "media" | "content" | "conversion";

export const SERVICE_GROUPS: { id: ServiceGroup; label: string; title: string; intro: string }[] = [
  {
    id: "media",
    label: "Media",
    title: "Get seen.",
    intro: "Paid placements on every screen, speaker, and street your customers pass.",
  },
  {
    id: "content",
    label: "Content & social",
    title: "Get remembered.",
    intro: "The creative, the daily presence, and the voices that make people care.",
  },
  {
    id: "conversion",
    label: "Conversion",
    title: "Get paid.",
    intro: "The pages, calls, and follow-up that turn attention into revenue.",
  },
];

/** The FAQ/page fields only the six catalog-rendered pages carry. */
export type ServicePageCopy = {
  /** H1 on the service page and the OG image headline. */
  heroTitle: string;
  /** Meta description, ≤ ~160 characters. */
  metaDescription: string;
  lead: string[];
  included: string[];
  /** "How it fits" rows: a sibling service slug and what it adds. */
  fits: { slug: string; body: string }[];
  pricing: string;
  whoFor: string;
  faq: FaqItem[];
};

export type Service = {
  /** URL-safe id; also the /start?service= value and the intake option value. */
  slug: string;
  name: string;
  group: ServiceGroup;
  /** One line for the hub, the home list, and the intake option hint. */
  summary: string;
  href: string;
  external?: boolean;
  /** Present only for pages rendered from this file. */
  page?: ServicePageCopy;
};

export const SERVICES: Service[] = [
  // ── Media ────────────────────────────────────────────────────────────────
  {
    slug: "digital-advertising",
    name: "Digital Advertising",
    group: "media",
    summary: "Paid social, search, and platform campaigns that bring the traffic.",
    href: "/digital-advertising",
  },
  {
    slug: "tv-streaming",
    name: "TV & Streaming",
    group: "media",
    summary: "Broadcast, cable, and streaming TV — commercials on the screens people actually watch.",
    href: "/tv-streaming",
    page: {
      heroTitle: "Television, on the screens your customers actually watch.",
      metaDescription:
        "Broadcast, cable, and streaming TV campaigns — planned, produced, and measured with the limits stated plainly.",
      lead: [
        "Broadcast, cable, and streaming TV, planned around where your audience actually watches — not where inventory happens to be cheap.",
        "Streaming (connected TV) adds what traditional TV never had: targeting by geography and household, frequency you can cap, and reporting that goes past a ratings estimate. Most plans use both.",
      ],
      included: [
        "Media planning across broadcast, cable, and streaming (CTV/OTT) — the mix set by your market, audience, and budget",
        "Schedule building — dayparts, programs, and flight dates chosen for reach and frequency, not filler",
        "Commercial production — :15, :30, and :60 spots made by our Creative & Production team, or cut from footage you already have",
        "Streaming targeting — by geography, household, and audience segment, with frequency capped so the same viewer isn’t hammered",
        "Measurement that connects airtime to response — calls, site visits, and branded search lined up against when spots ran, with the confidence stated plainly",
      ],
      fits: [
        { slug: "creative-production", body: "makes the commercial" },
        { slug: "digital-advertising", body: "catches the search and social demand TV creates" },
        { slug: "revenue-recovery", body: "makes sure the calls TV generates actually get answered" },
      ],
      pricing:
        "Scoped individually by market, network or platform, daypart, and flight length. Production is quoted separately from media.",
      whoFor:
        "Businesses ready to reach a whole market at once — local brands stepping up from digital-only, multi-location brands, auto dealers, entertainment releases, and anyone launching something people need to hear about fast.",
      faq: [
        {
          question: "Can a local business afford TV?",
          answer:
            "Often, yes — especially on streaming, where a campaign can be limited to the zip codes you serve instead of paying for a whole market. We’ll tell you plainly if TV isn’t the right next dollar for your business.",
        },
        {
          question: "What’s the difference between broadcast, cable, and streaming?",
          answer:
            "Broadcast airs on local stations across a whole market. Cable runs on cable networks and can be bought by smaller geographic zones. Streaming (connected TV) runs inside streaming apps and can be targeted by household and audience.",
        },
        {
          question: "Do you make the commercial?",
          answer:
            "Yes — through our Creative & Production team. We can also cut a spot from footage and brand assets you already have.",
        },
        {
          question: "How do you measure whether TV worked?",
          answer:
            "We line up your calls, site traffic, and branded search against when your spots ran, and report the lift with a confidence label. TV measurement is directional, and we say so rather than overclaim.",
        },
        {
          question: "How long should a TV campaign run?",
          answer:
            "Long enough to build frequency — a single week rarely shows you anything. We set the flight with you based on your goal and budget, before anything airs.",
        },
      ],
    },
  },
  {
    slug: "radio-audio",
    name: "Radio & Audio",
    group: "media",
    summary: "AM/FM radio, streaming audio, and podcasts — heard where screens can’t reach.",
    href: "/radio-audio",
    page: {
      heroTitle: "Be heard where screens can’t reach.",
      metaDescription:
        "AM/FM radio, streaming audio, and podcast advertising — planned, written, produced, and tracked.",
      lead: [
        "AM/FM radio, streaming audio, and podcasts reach people in the car, at work, and on the move — moments no feed or billboard owns.",
        "We plan the mix, write and produce the spots, and build in the tracking that shows what they drive.",
      ],
      included: [
        "Station and platform planning — AM/FM, streaming audio services, and podcasts matched to your listener, market, and budget",
        "Spot writing and production — scripts, voice talent, music, and final mix, through our Creative & Production team",
        "Host-read and sponsorship placements — on-air and podcast reads where a trusted voice sells better than a produced spot, always disclosed as advertising",
        "Scheduling — dayparts and frequency set so your message is heard enough times to stick",
        "Response tracking — dedicated phone numbers, web addresses, and offer codes so audio’s results show up in your numbers",
      ],
      fits: [
        { slug: "creative-production", body: "writes and produces the spot" },
        { slug: "out-of-home", body: "puts the same message on the road your listeners are driving" },
        { slug: "revenue-recovery", body: "makes sure the calls radio generates actually get answered" },
      ],
      pricing:
        "Scoped individually by market, station or platform, daypart, and flight length. Production is quoted separately from media.",
      whoFor:
        "Local service businesses that live on phone calls, auto dealers, restaurants, events and venues, music releases, and multi-location brands.",
      faq: [
        {
          question: "Is radio still worth it?",
          answer:
            "For many local businesses, yes — it reaches people during the commute and the workday, when they aren’t looking at a screen. Whether it’s right for you depends on your market and your offer, and we’ll tell you honestly.",
        },
        {
          question: "What’s the difference between AM/FM and streaming audio?",
          answer:
            "AM/FM reaches everyone tuned to a station in your market. Streaming audio and podcasts can be targeted by listener, location, and interest, and report what was delivered. Plans often use both.",
        },
        {
          question: "Do you write and produce the spots?",
          answer:
            "Yes — script, voice talent, music, and mix, through our Creative & Production team. You approve the script before anything is recorded.",
        },
        {
          question: "What’s a host-read ad?",
          answer:
            "The show’s host delivers your message in their own voice. It carries the host’s credibility, and it is always identified as a paid message.",
        },
        {
          question: "How do you track results from audio?",
          answer:
            "With a phone number, web address, or offer code used only in the audio campaign, plus your call and site data lined up against the schedule. Audio attribution is directional, and we report it that way.",
        },
      ],
    },
  },
  {
    slug: "out-of-home",
    name: "Out-of-Home",
    group: "media",
    summary: "Billboards, transit, and physical placements. Presence you can’t scroll past.",
    href: "/out-of-home",
  },

  // ── Content & social ────────────────────────────────────────────────────
  {
    slug: "social-media",
    name: "Social Media",
    group: "content",
    summary: "Strategy, content, posting, community, and reputation — run every day.",
    href: "/social-media",
    page: {
      heroTitle: "Social that runs every day, not when someone remembers.",
      metaDescription:
        "Social media management — strategy, content, publishing, community management, and reputation monitoring.",
      lead: [
        "Strategy, content, publishing, community management, and reputation — your social presence run as a daily discipline, not a side task.",
        "Organic social builds the audience and the trust. Paid social, through Digital Advertising, scales what’s already proven to work.",
      ],
      included: [
        "Channel strategy — the platforms your customers actually use, not every platform there is",
        "Content calendar and production — posts, short-form video, and stories built with our Creative & Production team",
        "Publishing — a consistent cadence in each platform’s native formats",
        "Community management — comments and messages answered, with escalation rules agreed with you up front",
        "Reputation monitoring — reviews and mentions watched, with responses drafted for your approval",
        "Monthly reporting — reach, engagement, and the actions that matter to your business, plus what we’re changing next",
      ],
      fits: [
        { slug: "digital-advertising", body: "puts paid spend behind the posts that are already working" },
        { slug: "z-best-clips", body: "spreads your short-form video across a network of creator accounts" },
        { slug: "creative-production", body: "makes the content" },
      ],
      pricing:
        "Monthly, scoped by number of channels, posting cadence, and content volume.",
      whoFor:
        "Businesses whose customers check social before they buy — med spas, restaurants, home services, retail, entertainment, and creators building a personal brand.",
      faq: [
        {
          question: "Which platforms do you manage?",
          answer:
            "Instagram, Facebook, TikTok, YouTube, LinkedIn, and X — whichever of them your customers actually use. We’d rather run two channels well than six badly.",
        },
        {
          question: "Do I have to approve every post?",
          answer:
            "Your call. Approve each post, approve the monthly calendar, or agree on guidelines up front and let us run. We set it with you before anything is published.",
        },
        {
          question: "Do you create the content, or do I provide it?",
          answer:
            "Either. We produce it through our Creative & Production team, work from photos and video you send, or mix the two.",
        },
        {
          question: "What’s the difference between organic and paid social?",
          answer:
            "Organic is what you post to your own audience. Paid puts budget behind content to reach people who don’t follow you yet. Organic finds what resonates; paid scales it.",
        },
        {
          question: "How is this different from Z Best Clips?",
          answer:
            "Social Media runs your own accounts. Z Best Clips distributes short clips of your content across a network of independent creators’ accounts, so it reaches audiences your accounts don’t.",
        },
      ],
    },
  },
  {
    slug: "creative-production",
    name: "Creative & Production",
    group: "content",
    summary: "Commercials, video, audio, design, and brand identity — made for the channel it runs on.",
    href: "/creative-production",
    page: {
      heroTitle: "Creative built to be measured, not just admired.",
      metaDescription:
        "Commercials, short-form video, audio, design, and brand identity — made for the channel and judged by what it does.",
      lead: [
        "Commercials, short-form video, audio, design, and brand identity — made for the channel it runs on and judged by what it does once it’s live.",
        "One team makes the creative for every service we run, so the billboard, the TV spot, and the social post all sound like the same brand.",
      ],
      included: [
        "Video — TV and streaming commercials, short-form social video, and brand films",
        "Audio — radio and podcast spots, voice talent, and music",
        "Design — ad creative, billboard and print layouts, social graphics, and presentations",
        "Brand identity — names, logos, visual systems, and brand guidelines",
        "Copywriting — scripts, headlines, ad copy, and web copy",
        "Creative testing — variations built to be tested, with winners kept and losers retired on evidence",
      ],
      fits: [
        { slug: "tv-streaming", body: "runs the commercials" },
        { slug: "out-of-home", body: "runs the boards" },
        { slug: "social-media", body: "runs the posts" },
      ],
      pricing:
        "Per project or on retainer, scoped by deliverables, production days, and usage rights.",
      whoFor:
        "Any business whose ads need to be made — and anyone with a campaign coming that needs creative fast.",
      faq: [
        {
          question: "Do you only make creative for campaigns you run?",
          answer:
            "No. We’ll produce creative you run yourself or that another partner places.",
        },
        {
          question: "Who owns the finished work?",
          answer:
            "Ownership and usage rights are written into your agreement before production starts — including any talent, music, or stock that carries its own license.",
        },
        {
          question: "How long does production take?",
          answer:
            "It depends on the deliverable — a set of social graphics and a broadcast commercial are different jobs. Every quote comes with a schedule.",
        },
        {
          question: "Can you work with footage and brand assets we already have?",
          answer:
            "Yes. We start from what you have and make only what’s missing.",
        },
        {
          question: "How do you judge whether creative is working?",
          answer:
            "By what it does once it runs — response, recall, and cost per result — not by whether it wins a room. Variations are built so the numbers can decide.",
        },
      ],
    },
  },
  {
    slug: "influencer-marketing",
    name: "Influencer & Creator Partnerships",
    group: "content",
    summary: "Creators your customers already trust — sourced, contracted, managed, and disclosed.",
    href: "/influencer-marketing",
    page: {
      heroTitle: "Creators your customers already trust.",
      metaDescription:
        "Influencer and creator partnerships — sourcing, contracts, content review, clear ad disclosure, and results reporting.",
      lead: [
        "We find creators whose audience matches yours, negotiate the partnership, manage the content, and make sure every sponsored post is properly disclosed.",
        "You get reach that arrives with a recommendation attached — from people your customers already follow.",
      ],
      included: [
        "Creator sourcing and vetting — audience fit, engagement quality, brand safety, and past sponsorships checked before anyone is signed",
        "Partnership terms — deliverables, usage rights, exclusivity, and payment negotiated and put in writing",
        "Content briefs and review — creators keep their voice; you approve before anything posts",
        "Disclosure — every paid post clearly labeled as an ad, and checked after it goes live",
        "Paid amplification — the best creator content run as ads through Digital Advertising, with the creator’s permission",
        "Results reporting — reach, engagement, clicks, codes, and sales tied to each creator",
      ],
      fits: [
        { slug: "z-best-clips", body: "adds high-volume short-form distribution across many creator accounts" },
        { slug: "digital-advertising", body: "turns the best creator content into ads" },
        { slug: "social-media", body: "carries the partnership on your own channels" },
      ],
      pricing:
        "A management fee plus creator fees, scoped by number of creators, platforms, and deliverables. Creator fees are quoted separately from our fee.",
      whoFor:
        "Consumer brands, med spas, restaurants and hospitality, apps, entertainment releases, and local businesses with a visual story to tell.",
      faq: [
        {
          question: "How is this different from Z Best Clips?",
          answer:
            "Here, specific creators make original content about your brand. Z Best Clips pays a network of clippers to distribute short clips of content that already exists. Many campaigns use both.",
        },
        {
          question: "Do creators have to disclose that they’re paid?",
          answer:
            "Yes. Every paid post must be clearly labeled — “#ad,” “sponsored,” or the platform’s paid-partnership label — and we check that it is.",
        },
        {
          question: "Do you work with smaller creators?",
          answer:
            "Yes. We choose creators for audience fit and engagement quality, not follower count.",
        },
        {
          question: "Can we reuse creator content in our own ads?",
          answer:
            "When usage rights are negotiated for it — and we negotiate them up front so the option is there.",
        },
        {
          question: "How do you know a creator’s audience is real?",
          answer:
            "We check audience-quality signals — engagement patterns, follower growth history, and audience location — before recommending anyone.",
        },
      ],
    },
  },
  {
    slug: "z-best-clips",
    name: "Z Best Clips",
    group: "content",
    summary: "Creator-powered short-form distribution. One source, hundreds of clips, real reach.",
    href: "https://zbestclips.com",
    external: true,
  },

  // ── Conversion ──────────────────────────────────────────────────────────
  {
    slug: "revenue-recovery",
    name: "Revenue Recovery",
    group: "conversion",
    summary: "The audit that finds where your traffic leaks — and fixes it before you spend more.",
    href: "/revenue-recovery",
  },
  {
    slug: "websites",
    name: "Websites & Landing Pages",
    group: "conversion",
    summary: "Sites and landing pages built to convert the traffic you’re paying for.",
    href: "/websites",
    page: {
      heroTitle: "Websites built to convert, not just to exist.",
      metaDescription:
        "Websites and landing pages designed, written, and built to convert — fast on mobile and wired to track every lead.",
      lead: [
        "Sites and landing pages designed, written, and built for the traffic you’re paying for — fast on a phone, clear at a glance, and wired to track every lead.",
        "The site you’re reading is our own work.",
      ],
      included: [
        "Campaign landing pages — one page per offer, matched to the ad that sends the traffic",
        "Full websites — design, copy, and build on a modern stack",
        "Mobile-first performance — pages that load fast on the phone most of your visitors use",
        "Lead capture that works — forms, click-to-call, and booking wired end to end and tested before launch",
        "Accessibility — built to WCAG 2.2 AA as the target, and checked",
        "Search-ready structure — clean markup, metadata, and structured data so search engines and AI assistants can read the site",
        "Analytics and conversion tracking set up from day one",
      ],
      fits: [
        { slug: "revenue-recovery", body: "finds the leaks a new page has to fix" },
        { slug: "digital-advertising", body: "sends the traffic" },
        { slug: "creative-production", body: "makes the imagery and video" },
      ],
      pricing:
        "Per project, scoped by page count, features, and integrations. Hosting and ongoing updates are available monthly.",
      whoFor:
        "Businesses whose site is losing the traffic they pay for, anyone launching a campaign that needs its own landing page, and new businesses that need a site that works from day one.",
      faq: [
        {
          question: "What do you build on?",
          answer:
            "Usually a modern framework — this site runs on Next.js. We also work in Shopify, WordPress, and Webflow when that’s what fits your team.",
        },
        {
          question: "How long does a site take?",
          answer:
            "A landing page is a much smaller job than a full site. Every quote comes with a schedule.",
        },
        {
          question: "Do you write the copy?",
          answer: "Yes. Words, design, and build come from one team.",
        },
        {
          question: "Will I be able to update it myself?",
          answer:
            "If you want to, yes — we can set up editing for the parts you change often. Or we maintain it for you.",
        },
        {
          question: "How does this connect to Revenue Recovery?",
          answer:
            "Revenue Recovery finds where visitors drop off. Many of those leaks live on the page itself — a broken mobile form, a slow load, the wrong page for the ad. This is where they get fixed.",
        },
      ],
    },
  },
];

/** The intake's "I don't know yet" choice. Not a service page. */
export const NOT_SURE = { slug: "not-sure", name: "Not sure yet — help me figure it out" } as const;

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

/** Every value the /start intake accepts for "What do you need?". */
export const INTAKE_SERVICE_VALUES = [...SERVICE_SLUGS, NOT_SURE.slug] as const;

export const serviceBySlug = (slug: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);

/** A catalog-rendered service, or a build error — never a silent 404. */
export function pageService(slug: string): Service & { page: ServicePageCopy } {
  const service = serviceBySlug(slug);
  if (!service?.page) throw new Error(`No catalog page for service "${slug}"`);
  return service as Service & { page: ServicePageCopy };
}

/** Where a service page's "Start a Project" button points. */
export const startHref = (slug?: string) => (slug ? `/start?service=${slug}` : "/start");
