-- Blade & Quill Art Academy — Supabase schema
-- Apply via Supabase SQL Editor or: psql "$POSTGRES_URL_NON_POOLING" -f lib/db/sql/schema.sql
-- All tables have RLS enabled with no anon policies: the app only accesses
-- them server-side via the service role key, which bypasses RLS.

create table if not exists products (
  id bigint primary key generated always as identity,
  name text not null,
  description text not null,
  price numeric(10, 2) not null,
  category text not null check (category in ('physical', 'digital', 'curriculum', 'bundle')),
  image_url text not null,
  gumroad_url text,
  download_url text,
  featured boolean not null default false,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists gallery (
  id bigint primary key generated always as identity,
  title text not null,
  image_url text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tutorials (
  id bigint primary key generated always as identity,
  title text not null,
  youtube_id text not null,
  description text,
  topic text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists downloads (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  file_url text not null,
  file_type text not null,
  thumbnail_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Orders store a snapshot of Tina product fields at checkout time so
-- fulfillment does not depend on the Supabase products seed matching Tina.
create table if not exists orders (
  id bigint primary key generated always as identity,
  stripe_session_id text not null unique,
  product_id bigint not null,
  product_name text,
  product_category text,
  product_slug text,
  gumroad_url text,
  download_url text,
  -- Snapshot of the product's Download Files at checkout:
  -- [{ "label": "Workbook (PDF)", "path": "krita-bundle/workbook.pdf" }, ...]
  -- Paths are object keys in the private `product-downloads` storage bucket.
  download_files jsonb,
  customer_email text,
  status text not null default 'pending',
  download_token text,
  download_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Migrate existing orders tables that still FK to products and lack snapshots.
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'orders_product_id_fkey'
      and table_name = 'orders'
  ) then
    alter table orders drop constraint orders_product_id_fkey;
  end if;
end $$;

alter table orders add column if not exists product_name text;
alter table orders add column if not exists product_category text;
alter table orders add column if not exists product_slug text;
alter table orders add column if not exists gumroad_url text;
alter table orders add column if not exists download_url text;
alter table orders add column if not exists download_files jsonb;

alter table products enable row level security;
alter table gallery enable row level security;
alter table tutorials enable row level security;
alter table downloads enable row level security;
alter table orders enable row level security;
alter table contacts enable row level security;
