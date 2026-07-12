-- 保存レシピ用テーブル
create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  title text not null,
  servings text not null,
  ingredients jsonb not null,
  extra_items text not null,
  steps jsonb not null,
  emoji text not null,
  input_text text not null,
  saved_at timestamptz not null default now()
);

-- 行単位のアクセス制御を有効化
alter table public.saved_recipes enable row level security;

-- 自分が保存したレシピだけを閲覧できる
create policy "Users can view their own saved recipes"
  on public.saved_recipes for select
  using (auth.uid() = user_id);

-- 自分のユーザーIDでのみ保存できる
create policy "Users can insert their own saved recipes"
  on public.saved_recipes for insert
  with check (auth.uid() = user_id);

-- 自分が保存したレシピだけを削除できる
create policy "Users can delete their own saved recipes"
  on public.saved_recipes for delete
  using (auth.uid() = user_id);
