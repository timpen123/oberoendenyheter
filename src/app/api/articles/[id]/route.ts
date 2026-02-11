import { NextResponse } from "next/server";
import { getArticleById } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json(
        { error: "id krävs" },
        { status: 400 }
      );
    }

    const article = getArticleById(id);
    if (!article) {
      return NextResponse.json(
        { error: "Artikeln hittades inte" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (err) {
    console.error("[GET /api/articles/[id]]", err);
    return NextResponse.json(
      { error: "Kunde inte hämta artikeln" },
      { status: 500 }
    );
  }
}
