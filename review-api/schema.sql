CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  session_id TEXT,
  visitor_id TEXT,
  page TEXT,
  referrer TEXT,
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

CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_ip_created_at ON visits(ip, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_session_created_at ON visits(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_created_at ON visits(visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_page_created_at ON visits(page, created_at DESC);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  session_id TEXT,
  visitor_id TEXT,
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
CREATE INDEX IF NOT EXISTS idx_events_visitor_created_at ON events(visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_name_created_at ON events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_page_created_at ON events(page, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_ip_created_at ON events(ip, created_at DESC);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  comment TEXT NOT NULL,
  page TEXT,
  referrer TEXT,
  session_id TEXT,
  visitor_id TEXT,
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
  client_timezone TEXT,
  github_issue_url TEXT,
  github_mirrored INTEGER NOT NULL DEFAULT 0 CHECK (github_mirrored IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_ip_created_at ON feedback(ip, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_visitor_created_at ON feedback(visitor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS analytics_reports (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  report_key TEXT NOT NULL UNIQUE,
  report_type TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  github_issue_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_reports_created_at ON analytics_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_type_created_at ON analytics_reports(report_type, created_at DESC);
