-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- TABLE 1: categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  icon_name text not null default 'package',
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- TABLE 2: subcategories
create table subcategories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null,
  display_order int not null default 0,
  is_active boolean not null default true
);

-- TABLE 3: products
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sku text not null default '',
  category_id uuid not null references categories(id) on delete restrict,
  subcategory_id uuid references subcategories(id) on delete set null,
  brand text not null default '',
  description text not null default '',
  pack_sizes text[] not null default '{}',
  unit text not null default '',
  min_order_qty int not null default 1,
  application text[] not null default '{}',
  tags text[] not null default '{}',
  status text not null default 'available' 
    check (status in ('available','on_request','out_of_stock')),
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  image_url text,
  certifications text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TABLE 4: inquiries
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete set null,
  name text not null,
  company text not null default '',
  phone text not null,
  email text not null,
  products_interested text not null default '',
  quantity text not null default '',
  message text not null default '',
  status text not null default 'new'
    check (status in ('new','read','responded')),
  source text not null default 'website',
  created_at timestamptz not null default now()
);

-- TABLE 5: settings
create table settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text not null default '',
  label text not null default ''
);

-- Auto-update updated_at on products
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- INDEXES
create index idx_products_category on products(category_id);
create index idx_products_status on products(status);
create index idx_products_slug on products(slug);
create index idx_inquiries_status on inquiries(status);
create index idx_subcategories_category on subcategories(category_id);

-- ROW LEVEL SECURITY
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table products enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;

-- PUBLIC READ: categories, subcategories, products
create policy "Public can read categories"
  on categories for select using (true);

create policy "Public can read subcategories"
  on subcategories for select using (true);

create policy "Public can read products"
  on products for select using (true);

-- PUBLIC INSERT: inquiries only
create policy "Public can submit inquiries"
  on inquiries for insert with check (true);

-- SERVICE ROLE FULL ACCESS (admin panel uses service role)
create policy "Service role full access categories"
  on categories for all using (auth.role() = 'service_role');

create policy "Service role full access subcategories"
  on subcategories for all using (auth.role() = 'service_role');

create policy "Service role full access products"
  on products for all using (auth.role() = 'service_role');

create policy "Service role full access inquiries"
  on inquiries for all using (auth.role() = 'service_role');

create policy "Service role full access settings"
  on settings for all using (auth.role() = 'service_role');

-- SEED: default settings
insert into settings (key, value, label) values
  ('whatsapp_number', '919314093160', 'WhatsApp Number'),
  ('company_email', '', 'Company Email'),
  ('company_phone', '+91 93140 93160', 'Company Phone'),
  ('company_address', 'Jaipur, Rajasthan', 'Company Address');

-- SEED: 10 categories
insert into categories (name, slug, icon_name, display_order) values
  ('Cleaning & Hygiene', 'cleaning-hygiene', 'sparkles', 1),
  ('Paper & Stationery', 'paper-stationery', 'file-text', 2),
  ('Office Electronics', 'office-electronics', 'laptop', 3),
  ('Office Furniture', 'office-furniture', 'armchair', 4),
  ('Pantry & Cafeteria', 'pantry-cafeteria', 'coffee', 5),
  ('Packaging Materials', 'packaging-materials', 'package', 6),
  ('Corporate Gifts', 'corporate-gifts', 'gift', 7),
  ('Safety & PPE', 'safety-ppe', 'shield', 8),
  ('Electrical & Lighting', 'electrical-lighting', 'zap', 9),
  ('Housekeeping Equipment', 'housekeeping-equipment', 'brush', 10);
