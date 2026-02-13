export default async function KategoriSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Kategori: {decodeURIComponent(slug)}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Artiklar i denna kategori kommer att visas här.
      </p>
    </div>
  );
}
