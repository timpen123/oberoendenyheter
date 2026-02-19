import Image from "next/image";

interface AdBannerProps {
  variant?: "horizontal" | "vertical";
  /** Bild-URL (t.ex. /Sebstahadd.png) – visas i stället för platshållare */
  src?: string;
  /** För horisontell annons: använd hela tillgängliga bredden */
  fullWidth?: boolean;
  /** Minska vertikal spacing runt annonsen */
  compact?: boolean;
  /** Visa svart mock i format 980x240 */
  mock980x240?: boolean;
}

export function AdBanner({
  variant = "horizontal",
  src,
  fullWidth = false,
  compact = false,
  mock980x240 = false,
}: AdBannerProps) {
  if (variant === "vertical") {
    return (
      <div>
        <div className="relative text-center">
          <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            ANNONS
          </p>
          <div className="relative mt-6 w-full overflow-hidden rounded bg-muted lg:h-[520px]">
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
    <div
      className={`${compact ? "my-0" : "my-8"} flex flex-col items-center justify-center ${
        mock980x240 ? "" : "rounded-lg bg-muted p-6"
      }`}
    >
      <p className="mb-2 text-xs text-muted-foreground">ANNONS</p>
      <div
        className={`flex w-full items-center justify-center overflow-hidden rounded ${
          fullWidth ? "max-w-none" : "max-w-3xl"
        }`}
      >
        {mock980x240 ? (
          <div className="relative w-full overflow-hidden rounded bg-black text-white aspect-[49/8]">
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                ANNONS
              </p>
              <p className="mt-2 text-xl font-semibold sm:text-2xl">
                980 x 160 Mockup
              </p>
              <p className="mt-2 text-sm text-zinc-300 sm:text-base">
                Responsiv annonsyta som skalar med sidbredden
              </p>
            </div>
          </div>
        ) : src ? (
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
