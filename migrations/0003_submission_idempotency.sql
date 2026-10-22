-- A retry of the same form submission must not create a second lead.
-- NULL is allowed for records created before this migration; SQLite permits
-- multiple NULL values in a unique index.
ALTER TABLE leads ADD COLUMN submission_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_submission_key_unique
  ON leads (submission_key)
  WHERE submission_key IS NOT NULL;
