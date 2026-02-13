import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getArticleBySlugFromSupabase } from "@/lib/supabase-data";

/** GET – hämta en artikel efter slug. Endast publikt. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "slug krävs" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const article = await getArticleBySlugFromSupabase(slug);
      if (!article) {
        return NextResponse.json(
          { error: "Artikeln hittades inte" },
          { status: 404 }
        );
      }
      return NextResponse.json(article);
    }

    const article = getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json(
        { error: "Artikeln hittades inte" },
        { status: 404 }
      );
    }
    return NextResponse.json(article);
  } catch (err) {
    console.error("[GET /api/site/articles/[slug]]", err);
    return NextResponse.json(
      { error: "Kunde inte hämta artikeln" },
      { status: 500 }
    );
  }
}
