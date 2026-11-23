from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "migrations"
EXPECTED_FILES = [
    "0001_leads.sql",
    "0002_lead_pipeline_attribution.sql",
    "0003_lead_operations.sql",
    "0004_creative_studio.sql",
]

files = sorted(MIGRATIONS.glob("*.sql"))
names = [item.name for item in files]
if names != EXPECTED_FILES:
    raise SystemExit(f"Expected migrations {EXPECTED_FILES}, found {names}")

db = sqlite3.connect(":memory:")
db.execute("PRAGMA foreign_keys = ON")

for migration in files:
    db.executescript(migration.read_text(encoding="utf-8"))

columns = {row[1] for row in db.execute("PRAGMA table_info(leads)")}
required_columns = {
    "id", "name", "email", "company", "goal", "details", "brief_hash",
    "notification_status", "ip_hash", "created_at", "notification_attempted_at",
    "stage", "source", "landing_page", "referrer", "utm_source", "utm_medium",
    "utm_campaign", "utm_content", "utm_term", "assigned_to", "next_action_at",
    "last_contacted_at", "closed_at", "updated_at",
}
missing_columns = required_columns - columns
if missing_columns:
    raise SystemExit(f"Missing leads columns: {sorted(missing_columns)}")

indexes = {row[1] for row in db.execute("PRAGMA index_list(leads)")}
required_indexes = {
    "idx_leads_email_created_at",
    "idx_leads_brief_duplicate",
    "idx_leads_stage_created_at",
    "idx_leads_source_created_at",
    "idx_leads_utm_campaign",
    "idx_leads_stage_follow_up",
    "idx_leads_assignee_stage",
}
if not required_indexes.issubset(indexes):
    raise SystemExit(f"Missing indexes: {sorted(required_indexes - indexes)}")

triggers = {
    row[0] for row in db.execute(
        "SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'leads'"
    )
}
if triggers != {"leads_set_updated_at_after_insert", "leads_set_updated_at_after_update"}:
    raise SystemExit(f"Unexpected lead triggers: {sorted(triggers)}")

views = {
    row[0] for row in db.execute(
        "SELECT name FROM sqlite_master WHERE type = 'view'"
    )
}
if "ops_open_leads" not in views:
    raise SystemExit("Missing ops_open_leads view")

db.execute(
    """
    INSERT INTO leads (id, name, email, goal, brief_hash, ip_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """,
    ("lead-test", "Ada Example", "ada@example.com", "Growth", "brief-hash", "ip-hash", "2026-11-07T10:00:00.000Z"),
)

lead = db.execute(
    "SELECT stage, notification_status, updated_at FROM leads WHERE id = ?",
    ("lead-test",),
).fetchone()
if lead is None or lead[0] != "new" or lead[1] != "pending" or not lead[2]:
    raise SystemExit(f"Unexpected lead defaults or insert trigger result: {lead}")

open_lead = db.execute(
    "SELECT stage, follow_up_overdue FROM ops_open_leads WHERE id = ?",
    ("lead-test",),
).fetchone()
if open_lead != ("new", 0):
    raise SystemExit(f"Unexpected open-lead view row: {open_lead}")

db.execute(
    "UPDATE leads SET next_action_at = ? WHERE id = ?",
    ("2000-01-01T00:00:00Z", "lead-test"),
)
overdue = db.execute(
    "SELECT follow_up_overdue FROM ops_open_leads WHERE id = ?",
    ("lead-test",),
).fetchone()
if overdue != (1,):
    raise SystemExit(f"Overdue follow-up was not detected: {overdue}")

db.execute("UPDATE leads SET stage = 'won' WHERE id = ?", ("lead-test",))
if db.execute("SELECT id FROM ops_open_leads WHERE id = ?", ("lead-test",)).fetchone() is not None:
    raise SystemExit("Closed lead should not appear in ops_open_leads")

for statement in (
    "UPDATE leads SET stage = 'invalid' WHERE id = 'lead-test'",
    "UPDATE leads SET notification_status = 'invalid' WHERE id = 'lead-test'",
):
    try:
        db.execute(statement)
    except sqlite3.IntegrityError:
        pass
    else:
        raise SystemExit(f"Expected a CHECK constraint to reject: {statement}")

db.execute(
    "INSERT INTO lead_rate_limits (ip_hash, window_start, count) VALUES (?, ?, ?)",
    ("ip-hash", "2026-11-07T10:00:00.000Z", 1),
)

print(
    "Validated 3 D1 migrations, "
    f"{len(required_columns)} required lead columns, "
    f"{len(required_indexes)} indexes, 2 triggers, the ops_open_leads view, "
    "default values, follow-up overdue logic and CHECK constraints."
)


creative_tables = {
    row[0] for row in db.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'creative_%'"
    )
}
required_creative_tables = {
    "creative_clients", "creative_projects", "creative_jobs",
    "creative_assets", "creative_approval_events", "creative_audit_events",
}
if creative_tables != required_creative_tables:
    raise SystemExit(f"Unexpected Creative Studio tables: {sorted(creative_tables)}")

creative_job_columns = {row[1] for row in db.execute("PRAGMA table_info(creative_jobs)")}
required_job_columns = {"max_attempts", "heartbeat_at", "lease_expires_at", "last_error"}
if not required_job_columns.issubset(creative_job_columns):
    raise SystemExit(f"Missing worker lease columns: {sorted(required_job_columns - creative_job_columns)}")

creative_indexes = {
    row[1] for row in db.execute("PRAGMA index_list(creative_jobs)")
}
if "idx_creative_jobs_queue" not in creative_indexes:
    raise SystemExit("Missing creative job queue index")

db.execute(
    "INSERT INTO creative_clients (id, slug, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ("client-a", "client-a", "Client A", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z"),
)
db.execute(
    "INSERT INTO creative_clients (id, slug, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ("client-b", "client-b", "Client B", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z"),
)
db.execute(
    """INSERT INTO creative_projects
       (id, client_id, slug, name, objective, brief_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
    ("project-a", "client-a", "launch", "Launch", "Test client-scoped project", "{}", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z"),
)
db.execute(
    """INSERT INTO creative_jobs
       (id, client_id, project_id, job_type, payload_json, available_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
    ("job-a", "client-a", "project-a", "concept", "{}", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z"),
)
db.execute(
    """INSERT INTO creative_assets
       (id, client_id, project_id, job_id, version, asset_type, media_type, filename, storage_key, sha256, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
    ("asset-a", "client-a", "project-a", "job-a", 1, "concept", "application/json", "concept.json", "private/client-a/concept.json", "a" * 64, "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z"),
)
db.execute(
    """INSERT INTO creative_approval_events
       (id, client_id, project_id, asset_id, reviewer_id, decision, usage_scope, asset_sha256, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
    ("approval-a", "client-a", "project-a", "asset-a", "reviewer-a", "changes_requested", "internal-review", "a" * 64, "2026-11-17T10:00:00Z"),
)
try:
    db.execute(
        """INSERT INTO creative_jobs
           (id, client_id, project_id, job_type, payload_json, available_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        ("job-cross-tenant", "client-b", "project-a", "concept", "{}", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z", "2026-11-17T10:00:00Z"),
    )
except sqlite3.IntegrityError:
    pass
else:
    raise SystemExit("Cross-client creative job reference was accepted")

if db.execute("PRAGMA foreign_key_check").fetchall():
    raise SystemExit("Creative Studio schema contains foreign-key violations")

print("Validated client-scoped Creative Studio tables, queue index, approval history and cross-client foreign-key isolation.")
