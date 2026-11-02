-- Daily, privacy-minimised usage counter for the public AI demand diagnostic.
-- Raw IP addresses and visitor prompts are never persisted.
CREATE TABLE IF NOT EXISTS ai_demand_usage (
  day_key TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (day_key, ip_hash)
);

CREATE INDEX IF NOT EXISTS idx_ai_demand_usage_updated
  ON ai_demand_usage (updated_at);
