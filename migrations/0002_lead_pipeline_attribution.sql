-- Apply once per Cloudflare D1 environment after 0001_leads.sql.
-- SQLite does not support ADD COLUMN IF NOT EXISTS; inspect PRAGMA table_info(leads) first if recovering a partial migration.

ALTER TABLE leads ADD COLUMN stage TEXT NOT NULL DEFAULT 'new'
  CHECK (stage IN ('new', 'qualified', 'meeting', 'proposal', 'won', 'lost', 'nurture'));
ALTER TABLE leads ADD COLUMN source TEXT NOT NULL DEFAULT 'website';
ALTER TABLE leads ADD COLUMN landing_page TEXT NOT NULL DEFAULT '/';
ALTER TABLE leads ADD COLUMN referrer TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_source TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_medium TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_campaign TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_content TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_term TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_leads_stage_created_at
  ON leads (stage, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_created_at
  ON leads (source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign
  ON leads (utm_campaign, created_at DESC);
