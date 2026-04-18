ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS quiz_mode text NOT NULL DEFAULT 'mcq',
  ADD COLUMN IF NOT EXISTS time_per_question_sec integer NOT NULL DEFAULT 60;

ALTER TABLE public.room_answers
  ADD COLUMN IF NOT EXISTS answer_payload jsonb;