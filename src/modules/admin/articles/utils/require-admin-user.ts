import { createClient } from "@supabase/supabase-js";

export async function requireAdminUser(request: Request): Promise<{
  ok: true;
  userId: string;
} | {
  ok: false;
  response: Response;
}> {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) {
    return {
      ok: false,
      response: Response.json({ error: "Supabase auth är inte konfigurerat" }, { status: 503 }),
    };
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allowedEmails.length > 0) {
    const userEmail = (data.user.email ?? "").toLowerCase();
    if (!allowedEmails.includes(userEmail)) {
      return {
        ok: false,
        response: Response.json({ error: "Forbidden" }, { status: 403 }),
      };
    }
  }

  return { ok: true, userId: data.user.id };
}
