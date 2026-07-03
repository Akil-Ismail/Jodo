-- Profiles: one row per auth.users, created automatically on signup.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Generic updated_at trigger, reused by every table below that has the column.
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Projects: one row per site/app a user is building.
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  stack text not null check (stack in ('html', 'react', 'nextjs', 'vue', 'nuxt')),
  has_backend boolean not null default false,
  github_repo text,
  default_branch text not null default 'main',
  vercel_project_id text,
  design_tokens jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, slug)
);

alter table projects enable row level security;

create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = owner_id);

create policy "Users can create own projects"
  on projects for insert
  with check (auth.uid() = owner_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = owner_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = owner_id);

create trigger projects_set_updated_at
  before update on projects
  for each row execute procedure set_updated_at();
