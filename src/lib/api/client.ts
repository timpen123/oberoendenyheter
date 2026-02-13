/**
 * Enkel API-klient för frontend-anrop mot våra egna routes.
 * Använd get/post etc. så att fel och typer hanteras konsekvent.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestConfig extends RequestInit {
  /** Query-parametrar som läggs på URL. */
  params?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const search = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  return path + search;
}

/**
 * GET request mot vår API. Kastar ApiError vid !res.ok.
 */
export async function get<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { params, ...init } = config;
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}
