import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getArticlesTableName } from "@/lib/supabase";

const BUCKET = "article-images";
const MAX_SIZE_MB = 4;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getStageClient() {
  const url = process.env.STAGE__SUPABASE_URL;
  const key = process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("Stage env saknas: STAGE__SUPABASE_URL och STAGE__SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function excerptFromBody(body: string, maxLen = 200): string {
  const plain = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen).trim();
  const last = cut.lastIndexOf(" ");
  return last > maxLen * 0.6 ? cut.slice(0, last) + "…" : cut + "…";
}

function getFormString(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function looksLikeJsonObject(input: string): boolean {
  const s = input.trim();
  return s.startsWith("{") && s.endsWith("}");
}

type CombinedPayload = {
  title?: string;
  body?: string;
  excerpt?: string;
  category?: string;
  read_time?: string;
  source?: string;
  external_id?: string;
};

/**
 * Stöd för "2-item"-flöde i Make:
 * - item 1: file
 * - item 2: key=body med antingen:
 *   a) JSON-sträng ({ title, body, ... })
 *   b) text där första raden är titel och resten är body
 */
function parseCombinedBodyField(input: string): CombinedPayload | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title.trim() : "";
      const body = typeof obj.body === "string" ? obj.body.trim() : "";
      return {
        title: title || undefined,
        body: body || undefined,
        excerpt: typeof obj.excerpt === "string" ? obj.excerpt.trim() : undefined,
        category: typeof obj.category === "string" ? obj.category.trim() : undefined,
        read_time: typeof obj.read_time === "string" ? obj.read_time.trim() : undefined,
        source: typeof obj.source === "string" ? obj.source.trim() : undefined,
        external_id: typeof obj.external_id === "string" ? obj.external_id.trim() : undefined,
      };
    }
  } catch {
    // Inte JSON – fortsätt med texttolkning nedan.
  }

  const lines = raw.split(/\r?\n/).map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length < 2) return null;

  const title = nonEmpty[0];
  const body = nonEmpty.slice(1).join("\n").trim();
  if (!title || !body) return null;
  return { title, body };
}

/**
 * POST – ett steg i Make: skicka bild + artikeldata i samma anrop.
 * Multipart/form-data med:
 * - en fil (bild) – laddas upp till bucket, URL sätts som article.image
 * - title, body (obligatoriskt)
 * - excerpt, category (valfritt)
 * Flöde: 1) Hämta fil i Make, 2) Anropa denna URL med fil + title, body, category osv.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    let file: File | null = null;
    for (const [, value] of formData.entries()) {
      if (value instanceof File) {
        file = value;
        break;
      }
    }

    let title = getFormString(formData, "title");
    let body = getFormString(formData, "body");

    let parsedCombined: CombinedPayload | null = null;

    // Om body är JSON-sträng med {title, body, ...} ska vi alltid normalisera den,
    // även om title redan skickats separat.
    if (body && looksLikeJsonObject(body)) {
      parsedCombined = parseCombinedBodyField(body);
      if (!title) title = parsedCombined?.title ?? "";
      if (parsedCombined?.body) body = parsedCombined.body;
    } else if (!title || !body) {
      parsedCombined = parseCombinedBodyField(body);
      if (!title) title = parsedCombined?.title ?? "";
      if (parsedCombined?.body) {
        const rawLooksLikeJson = body.trim().startsWith("{") || body.trim().startsWith("[");
        if (!body || body === title || rawLooksLikeJson) {
          body = parsedCombined.body;
        }
      }
    }

    if (!title || !body) {
      return NextResponse.json(
        {
          error:
            "title och body krävs från Make. Skicka separata fält, eller key=body med JSON ({title,body,...}) alternativt första raden=titel och resten=body.",
        },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Endast bilder tillåtna (JPEG, PNG, WebP, GIF)" },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `Bilden får max vara ${MAX_SIZE_MB} MB` },
          { status: 400 }
        );
      }
      const ext = (file.name || "").split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;
      const supabase = getStageClient();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        console.error("[make-with-upload] upload error:", uploadError);
        return NextResponse.json(
          { error: uploadError.message || "Kunde inte ladda upp bild" },
          { status: 500 }
        );
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
    }

    let excerptInput = getFormString(formData, "excerpt");
    if (excerptInput && looksLikeJsonObject(excerptInput)) {
      const parsedExcerpt = parseCombinedBodyField(excerptInput);
      if (parsedExcerpt?.excerpt) {
        excerptInput = parsedExcerpt.excerpt;
      } else if (parsedExcerpt?.body) {
        excerptInput = excerptFromBody(parsedExcerpt.body);
      }
    }

    const excerpt = excerptInput || parsedCombined?.excerpt || excerptFromBody(body);
    const category = getFormString(formData, "category") || parsedCombined?.category || "Övrigt";
    const slug = slugify(title) || `artikel-${Date.now()}`;

    const row = {
      title,
      body,
      slug,
      excerpt: excerpt || null,
      image: imageUrl,
      category,
      read_time: getFormString(formData, "read_time") || parsedCombined?.read_time || "1 min",
      published_at: null as string | null,
      source: getFormString(formData, "source") || parsedCombined?.source || null,
      external_id: getFormString(formData, "external_id") || parsedCombined?.external_id || null,
    };

    const supabase = getStageClient();
    const table = getArticlesTableName();
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(row)
      .select("id,title,slug,image,created_at")
      .single();

    if (error) {
      if (error.code === "23505" && String(error.message).includes("slug")) {
        const retrySlug = `${slug}-${Date.now()}`;
        const { data: retryData, error: retryError } = await supabase
          .from(table)
          .insert({ ...row, slug: retrySlug })
          .select("id,title,slug,image,created_at")
          .single();
        if (retryError) {
          console.error("[make-with-upload] insert retry error:", retryError);
          return NextResponse.json(
            { error: retryError.message || "Kunde inte spara artikel" },
            { status: 500 }
          );
        }
        return NextResponse.json({
          success: true,
          imageUrl,
          article: retryData,
          message: "Artikel sparad med unik slug (slug-kollision).",
        });
      }
      console.error("[make-with-upload] insert error:", error);
      return NextResponse.json(
        { error: error.message || "Kunde inte spara artikel" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      article: inserted,
    });
  } catch (e) {
    if (String(e).includes("Stage env saknas")) {
      return NextResponse.json(
        { error: "Supabase stage är inte konfigurerat (STAGE__SUPABASE_*)" },
        { status: 503 }
      );
    }
    console.error("[POST /api/admin/make-with-upload]", e);
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
