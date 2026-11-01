/// <reference types="next/image-types/global" />
import type { StaticImageData } from "next/image";
import manifest from "../../assets/manifest.json";
import ironholdBillboard from "../../assets/concepts/ironhold-billboard.png";
import ivosolaceStage from "../../assets/concepts/ivosolace-stage.png";
import marenvaleInfluencer from "../../assets/concepts/marenvale-influencer.png";
import marenvaleRoom from "../../assets/concepts/marenvale-room.png";
import marenvaleSocial from "../../assets/concepts/marenvale-social.png";
import marenvaleWebsite from "../../assets/concepts/marenvale-website.png";
import quellmontCover from "../../assets/concepts/quellmont-cover.png";
import quellmontFeedSticker from "../../assets/concepts/quellmont-feed-sticker.png";
import quellmontTvKeys from "../../assets/concepts/quellmont-tv-keys.png";
import saltgroveBrandSystem from "../../assets/concepts/saltgrove-brand-system.png";
import saltgroveRadio from "../../assets/concepts/saltgrove-radio.png";
import saltgroveTransit from "../../assets/concepts/saltgrove-transit.png";
import zbcClipperPhone from "../../assets/concepts/zbc-clipper-phone.png";

/**
 * The only door from a page to an image (FD-VISUAL-01 §3.2.4). Each file is a
 * static import, so next/image knows its intrinsic size and serves AVIF/WebP;
 * each entry is joined to its manifest record, so nothing renders without one.
 *
 * Adding an asset: put the file in packages/ui/assets/, add its manifest
 * entry, then add it here. scripts/check-media.mjs fails CI if the three drift.
 */
import storyRrMissedCall from "../../assets/story-pass/rr-missed-call.png";
import storyRrBrokenForm from "../../assets/story-pass/rr-broken-form.png";
import storyRrNoFollowUp from "../../assets/story-pass/rr-no-follow-up.png";
import storyRrSlowPage from "../../assets/story-pass/rr-slow-page.png";
import storyRrWrongPage from "../../assets/story-pass/rr-wrong-page.png";
import storyRrLeakReport from "../../assets/story-pass/rr-leak-report.png";
import storyDaProblemWastedSpend from "../../assets/story-pass/da-problem-wasted-spend.png";
import storyDaWorkCampaign from "../../assets/story-pass/da-work-campaign.png";
import storyDaResultLead from "../../assets/story-pass/da-result-lead.png";
import storyTvProblemWrongRoom from "../../assets/story-pass/tv-problem-wrong-room.png";
import storyTvWorkSet from "../../assets/story-pass/tv-work-set.png";
import storyTvResultWatching from "../../assets/story-pass/tv-result-watching.png";
import storyRadioProblemCommute from "../../assets/story-pass/radio-problem-commute.png";
import storyRadioWorkStudio from "../../assets/story-pass/radio-work-studio.png";
import storyRadioResultCar from "../../assets/story-pass/radio-result-car.png";
import storyOohWorkPlanning from "../../assets/story-pass/ooh-work-planning.png";
import storyOohResultStreet from "../../assets/story-pass/ooh-result-street.png";
import storySocialProblemDeadPage from "../../assets/story-pass/social-problem-dead-page.png";
import storySocialWorkCalendar from "../../assets/story-pass/social-work-calendar.png";
import storySocialResultEngaged from "../../assets/story-pass/social-result-engaged.png";
import storyCreativeWorkStoryboard from "../../assets/story-pass/creative-work-storyboard.png";
import storyCreativeWorkShoot from "../../assets/story-pass/creative-work-shoot.png";
import storyInfluencerWorkFilming from "../../assets/story-pass/influencer-work-filming.png";
import storyInfluencerWorkBrief from "../../assets/story-pass/influencer-work-brief.png";
import storyWebProblemOldSite from "../../assets/story-pass/web-problem-old-site.png";
import storyWebWorkWireframes from "../../assets/story-pass/web-work-wireframes.png";
import storyHomeHowWeWork from "../../assets/story-pass/home-how-we-work.png";
import storyAboutWorkspace from "../../assets/story-pass/about-workspace.png";
import storyZbcStep1Brief from "../../assets/story-pass/zbc-step1-brief.png";
import storyZbcStep2Clippers from "../../assets/story-pass/zbc-step2-clippers.png";
import storyZbcStep3Review from "../../assets/story-pass/zbc-step3-review.png";
import storyZbcStep4Results from "../../assets/story-pass/zbc-step4-results.png";
import storyZbcEntStudio from "../../assets/story-pass/zbc-ent-studio.png";
import storyZbcEntFans from "../../assets/story-pass/zbc-ent-fans.png";
import storyZbcBrandsFilming from "../../assets/story-pass/zbc-brands-filming.png";
import storyZbcClipperPaid from "../../assets/story-pass/zbc-clipper-paid.png";

const FILES = {
  "rr-missed-call": storyRrMissedCall,
  "rr-broken-form": storyRrBrokenForm,
  "rr-no-follow-up": storyRrNoFollowUp,
  "rr-slow-page": storyRrSlowPage,
  "rr-wrong-page": storyRrWrongPage,
  "rr-leak-report": storyRrLeakReport,
  "da-problem-wasted-spend": storyDaProblemWastedSpend,
  "da-work-campaign": storyDaWorkCampaign,
  "da-result-lead": storyDaResultLead,
  "tv-problem-wrong-room": storyTvProblemWrongRoom,
  "tv-work-set": storyTvWorkSet,
  "tv-result-watching": storyTvResultWatching,
  "radio-problem-commute": storyRadioProblemCommute,
  "radio-work-studio": storyRadioWorkStudio,
  "radio-result-car": storyRadioResultCar,
  "ooh-work-planning": storyOohWorkPlanning,
  "ooh-result-street": storyOohResultStreet,
  "social-problem-dead-page": storySocialProblemDeadPage,
  "social-work-calendar": storySocialWorkCalendar,
  "social-result-engaged": storySocialResultEngaged,
  "creative-work-storyboard": storyCreativeWorkStoryboard,
  "creative-work-shoot": storyCreativeWorkShoot,
  "influencer-work-filming": storyInfluencerWorkFilming,
  "influencer-work-brief": storyInfluencerWorkBrief,
  "web-problem-old-site": storyWebProblemOldSite,
  "web-work-wireframes": storyWebWorkWireframes,
  "home-how-we-work": storyHomeHowWeWork,
  "about-workspace": storyAboutWorkspace,
  "zbc-step1-brief": storyZbcStep1Brief,
  "zbc-step2-clippers": storyZbcStep2Clippers,
  "zbc-step3-review": storyZbcStep3Review,
  "zbc-step4-results": storyZbcStep4Results,
  "zbc-ent-studio": storyZbcEntStudio,
  "zbc-ent-fans": storyZbcEntFans,
  "zbc-brands-filming": storyZbcBrandsFilming,
  "zbc-clipper-paid": storyZbcClipperPaid,

  "ironhold-billboard": ironholdBillboard,
  "ivosolace-stage": ivosolaceStage,
  "marenvale-influencer": marenvaleInfluencer,
  "marenvale-room": marenvaleRoom,
  "marenvale-social": marenvaleSocial,
  "marenvale-website": marenvaleWebsite,
  "quellmont-cover": quellmontCover,
  "quellmont-feed-sticker": quellmontFeedSticker,
  "quellmont-tv-keys": quellmontTvKeys,
  "saltgrove-brand-system": saltgroveBrandSystem,
  "saltgrove-radio": saltgroveRadio,
  "saltgrove-transit": saltgroveTransit,
  "zbc-clipper-phone": zbcClipperPhone,
} satisfies Record<string, StaticImageData>;

export type AssetId = keyof typeof FILES;
export type AssetClass = "real" | "concept" | "process" | "portrait";

export type ManifestEntry = (typeof manifest.assets)[number] & { class: AssetClass };

export type Asset = ManifestEntry & { id: AssetId; image: StaticImageData };

const byId = new Map(manifest.assets.map((a) => [a.id, a as ManifestEntry]));

export function asset(id: AssetId): Asset {
  const entry = byId.get(id);
  if (!entry) throw new Error(`Asset "${id}" has no manifest entry (packages/ui/assets/manifest.json)`);
  return { ...entry, id, image: FILES[id] };
}
