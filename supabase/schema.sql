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

-- 5) ERP upgrade (safe to re-run): stock, categories, expenses
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists low_stock_at integer not null default 5;

create table if not exists public.categories (
  slug text primary key,
  title text not null,
  subtitle text not null default '',
  blurb text not null default '',
  image_url text,
  custom boolean not null default false,
  visible boolean not null default true,
  sort_order integer not null default 0
);

insert into public.categories (slug, title, subtitle, blurb, custom, visible, sort_order) values
  ('accessories', 'Accessories', 'For Him & Her', 'Delicate pieces designed to layer, stack and live in.', false, true, 1),
  ('beauty', 'Beauty', 'Makeup & Skincare', 'Everyday radiance, from skin prep to the final glow.', false, true, 2),
  ('gifts', 'Gifts', 'For Every Occasion', 'Every gift is tailored to the customer — tell us what you have in mind.', true, true, 3),
  ('bridal-favors', 'Bridal Favors', 'Weddings & Henna', 'Elegant favors for bridal showers, weddings and henna nights.', true, true, 4),
  ('baby-favors', 'Baby Favors', 'Newborn Distributions', 'Personalised newborn favors — tell us the baby name, count and birth date.', true, true, 5)
on conflict (slug) do nothing;

-- Remove the Beauty section entirely (category + its products)
delete from public.products where category = 'beauty';
delete from public.categories where slug = 'beauty';

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null default 0,
  category text not null default 'general',
  spent_on date not null default current_date,
  notes text default '',
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "public all categories" on public.categories;
create policy "public all categories" on public.categories
  for all using (true) with check (true);

drop policy if exists "public all expenses" on public.expenses;
create policy "public all expenses" on public.expenses
  for all using (true) with check (true);
