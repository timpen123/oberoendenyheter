import { NewsList } from "@/components/news/NewsList";
import { AdBanner } from "@/components/ads/AdBanner";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-3">
        <div className="lg:col-span-12">
          <AdBanner variant="horizontal" fullWidth compact mock980x240 />
        </div>
        <div className="lg:col-span-9">
          <NewsList />
        </div>
        <aside className="hidden lg:col-span-3 lg:block">
          <AdBanner variant="vertical" src="/Sebstahadd.png" />
        </aside>
      </div>
    </div>
  );
}
