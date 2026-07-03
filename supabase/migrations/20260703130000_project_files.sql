-- Working-copy files per project (canvas state + generated code).
create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  path text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  unique (project_id, path)
);

alter table project_files enable row level security;

-- No owner_id on this table — ownership is derived through the parent project.
create policy "Users can view files of own projects"
  on project_files for select
  using (exists (
    select 1 from projects
    where projects.id = project_files.project_id
    and projects.owner_id = auth.uid()
  ));

create policy "Users can write files of own projects"
  on project_files for insert
  with check (exists (
    select 1 from projects
    where projects.id = project_files.project_id
    and projects.owner_id = auth.uid()
  ));

create policy "Users can update files of own projects"
  on project_files for update
  using (exists (
    select 1 from projects
    where projects.id = project_files.project_id
    and projects.owner_id = auth.uid()
  ));

create trigger project_files_set_updated_at
  before update on project_files
  for each row execute procedure set_updated_at();
