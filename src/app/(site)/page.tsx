import { NewsList } from "@/components/news/NewsList";
import { AdBanner } from "@/components/ads/AdBanner";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <NewsList />
        </div>
        <aside className="hidden lg:col-span-3 lg:block">
          <AdBanner variant="vertical" />
        </aside>
      </div>
    </div>
  );
}
