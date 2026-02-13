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

function withSlugSuffix(baseSlug: string, attempt: number): string {
  const safeBase = baseSlug || `artikel-${Date.now()}`;
  return `${safeBase}-${Date.now()}-${attempt}`;
}

/** Plockar ut text från vanliga fältnamn (hela blocket från RSS/Apify/OpenAI etc.). */
function pickText(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/** Normaliserar ett "helt block" till våra artikel-fält. */
function normalizePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const title = pickText(payload, [
    "title",
    "headline",
    "name",
    "subject",
    "label",
  ]);
  const body = pickText(payload, [
    "body",
    "content",
    "description",
    "text",
    "html",
    "summary",
  ]);
  const excerpt = pickText(payload, ["excerpt", "summary", "snippet", "description"]);
  const image = pickText(payload, ["image", "imageUrl", "thumbnail", "enclosure", "url"]);
  let category = pickText(payload, ["category", "section", "channel", "type"]);
  if (!category && Array.isArray(payload.categories) && payload.categories.length > 0) {
    const first = payload.categories[0];
    category = typeof first === "string" ? first.trim() : "";
  }
  if (!category) category = "Övrigt";
  const source = pickText(payload, ["source", "url", "link", "canonical"]);
  const externalId = pickText(payload, ["external_id", "id", "guid", "uuid"]);

  return {
    ...payload,
    title: title || (payload.title as string),
    body: body || (payload.body as string),
    excerpt: excerpt || (payload.excerpt as string) || null,
    image: image || (payload.image as string) || "",
    category: category || (payload.category as string) || "Övrigt",
    source: source || (payload.source as string) || null,
    external_id: externalId || (payload.external_id as string) || null,
  };
}

function toArticleInsert(
  payload: Record<string, unknown>,
  idx: number
): { row: Record<string, unknown> | null; reason?: string } {
  const normalized = normalizePayload(payload);
  const title = typeof normalized.title === "string" ? normalized.title.trim() : "";
  const body = typeof normalized.body === "string" ? normalized.body.trim() : "";
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
      excerpt: typeof normalized.excerpt === "string" ? normalized.excerpt : null,
      image: typeof normalized.image === "string" ? normalized.image : "",
      category: typeof normalized.category === "string" ? normalized.category : "Övrigt",
      read_time:
        typeof normalized.read_time === "string"
          ? normalized.read_time
          : typeof normalized.readTime === "string"
            ? normalized.readTime
            : "1 min",
      published_at:
        typeof normalized.published_at === "string" ? normalized.published_at : null,
      source: typeof normalized.source === "string" ? normalized.source : null,
      external_id:
        typeof normalized.external_id === "string" ? normalized.external_id : null,
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
    } catch {
      if (rawBody && rawBody.trim()) {
        const text = rawBody.trim();
        const lines = text.split(/\r?\n/);
        const firstLine = lines[0] ?? "";
        const title =
          firstLine.length > 0 && firstLine.length <= 200
            ? firstLine
            : text.length > 200
              ? text.slice(0, 197) + "..."
              : text || "Artikel från Make";
        const body = lines.length > 1 ? text : `<p>${text}</p>`;
        parsedBody = { title, body };
        console.log("=== MAKE PLAIN TEXT FALLBACK ===", { title: title.slice(0, 60) });
      } else {
        parsedBody = null;
      }
    }

    console.log("=== MAKE PARSED BODY ===");
    console.log(parsedBody);

    const toItems = (arr: unknown[]): Record<string, unknown>[] =>
      arr.filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null
      );

    let incomingItems: Record<string, unknown>[] = [];
    if (Array.isArray(parsedBody)) {
      incomingItems = toItems(parsedBody);
    } else if (parsedBody && typeof parsedBody === "object") {
      const obj = parsedBody as Record<string, unknown>;
      const arr =
        obj.articles ?? obj.items ?? obj.data ?? obj.results ?? obj.entries;
      if (Array.isArray(arr)) {
        incomingItems = toItems(arr);
      } else {
        incomingItems = [obj];
      }
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
    const inserted: Array<Record<string, unknown>> = [];
    const failed: Array<{ slug: string; error: string }> = [];

    for (const row of rowsToInsert) {
      let payload = { ...row } as Record<string, unknown>;
      let didInsert = false;

      for (let attempt = 1; attempt <= 3; attempt++) {
        const { data, error } = await supabase
          .from("articles")
          .insert(payload)
          .select("id,title,slug,created_at")
          .single();

        if (!error) {
          inserted.push(data as Record<string, unknown>);
          didInsert = true;
          break;
        }

        const isDuplicateSlug =
          error.code === "23505" &&
          String(error.message).includes("articles_slug_key");

        if (isDuplicateSlug) {
          const currentSlug =
            typeof payload.slug === "string" ? payload.slug : slugify("artikel");
          payload = {
            ...payload,
            slug: withSlugSuffix(currentSlug, attempt),
          };
          continue;
        }

        console.error("Stage insert error:", error);
        failed.push({
          slug: typeof payload.slug === "string" ? payload.slug : "unknown",
          error: error.message || "Unknown insert error",
        });
        break;
      }

      if (!didInsert) {
        const slug = typeof payload.slug === "string" ? payload.slug : "unknown";
        if (!failed.some((f) => f.slug === slug)) {
          failed.push({ slug, error: "Kunde inte spara efter retries" });
        }
      }
    }

    return NextResponse.json({
      success: true,
      received: parsedBody,
      insertedCount: inserted.length,
      skippedCount,
      inserted,
      failedCount: failed.length,
      failed,
    });
  } catch (error) {
    console.error("Make route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
