import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stageUrl = process.env.STAGE__SUPABASE_URL;
const stageServiceKey = process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  if (url && serviceKey) return true;
  if (
    process.env.USE_STAGE_SUPABASE_FOR_SITE === "true" &&
    stageUrl &&
    stageServiceKey
  )
    return true;
  return false;
}

/** Server-side Supabase-klient med service role (för upload + CRUD). Använd endast i API-routes / Server Components. */
export function getSupabaseAdmin() {
  if (!url || !serviceKey) {
    throw new Error("Supabase server env saknas: NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

/**
 * Klient för sajtens läsning (nyheter etc.). På preview kan du sätta
 * USE_STAGE_SUPABASE_FOR_SITE=true så läser sajten från stage-DB (samma som Make skriver till).
 */
export function getSupabaseAdminForSite() {
  const useStage =
    process.env.USE_STAGE_SUPABASE_FOR_SITE === "true" && stageUrl && stageServiceKey;
  if (useStage) {
    return createClient(stageUrl, stageServiceKey, {
      auth: { persistSession: false },
    });
  }
  return getSupabaseAdmin();
}

/** Klient med anon key (t.ex. för publikt läsande från Storage). Kan användas i browser om du vill. */
export function getSupabase() {
  if (!url || !anonKey) {
    throw new Error("Supabase env saknas: NEXT_PUBLIC_SUPABASE_URL och NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, anonKey);
}

export const SUPABASE_BUCKET_IMAGES = "article-images";

/** Tabellnamn för artiklar – sätt SUPABASE_ARTICLES_TABLE i .env om din tabell heter något annat. */
export function getArticlesTableName(): string {
  return process.env.SUPABASE_ARTICLES_TABLE ?? "articles";
}
