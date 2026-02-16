import { NextResponse } from "next/server";
import { requireAdminUser } from "@/modules/admin/articles/utils/require-admin-user";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  uploadImageToBucket,
} from "@/modules/admin/articles/infrastructure/admin-articles.repository";
import { getFirstFormFile } from "@/modules/admin/articles/services/multipart-article-parser.service";

export async function POST(request: Request) {
  const admin = await requireAdminUser(request);
  if (!admin.ok) return admin.response;

  try {
    const formData = await request.formData();
    const file = getFirstFormFile(formData);
    if (!file) {
      return NextResponse.json(
        { error: "Ingen fil skickad" },
        { status: 400 }
      );
    }

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

    const uploaded = await uploadImageToBucket(file);
    if (uploaded.error || !uploaded.publicUrl) {
      return NextResponse.json(
        { error: uploaded.error || "Kunde inte ladda upp bild" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: uploaded.publicUrl,
      path: uploaded.path,
    });
  } catch (error) {
    console.error("[POST /api/admin/images]", error);
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
