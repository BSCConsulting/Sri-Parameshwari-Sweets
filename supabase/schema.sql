-- Run once in Supabase → SQL Editor (free project at https://supabase.com)
-- Then: Authentication → Users → Add user (email + password) = your admin login
-- Then: Storage → New bucket → name "project-images" → Public bucket ON

create table if not exists products (
  id text primary key,
  name text not null,
  telugu_name text not null default '',
  category text not null,
  description text not null default '',
  image text not null default '',
  price_250g integer not null check (price_250g >= 0),
  price_500g integer not null check (price_500g >= 0),
  price_1kg integer not null check (price_1kg >= 0),
  tags text[] not null default '{}',
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table products enable row level security;

-- Anyone can read active products (the public website)
drop policy if exists "Public read active products" on products;
create policy "Public read active products"
  on products for select
  using (active = true);

-- Logged-in admin can read everything (incl. inactive)
drop policy if exists "Auth read all products" on products;
create policy "Auth read all products"
  on products for select
  to authenticated
  using (true);

drop policy if exists "Auth insert products" on products;
create policy "Auth insert products"
  on products for insert
  to authenticated
  with check (true);

drop policy if exists "Auth update products" on products;
create policy "Auth update products"
  on products for update
  to authenticated
  using (true);

drop policy if exists "Auth delete products" on products;
create policy "Auth delete products"
  on products for delete
  to authenticated
  using (true);

-- Storage policies for project-images bucket (create the bucket in the UI first)
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "Auth upload product images" on storage.objects;
create policy "Auth upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Auth update product images" on storage.objects;
create policy "Auth update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Auth delete product images" on storage.objects;
create policy "Auth delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
