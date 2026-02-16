export function isAdminIngestAuthorized(request: Request): boolean {
  const configuredKey = (process.env.ADMIN_INGEST_KEY ?? "").trim();
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
