export default function IntegritetspolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Integritetspolicy
      </h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Gäller från: 2026-02-13
      </p>

      <div className="space-y-8 text-zinc-700 dark:text-zinc-300">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            1. Personuppgiftsansvarig
          </h2>
          <p>
            Oberoende Nyheter ansvarar för behandlingen av personuppgifter på webbplatsen.
            Vid frågor om dataskydd kan du kontakta oss via{" "}
            <a
              href="mailto:redaktionen@oberoendenyheter.se"
              className="text-primary underline underline-offset-2"
            >
              redaktionen@oberoendenyheter.se
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            2. Vilka uppgifter vi behandlar
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Kontaktuppgifter du skickar till oss (t.ex. namn, e-post och meddelande).</li>
            <li>Teknisk information om besök, enhet och webbläsare.</li>
            <li>Analysdata om hur webbplatsen används (vid godkänt samtycke).</li>
            <li>Marknadsföringsrelaterad data och annonsmätning (vid godkänt samtycke).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            3. Ändamål och rättslig grund
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Nödvändiga funktioner</strong>: för att webbplatsen ska fungera (berättigat intresse/
              avtal).
            </li>
            <li>
              <strong>Kontaktärenden</strong>: för att svara på frågor (berättigat intresse och/eller
              rättslig förpliktelse).
            </li>
            <li>
              <strong>Analys</strong>: för statistik och förbättring av innehåll (samtycke).
            </li>
            <li>
              <strong>Marknadsföring</strong>: för annonsmätning, målgrupper och relevanta annonser
              (samtycke).
            </li>
          </ul>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            För analys- och marknadsföringscookies samlar vi inte in data förrän samtycke lämnats.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            4. Lagringstid
          </h2>
          <p>
            Personuppgifter sparas endast så länge det behövs för ändamålet, eller så länge lag kräver.
            Samtyckesbaserad data lagras enligt respektive verktygs standardperioder och raderas eller
            anonymiseras därefter.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            5. Delning av uppgifter
          </h2>
          <p>
            Vi kan dela uppgifter med personuppgiftsbiträden, exempelvis driftleverantörer,
            analysleverantörer och annonsplattformar. Delning sker endast när det finns laglig grund och
            personuppgiftsbiträdesavtal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            6. Överföring utanför EU/EES
          </h2>
          <p>
            Om personuppgifter överförs utanför EU/EES använder vi lämpliga skyddsåtgärder, till exempel
            EU-kommissionens standardavtalsklausuler (SCC) och kompletterande säkerhetsåtgärder när det
            behövs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            7. Dina rättigheter
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Rätt till tillgång till dina personuppgifter.</li>
            <li>Rätt till rättelse och radering.</li>
            <li>Rätt till begränsning av behandling.</li>
            <li>Rätt att invända mot viss behandling.</li>
            <li>Rätt till dataportabilitet när tillämpligt.</li>
            <li>Rätt att återkalla samtycke när som helst.</li>
          </ul>
          <p>
            Du kan även lämna klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att vår
            behandling strider mot dataskyddsreglerna.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            8. Cookies och samtycke
          </h2>
          <p>
            Vi använder cookies och liknande tekniker. Nödvändiga cookies används alltid, medan analys-
            och marknadsföringscookies endast används efter samtycke enligt tillämpliga regler i Sverige
            och EU. Läs mer i vår cookiepolicy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            9. Ändringar av policyn
          </h2>
          <p>
            Vi kan uppdatera denna policy vid behov. Senaste version publiceras alltid på denna sida med
            uppdaterat datum.
          </p>
        </section>
      </div>
    </div>
  );
}
