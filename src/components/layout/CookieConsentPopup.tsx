"use client";

import Link from "next/link";
import { useState } from "react";

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

const STORAGE_KEY = "oberoende_cookie_consent_v1";
const COOKIE_NAME = "oberoende_cookie_consent";

function writeConsentCookie(value: CookieConsent) {
  const maxAge = 60 * 60 * 24 * 365;
  const encoded = encodeURIComponent(JSON.stringify(value));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encoded}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function saveConsent(value: CookieConsent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  writeConsentCookie(value);
}

function getInitialConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function CookieConsentPopup() {
  const initialConsent = getInitialConsent();
  const [visible, setVisible] = useState(initialConsent === null);
  const [analytics, setAnalytics] = useState(Boolean(initialConsent?.analytics));
  const [marketing, setMarketing] = useState(Boolean(initialConsent?.marketing));

  const saveAndClose = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveConsent({
      necessary: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      updatedAt: new Date().toISOString(),
      version: 1,
    });
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Vi anvander cookies</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Vi anvander cookies for nodvandiga funktioner samt, vid ditt samtycke, statistik och
              marknadsforing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => saveAndClose(false, false)}
            className="rounded-full border border-border px-2.5 py-1 text-sm text-muted-foreground hover:text-foreground"
            aria-label="Stang cookie-popup"
          >
            x
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium">Nodvandiga</p>
              <p className="text-sm text-muted-foreground">Kravs for att webbplatsen ska fungera.</p>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Alltid aktiv</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium">Statistik</p>
              <p className="text-sm text-muted-foreground">Hjalper oss forsta hur webbplatsen anvands.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="peer sr-only"
              />
              <span className="h-7 w-12 rounded-full bg-zinc-300 transition peer-checked:bg-zinc-900 dark:bg-zinc-700 dark:peer-checked:bg-zinc-50" />
              <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5 dark:bg-zinc-900" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium">Marknadsforing</p>
              <p className="text-sm text-muted-foreground">Anvands for marknadsforing och annonser.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="peer sr-only"
              />
              <span className="h-7 w-12 rounded-full bg-zinc-300 transition peer-checked:bg-zinc-900 dark:bg-zinc-700 dark:peer-checked:bg-zinc-50" />
              <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5 dark:bg-zinc-900" />
            </label>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Las mer i{" "}
          <Link href="/integritetspolicy" className="underline underline-offset-2">
            integritetspolicyn
          </Link>{" "}
          och{" "}
          <Link href="/cookiepolicy" className="underline underline-offset-2">
            cookiepolicyn
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveAndClose(false, false)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Neka alla
          </button>
          <button
            type="button"
            onClick={() => saveAndClose(true, true)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Acceptera alla
          </button>
          <button
            type="button"
            onClick={() => saveAndClose(analytics, marketing)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Spara val
          </button>
        </div>
      </div>
    </div>
  );
}
