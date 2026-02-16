"use client";

import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

function subscribeHash(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("hashchange", handler);
  return () => window.removeEventListener("hashchange", handler);
}

function getHashSnapshot() {
  if (typeof window === "undefined") return "";
  return window.location.hash;
}

function getHashServerSnapshot() {
  return "";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeHash, getHashSnapshot, getHashServerSnapshot);
  const isRecoveryMode = hash.includes("type=recovery");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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

  const onSendReset = async () => {
    setSendingReset(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/admin/login`
          : undefined;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      if (resetError) throw resetError;
      setResetSent(true);
      setInfo("Återställningslänk skickad. Kontrollera din e-post.");
    } catch {
      setError("Kunde inte skicka återställningslänk.");
    } finally {
      setSendingReset(false);
    }
  };

  const onSetNewPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    if (!newPassword || newPassword.length < 6) {
      setLoading(false);
      setError("Nytt lösenord måste vara minst 6 tecken.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setLoading(false);
      setError("Lösenorden matchar inte.");
      return;
    }
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", "/admin/login");
      }
      setInfo("Lösenord uppdaterat. Du kan nu logga in.");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch {
      setError("Kunde inte uppdatera lösenord. Öppna länken igen och försök.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded border border-border bg-card p-6">
      <h1 className="mb-2 text-xl font-semibold">Admin-inloggning</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Endast befintliga användare kan logga in. Registrering är avstängd.
      </p>

      {isRecoveryMode ? (
        <form onSubmit={onSetNewPassword} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="new-password" className="text-sm font-medium">
              Nytt lösenord
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded border border-border bg-background px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="new-password-confirm" className="text-sm font-medium">
              Bekräfta nytt lösenord
            </label>
            <input
              id="new-password-confirm"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              className="w-full rounded border border-border bg-background px-3 py-2"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-600">{info}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Sparar..." : "Sätt nytt lösenord"}
          </button>
        </form>
      ) : (
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
        {info ? <p className="text-sm text-emerald-600">{info}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>

        <div className="border-t border-border pt-3">
          <p className="mb-2 text-sm text-muted-foreground">Glömt lösenord?</p>
          <button
            type="button"
            onClick={() => void onSendReset()}
            disabled={sendingReset || !email.trim()}
            className="w-full rounded border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-60"
          >
            {sendingReset ? "Skickar..." : resetSent ? "Skickat" : "Skicka återställningslänk"}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Ange e-post ovan först. Länken öppnar samma sida i återställningsläge.
          </p>
        </div>
      </form>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Problem med inloggning? <Link href="/" className="underline underline-offset-2">Tillbaka till sajten</Link>
      </p>
    </div>
  );
}
