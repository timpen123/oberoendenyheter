import Link from "next/link";
import { Menu } from "lucide-react";

const categories = [
  { name: "Nyheter", href: "/" },
  { name: "Sport", href: "/sport" },
  { name: "Ekonomi", href: "/ekonomi" },
  { name: "Vetenskap", href: "/kategori/vetenskap" },
  { name: "Nöje", href: "/kategori/noje" },
  { name: "Kultur", href: "/kategori/kultur" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl tracking-tight">
            <span className="font-semibold">OBEROENDE</span>
            <span className="font-light">NYHETER</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-sm transition-colors hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <button type="button" className="p-2 md:hidden" aria-label="Meny">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
