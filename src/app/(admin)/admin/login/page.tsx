"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Inloggning misslyckades. Kontrollera e-post och lösenord.");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    router.replace(next);
  };

  return (
    <div className="mx-auto max-w-md rounded border border-border bg-card p-6">
      <h1 className="mb-2 text-xl font-semibold">Admin-inloggning</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Endast befintliga användare kan logga in. Registrering är avstängd.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-post
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Lösenord
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </div>
  );
}
