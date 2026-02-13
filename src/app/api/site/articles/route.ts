import { NextResponse } from "next/server";
import { getArticlesList } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getArticlesListFromSupabase } from "@/lib/supabase-data";

/** GET – lista artiklar (paginering). Endast publikt/läsning. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

    if (isSupabaseConfigured()) {
      const result = await getArticlesListFromSupabase({ page, limit });
      return NextResponse.json(result);
    }
    const result = getArticlesList({ page, limit });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/site/articles]", err);
    return NextResponse.json(
      { error: "Kunde inte hämta artiklar" },
      { status: 500 }
    );
  }
}
