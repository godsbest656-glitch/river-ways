-- River Ways Creative Studio: explicit client reviewer membership.
-- Membership is separate from staff allowlists and worker service identities.
-- Apply only to a dedicated, reviewed Preview database before enabling the client portal.

CREATE TABLE IF NOT EXISTS creative_client_memberships (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES creative_clients(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'reviewer'
    CHECK (role IN ('reviewer')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'revoked')),
  invited_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (client_id, email),
  UNIQUE (id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_creative_client_memberships_email_status
  ON creative_client_memberships (email, status, client_id);
