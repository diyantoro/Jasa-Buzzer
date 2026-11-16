/**
 * Sesi server-side bertanda tangan (HMAC-SHA256) untuk Fase 1.
 *
 * Modul ini HANYA boleh diimpor dari dalam handler server function /
 * server route. Jangan pernah diimpor di komponen React.
 *
 * Tujuan: memberi batas kepercayaan nyata antara client dan operasi
 * istimewa. Cookie berisi { email, role, exp } dan ditandatangani dengan
 * secret yang hanya ada di server. Tanpa tanda tangan valid, server
 * function menolak permintaan.
 *
 * Fase 3 (Supabase Auth) akan menggantikan modul ini dengan
 * `auth.uid()` + custom access token hook.
 */
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

export const SESSION_COOKIE = "buzzhub_sid";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 hari

export type SessionPayload = {
  email: string;
  role: "admin" | "buzzer" | "customer";
};

type TokenPayload = {
  e: string;
  r: string;
  x: number;
};

const encoder = new TextEncoder();

function resolveSecret(): string {
  const explicit = process.env["SESSION_SECRET"];
  if (explicit && explicit.length >= 16) return explicit;

  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (serviceKey && serviceKey.length >= 16 && !serviceKey.startsWith("sb_publishable_")) {
    return serviceKey;
  }

  if (process.env["NODE_ENV"] === "production") {
    throw new Error(
      "SESSION_SECRET belum dikonfigurasi. Isi SESSION_SECRET (minimal 16 karakter) di environment server.",
    );
  }

  console.warn(
    "[Session] SESSION_SECRET / SUPABASE_SERVICE_ROLE_KEY kosong. " +
      "Memakai secret development. JANGAN dipakai di production.",
  );
  return "buzzhub-dev-only-session-secret";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(resolveSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

async function verify(data: string, signature: string): Promise<boolean> {
  const expected = await sign(data);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let index = 0; index < expected.length; index += 1) {
    diff |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  }
  return diff === 0;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const body: TokenPayload = {
    e: payload.email.trim().toLowerCase(),
    r: payload.role,
    x: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = toBase64Url(encoder.encode(JSON.stringify(body)));
  const signature = await sign(encoded);
  return `v1.${encoded}.${signature}`;
}

export async function readSessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;

  const [, encoded, signature] = parts;
  try {
    if (!(await verify(encoded, signature))) return null;
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded))) as TokenPayload;
    if (!decoded?.e || !decoded?.r) return null;
    if (typeof decoded.x !== "number" || decoded.x * 1000 < Date.now()) return null;
    return { email: decoded.e, role: decoded.r as SessionPayload["role"] };
  } catch {
    return null;
  }
}

export async function setSessionCookie(email: string, role: SessionPayload["role"]): Promise<void> {
  const token = await createSessionToken({ email, role });
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(): void {
  deleteCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env["NODE_ENV"] === "production",
  });
}

export async function getServerSession(): Promise<SessionPayload | null> {
  return readSessionToken(getCookie(SESSION_COOKIE));
}

/** Wajib admin: tanda tangan valid DAN role di database masih admin. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Sesi admin tidak ditemukan. Silakan masuk ulang.");
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("app_accounts")
    .select("role")
    .eq("email", session.email)
    .maybeSingle();

  if (error) {
    throw new Error(
      "Server belum memakai service role key. Isi SUPABASE_SERVICE_ROLE_KEY dengan secret key Supabase.",
    );
  }
  if (data?.role !== "admin") {
    throw new Error("Akses ditolak: akun ini bukan admin.");
  }
  return session;
}
