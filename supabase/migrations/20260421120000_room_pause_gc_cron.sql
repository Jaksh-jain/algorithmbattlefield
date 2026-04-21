create extension if not exists pg_cron;

create or replace function public.cleanup_zombie_rooms()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Active rooms that never finished are force-finished after 2 hours.
  update public.rooms
  set status = 'finished'
  where status = 'active'
    and quiz_started = true
    and started_at is not null
    and started_at <= now() - interval '2 hours';

  -- Waiting lobbies are cancelled after 1 hour.
  update public.rooms
  set status = 'cancelled'
  where status = 'waiting'
    and created_at <= now() - interval '1 hour';
end;
$$;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'room_cleanup_every_15m') then
    perform cron.unschedule('room_cleanup_every_15m');
  end if;
end
$$;

select cron.schedule(
  'room_cleanup_every_15m',
  '*/15 * * * *',
  $$select public.cleanup_zombie_rooms();$$
);
