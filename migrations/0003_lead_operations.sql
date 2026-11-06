-- Lead operations for the UUID-based River Ways schema (migrations 0001–0002).
-- Reuse the existing `stage` lifecycle; do not introduce a duplicate pipeline_status field.
-- Apply to the intended Preview database only after inspecting its current schema.

ALTER TABLE leads ADD COLUMN assigned_to TEXT;
ALTER TABLE leads ADD COLUMN next_action_at TEXT;
ALTER TABLE leads ADD COLUMN last_contacted_at TEXT;
ALTER TABLE leads ADD COLUMN closed_at TEXT;
ALTER TABLE leads ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';

UPDATE leads SET updated_at = created_at WHERE updated_at = '';

CREATE INDEX IF NOT EXISTS idx_leads_stage_follow_up
  ON leads (stage, next_action_at, created_at);

CREATE INDEX IF NOT EXISTS idx_leads_assignee_stage
  ON leads (assigned_to, stage, next_action_at);

CREATE TRIGGER IF NOT EXISTS leads_set_updated_at_after_insert
AFTER INSERT ON leads
WHEN NEW.updated_at = ''
BEGIN
  UPDATE leads SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS leads_set_updated_at_after_update
AFTER UPDATE ON leads
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE leads SET updated_at = datetime('now') WHERE id = NEW.id;
END;

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
  stage,
  assigned_to,
  next_action_at,
  last_contacted_at,
  updated_at,
  CASE
    WHEN next_action_at IS NOT NULL AND next_action_at < datetime('now') THEN 1
    ELSE 0
  END AS follow_up_overdue
FROM leads
WHERE stage NOT IN ('won', 'lost');
