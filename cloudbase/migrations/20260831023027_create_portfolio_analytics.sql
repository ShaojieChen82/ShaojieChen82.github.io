CREATE TABLE public.visits (
  id text PRIMARY KEY,
  created_at timestamptz NOT NULL,
  created_at_iso text NOT NULL,
  created_at_ms bigint NOT NULL,
  source text NOT NULL,
  visitor_id text,
  session_id text,
  page text,
  referrer text,
  language text,
  screen text,
  viewport text,
  client_timezone text,
  ip text,
  user_agent text
);

CREATE TABLE public.events (
  id text PRIMARY KEY,
  created_at timestamptz NOT NULL,
  created_at_iso text NOT NULL,
  created_at_ms bigint NOT NULL,
  source text NOT NULL,
  visitor_id text,
  session_id text,
  page text,
  referrer text,
  language text,
  screen text,
  viewport text,
  client_timezone text,
  ip text,
  user_agent text,
  event_name text NOT NULL,
  event_target text,
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text
);

CREATE TABLE public.feedback (
  id text PRIMARY KEY,
  created_at timestamptz NOT NULL,
  created_at_iso text NOT NULL,
  created_at_ms bigint NOT NULL,
  source text NOT NULL,
  visitor_id text,
  session_id text,
  page text,
  referrer text,
  language text,
  screen text,
  viewport text,
  client_timezone text,
  ip text,
  user_agent text,
  name text NOT NULL,
  email text,
  comment text NOT NULL,
  github_mirrored boolean NOT NULL DEFAULT false
);

CREATE INDEX feedback_ip_created_at_ms_idx
  ON public.feedback (ip, created_at_ms);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.visits, public.events, public.feedback
  FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.visits, public.events, public.feedback
  TO service_role;
