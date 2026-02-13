import { NewsList } from "@/components/news/NewsList";

export default function NyheterPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Nyheter
      </h1>
      <NewsList />
    </div>
  );
}
