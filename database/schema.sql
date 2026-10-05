create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

create table sources (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('shopify','woocommerce','manual')),
  name text not null,
  is_active boolean not null default true,
  last_sync_at timestamptz,
  last_sync_status text,       -- success | partial | failed
  created_at timestamptz not null default now(),
  unique (type, name)
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete set null,
  source_id uuid references sources(id) on delete set null,
  external_id text,           -- id/slug in source (null for manual)
  name text not null,
  slug text not null unique,
  position int not null default 0,
  is_visible boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  unique (source_id, external_id)
);
create index idx_cat_parent_pos on categories(parent_id, position);

create table products (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  external_id text not null,   -- duplicate-prevention key with source_id
  sku text,
  slug text not null unique,
  name text not null,
  description_html text,
  description_text text,
  price numeric(12,2),
  compare_at_price numeric(12,2),
  currency char(3) not null default 'INR',
  availability text not null default 'in_stock' 
    check (availability in ('in_stock','out_of_stock','preorder')),
  stock_quantity int,
  source_url text,
  thumb_url text,              -- denormalized first image => tiny list payloads
  metadata jsonb not null default '{}',
  content_hash text,           -- sha256 of normalized fields; change detection
  locked_fields text[] not null default '{}', -- admin-edited fields sync must not overwrite
  is_published boolean not null default true,
  remote_deleted_at timestamptz,      -- source no longer returns it
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, external_id)
);
create index idx_products_list on products(is_published, created_at desc, id);
create index idx_products_avail on products(availability);
create index idx_products_price on products(price);
create index idx_products_name_trgm on products using gin (name gin_trgm_ops);
create index idx_products_sku_trgm  on products using gin (sku gin_trgm_ops);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  position int not null default 0,
  original_url text not null,
  cdn_public_id text,          -- Cloudinary id once uploaded
  width int, height int, alt text,
  status text not null default 'ok',     -- ok | failed
  unique (product_id, original_url)
);
create index idx_img_product on product_images(product_id, position);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  external_id text not null,
  sku text, title text,
  price numeric(12,2),
  stock_quantity int,
  availability text not null default 'in_stock',
  options jsonb not null default '{}',   -- {"Size":"M"}
  unique (product_id, external_id)
);

create table product_categories (
  product_id uuid references products(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (product_id, category_id)
);
create index idx_pc_cat on product_categories(category_id, product_id);

create table sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  kind text not null check (kind in ('import','sync')),
  status text not null default 'running' check (status in ('running','success','partial','failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  fetched_count int default 0, created_count int default 0, updated_count int default 0,
  unchanged_count int default 0, failed_count int default 0, removed_count int default 0,
  error_summary text,
  triggered_by text
);
create index idx_runs_src on sync_runs(source_id, started_at desc);

create table sync_errors (
  id uuid primary key default gen_random_uuid(),
  sync_run_id uuid not null references sync_runs(id) on delete cascade,
  external_id text, stage text,      -- fetch | normalize | upsert | image
  message text not null, details jsonb,
  created_at timestamptz not null default now()
);

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table catalog_designs (
  key text primary key, name text not null, description text, is_enabled boolean not null default true
);

insert into catalog_designs values
  ('design_a','Premium Minimal','Clean grid, bottom-sheet product view',true),
  ('design_b','Editorial Magazine','Large visual stories, full-page product view',true);

create table settings (
  key text primary key, value jsonb not null, updated_at timestamptz not null default now()
);
insert into settings(key,value) values
  ('active_design','"design_a"'), ('whatsapp_number','""'), 
  ('store_name','"SamaanHub"'), ('currency','"INR"');

insert into sources(type,name) values ('manual','Manual'),('shopify','Shopify Demo'),('woocommerce','WooCommerce Demo');
