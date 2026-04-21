alter table public.rooms
  add column if not exists host_session_id text;

-- Backfill host_session_id for existing rooms from current host participant rows.
update public.rooms r
set host_session_id = rp.session_id
from public.room_participants rp
where rp.room_id = r.id
  and rp.is_host = true
  and r.host_session_id is null;

-- Enforce that all newly created rooms must carry a host session identifier.
alter table public.rooms
  alter column host_session_id set not null;
