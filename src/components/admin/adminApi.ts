"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export async function getAdminAccessToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Ingen aktiv admin-session");
  }
  return token;
}

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await getAdminAccessToken();
  const headers = new Headers(init.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

export async function uploadAdminImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.set("file", file);
  const res = await adminFetch("/api/admin/images", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || "Kunde inte ladda upp bild");
  }
  const data = (await res.json()) as { imageUrl: string };
  return data.imageUrl;
}
