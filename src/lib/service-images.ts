import trending from "@/assets/svc-trending.jpg";
import brand from "@/assets/svc-brand.jpg";
import engagement from "@/assets/svc-engagement.jpg";
import influencer from "@/assets/svc-influencer.jpg";
import video from "@/assets/svc-video.jpg";
import crowd from "@/assets/svc-crowd.jpg";
import seminar from "@/assets/svc-seminar.jpg";
import launch from "@/assets/svc-launch.jpg";
import type { Service } from "@/lib/customer-store";

const BY_NAME: Record<string, string> = {
  "Trending Topic Booster": trending,
  "Viral Marketing Campaign": trending,
  "Brand Awareness Push": brand,
  "Counter Narrative Response": brand,
  "Social Engagement Booster": engagement,
  "Community Seeding": engagement,
  "Product Review Campaign": influencer,
  "Influencer Support Program": influencer,
  "Livestream Amplifier": video,
  "Video Reels Distribution": video,
  "Event Crowd Booster": crowd,
  "Flash Mob Activation": crowd,
  "Community Activation": crowd,
  "Concert Cheerleader": crowd,
  "Political Rally Crowd": crowd,
  "Seminar Audience": seminar,
  "Gathering Participants": seminar,
  "Grand Opening Crowd": launch,
  "Product Launch Crowd": launch,
  "Roadshow Support": launch,
};

export function serviceImage(service: Pick<Service, "name">): string {
  return BY_NAME[service.name] ?? trending;
}
