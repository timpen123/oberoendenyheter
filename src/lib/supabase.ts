import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stageUrl = process.env.STAGE__SUPABASE_URL;
const stageServiceKey = process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;
const resolvedUrl = url ?? process.env.SUPABASE_URL ?? null;
const resolvedAnonKey =
  anonKey ?? process.env.SUPABASE_PUBLISHABLE_KEY ?? null;
const resolvedServiceKey =
  serviceKey ?? process.env.SUPABASE_SECRET_KEY ?? null;

export function isSupabaseConfigured(): boolean {
  if (resolvedUrl && resolvedServiceKey) return true;
  if (stageUrl && stageServiceKey) return true;
  return false;
}

/** Server-side Supabase-klient med service role (för upload + CRUD). Använd endast i API-routes / Server Components. */
export function getSupabaseAdmin() {
  if (!resolvedUrl || !resolvedServiceKey) {
    throw new Error("Supabase server env saknas: NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(resolvedUrl, resolvedServiceKey, {
    auth: { persistSession: false },
  });
}

function getSupabaseAdminFromStage() {
  if (!stageUrl || !stageServiceKey) {
    throw new Error(
      "Supabase stage env saknas: STAGE__SUPABASE_URL och STAGE__SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return createClient(stageUrl, stageServiceKey, {
    auth: { persistSession: false },
  });
}

/** Om sajten just nu läser från stage (true) eller main (false). */
export function isSiteUsingStageSupabase(): boolean {
  return getSiteSupabaseDataSource() === "stage";
}

export type SiteSupabaseDataSource = "stage" | "main";
export type AdminSupabaseDataSource = "stage" | "main";

/**
 * Avgör vilken datakälla site-läsning ska använda.
 *
 * Prioritet:
 * 1) USE_STAGE_SUPABASE_FOR_SITE=false|0|main => main (explicit override)
 * 2) Om stage är konfigurerad => stage (default)
 * 3) Annars main
 */
export function getSiteSupabaseDataSource(): SiteSupabaseDataSource {
  const hasStage = Boolean(stageUrl && stageServiceKey);
  const raw = (process.env.USE_STAGE_SUPABASE_FOR_SITE ?? "").trim().toLowerCase();
  if (raw === "false" || raw === "0" || raw === "main") return "main";
  if (hasStage && (raw === "true" || raw === "1" || raw === "stage")) return "stage";

  if (hasStage) return "stage";

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

/**
 * Avgör datakälla för admin-ingest (make/upload).
 *
 * Prioritet:
 * 1) USE_STAGE_SUPABASE_FOR_ADMIN=true|1|stage => stage
 * 2) USE_STAGE_SUPABASE_FOR_ADMIN=false|0|main => main
 * 3) Om main finns => main (default)
 * 4) Om main saknas men stage finns => stage
 */
export function getAdminSupabaseDataSource(): AdminSupabaseDataSource {
  const hasStage = Boolean(stageUrl && stageServiceKey);
  const hasMain = Boolean(resolvedUrl && resolvedServiceKey);
  const raw = (process.env.USE_STAGE_SUPABASE_FOR_ADMIN ?? "").trim().toLowerCase();

  if (hasStage && (raw === "true" || raw === "1" || raw === "stage")) return "stage";
  if (raw === "false" || raw === "0" || raw === "main") return "main";

  if (hasMain) return "main";
  if (hasStage) return "stage";

  return "main";
}

/** Server-side klient för admin-ingest (Make/upload). */
export function getSupabaseAdminForAdmin() {
  const source = getAdminSupabaseDataSource();
  if (source === "stage") return getSupabaseAdminFromStage();
  return getSupabaseAdmin();
}

/** Klient med anon key (t.ex. för publikt läsande från Storage). Kan användas i browser om du vill. */
export function getSupabase() {
  if (!resolvedUrl || !resolvedAnonKey) {
    throw new Error("Supabase env saknas: NEXT_PUBLIC_SUPABASE_URL och NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(resolvedUrl, resolvedAnonKey);
}

export const SUPABASE_BUCKET_IMAGES = "article-images";

/** Tabellnamn för artiklar – sätt SUPABASE_ARTICLES_TABLE i .env om din tabell heter något annat. */
export function getArticlesTableName(): string {
  return process.env.SUPABASE_ARTICLES_TABLE ?? "articles";
}
