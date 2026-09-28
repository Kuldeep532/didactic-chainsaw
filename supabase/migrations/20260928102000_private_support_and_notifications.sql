-- Nexus private support + notifications + volunteer routing contract
create extension if not exists pgcrypto;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(),
  case_code text not null unique default upper(substr(encode(gen_random_bytes(8),'hex'),1,12)),
  requester_id uuid not null references auth.users(id) on delete cascade,
  subject_gender text not null check (subject_gender in ('female','male','unspecified')),
  status text not null default 'open' check (status in ('open','waiting','active','resolved','closed')),
  contact_mode text not null default 'secure-chat' check (contact_mode in ('secure-chat','voice','either','email-only')),
  contact_email text,
  invitation_expires_at timestamptz,
  assigned_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_cases_requester_idx on public.support_cases(requester_id);
create index if not exists support_cases_status_idx on public.support_cases(status, updated_at desc);

create table if not exists public.support_case_tokens (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.support_cases(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.support_case_participants (
  case_id uuid not null references public.support_cases(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  participant_role text not null check (participant_role in ('requester','female_support','male_support','privacy_steward')),
  created_at timestamptz not null default now(),
  primary key (case_id,user_id)
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.support_cases(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  body_ciphertext text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_messages_case_created_idx
  on public.support_messages(case_id, created_at);

create table if not exists public.support_voice_sessions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.support_cases(id) on delete cascade,
  started_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'ringing' check (status in ('ringing','connected','ended','failed')),
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.support_volunteer_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role_code text not null check (role_code in (
    'saheli_care_guide',
    'shakti_response_companion',
    'sahara_support_guide',
    'rakshak_response_companion',
    'case_privacy_steward',
    'access_care_specialist'
  )),
  served_gender text not null check (served_gender in ('female','male','both')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.create_private_support_case(
  p_subject_gender text,
  p_contact_mode text,
  p_contact_email text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_case public.support_cases;
  v_token text;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  insert into public.support_cases(requester_id,subject_gender,contact_mode,contact_email)
  values (auth.uid(), p_subject_gender, p_contact_mode, nullif(trim(p_contact_email),''))
  returning * into v_case;

  v_token := encode(gen_random_bytes(24),'hex');
  insert into public.support_case_tokens(case_id, token_hash, expires_at)
  values (v_case.id, encode(digest(v_token,'sha256'),'hex'), now() + interval '7 days');

  insert into public.notifications(user_id,type,title,body,data)
  values (
    auth.uid(),
    'support_case_created',
    'Private support case created',
    'Your private support case is ready. Keep the invitation link safe.',
    jsonb_build_object('case_code',v_case.case_code,'token',v_token)
  );

  return jsonb_build_object(
    'case_id',v_case.id,
    'case_code',v_case.case_code,
    'invitation_token',v_token,
    'expires_at',now() + interval '7 days'
  );
end;
$$;

revoke all on function public.create_private_support_case(text,text,text) from public, anon;
grant execute on function public.create_private_support_case(text,text,text) to authenticated;

alter table public.notifications enable row level security;
alter table public.support_cases enable row level security;
alter table public.support_case_tokens enable row level security;
alter table public.support_case_participants enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_voice_sessions enable row level security;
alter table public.support_volunteer_roles enable row level security;

drop policy if exists notifications_self on public.notifications;
create policy notifications_self on public.notifications
  for select using (user_id = auth.uid());

drop policy if exists notifications_self_update on public.notifications;
create policy notifications_self_update on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists support_cases_requester on public.support_cases;
create policy support_cases_requester on public.support_cases
  for select using (requester_id = auth.uid());

drop policy if exists support_case_participant on public.support_case_participants;
create policy support_case_participant on public.support_case_participants
  for select using (user_id = auth.uid());

drop policy if exists support_messages_participant on public.support_messages;
create policy support_messages_participant on public.support_messages
  for select using (
    exists (
      select 1 from public.support_case_participants p
      where p.case_id = support_messages.case_id and p.user_id = auth.uid()
    )
  );

drop policy if exists support_messages_insert on public.support_messages;
create policy support_messages_insert on public.support_messages
  for insert with check (
    sender_user_id = auth.uid()
    and exists (
      select 1 from public.support_case_participants p
      where p.case_id = support_messages.case_id and p.user_id = auth.uid()
    )
  );

drop policy if exists support_voice_participant on public.support_voice_sessions;
create policy support_voice_participant on public.support_voice_sessions
  for select using (
    started_by = auth.uid()
    or exists (
      select 1 from public.support_case_participants p
      where p.case_id = support_voice_sessions.case_id and p.user_id = auth.uid()
    )
  );

drop policy if exists support_volunteer_self on public.support_volunteer_roles;
create policy support_volunteer_self on public.support_volunteer_roles
  for select using (user_id = auth.uid());
