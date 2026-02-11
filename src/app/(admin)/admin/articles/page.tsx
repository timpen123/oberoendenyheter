import Link from "next/link";

export default function AdminArticlesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Artiklar
        </h1>
        <Link
          href="/admin/articles/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Ny artikel
        </Link>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">
        Lista över artiklar kommer att visas här. Redigera via länken på varje rad.
      </p>
    </div>
  );
}
