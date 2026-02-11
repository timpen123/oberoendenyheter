export default async function AdminArticlesEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Redigera artikel {id}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Formulär för att redigera artikeln kommer att visas här.
      </p>
    </div>
  );
}
