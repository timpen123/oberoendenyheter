# Datastruktur (JSON)

Artiklar ligger i `articles.json` tills databas/integration är på plats.

## Artikel (Article)

Varje objekt ska följa denna form:

| Fält          | Typ    | Obligatorisk | Beskrivning |
|---------------|--------|---------------|-------------|
| `id`          | string | Ja            | Unikt id (t.ex. UUID eller "1", "2") |
| `title`       | string | Ja            | Rubrik |
| `slug`        | string | Ja            | URL-vänlig sträng, unik (t.ex. "min-artikel") |
| `excerpt`     | string \| null | Nej | Kort sammanfattning (listvy) |
| `body`        | string | Ja            | Brödtext (kan vara HTML eller vanlig text) |
| `image`       | string | Ja            | Bild-URL (t.ex. Unsplash) |
| `category`    | string | Ja            | Kategori (t.ex. Sport, Ekonomi, Politik) |
| `readTime`    | string | Ja            | Uppskattad lästid (t.ex. "3 min") |
| `published_at` | string \| null | Nej | Publiceringsdatum, ISO 8601 |
| `created_at` | string | Ja            | Skapad-datum, ISO 8601 |
| `source`      | string \| null | Nej | Källa (t.ex. för Make) |
| `external_id` | string \| null | Nej | Externt id (t.ex. från Make) |

Typerna finns i `src/lib/types.ts` (Article).

## Sortering

API:et returnerar artiklar sorterade på `published_at` (eller `created_at`) fallande, så nyast först.
