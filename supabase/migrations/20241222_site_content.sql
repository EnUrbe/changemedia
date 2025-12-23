-- Create a table to store site content (replacing the JSON file)
create table if not exists site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by text,
  last_note text
);

-- Enable RLS
alter table site_content enable row level security;

-- Allow public read access (since the site needs to display it)
create policy "Allow public read access" on site_content
  for select using (true);

-- Allow authenticated users (admins) to update
create policy "Allow admin update" on site_content
  for all using (auth.role() = 'authenticated');
