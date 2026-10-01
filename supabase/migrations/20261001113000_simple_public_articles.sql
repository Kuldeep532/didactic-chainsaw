-- Simple public article content model for the Nexus Wave website.
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null default 'Nexus',
  excerpt text not null default '',
  content text not null,
  image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_idx
  on public.articles (published, published_at desc);

alter table public.articles enable row level security;

drop policy if exists articles_public_read on public.articles;
create policy articles_public_read
  on public.articles
  for select
  to anon, authenticated
  using (published = true);

create or replace function public.touch_articles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
before update on public.articles
for each row execute function public.touch_articles_updated_at();

insert into public.articles (title, slug, category, excerpt, content, published)
values
(
  'Welcome to Nexus Wave Technologies',
  'welcome-to-nexus-wave-technologies',
  'Company',
  'A simple introduction to Nexus Wave Technologies and the products we build.',
  'Nexus Wave Technologies creates practical digital products with a focus on accessibility, clarity and useful everyday tools. Our ecosystem includes Nexus Plus and Geeta Nexus, with more services being developed over time.',
  true
),
(
  'Designing for Accessible Everyday Use',
  'designing-for-accessible-everyday-use',
  'Accessibility',
  'Why clear navigation, readable layouts and predictable interactions matter.',
  'Accessible design is about making important actions easy to find and easy to understand. We focus on semantic structure, clear headings, strong focus states and straightforward navigation so people can use our products independently.',
  true
),
(
  'What is Nexus Plus?',
  'what-is-nexus-plus',
  'Products',
  'An overview of the Nexus Plus ecosystem and its practical tools.',
  'Nexus Plus brings together AI assistance, audio tools, document utilities, media features and accessibility-focused workflows in one place. The product is designed to grow gradually while keeping everyday use simple.',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  excerpt = excluded.excerpt,
  content = excluded.content,
  published = excluded.published,
  updated_at = now();
