import { NextResponse } from "next/server";
import {
  isSupabaseConfigured,
  isSiteUsingStageSupabase,
  getSupabaseAdminForSite,
} from "@/lib/supabase";
import { getArticlesTableName } from "@/lib/supabase";

/** GET – visar vilken databas sajten läser från och ett artikeltest. Använd för felsökning. */
export async function GET() {
  const stageUrl = !!process.env.STAGE__SUPABASE_URL;
  const stageKey = !!process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;
  const mainUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const mainKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const useStageFlag = (process.env.USE_STAGE_SUPABASE_FOR_SITE ?? "").trim().toLowerCase();

  const dataSource = isSiteUsingStageSupabase() ? "stage" : "main";
  const supabaseConfigured = isSupabaseConfigured();

  let articleCount: number | null = null;
  let tableName = getArticlesTableName();
  let error: string | null = null;

  if (supabaseConfigured) {
    try {
      const supabase = getSupabaseAdminForSite();
      const { count } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });
      articleCount = count;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    supabaseConfigured,
    dataSource,
    useStageFlagValue: useStageFlag || "(tom)",
    env: {
      hasStageUrl: stageUrl,
      hasStageKey: stageKey,
      hasMainUrl: mainUrl,
      hasMainKey: mainKey,
    },
    table: tableName,
    articleCount,
    error: error ?? undefined,
  });
}
