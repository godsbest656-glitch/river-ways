-- River Ways Creative Studio: client-scoped production records and approval history.
-- Media bytes stay in private object storage/local production; D1 stores metadata only.

CREATE TABLE IF NOT EXISTS creative_clients (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'archived')),
  brand_profile_json TEXT NOT NULL DEFAULT '{}'
    CHECK (json_valid(brand_profile_json)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS creative_projects (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  objective TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'brief_review', 'brief_approved', 'production', 'qa', 'client_review', 'approved', 'delivered', 'paused', 'cancelled')),
  brief_version INTEGER NOT NULL DEFAULT 1 CHECK (brief_version > 0),
  brief_json TEXT NOT NULL CHECK (json_valid(brief_json)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (client_id, slug),
  UNIQUE (id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_creative_projects_client_status
  ON creative_projects (client_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS creative_jobs (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  project_id TEXT NOT NULL REFERENCES creative_projects(id) ON DELETE RESTRICT,
  job_type TEXT NOT NULL
    CHECK (job_type IN ('strategy', 'copy', 'concept', 'storyboard', 'image', 'video', 'render', 'qa', 'delivery')),
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'claimed', 'running', 'review_required', 'completed', 'failed', 'cancelled')),
  payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
  result_json TEXT CHECK (result_json IS NULL OR json_valid(result_json)),
  worker_id TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts INTEGER NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 10),
  available_at TEXT NOT NULL,
  claimed_at TEXT,
  heartbeat_at TEXT,
  lease_expires_at TEXT,
  started_at TEXT,
  last_error TEXT,
  finished_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (id, client_id),
  FOREIGN KEY (project_id, client_id)
    REFERENCES creative_projects(id, client_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_creative_jobs_queue
  ON creative_jobs (status, available_at, created_at);

CREATE INDEX IF NOT EXISTS idx_creative_jobs_client_project
  ON creative_jobs (client_id, project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS creative_assets (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  project_id TEXT NOT NULL REFERENCES creative_projects(id) ON DELETE RESTRICT,
  job_id TEXT,
  version INTEGER NOT NULL CHECK (version > 0),
  asset_type TEXT NOT NULL,
  media_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'generated'
    CHECK (status IN ('generated', 'qa_passed', 'review_required', 'approved', 'rejected', 'delivered')),
  provenance_json TEXT NOT NULL DEFAULT '{}'
    CHECK (json_valid(provenance_json)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (project_id, asset_type, version),
  UNIQUE (id, client_id),
  FOREIGN KEY (project_id, client_id)
    REFERENCES creative_projects(id, client_id) ON DELETE RESTRICT,
  FOREIGN KEY (job_id, client_id)
    REFERENCES creative_jobs(id, client_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_creative_assets_client_project
  ON creative_assets (client_id, project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS creative_approval_events (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  project_id TEXT NOT NULL REFERENCES creative_projects(id) ON DELETE RESTRICT,
  asset_id TEXT NOT NULL REFERENCES creative_assets(id) ON DELETE RESTRICT,
  reviewer_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'changes_requested', 'rejected')),
  usage_scope TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  asset_sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id, client_id)
    REFERENCES creative_projects(id, client_id) ON DELETE RESTRICT,
  FOREIGN KEY (asset_id, client_id)
    REFERENCES creative_assets(id, client_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_creative_approval_asset_history
  ON creative_approval_events (client_id, asset_id, created_at DESC);

CREATE TABLE IF NOT EXISTS creative_audit_events (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  project_id TEXT REFERENCES creative_projects(id) ON DELETE RESTRICT,
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}'
    CHECK (json_valid(details_json)),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_creative_audit_client_time
  ON creative_audit_events (client_id, created_at DESC);
