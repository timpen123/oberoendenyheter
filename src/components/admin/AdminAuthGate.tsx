"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (pathname === "/admin/login") {
        setChecking(false);
        return;
      }
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        const next = encodeURIComponent(pathname || "/admin");
        router.replace(`/admin/login?next=${next}`);
        return;
      }
      setChecking(false);
    };
    void run();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
        Kontrollerar inloggning...
      </div>
    );
  }
  return <>{children}</>;
}
