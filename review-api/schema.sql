CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  session_id TEXT,
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
CREATE INDEX IF NOT EXISTS idx_visits_page_created_at ON visits(page, created_at DESC);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  comment TEXT NOT NULL,
  page TEXT,
  referrer TEXT,
  session_id TEXT,
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
