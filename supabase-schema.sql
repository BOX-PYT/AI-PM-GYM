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

-- ── 安全加固：从"anon 全开"迁移到"真实匿名登录 + 按用户行级隔离" ──
-- 前置条件（必须先在 Supabase 后台手动开启，SQL 做不到）：
--   Authentication → Sign In / Providers → Anonymous Sign-Ins → 打开
--
-- users.id 保持不变（历史 records/sessions 的外键不用动）；
-- 新增 auth_uid 记录"当前是哪个真实登录会话在管这个账号"，
-- RLS 按 auth_uid = auth.uid() 校验，不再信任客户端传的 user_id。
alter table users add column if not exists auth_uid uuid unique;
alter table users add column if not exists recovery_code text unique;

-- 清掉旧的"anon 全开"策略
drop policy if exists "allow all for anon" on users;
drop policy if exists "allow all for anon" on sessions;
drop policy if exists "allow all for anon" on records;
drop policy if exists "allow all for anon" on course_chunks;

-- users：只能读写 auth_uid 等于自己当前登录会话的那一行
create policy "select own" on users for select to authenticated
  using (auth_uid = auth.uid());
create policy "update own" on users for update to authenticated
  using (auth_uid = auth.uid());
create policy "insert own" on users for insert to authenticated
  with check (auth_uid = auth.uid());

-- sessions / records：通过 user_id 关联的 users 行判断归属
create policy "own via user" on sessions for all to authenticated
  using (exists (select 1 from users u where u.id = sessions.user_id and u.auth_uid = auth.uid()))
  with check (exists (select 1 from users u where u.id = sessions.user_id and u.auth_uid = auth.uid()));

create policy "own via user" on records for all to authenticated
  using (exists (select 1 from users u where u.id = records.user_id and u.auth_uid = auth.uid()))
  with check (exists (select 1 from users u where u.id = records.user_id and u.auth_uid = auth.uid()));

-- course_chunks：知识库内容本身不敏感，保留公开只读；不再允许客户端写入
-- （灌数据仍走 SQL Editor / service_role，不走前端）
create policy "public read" on course_chunks for select to authenticated, anon
  using (true);

-- 迁移期兼容：旧的匿名会话（auth_uid 为空）在完成一次登录前无法通过新策略，
-- 前端 userId.js 已改为在 getOrCreateUser 里对每个浏览器做一次 signInAnonymously()
-- 并回填 auth_uid，属于一次性迁移，无需手动处理历史行。
