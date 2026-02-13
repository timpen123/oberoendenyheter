import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getStageClient() {
  const url = process.env.STAGE__SUPABASE_URL;
  const serviceRoleKey = process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Stage env saknas: STAGE__SUPABASE_URL och STAGE__SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function toArticleInsert(
  payload: Record<string, unknown>,
  idx: number
): { row: Record<string, unknown> | null; reason?: string } {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  if (!title || !body) return { row: null, reason: "missing_title_or_body" };

  const slug =
    typeof payload.slug === "string" && payload.slug.trim()
      ? payload.slug.trim()
      : slugify(title || `artikel-${Date.now()}-${idx}`);

  return {
    row: {
    title,
    body,
    slug,
    excerpt: typeof payload.excerpt === "string" ? payload.excerpt : null,
    image: typeof payload.image === "string" ? payload.image : "",
    category: typeof payload.category === "string" ? payload.category : "Övrigt",
    read_time:
      typeof payload.read_time === "string"
        ? payload.read_time
        : typeof payload.readTime === "string"
          ? payload.readTime
          : "1 min",
    published_at:
      typeof payload.published_at === "string" ? payload.published_at : null,
    source: typeof payload.source === "string" ? payload.source : null,
    external_id:
      typeof payload.external_id === "string" ? payload.external_id : null,
    },
  };
}

/** GET – snabb kontroll för att läsa data från stage articles. */
export async function GET() {
  try {
    const supabase = getStageClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id,title,slug,created_at,published_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Stage read error:", error);
      return NextResponse.json(
        { error: error.message || "Kunde inte läsa från stage DB" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, count: data?.length ?? 0, data });
  } catch (error) {
    console.error("Make GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST – tar emot data från Make och sparar i stage articles. */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    console.log("=== MAKE RAW BODY ===");
    console.log(rawBody);

    let parsedBody: unknown;
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null;
    } catch (err) {
      console.error("JSON parse error:", err);
      return NextResponse.json(
        { error: "Invalid JSON", rawBody },
        { status: 400 }
      );
    }

    console.log("=== MAKE PARSED BODY ===");
    console.log(parsedBody);

    let incomingItems: Record<string, unknown>[] = [];
    if (Array.isArray(parsedBody)) {
      incomingItems = parsedBody.filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null
      );
    } else if (
      parsedBody &&
      typeof parsedBody === "object" &&
      Array.isArray((parsedBody as Record<string, unknown>).articles)
    ) {
      incomingItems = ((parsedBody as Record<string, unknown>).articles as unknown[]).filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null
      );
    } else if (parsedBody && typeof parsedBody === "object") {
      incomingItems = [parsedBody as Record<string, unknown>];
    }

    const transformed = incomingItems.map((item, idx) => toArticleInsert(item, idx));
    const rowsToInsert = transformed
      .map((t) => t.row)
      .filter((row): row is Record<string, unknown> => row !== null);
    const skippedCount = transformed.length - rowsToInsert.length;

    if (rowsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        received: parsedBody,
        insertedCount: 0,
        skippedCount,
        message: "Inga giltiga artiklar att spara (okända fält ignoreras).",
      });
    }

    const supabase = getStageClient();
    const { data: inserted, error: insertError } = await supabase
      .from("articles")
      .insert(rowsToInsert)
      .select("id,title,slug,created_at");

    if (insertError) {
      console.error("Stage insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Kunde inte spara i stage DB" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      received: parsedBody,
      insertedCount: inserted?.length ?? 0,
      skippedCount,
      inserted,
    });
  } catch (error) {
    console.error("Make route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
