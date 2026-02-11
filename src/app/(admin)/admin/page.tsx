import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Admin – översikt
      </h1>
      <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
        <li>
          <Link
            href="/admin/articles"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Hantera artiklar
          </Link>
        </li>
        <li>
          <Link
            href="/admin/articles/new"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Skapa ny artikel
          </Link>
        </li>
      </ul>
    </div>
  );
}
