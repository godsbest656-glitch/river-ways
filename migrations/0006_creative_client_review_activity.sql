-- Client-facing review activity is separate from agency approval state.
-- These records are append-only feedback against the exact asset version.

CREATE TABLE IF NOT EXISTS creative_client_review_events (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  project_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'changes_requested', 'rejected')),
  notes TEXT NOT NULL DEFAULT '',
  asset_sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id, client_id)
    REFERENCES creative_projects(id, client_id) ON DELETE RESTRICT,
  FOREIGN KEY (asset_id, client_id)
    REFERENCES creative_assets(id, client_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_creative_client_reviews_asset_history
  ON creative_client_review_events (client_id, asset_id, created_at DESC);

CREATE TABLE IF NOT EXISTS creative_client_comments (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  project_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  comment TEXT NOT NULL CHECK (length(comment) BETWEEN 1 AND 4000),
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id, client_id)
    REFERENCES creative_projects(id, client_id) ON DELETE RESTRICT,
  FOREIGN KEY (asset_id, client_id)
    REFERENCES creative_assets(id, client_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_creative_client_comments_asset_history
  ON creative_client_comments (client_id, asset_id, created_at ASC);
