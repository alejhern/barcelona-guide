-- Pega esto en Supabase → SQL Editor → Run.
create table if not exists plans (
  id text primary key,
  title text not null,
  category text not null,
  description text not null default '',
  duration text not null,
  difficulty text,
  distance text,
  latitude double precision not null,
  longitude double precision not null,
  visited boolean not null default false,
  stops text[] not null default '{}',
  tips text[] not null default '{}',
  "createdAt" timestamptz not null default now()
);
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  "planId" text references plans(id) on delete cascade,
  "imageUrl" text not null,
  caption text not null default '',
  date date not null,
  "createdAt" timestamptz not null default now()
);
-- Sin políticas: solo el servidor (clave secreta) puede leer y escribir.
alter table plans enable row level security;
alter table memories enable row level security;
