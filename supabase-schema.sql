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

-- ── 能力雷达重构：records 增加维度与结构化评分字段 ──
alter table records add column if not exists dimension text;   -- product|ai-tech|narrative|workflow
alter table records add column if not exists score int;        -- LLM 结构化得分 0-100
alter table records add column if not exists hit_points jsonb;
alter table records add column if not exists missed jsonb;

-- ── RAG 知识源：训练营课件切片（MVP 关键词检索，不上向量库）──
create table if not exists course_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  dimension_tags text[],
  keywords text[]
);
alter table course_chunks enable row level security;
create policy "allow all for anon" on course_chunks for all to anon using (true) with check (true);

-- ── 追问功能：每道题可追问一次，答案随该题记录一起存 ──
alter table records add column if not exists follow_up_q text;
alter table records add column if not exists follow_up_a text;
