import { NextResponse } from "next/server";
import {
  deleteArticleFromSupabase,
  getArticleByIdFromSupabase,
  updateArticleInSupabase,
} from "@/lib/supabase-data";
import type { ArticleInsert } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import { requireAdminUser } from "@/modules/admin/articles/utils/require-admin-user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminUser(request);
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase är inte konfigurerat" }, { status: 503 });
  }
  const { id } = await params;
  const article = await getArticleByIdFromSupabase(id);
  if (!article) {
    return NextResponse.json({ error: "Artikeln hittades inte" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminUser(request);
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase är inte konfigurerat" }, { status: 503 });
  }
  const { id } = await params;
  const body = (await request.json()) as Partial<ArticleInsert>;
  const updated = await updateArticleInSupabase(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Kunde inte uppdatera artikel" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminUser(request);
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase är inte konfigurerat" }, { status: 503 });
  }
  const { id } = await params;
  const ok = await deleteArticleFromSupabase(id);
  if (!ok) {
    return NextResponse.json({ error: "Kunde inte radera artikel" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
