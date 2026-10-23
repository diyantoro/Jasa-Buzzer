import { useEffect, useState, useSyncExternalStore } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export type QrisSettings = {
  isEnabled: boolean;
  imageUrl: string | null;
  merchantName: string;
  updatedAt: string;
};

export const DEFAULT_QRIS_SETTINGS: QrisSettings = {
  isEnabled: true,
  imageUrl: "/qris-merchant-buzzpro.png",
  merchantName: "BUZZPRO / BuzzHub",
  updatedAt: "2026-09-01T00:00:00Z",
};

const STORAGE_KEY = "buzz_admin_qris_settings";
const EVENT_KEY = "buzz_admin_qris_settings_change";

let CACHE: QrisSettings = DEFAULT_QRIS_SETTINGS;
let VERSION = 0;
const listeners = new Set<() => void>();

function emit() {
  VERSION += 1;
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_KEY));
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function loadFromLocal(): QrisSettings {
  if (typeof window === "undefined") return DEFAULT_QRIS_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        return {
          isEnabled: parsed.isEnabled ?? true,
          imageUrl: parsed.imageUrl === undefined ? DEFAULT_QRIS_SETTINGS.imageUrl : parsed.imageUrl,
          merchantName: parsed.merchantName || DEFAULT_QRIS_SETTINGS.merchantName,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch {
    /* noop */
  }
  return DEFAULT_QRIS_SETTINGS;
}

function saveToLocal(settings: QrisSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* noop */
  }
}

// Initialize cache
if (typeof window !== "undefined") {
  CACHE = loadFromLocal();
}

/** Hook to manage QRIS settings for customer checkout and admin control */
export function useQrisSettings() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        CACHE = loadFromLocal();
        emit();
      }
    };
    const handleCustom = () => {
      CACHE = loadFromLocal();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(EVENT_KEY, handleCustom);

    // Initial sync
    CACHE = loadFromLocal();
    emit();

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(EVENT_KEY, handleCustom);
    };
  }, []);

  const settings = useSyncExternalStore(
    subscribe,
    () => CACHE,
    () => DEFAULT_QRIS_SETTINGS
  );

  const updateSettings = async (patch: Partial<QrisSettings>) => {
    setLoading(true);
    try {
      const updated: QrisSettings = {
        ...CACHE,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      CACHE = updated;
      saveToLocal(updated);
      emit();

      // If Supabase is connected, optionally sync with admin bio or a metadata row
      if (isSupabaseConfigured()) {
        try {
          const { data: adminUser } = await (supabase as any)
            .from("app_accounts")
            .select("email, bio")
            .eq("role", "admin")
            .limit(1)
            .maybeSingle();

          if (adminUser?.email) {
            let bioObj: Record<string, any> = {};
            try {
              if (adminUser.bio && adminUser.bio.startsWith("{")) {
                bioObj = JSON.parse(adminUser.bio);
              }
            } catch {
              /* ignore */
            }
            bioObj._qrisSettings = updated;
            await (supabase as any)
              .from("app_accounts")
              .update({ bio: JSON.stringify(bioObj) })
              .eq("email", adminUser.email);
          }
        } catch {
          /* background sync fail is safe */
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadQrisImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File harus berupa gambar (PNG, JPG, JPEG, WEBP)");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 5 MB");
    }

    // Convert file to base64 Data URL so it is permanently self-contained and never lost
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
      reader.readAsDataURL(file);
    });

    await updateSettings({ imageUrl: dataUrl, isEnabled: true });
    return dataUrl;
  };

  const removeQrisImage = async () => {
    await updateSettings({ imageUrl: null });
  };

  const toggleQris = async (isEnabled: boolean) => {
    await updateSettings({ isEnabled });
  };

  return {
    settings,
    isEnabled: settings.isEnabled && !!settings.imageUrl,
    imageUrl: settings.imageUrl,
    merchantName: settings.merchantName,
    loading,
    updateSettings,
    uploadQrisImage,
    removeQrisImage,
    toggleQris,
  };
}
