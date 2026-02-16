import { NextResponse } from "next/server";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  insertArticleWithRetry,
  uploadImageToBucket,
} from "@/modules/admin/articles/infrastructure/admin-articles.repository";
import {
  getFirstFormFile,
  getFormString,
  parseArticleFromMultipart,
} from "@/modules/admin/articles/services/multipart-article-parser.service";
import { isAdminIngestAuthorized } from "@/modules/admin/articles/utils/admin-auth";

export async function postMakeWithUpload(request: Request) {
  if (!isAdminIngestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = getFirstFormFile(formData);
    const parsed = parseArticleFromMultipart(formData);

    if (!parsed.row) {
      return NextResponse.json({ error: parsed.error ?? "Ogiltigt payload" }, { status: 400 });
    }

    let imageUrl = "";
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
        return NextResponse.json(
          { error: "Endast bilder tillåtna (JPEG, PNG, WebP, GIF)" },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `Bilden får max vara ${MAX_IMAGE_SIZE_MB} MB` },
          { status: 400 }
        );
      }
      const upload = await uploadImageToBucket(file);
      if (upload.error || !upload.publicUrl) {
        return NextResponse.json(
          { error: upload.error || "Kunde inte ladda upp bild" },
          { status: 500 }
        );
      }
      imageUrl = upload.publicUrl;
    }

    const explicitStatusFromField = getFormString(formData, "status");
    const explicitStatusFromPayload = parsed.parsedCombined?.status;
    const explicitStatus =
      explicitStatusFromField === "draft" ||
      explicitStatusFromField === "published" ||
      explicitStatusFromPayload === "draft" ||
      explicitStatusFromPayload === "published";

    const hasImage = Boolean(imageUrl);
    const derivedStatus: "draft" | "published" = explicitStatus
      ? parsed.row.status
      : hasImage
        ? "published"
        : "draft";

    const row = {
      ...parsed.row,
      image: imageUrl,
      status: derivedStatus,
      published_at:
        derivedStatus === "published"
          ? parsed.row.published_at ?? new Date().toISOString()
          : null,
    };
    const inserted = await insertArticleWithRetry(row);
    if (inserted.error || !inserted.data) {
      return NextResponse.json(
        { error: inserted.error || "Kunde inte spara artikel" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      dataSource: inserted.dataSource,
      imageUrl,
      article: inserted.data,
    });
  } catch (error) {
    if (String(error).includes("Supabase")) {
      return NextResponse.json(
        {
          error:
            "Supabase admin är inte konfigurerat. Sätt NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, eller stage-variabler och USE_STAGE_SUPABASE_FOR_ADMIN=true.",
        },
        { status: 503 }
      );
    }
    console.error("[POST /api/admin/make-with-upload]", error);
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
