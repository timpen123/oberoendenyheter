import { NextResponse } from "next/server";
import { getArticlesList } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getArticlesListFromSupabase,
  insertArticleToSupabase,
} from "@/lib/supabase-data";
import type { ArticleInsert } from "@/lib/types";

/** GET – lista artiklar (admin). */
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
    console.error("[GET /api/admin/articles]", err);
    return NextResponse.json(
      { error: "Kunde inte hämta artiklar" },
      { status: 500 }
    );
  }
}

/** POST – skapa ny artikel (admin, kräver Supabase). */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Skapa artikel kräver Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 }
    );
  }
  try {
    const body = (await request.json()) as ArticleInsert;
    if (!body?.title?.trim() || !body?.body?.trim()) {
      return NextResponse.json(
        { error: "title och body krävs" },
        { status: 400 }
      );
    }
    const article = await insertArticleToSupabase(body);
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/articles]", err);
    return NextResponse.json(
      { error: "Kunde inte skapa artikel" },
      { status: 500 }
    );
  }
}
