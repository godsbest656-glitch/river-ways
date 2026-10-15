CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  goal TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  brief_hash TEXT NOT NULL,
  notification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'failed', 'not_configured')),
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  notification_attempted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_email_created_at
  ON leads (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_brief_duplicate
  ON leads (email, brief_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS lead_rate_limits (
  ip_hash TEXT NOT NULL,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, window_start)
);
