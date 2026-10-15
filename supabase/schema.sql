-- To Do Scheduler: run this once in Supabase > SQL Editor > New query.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  note text not null default '',
  due_date date,
  hours numeric(4, 1) check (hours is null or hours >= 0),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_date_idx on public.tasks (user_id, due_date);

create table if not exists public.settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  max_hours numeric(4, 1) not null default 8 check (max_hours > 0)
);

-- Row Level Security: each signed-in user can only see and change their own rows.
alter table public.tasks enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Own tasks" on public.tasks;
create policy "Own tasks" on public.tasks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Own settings" on public.settings;
create policy "Own settings" on public.settings
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
