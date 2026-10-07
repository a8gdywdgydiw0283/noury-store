-- Noury store dashboard schema.
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run.

-- 1) Products table (managed from /admin, shown on the site)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  price numeric not null default 0,
  image_url text,
  description text default '',
  badge text,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Orders table (checkout + gift + baby + bridal requests)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'checkout',
  customer jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  details jsonb,
  subtotal numeric not null default 0,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- 3) Public storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 4) Row Level Security: open access for the storefront + admin
-- (The admin area is gated by a password in the app; for stronger
--  protection later we can switch to Supabase Auth + owner-only policies.)
alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "public all products" on public.products;
create policy "public all products" on public.products
  for all using (true) with check (true);

drop policy if exists "public all orders" on public.orders;
create policy "public all orders" on public.orders
  for all using (true) with check (true);

drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "public write product-images" on storage.objects;
create policy "public write product-images" on storage.objects
  for insert with check (bucket_id = 'product-images');

drop policy if exists "public update product-images" on storage.objects;
create policy "public update product-images" on storage.objects
  for update using (bucket_id = 'product-images') with check (bucket_id = 'product-images');

drop policy if exists "public delete product-images" on storage.objects;
create policy "public delete product-images" on storage.objects
  for delete using (bucket_id = 'product-images');
