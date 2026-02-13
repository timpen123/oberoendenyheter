# Databasstruktur (referens)

Skapa tabellerna i Supabase Table Editor eller SQL Editor. Koden förväntar sig följande.

---

## 1. Artiklar (din artikel-JSON)

Tabellnamn: `articles` (eller sätt `SUPABASE_ARTICLES_TABLE` i .env).

| Kolumn       | Typ         | Kommentar                    |
|-------------|-------------|------------------------------|
| id          | uuid        | PRIMARY KEY, default gen_random_uuid() |
| title       | text        | NOT NULL                     |
| slug        | text        | NOT NULL UNIQUE              |
| excerpt     | text        |                              |
| body        | text        | NOT NULL                     |
| image       | text        | URL, default ''               |
| category    | text        | default 'Övrigt'             |
| read_time   | text        | t.ex. "7 min", default '1 min' |
| published_at| timestamptz |                              |
| created_at  | timestamptz | NOT NULL default now()        |
| updated_at  | timestamptz | NOT NULL default now()       |
| source      | text        |                              |
| external_id | text        |                              |

Index: `slug`, `published_at`, `created_at`, `category` (valfritt).

---

## 2. Användare och roller (admin/editor)

Använd **Supabase Auth** för inloggning – då finns `auth.users` redan. Lägg bara till en **profiles**-tabell med roll.

| Kolumn       | Typ    | Kommentar                    |
|-------------|--------|------------------------------|
| id          | uuid   | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE |
| role        | text   | t.ex. 'admin', 'editor'      |
| display_name| text   | valfritt                     |
| updated_at  | timestamptz | default now()             |

Roller du kan använda: `admin`, `editor`, `viewer` (eller egna). Sen kan du i API (admin-routes) kolla `profiles.role === 'admin'` innan du tillåter skrivning.

Kör SQL nedan i Supabase **SQL Editor** om du vill skapa `profiles` och trigger som skapar profil vid ny användare.
