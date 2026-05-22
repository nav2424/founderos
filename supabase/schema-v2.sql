-- Optional migration: run in Supabase SQL editor for cloud sync of v2 entities.
-- Local-only users can skip; data persists in localStorage (founderos-v3).

alter table brands add column if not exists brief text;
alter table brands add column if not exists positioning text;
alter table brands add column if not exists icp text;
alter table brands add column if not exists constraints text;
alter table brands add column if not exists notes text;
alter table brands add column if not exists notion_url text;

alter table tasks add column if not exists goal_id uuid references goals(id) on delete set null;
alter table tasks add column if not exists recurrence text default 'none';
alter table tasks add column if not exists focus_today boolean default false;

alter table goals add column if not exists parent_goal_id uuid references goals(id) on delete set null;

create table if not exists mrr_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete cascade not null,
  amount numeric not null,
  period text not null default 'monthly',
  recorded_at date not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete cascade not null,
  goal_id uuid references goals(id) on delete set null,
  title text not null,
  description text,
  due_date date not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists brand_finances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete cascade not null,
  month text not null,
  revenue numeric not null default 0,
  cogs numeric not null default 0,
  ad_spend numeric not null default 0,
  notes text,
  unique (brand_id, month)
);

alter table reminders add column if not exists end_date timestamptz;
alter table reminders add column if not exists event_type text default 'reminder';
alter table reminders add column if not exists meeting_url text;
alter table reminders add column if not exists location text;

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete cascade not null,
  name text not null,
  company text,
  email text,
  status text not null default 'Lead',
  next_follow_up date,
  notes text,
  created_at timestamptz default now()
);
