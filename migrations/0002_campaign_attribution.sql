-- Campaign attribution for website enquiries.
-- Apply once after 0001_leads.sql in each D1 environment.
ALTER TABLE leads ADD COLUMN landing_page TEXT NOT NULL DEFAULT '/';
ALTER TABLE leads ADD COLUMN utm_source TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_medium TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_campaign TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_content TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm_term TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_leads_campaign_created_at
  ON leads (utm_source, utm_campaign, created_at);
