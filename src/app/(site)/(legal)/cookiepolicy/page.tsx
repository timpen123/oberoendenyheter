export default function CookiepolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Cookiepolicy
      </h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Gäller från: 2026-02-13
      </p>

      <div className="space-y-8 text-zinc-700 dark:text-zinc-300">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            1. Vad är cookies?
          </h2>
          <p>
            Cookies är små textfiler som lagras i din enhet när du besöker en webbplats. De används för
            att få webbplatsen att fungera, förbättra användarupplevelsen samt mäta och anpassa innehåll
            och annonser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            2. Kategorier av cookies vi använder
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Nödvändiga cookies</strong>: krävs för att webbplatsen ska fungera och kan inte
              stängas av.
            </li>
            <li>
              <strong>Analyscookies</strong>: används för statistik och förbättring av innehåll. Dessa
              aktiveras endast efter samtycke.
            </li>
            <li>
              <strong>Marknadsföringscookies</strong>: används för annonsmätning och relevanta annonser.
              Dessa aktiveras endast efter samtycke.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            3. Rättslig grund i Sverige/EU
          </h2>
          <p>
            Enligt tillämpliga svenska och europeiska regler (bl.a. ePrivacy-regler och GDPR) krävs
            samtycke innan analys- och marknadsföringscookies sätts. Nödvändiga cookies kan användas utan
            samtycke när de behövs för tjänstens funktion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            4. Hur du hanterar samtycke
          </h2>
          <p>
            Du kan när som helst ändra eller återkalla ditt samtycke via sidan för cookie-inställningar.
            Du kan även blockera cookies i webbläsaren, men vissa delar av webbplatsen kan då fungera
            sämre.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            5. Lagringstid för cookies
          </h2>
          <p>
            Cookies kan vara sessionsbaserade (raderas när du stänger webbläsaren) eller permanenta
            (lagras under en begränsad tid). Exakta lagringstider kan variera mellan olika verktyg och
            leverantörer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            6. Tredjepartsleverantörer
          </h2>
          <p>
            Vi kan använda tredjepartsleverantörer för analys och annonsering. Dessa kan i vissa fall
            behandla data utanför EU/EES med lämpliga skyddsåtgärder enligt dataskyddsreglerna.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            7. Kontakt
          </h2>
          <p>
            Har du frågor om cookies eller dataskydd kan du kontakta oss via{" "}
            <a
              href="mailto:redaktionen@oberoendenyheter.se"
              className="text-primary underline underline-offset-2"
            >
              redaktionen@oberoendenyheter.se
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
