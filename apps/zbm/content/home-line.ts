/**
 * The homepage's customer line (founder direction 2026-11-07, homepage concept
 * "Audit + Line"; prototype in ~/WebstormProjects/zbm-wow-concepts/b-the-line).
 *
 * One customer, followed from the first ad they notice to the booking. The
 * visitor picks a kind of business and every stop's story changes with it.
 *
 * COPY RULES (carried from content/services.ts and the Sep 17 rulings):
 *   - The brands are fictional concept brands; every image of them carries its
 *     ConceptBadge through MediaFrame.
 *   - What ZBM does at each stop is the approved service summary from
 *     content/services.ts, never new capability copy (no "we buy" claims).
 *   - Findings are labeled "Example finding". No numbers presented as results.
 */

export const BUSINESSES = [
  { id: "auto", label: "Auto dealer" },
  { id: "medspa", label: "Med spa" },
  { id: "law", label: "Injury law" },
  { id: "restaurant", label: "Restaurant" },
  { id: "artist", label: "Artist" },
] as const;

export type BizId = (typeof BUSINESSES)[number]["id"];

export type BizStory = {
  ooh: string;
  heard: string;
  radio: string;
  tv: string;
  social: string;
  creator: string;
  clip: string;
  query: string;
  search: string;
  web: string;
  leakKind: string;
  leakTitle: string;
  leak: string;
  finding: string;
  confidence: string;
  fix: string;
  booked: string;
};

export const STORIES: Record<BizId, BizStory> = {
  auto: {
    ooh: "Stuck in traffic on the 10, she looks up at a poster for a dealer she has never heard of. Quellmont Motors. “Your car is ready.”",
    heard: "The price on the window is the price.",
    radio: "Two days later the same promise comes through the car speakers on the drive home.",
    tv: "Sunday night, a streaming break. Keys handed across a desk, and the same line about the price.",
    social: "In her feed, a window sticker with the full price printed on it. She saves the post.",
    creator: "A local creator walks the lot on camera and asks what the sticker price includes.",
    clip: "Short clips of that walk-through show up on three accounts she already follows.",
    query: "quellmont motors price",
    search: "She searches the name. The ad at the top goes straight to the car she saved, not to the homepage.",
    web: "The page shows the car, the price and one button: Get a quote.",
    leakKind: "No follow-up",
    leakTitle: "Then nobody wrote back.",
    leak: "She asks for a quote on a Tuesday. Nine days later, nothing. She buys from the dealer who called her back.",
    finding: "Quote requests from the website go to an inbox nobody checks. No one replies.",
    confidence: "Confirmed by test submission",
    fix: "Route quote requests to sales and reply the same day",
    booked: "With replies going out the same day, the next customer who asks for a quote hears back, and books a test drive.",
  },
  medspa: {
    ooh: "Waiting for a table on Abbot Kinney, she looks up at a quiet treatment room and four words. “Your hour starts here.”",
    heard: "Look rested. Not done.",
    radio: "That week, a short spot on a podcast she plays on the way to work says it in a calm voice.",
    tv: "A fifteen-second spot runs before her show. Soft light, a bottle on a stone counter, the same name.",
    social: "The same line turns up in her feed. She taps through to the profile and reads every caption.",
    creator: "A creator she trusts posts week three of her treatment plan, and says what it cost.",
    clip: "Clips from that post keep reaching her for a week, cut for different accounts.",
    query: "maren vale consultation",
    search: "She searches for a consultation. The ad takes her to a booking page, not the homepage.",
    web: "The site loads clean on her phone. One headline, one button: Book a consultation.",
    leakKind: "Broken mobile form",
    leakTitle: "Then the form wouldn’t send.",
    leak: "She types her name, email and phone. The form keeps asking her to fix an error she can’t see. She closes the tab.",
    finding: "The booking form fails on iPhone. The error points to a field that is off screen.",
    confidence: "Confirmed by test on a phone",
    fix: "Rebuild the form for mobile and test it on real phones",
    booked: "With the form fixed and tested on real phones, the next person who taps Book a consultation gets a confirmation.",
  },
  law: {
    ooh: "Driving home from the accident report, he passes a bulletin. “Hurt? Talk to a lawyer before you talk to the insurer.”",
    heard: "Before you sign anything from the insurer, call us.",
    radio: "The next morning the same sentence is on the radio, word for word.",
    tv: "Late at night, a plain spot on a streaming channel. A name, a phone number, one sentence about the insurer.",
    social: "A short post explains what not to say to an adjuster. His cousin sends it to him.",
    creator: "A local news creator interviews one of the attorneys about the first week after a crash.",
    clip: "Pieces of that interview get clipped and shared in neighborhood groups.",
    query: "ironhold injury law",
    search: "He searches the firm by name. The ad goes to a page about car accidents, the reason he is searching.",
    web: "The page says what happens on the first call and shows a number he can tap.",
    leakKind: "Missed call",
    leakTitle: "Then the call went to voicemail.",
    leak: "He calls at a quarter past six. Four rings, then a full voicemail box. He calls the next firm on the list.",
    finding: "Calls after 5 pm go to a full voicemail box while search ads keep running.",
    confidence: "Confirmed by test call",
    fix: "Send after-hours calls to a live answering service",
    booked: "With after-hours calls answered, the next caller talks to a person and books a consultation.",
  },
  restaurant: {
    ooh: "Waiting for the bus on Pacific Coast Highway, she sees a plate of grilled fish and four words. “Dinner by the water.”",
    heard: "Pull up a chair by the water.",
    radio: "On the drive home, a short spot on the radio, read slowly over the sound of the pier.",
    tv: "A streaming spot shows the dining room at sunset as the pier lights come on.",
    social: "A friend tags her in a photo from the patio. She saves the restaurant.",
    creator: "A food creator films the chef plating the fish and says what the table costs for two.",
    clip: "Clips of the plating run for a week on accounts she follows.",
    query: "saltgrove reservations saturday",
    search: "She searches for a table on Saturday. The ad goes to the reservations page.",
    web: "The page shows the menu, the hours, and a phone number for parties over six.",
    leakKind: "Missed call",
    leakTitle: "Then nobody picked up.",
    leak: "She calls to book for eight. The phone rings out during the dinner rush. She books somewhere else.",
    finding: "Calls during dinner service ring out, and large parties can only book by phone.",
    confidence: "Confirmed by test calls on three nights",
    fix: "Add a large-party request form and a callback list",
    booked: "With a request form and a callback list, the next party of eight books their Saturday table.",
  },
  artist: {
    ooh: "Outside a venue on Sunset, a poster for a singer he half remembers from a playlist. Ivo Solace.",
    heard: "One night only. Tickets on sale Friday.",
    radio: "Friday morning, an audio spot plays between songs on his streaming app.",
    tv: "A live session runs on a streaming channel. Four cameras, one song, the same name.",
    social: "Fans post phone video from the last show. The comments are all asking where to get tickets.",
    creator: "A music creator he follows films a reaction to the live session.",
    clip: "Z Best Clips puts the best thirty seconds of the session in front of fans through a network of clippers.",
    query: "ivo solace tickets",
    search: "He searches for tickets. The ad goes straight to the show page.",
    web: "The page has the date, the venue and one button to buy.",
    leakKind: "Slow page",
    leakTitle: "Then the page wouldn’t load.",
    leak: "On the bus, on his phone, the ticket page spins. He means to try again later. He doesn’t.",
    finding: "The ticket page loads a full video before the Buy button appears on a phone connection.",
    confidence: "Measured on a phone connection",
    fix: "Load the Buy button first and the video after",
    booked: "With the button loading first, the next fan who taps through buys two tickets.",
  },
};
