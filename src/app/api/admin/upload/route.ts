import { NextResponse } from "next/server";
import { getSupabaseAdminForAdmin } from "@/lib/supabase";

const BUCKET = "article-images";
/** Håll under Vercels hårda gräns 4,5 MB – annars 413 innan request når denna route. */
const MAX_SIZE_MB = 4;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** POST – ladda upp bild till vald admin-Storage. Tar emot vilket form-fält som helst som innehåller en fil (Make skickar t.ex. hela bundle från Get a file). */
export async function POST(request: Request) {
  try {
    const contentLength = request.headers.get("content-length");
    const formData = await request.formData();
    let file: File | null = null;
    for (const [, value] of formData.entries()) {
      if (value instanceof File) {
        file = value;
        break;
      }
    }
    if (!file) {
      return NextResponse.json(
        { error: "Ingen fil hittades i request (skicka multipart/form-data med minst en fil)" },
        { status: 400 }
      );
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    console.info("[POST /api/admin/upload] size:", file.size, "bytes (~" + sizeMb + " MB), Content-Length:", contentLength ?? "—");

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Endast bilder tillåtna (JPEG, PNG, WebP, GIF)" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        {
          error: `Filen får max vara ${MAX_SIZE_MB} MB (Vercel avvisar vid 4,5 MB innan request når servern)`,
          size_bytes: file.size,
          size_mb: Number(sizeMb),
        },
        { status: 400 }
      );
    }

    const ext = (file.name || "").split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

    const supabase = getSupabaseAdminForAdmin();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("[POST /api/admin/upload]", error);
      return NextResponse.json({ error: error.message || "Kunde inte ladda upp" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl, path: data.path });
  } catch (e) {
    if (String(e).includes("Supabase")) {
      return NextResponse.json(
        {
          error:
            "Supabase admin är inte konfigurerat. Sätt NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, eller stage-variabler och USE_STAGE_SUPABASE_FOR_ADMIN=true.",
        },
        { status: 503 }
      );
    }
    console.error("[POST /api/admin/upload]", e);
    return NextResponse.json({ error: "Något gick fel vid uppladdning" }, { status: 500 });
  }
}
