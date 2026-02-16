import Link from "next/link";

const sections = [
  { label: "Nyheter", href: "/nyheter" },
  { label: "Sport", href: "/sport" },
  { label: "Ekonomi", href: "/ekonomi" },
  { label: "Vetenskap", href: "/kategori/vetenskap" },
];

const company = [
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakt", href: "/kontakt" },
];

const legal = [
  { label: "Integritetspolicy", href: "/integritetspolicy" },
  { label: "Cookiepolicy", href: "/cookiepolicy" },
  { label: "Cookie-inställningar", href: "/cookie-installningar" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block text-xl tracking-tight">
              <span className="font-semibold">OBEROENDE</span>
              <span className="font-light">NYHETER</span>
            </Link>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Oberoende nyhetsrapportering med fokus på tydlighet, relevans och snabb överblick.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Sektioner</h3>
            <ul className="mt-3 space-y-2">
              {sections.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Information</h3>
            <ul className="mt-3 space-y-2">
              {company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
              {legal.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {year} Oberoende Nyheter. Alla rättigheter förbehållna.</p>
            <p>Tipsa redaktionen: redaktionen@oberoendenyheter.se</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
