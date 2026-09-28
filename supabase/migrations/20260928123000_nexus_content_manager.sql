-- Nexus website content manager: posts + safe auto links
create extension if not exists pgcrypto;

create or replace function public.is_nexus_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_nexus_admin() from public, anon;
grant execute on function public.is_nexus_admin() to authenticated;

create table if not exists public.site_links (
  id uuid primary key default gen_random_uuid(),
  screen text not null check (screen in ('home','apps','women-safety','posts','community','join-team','footer','all')),
  label text not null check (char_length(trim(label)) between 1 and 100),
  url text not null check (url ~* '^https?://'),
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_links_screen_active_idx
  on public.site_links(screen, active, sort_order, created_at desc);

create table if not exists public.site_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null default 'Nexus',
  excerpt text not null default '',
  body text not null,
  published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_posts_published_idx
  on public.site_posts(published, created_at desc);

alter table public.site_links enable row level security;
alter table public.site_posts enable row level security;

drop policy if exists site_links_public_read on public.site_links;
create policy site_links_public_read on public.site_links
  for select using (active = true);

drop policy if exists site_links_admin_insert on public.site_links;
create policy site_links_admin_insert on public.site_links
  for insert with check (public.is_nexus_admin() and created_by = auth.uid());

drop policy if exists site_links_admin_update on public.site_links;
create policy site_links_admin_update on public.site_links
  for update using (public.is_nexus_admin())
  with check (public.is_nexus_admin());

drop policy if exists site_links_admin_delete on public.site_links;
create policy site_links_admin_delete on public.site_links
  for delete using (public.is_nexus_admin());

drop policy if exists site_posts_public_read on public.site_posts;
create policy site_posts_public_read on public.site_posts
  for select using (published = true);

drop policy if exists site_posts_admin_insert on public.site_posts;
create policy site_posts_admin_insert on public.site_posts
  for insert with check (public.is_nexus_admin() and created_by = auth.uid());

drop policy if exists site_posts_admin_update on public.site_posts;
create policy site_posts_admin_update on public.site_posts
  for update using (public.is_nexus_admin())
  with check (public.is_nexus_admin());

drop policy if exists site_posts_admin_delete on public.site_posts;
create policy site_posts_admin_delete on public.site_posts
  for delete using (public.is_nexus_admin());

grant select on public.site_links, public.site_posts to anon, authenticated;
grant insert, update, delete on public.site_links, public.site_posts to authenticated;
