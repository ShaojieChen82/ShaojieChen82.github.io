CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  country TEXT,
  region TEXT,
  city TEXT,
  asn INTEGER,
  approved INTEGER NOT NULL DEFAULT 1 CHECK (approved IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_ip_created_at ON reviews(ip, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved_created_at ON reviews(approved, created_at DESC);
