# oberoendenyheter
# Oberoende nyheter

Nyhetssajt byggd med Next.js (App Router) och Tailwind CSS. Kan köras med **JSON** som datakälla eller med **Supabase** (databas + bildlagring).

## Krav

- Node.js 18+

## Datakälla

- **Utan Supabase:** Artiklar läses från **`src/data/articles.json`**.
- **Med Supabase:** Artiklar lagras i Supabase (Postgres) och bilder i Supabase Storage. Sätt env enligt `env.example` och kör SQL i `scripts/supabase-schema.sql`.

Strukturen för varje artikel beskrivs i `src/data/README.md` och typerna i `src/lib/types.ts` (Article).

## Kom igång

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Supabase (databas + bilder)

Supabase ger gratis Postgres och fil-lagring – bra och billigt att börja med.

1. Skapa projekt på [supabase.com](https://supabase.com).
2. Kopiera `env.example` till `.env.local` och fyll i:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API)
3. I Supabase **SQL Editor**: kör innehållet i **`scripts/supabase-schema.sql`**.
4. I Supabase **Storage**: skapa en bucket **`article-images`** och gör den **public** (så uppladdade bilder får en publik URL).

Därefter används Supabase automatiskt för artiklar och bilduppladdning. Utan dessa env-variabler används fortfarande `articles.json`.

## API

API är uppdelat i **site** (publik läsning + kontakt) och **admin** (artiklar CRUD + bilduppladdning).

### Site API (publik)

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | `/api/site/articles` | Lista artiklar. Query: `page`, `limit`. |
| GET | `/api/site/articles/[slug]` | Hämta artikel efter slug. |
| POST | `/api/site/contact` | Skicka kontaktmeddelande (body: `email`, `name`, `message`). |

### Admin API

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | `/api/admin/articles` | Lista artiklar. |
| POST | `/api/admin/articles` | Skapa artikel (kräver Supabase). Body: `ArticleInsert`. |
| GET | `/api/admin/articles/[id]` | Hämta artikel efter id. |
| PATCH | `/api/admin/articles/[id]` | Uppdatera artikel (kräver Supabase). |
| DELETE | `/api/admin/articles/[id]` | Radera artikel (kräver Supabase). 204 vid lyckat. |
| POST | `/api/admin/upload` | Ladda upp bild. FormData: `file` eller `image`. Svarar `{ url, path }`. Max 5 MB, JPEG/PNG/WebP/GIF. |

## Miljövariabler

- **Supabase (valfritt):** Se `env.example`. Krävs för admin-artikel-CRUD och `/api/admin/upload`.
- **Utan Supabase:** Ingen env krävs; sajten använder `src/data/articles.json`.

## Projektstruktur

- `src/app/(site)/` – publika sidor (layout, startsida, nyheter, kategori, sport, ekonomi, kontakt, om-oss, legal)
- `src/app/(admin)/admin/` – admin (översikt, artiklar, ny/redigera)
- `src/app/api/site/` – publik API (artiklar, contact)
- `src/app/api/admin/` – admin-API (artiklar CRUD, upload)
- `src/data/` – **articles.json** + README med JSON-struktur
- `src/lib/` – typer (types.ts), dataläsning (data.ts), slug-hjälp (slug.ts)
- `src/components/` – layout (Header, Footer), nyheter (NewsList, NewsCard, ArticleView)

## Deploy på Vercel

Koppla repot, välj mappen `oberoende-nyheter` som root om behov, och deploy. Ingen databas behövs för nu.
