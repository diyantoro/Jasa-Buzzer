import trending from "@/assets/svc-trending.jpg";
import brand from "@/assets/svc-brand.jpg";
import engagement from "@/assets/svc-engagement.jpg";
import influencer from "@/assets/svc-influencer.jpg";
import video from "@/assets/svc-video.jpg";
import crowd from "@/assets/svc-crowd.jpg";
import seminar from "@/assets/svc-seminar.jpg";
import launch from "@/assets/svc-launch.jpg";

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

const KEYWORD_IMAGES: Array<[RegExp, string]> = [
  [/\b(review|ulasan|influencer)\b/, influencer],
  [/\b(video|reels|reel|youtube|livestream|live)\b/, video],
  [/\b(launch|opening|roadshow|grand)\b/, launch],
  [/\b(seminar|gathering|webinar|audience)\b/, seminar],
  [/\b(crowd|event|flash|concert|rally|mob)\b/, crowd],
  [/\b(engagement|like|komentar|comment|share|community|follow)\b/, engagement],
  [/\b(brand|awareness|narrative|crisis)\b/, brand],
  [/\b(trending|viral|thread|twitter|x)\b/, trending],
];

type ServiceImageInput = {
  name: string;
  thumbnailUrl?: string | null;
  desc?: string;
  platforms?: readonly string[];
};

/**
 * Foto layanan memakai aset lokal agar tetap tampil tanpa bergantung pada
 * gambar eksternal. Thumbnail yang diunggah admin tetap diprioritaskan.
 */
export function serviceImage(service: ServiceImageInput): string {
  const uploaded = service.thumbnailUrl?.trim();
  if (uploaded) return uploaded;

  const exact = BY_NAME[service.name];
  if (exact) return exact;

  const match = (text: string) => {
    for (const [pattern, image] of KEYWORD_IMAGES) {
      if (pattern.test(text)) return image;
    }
    return undefined;
  };

  const byName = match(service.name.toLowerCase());
  if (byName) return byName;

  const byDesc = match((service.desc ?? "").toLowerCase());
  if (byDesc) return byDesc;

  // Platform tunggal membantu membedakan katalog seperti YouTube vs Instagram.
  // Untuk layanan multi-platform, jangan pakai platform agar tidak semuanya
  // jatuh ke gambar video.
  if (service.platforms?.length === 1) {
    const byPlatform = match(service.platforms[0].toLowerCase());
    if (byPlatform) return byPlatform;
  }

  return trending;
}
