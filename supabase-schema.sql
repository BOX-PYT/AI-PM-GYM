-- 在 Supabase SQL Editor 中执行

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text unique not null,
  created_at timestamptz default now(),
  total_completed integer default 0
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  direction text not null,
  level text not null,
  completed_at timestamptz default now()
);

create table if not exists records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  session_id uuid references sessions(id) on delete set null,
  question text not null,
  answer text,
  user_input text,
  ai_feedback text,
  direction text,
  level text,
  is_conquer boolean default false,
  created_at timestamptz default now()
);

-- 开启 RLS（Row Level Security），前端用 anon key 可读写自己的数据
alter table users enable row level security;
alter table sessions enable row level security;
alter table records enable row level security;

-- 简单策略：允许 anon 角色对所有行读写（适合匿名 ID 模式）
-- 生产环境建议改为按 anonymous_id 匹配的策略
create policy "allow all for anon" on users for all to anon using (true) with check (true);
create policy "allow all for anon" on sessions for all to anon using (true) with check (true);
create policy "allow all for anon" on records for all to anon using (true) with check (true);
