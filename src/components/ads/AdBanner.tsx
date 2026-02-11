import Image from "next/image";

interface AdBannerProps {
  variant?: "horizontal" | "vertical";
  /** Bild-URL (t.ex. /Sebstahadd.png) – visas i stället för platshållare */
  src?: string;
}

export function AdBanner({ variant = "horizontal", src }: AdBannerProps) {
  if (variant === "vertical") {
    return (
      <div className="flex min-h-[600px] sticky top-20 flex-col items-center justify-center rounded-lg bg-muted p-6">
        <div className="text-center">
          <p className="mb-2 text-xs text-muted-foreground">ANNONS</p>
          <div className="flex items-center justify-center overflow-hidden rounded">
            {src ? (
              <a
                href="https://sebstah.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={src}
                  alt="Annons"
                  width={300}
                  height={600}
                  className="h-auto max-h-[600px] w-auto max-w-[300px] object-contain"
                />
              </a>
            ) : (
              <div className="flex h-96 w-64 flex-shrink-0 items-center justify-center rounded border-2 border-dashed border-border text-muted-foreground">
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
      <div className="flex w-full max-w-3xl items-center justify-center overflow-hidden rounded">
        {src ? (
          <Image
            src={src}
            alt="Annons"
            width={728}
            height={90}
            className="h-auto max-h-32 w-full max-w-3xl object-contain"
          />
        ) : (
          <div className="flex h-32 w-full max-w-3xl items-center justify-center rounded border-2 border-dashed border-border text-muted-foreground">
            <span className="text-sm">Annonsyta 728x90</span>
          </div>
        )}
      </div>
    </div>
  );
}
