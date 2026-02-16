import { getAdminSupabaseDataSource } from "@/lib/supabase";

function getExpectedIngestKey(): string {
  const mainKey = (process.env.ADMIN_INGEST_KEY ?? "").trim();
  const stageKey = (process.env.ADMIN_INGEST_KEY_STAGE ?? "").trim();
  if (getAdminSupabaseDataSource() === "stage" && stageKey) return stageKey;
  return mainKey || stageKey;
}

export function isAdminIngestAuthorized(request: Request): boolean {
  const configuredKey = getExpectedIngestKey();
  if (!configuredKey) return false;

  const headerKey = (request.headers.get("x-admin-ingest-key") ?? "").trim();
  if (headerKey && headerKey === configuredKey) return true;

  const authHeader = (request.headers.get("authorization") ?? "").trim();
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token === configuredKey) return true;
  }

  return false;
}
