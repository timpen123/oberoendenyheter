import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stageUrl = process.env.STAGE__SUPABASE_URL;
const stageServiceKey = process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  if (url && serviceKey) return true;
  if (stageUrl && stageServiceKey) return true;
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

/** Om sajten just nu läser från stage (true) eller main (false). */
export function isSiteUsingStageSupabase(): boolean {
  return getSiteSupabaseDataSource() === "stage";
}

export type SiteSupabaseDataSource = "stage" | "main";

/**
 * Avgör vilken datakälla site-läsning ska använda.
 *
 * Prioritet:
 * 1) USE_STAGE_SUPABASE_FOR_SITE=true|1|stage => stage
 * 2) USE_STAGE_SUPABASE_FOR_SITE=false|0|main => main
 * 3) Om main saknas men stage finns => stage
 * 4) Preview/stage URL på Vercel => stage
 * 5) I lokal/dev-miljö med stage konfigurerat => stage
 * 6) Annars => main
 */
export function getSiteSupabaseDataSource(): SiteSupabaseDataSource {
  const hasStage = Boolean(stageUrl && stageServiceKey);
  const hasMain = Boolean(url && serviceKey);

  const raw = (process.env.USE_STAGE_SUPABASE_FOR_SITE ?? "").trim().toLowerCase();
  if (hasStage && (raw === "true" || raw === "1" || raw === "stage")) return "stage";
  if (raw === "false" || raw === "0" || raw === "main") return "main";

  if (!hasMain && hasStage) return "stage";

  const vercelUrl = (process.env.VERCEL_URL ?? "").toLowerCase();
  if (hasStage && (vercelUrl.includes("stage") || vercelUrl.includes("preview"))) return "stage";

  if (process.env.NODE_ENV !== "production" && hasStage) return "stage";

  return "main";
}

/**
 * Klient för sajtens läsning (nyheter etc.).
 * Använder stage om USE_STAGE_SUPABASE_FOR_SITE=true, eller om Vercel-URL innehåller "stage"/"preview" (och stage-vars finns).
 */
export function getSupabaseAdminForSite() {
  const source = getSiteSupabaseDataSource();
  if (source === "stage" && stageUrl && stageServiceKey) {
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
