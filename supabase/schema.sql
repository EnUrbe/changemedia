-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  project_title text not null,
  status text not null check (status in ('planning', 'in-production', 'in-review', 'approved', 'delivered')),
  summary text,
  due_date date,
  point_of_contact jsonb, -- { name, email }
  access_code text unique not null,
  checklist jsonb default '[]'::jsonb,
  ai_notes text,
  feedback jsonb default '[]'::jsonb, -- Keeping feedback simple for now
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Deliverables Table
create table deliverables (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  type text not null check (type in ('video', 'gallery', 'document', 'audio', 'link', 'podcast', 'portrait', 'photoshoot')),
  title text not null,
  description text,
  url text not null,
  thumbnail text,
  images jsonb default '[]'::jsonb, -- Array of image URLs for galleries
  status text not null check (status in ('ready', 'needs-review', 'in-progress', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Optional but recommended)
alter table projects enable row level security;
alter table deliverables enable row level security;

-- Allow public read access if they have the access code (handled by app logic, but for RLS we might want to be stricter)
-- For now, we'll allow service_role (admin) full access and maybe public read for simplicity if using client-side fetching, 
-- but since we are using server-side fetching with Admin Client, RLS defaults of "deny all" are fine as long as we use the service role key.

-- Bookings Table
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_email text not null,
  service_type text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text not null default 'confirmed',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Calendar Feeds Table
create table if not exists calendar_feeds (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Photo Selections Table (for client photo proofing workflow)
create table if not exists photo_selections (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text,
  photos jsonb not null default '[]'::jsonb, -- Array of { id, url, thumbnail?, filename? }
  max_selections integer not null default 15,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'editing', 'delivered')),
  selected_photos jsonb default '[]'::jsonb, -- Array of photo IDs
  client_notes text,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for photo_selections
alter table photo_selections enable row level security;

