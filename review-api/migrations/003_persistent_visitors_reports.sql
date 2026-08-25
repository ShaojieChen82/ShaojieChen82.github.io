ALTER TABLE visits ADD COLUMN visitor_id TEXT;
ALTER TABLE events ADD COLUMN visitor_id TEXT;
ALTER TABLE feedback ADD COLUMN visitor_id TEXT;

CREATE INDEX IF NOT EXISTS idx_visits_visitor_created_at ON visits(visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_visitor_created_at ON events(visitor_id, created_at DESC);
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
