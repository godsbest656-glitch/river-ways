-- River Ways website enquiries. Apply to the Cloudflare D1 database bound as LEADS_DB.
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  goal TEXT NOT NULL,
  details TEXT,
  source TEXT NOT NULL DEFAULT 'website-contact',
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  notification_status TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_leads_ip_created_at ON leads (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
