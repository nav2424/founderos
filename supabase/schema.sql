-- FounderOS Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stage TEXT DEFAULT 'Growth',
  monthly_revenue NUMERIC DEFAULT 0,
  priority_level INTEGER DEFAULT 1,
  categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category TEXT,
  status TEXT DEFAULT 'Inbox' CHECK (status IN ('Inbox', 'To Do', 'In Progress', 'Waiting', 'Done')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  due_date DATE,
  reminder_date TIMESTAMPTZ,
  estimated_impact INTEGER DEFAULT 3 CHECK (estimated_impact BETWEEN 1 AND 5),
  effort_level INTEGER DEFAULT 3 CHECK (effort_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'Monthly' CHECK (type IN ('Yearly', 'Quarterly', 'Monthly', 'Weekly')),
  target_metric TEXT,
  current_value NUMERIC DEFAULT 0,
  target_value NUMERIC DEFAULT 100,
  deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPIs
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  target_value NUMERIC DEFAULT 0,
  period TEXT DEFAULT 'Monthly' CHECK (period IN ('Daily', 'Weekly', 'Monthly')),
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'Other' CHECK (category IN ('Content', 'Product', 'Marketing', 'Wholesale', 'Creator', 'Operations', 'Other')),
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Raw Idea' CHECK (status IN ('Raw Idea', 'Considering', 'Testing', 'Implemented', 'Archived')),
  estimated_impact INTEGER DEFAULT 3 CHECK (estimated_impact BETWEEN 1 AND 5),
  effort_level INTEGER DEFAULT 3 CHECK (effort_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ NOT NULL,
  repeat_frequency TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playbooks
CREATE TABLE playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Reviews
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  wins TEXT,
  losses TEXT,
  lessons TEXT,
  priorities_next_week TEXT,
  bottlenecks TEXT,
  avoided TEXT,
  moved_forward TEXT,
  stop_doing TEXT,
  delegate_later TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users manage own brands" ON brands FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own kpis" ON kpis FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own ideas" ON ideas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own playbooks" ON playbooks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own weekly_reviews" ON weekly_reviews FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_tasks_user_brand ON tasks(user_id, brand_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_goals_user_brand ON goals(user_id, brand_id);
CREATE INDEX idx_kpis_user_brand ON kpis(user_id, brand_id);
CREATE INDEX idx_ideas_user_brand ON ideas(user_id, brand_id);
CREATE INDEX idx_reminders_due ON reminders(due_date) WHERE completed = FALSE;
