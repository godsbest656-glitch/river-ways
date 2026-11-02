-- Lightweight lead-operations lifecycle for the River Ways acquisition pipeline.
-- Existing enquiry rows enter the queue as new; no historical data is discarded.
ALTER TABLE leads ADD COLUMN pipeline_status TEXT NOT NULL DEFAULT 'new'
  CHECK (pipeline_status IN ('new', 'reviewing', 'qualified', 'not_a_fit', 'contacted', 'meeting', 'proposal', 'won', 'lost'));

ALTER TABLE leads ADD COLUMN assigned_to TEXT;
ALTER TABLE leads ADD COLUMN next_action_at TEXT;
ALTER TABLE leads ADD COLUMN last_contacted_at TEXT;
ALTER TABLE leads ADD COLUMN closed_at TEXT;
ALTER TABLE leads ADD COLUMN updated_at TEXT NOT NULL DEFAULT (datetime('now'));

CREATE INDEX IF NOT EXISTS idx_leads_pipeline_follow_up
  ON leads (pipeline_status, next_action_at, created_at);

CREATE INDEX IF NOT EXISTS idx_leads_assignee_pipeline
  ON leads (assigned_to, pipeline_status, next_action_at);

CREATE VIEW IF NOT EXISTS ops_open_leads AS
SELECT
  id,
  created_at,
  name,
  email,
  company,
  goal,
  source,
  landing_page,
  utm_source,
  utm_medium,
  utm_campaign,
  notification_status,
  pipeline_status,
  assigned_to,
  next_action_at,
  last_contacted_at,
  updated_at,
  CASE
    WHEN next_action_at IS NOT NULL AND next_action_at < datetime('now') THEN 1
    ELSE 0
  END AS follow_up_overdue
FROM leads
WHERE pipeline_status NOT IN ('not_a_fit', 'won', 'lost');
