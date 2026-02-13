import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "article-images";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getStageClient() {
  const url = process.env.STAGE__SUPABASE_URL;
  const key = process.env.STAGE__SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Stage env saknas: STAGE__SUPABASE_URL och STAGE__SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

/** POST – ladda upp bild till stage Storage. Tar emot vilket form-fält som helst som innehåller en fil (Make skickar t.ex. hela bundle från Get a file). */
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
    if (!file) {
      return NextResponse.json(
        { error: "Ingen fil hittades i request (skicka multipart/form-data med minst en fil)" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Endast bilder tillåtna (JPEG, PNG, WebP, GIF)" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Filen får max vara ${MAX_SIZE_MB} MB` },
        { status: 400 }
      );
    }

    const ext = (file.name || "").split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

    const supabase = getStageClient();
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
    if (String(e).includes("Stage env saknas")) {
      return NextResponse.json(
        { error: "Supabase stage är inte konfigurerat (STAGE__SUPABASE_*)" },
        { status: 503 }
      );
    }
    console.error("[POST /api/admin/upload]", e);
    return NextResponse.json({ error: "Något gick fel vid uppladdning" }, { status: 500 });
  }
}
