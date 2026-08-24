CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_target TEXT,
  event_data TEXT,
  page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  ip TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  colo TEXT,
  asn INTEGER,
  user_agent TEXT,
  language TEXT,
  screen TEXT,
  viewport TEXT,
  client_timezone TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session_created_at ON events(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_name_created_at ON events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_page_created_at ON events(page, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_ip_created_at ON events(ip, created_at DESC);
