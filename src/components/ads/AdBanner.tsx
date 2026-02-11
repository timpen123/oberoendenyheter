interface AdBannerProps {
  variant?: "horizontal" | "vertical";
}

export function AdBanner({ variant = "horizontal" }: AdBannerProps) {
  if (variant === "vertical") {
    return (
      <div className="flex min-h-[600px] sticky top-20 flex-col items-center justify-center rounded-lg bg-muted p-6">
        <div className="text-center">
          <p className="mb-2 text-xs text-muted-foreground">ANNONS</p>
          <div className="text-muted-foreground">
            <div className="flex h-96 w-64 flex-shrink-0 items-center justify-center rounded border-2 border-dashed border-border">
              <span className="text-sm">Annonsyta 300x600</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 flex flex-col items-center justify-center rounded-lg bg-muted p-6">
      <p className="mb-2 text-xs text-muted-foreground">ANNONS</p>
      <div className="flex h-32 w-full max-w-3xl items-center justify-center rounded border-2 border-dashed border-border">
        <span className="text-sm text-muted-foreground">Annonsyta 728x90</span>
      </div>
    </div>
  );
}
