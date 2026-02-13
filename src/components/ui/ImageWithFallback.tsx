"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fill,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const noSrc = !src || !src.trim();

  if (noSrc || error) {
    return (
      <div
        className={`flex min-h-[120px] items-center justify-center bg-muted text-muted-foreground ${className ?? ""}`}
        style={fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="text-sm">Bild saknas</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={320}
      height={240}
      className={className}
      onError={() => setError(true)}
    />
  );
}
