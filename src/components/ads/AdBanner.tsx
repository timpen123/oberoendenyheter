import Image from "next/image";

interface AdBannerProps {
  variant?: "horizontal" | "vertical";
  /** Bild-URL (t.ex. /Sebstahadd.png) – visas i stället för platshållare */
  src?: string;
  /** För horisontell annons: använd hela tillgängliga bredden */
  fullWidth?: boolean;
}

export function AdBanner({ variant = "horizontal", src, fullWidth = false }: AdBannerProps) {
  if (variant === "vertical") {
    return (
      <div>
        <div className="relative text-center">
          <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">ANNONS</p>
          <div className="relative w-full overflow-hidden rounded lg:aspect-[11/20]">
            {src ? (
              <a
                href="https://sebstah.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full"
              >
                <Image
                  src={src}
                  alt="Annons"
                  fill
                  sizes="(max-width: 1024px) 0px, 25vw"
                  className="object-cover object-top"
                />
              </a>
            ) : (
              <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded border-2 border-dashed border-border text-muted-foreground lg:min-h-0">
                <span className="text-sm">Annonsyta 300x600</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 flex flex-col items-center justify-center rounded-lg bg-muted p-6">
      <p className="mb-2 text-xs text-muted-foreground">ANNONS</p>
      <div
        className={`flex w-full items-center justify-center overflow-hidden rounded ${
          fullWidth ? "max-w-none" : "max-w-3xl"
        }`}
      >
        {src ? (
          <Image
            src={src}
            alt="Annons"
            width={728}
            height={90}
            className={`h-auto max-h-32 w-full object-contain ${fullWidth ? "max-w-none" : "max-w-3xl"}`}
          />
        ) : (
          <div
            className={`flex h-32 w-full items-center justify-center rounded border-2 border-dashed border-border text-muted-foreground ${
              fullWidth ? "max-w-none" : "max-w-3xl"
            }`}
          >
            <span className="text-sm">Annonsyta 728x90</span>
          </div>
        )}
      </div>
    </div>
  );
}
