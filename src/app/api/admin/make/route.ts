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

    const payload = (parsedBody ?? {}) as Record<string, unknown>;
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    const slug =
      typeof payload.slug === "string" && payload.slug.trim()
        ? payload.slug.trim()
        : slugify(title || `artikel-${Date.now()}`);

    if (!title || !body) {
      return NextResponse.json(
        {
          error: "title och body krävs i Make payload",
          received: payload,
        },
        { status: 400 }
      );
    }

    const supabase = getStageClient();
    const { data: inserted, error: insertError } = await supabase
      .from("articles")
      .insert({
        title,
        body,
        slug,
        excerpt: typeof payload.excerpt === "string" ? payload.excerpt : null,
        image: typeof payload.image === "string" ? payload.image : "",
        category:
          typeof payload.category === "string" ? payload.category : "Övrigt",
        read_time:
          typeof payload.read_time === "string" ? payload.read_time : "1 min",
        published_at:
          typeof payload.published_at === "string"
            ? payload.published_at
            : null,
        source: typeof payload.source === "string" ? payload.source : null,
        external_id:
          typeof payload.external_id === "string" ? payload.external_id : null,
      })
      .select("id,title,slug,created_at")
      .single();

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
      inserted,
    });
  } catch (error) {
    console.error("Make route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
