"use client";

import { useState, useEffect } from "react";
import { Share2, Facebook, Twitter } from "lucide-react";

interface ArticleShareProps {
  url?: string;
  title?: string;
}

export function ArticleShare({ url, title }: ArticleShareProps) {
  const [mounted, setMounted] = useState(false);
  const [shareUrl, setShareUrl] = useState(url ?? "");
  const [shareTitle, setShareTitle] = useState(title ?? "");

  useEffect(() => {
    setMounted(true);
    if (!url) setShareUrl(window.location.href);
    if (!title) setShareTitle(document.title);
  }, [url, title]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl || window.location.href);
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  if (!url && !mounted) {
    return (
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8 mt-8">
        <span className="mr-2 text-sm text-muted-foreground">Dela artikel:</span>
        <span className="text-sm text-muted-foreground">Laddar…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8 mt-8">
      <span className="mr-2 text-sm text-muted-foreground">Dela artikel:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-colors hover:opacity-90"
      >
        <Facebook className="h-4 w-4" />
        <span>Facebook</span>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm text-secondary-foreground transition-colors hover:opacity-90"
      >
        <Twitter className="h-4 w-4" />
        <span>Twitter</span>
      </a>
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
      >
        <Share2 className="h-4 w-4" />
        <span>Kopiera länk</span>
      </button>
    </div>
  );
}
