# Oberoende nyheter

Nyhetssajt byggd med Next.js (App Router) och Tailwind CSS. Just nu används **enbart JSON** som datakälla; databas och integration (t.ex. Make) kommer senare.

## Krav

- Node.js 18+

## Datakälla (JSON)

Artiklar läses från **`src/data/articles.json`**. Redigera den filen för att lägga till och ändra nyheter.

Strukturen för varje artikel beskrivs i `src/data/README.md` och typerna i `src/lib/types.ts` (Article). När ni är nöjda med JSON-strukturen kan ni koppla databas eller Make och återanvända samma form.

## Kom igång

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## API

### GET /api/articles

Listar artiklar med paginering (från JSON).

- **Query:** `page` (default 1), `limit` (default 20, max 100).
- **Response:** `{ articles, total, page, limit }`.

### GET /api/articles/[id]

Hämtar en artikel efter `id`.

### GET /api/articles/by-slug/[slug]

Hämtar en artikel efter `slug` (används av publika sidor).

### POST /api/articles

Returnerar **501** – "Skapa artikel är inte aktiverat än. Databas/integration kommer att kopplas in senare." När ni har databas/Make kan ni aktivera POST och använda samma request-body som i `src/lib/types.ts` (ArticleInsert).

## Miljövariabler (senare)

Inga krävs för att köra med JSON. När databas/integration läggs till:

- `POSTGRES_URL` – anslutning till Postgres (om ni använder det).
- `NEWS_API_KEY` – för att skydda POST /api/articles (t.ex. från Make).

## Projektstruktur

- `src/app/(site)/` – publika sidor (layout, startsida, nyheter, kategori, sport, ekonomi, kontakt, om-oss, legal)
- `src/app/(admin)/admin/` – admin (översikt, artiklar, ny/redigera)
- `src/app/api/` – API (articles, contact)
- `src/data/` – **articles.json** + README med JSON-struktur
- `src/lib/` – typer (types.ts), dataläsning (data.ts), slug-hjälp (slug.ts)
- `src/components/` – layout (Header, Footer), nyheter (NewsList, NewsCard, ArticleView)

## Deploy på Vercel

Koppla repot, välj mappen `oberoende-nyheter` som root om behov, och deploy. Ingen databas behövs för nu.
