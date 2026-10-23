import {
  AtSign,
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import type { ReactNode } from "react";
import type { SocialPlatform } from "@/lib/social-store";

export const SOCIAL_PLATFORM_ICON: Record<SocialPlatform, ReactNode> = {
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <Music2 className="h-4 w-4" />,
  Facebook: <Facebook className="h-4 w-4" />,
  "X (Twitter)": <Twitter className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Threads: <AtSign className="h-4 w-4" />,
  Telegram: <Send className="h-4 w-4" />,
};
