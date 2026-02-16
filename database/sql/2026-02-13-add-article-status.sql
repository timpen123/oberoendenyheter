-- Lägg till statusfält för draft/published i articles-tabellen.
-- Kör denna i Supabase SQL Editor.

alter table if exists public.articles
  add column if not exists status text not null default 'draft';

-- Säkerställ giltiga värden.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_status_check'
  ) then
    alter table public.articles
      add constraint articles_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

-- Backfill: publicerade artiklar får status published, övriga draft.
update public.articles
set status = case when published_at is not null then 'published' else 'draft' end
where status is null or status not in ('draft', 'published');

create index if not exists idx_articles_status on public.articles (status);
