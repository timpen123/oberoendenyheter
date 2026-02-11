import { NextResponse } from "next/server";
import { getArticlesList } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

    const result = getArticlesList({ page, limit });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/articles]", err);
    return NextResponse.json(
      { error: "Kunde inte hämta artiklar" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Skapa artikel är inte aktiverat än. Databas/integration (t.ex. Make) kommer att kopplas in senare.",
    },
    { status: 501 }
  );
}
