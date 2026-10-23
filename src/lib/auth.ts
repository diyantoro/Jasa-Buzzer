import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Role } from "./mock-data";
import { registerAccountFn, loginAccountFn } from "./accounts.functions";
import { supabase } from "@/integrations/supabase/client";

export type { Role };

const KEY = "buzzhub.session";

export type Session = {
  role: Role;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  bio?: string;
  company?: string;
  industry?: string;
  username?: string;
  platform?: string;
  followers?: number;
  avatarUrl?: string;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify({
    ...s,
    email: s.email.trim().toLowerCase(),
  }));
  window.dispatchEvent(new Event("buzzhub:session"));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("buzzhub:session"));
}

/* ---- Akun terdaftar (tersimpan permanen di database) ---- */
export type Account = {
  role: Role;
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  bio?: string;
  company?: string;
  industry?: string;
  username?: string;
  platform?: string;
  followers?: number;
  avatarUrl?: string;
};

export async function registerAccount(
  acc: Account,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await registerAccountFn({
      data: {
        name: acc.name,
        email: acc.email,
        password: acc.password,
        role: acc.role as "admin" | "buzzer" | "customer",
        phone: acc.phone,
        city: acc.city,
        bio: acc.bio,
        company: acc.company,
        industry: acc.industry,
        username: acc.username,
        platform: acc.platform,
        followers: acc.followers,
        avatar_url: acc.avatarUrl,
      },
    });
    return res.ok ? { ok: true } : { ok: false, message: res.message };
  } catch {
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}

export async function findAccount(
  email: string,
  password: string,
): Promise<Session | null> {
  try {
    const res = await loginAccountFn({ data: { email: email.trim().toLowerCase(), password } });
    if (!res.ok) return null;
    return {
      role: res.account.role as Role,
      name: res.account.name,
      email: res.account.email,
      phone: res.account.profile?.phone,
      city: res.account.profile?.city,
      bio: res.account.profile?.bio,
      company: res.account.profile?.company,
      industry: res.account.profile?.industry,
      username: res.account.profile?.username,
      platform: res.account.profile?.platform,
      followers: res.account.profile?.followers,
      avatarUrl: res.account.profile?.avatarUrl,
    };
  } catch {
    return null;
  }
}

export function useSession() {
  const [session, setS] = useState<Session | null>(null);
  useEffect(() => {
    const s = getSession();
    setS(s);
    if (s?.email && !s.avatarUrl) {
      void supabase
        .from("app_accounts")
        .select("avatar_url")
        .eq("email", s.email.trim().toLowerCase())
        .maybeSingle()
        .then(({ data }) => {
          if (data?.avatar_url) {
            const current = getSession();
            if (current && current.email.toLowerCase() === s.email.toLowerCase() && !current.avatarUrl) {
              setSession({ ...current, avatarUrl: data.avatar_url });
            }
          }
        });
    }
    const handler = () => setS(getSession());
    window.addEventListener("buzzhub:session", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("buzzhub:session", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return session;
}

export function useRequireRole(role: Role) {
  const navigate = useNavigate();
  const session = useSession();
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) {
      navigate({ to: "/login" });
    } else if (s.role !== role) {
      navigate({ to: `/${s.role}` as never });
    }
  }, [navigate, path, role]);
  return session;
}
