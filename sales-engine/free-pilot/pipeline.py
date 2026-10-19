#!/usr/bin/env python3
"""Zero-dependency local prospect tracker for River Ways.

Uses only Python's standard library and a SQLite file on the local machine.
No network calls, model APIs, email sending, or external account access.
"""
from __future__ import annotations

import argparse
import csv
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).with_name("river_ways_leads.sqlite3")
FIELDS = [
    "company", "website", "segment", "source_url", "observation",
    "checked_at", "fit_score", "score_reason", "contact_name",
    "contact_role", "public_contact", "stage", "next_action",
    "next_action_date", "do_not_contact", "notes",
]
STAGES = ("research", "qualified", "draft_ready", "contacted", "replied",
          "meeting", "proposal", "won", "lost", "suppressed")


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL COLLATE NOCASE,
            website TEXT NOT NULL DEFAULT '',
            segment TEXT NOT NULL DEFAULT '',
            source_url TEXT NOT NULL DEFAULT '',
            observation TEXT NOT NULL DEFAULT '',
            checked_at TEXT NOT NULL DEFAULT '',
            fit_score INTEGER,
            score_reason TEXT NOT NULL DEFAULT '',
            contact_name TEXT NOT NULL DEFAULT '',
            contact_role TEXT NOT NULL DEFAULT '',
            public_contact TEXT NOT NULL DEFAULT '',
            stage TEXT NOT NULL DEFAULT 'research',
            next_action TEXT NOT NULL DEFAULT '',
            next_action_date TEXT NOT NULL DEFAULT '',
            do_not_contact INTEGER NOT NULL DEFAULT 0,
            notes TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id INTEGER NOT NULL REFERENCES leads(id),
            event_at TEXT NOT NULL,
            event_type TEXT NOT NULL,
            detail TEXT NOT NULL DEFAULT ''
        )
    """)
    conn.commit()
    return conn


def event(conn, lead_id: int, kind: str, detail: str = "") -> None:
    conn.execute(
        "INSERT INTO events(lead_id,event_at,event_type,detail) VALUES(?,?,?,?)",
        (lead_id, now(), kind, detail),
    )


def add(args: argparse.Namespace) -> None:
    if not args.company.strip():
        raise SystemExit("Company name is required.")
    conn = connect()
    existing = conn.execute(
        "SELECT id FROM leads WHERE company=? AND website=?",
        (args.company.strip(), args.website.strip()),
    ).fetchone()
    if existing:
        raise SystemExit(f"Likely duplicate: lead id {existing['id']}. Update it instead.")
    stamp = now()
    values = {
        "company": args.company.strip(), "website": args.website.strip(),
        "segment": args.segment.strip(), "source_url": args.source_url.strip(),
        "observation": args.observation.strip(), "checked_at": args.checked_at.strip() or stamp[:10],
        "fit_score": args.fit_score, "score_reason": args.score_reason.strip(),
        "public_contact": args.public_contact.strip(), "stage": "research",
        "next_action": args.next_action.strip(), "next_action_date": "",
        "do_not_contact": 0, "notes": args.notes.strip(),
    }
    if values["fit_score"] is not None and not 0 <= values["fit_score"] <= 10:
        raise SystemExit("fit-score must be between 0 and 10.")
    cols = list(values)
    cur = conn.execute(
        f"INSERT INTO leads({','.join(cols)},created_at,updated_at) VALUES({','.join('?' for _ in cols)},?,?)",
        [values[k] for k in cols] + [stamp, stamp],
    )
    event(conn, cur.lastrowid, "created", "Added manually; no message sent.")
    conn.commit()
    print(f"Added lead {cur.lastrowid}: {values['company']}")


def list_leads(args: argparse.Namespace) -> None:
    conn = connect()
    sql = "SELECT id,company,website,segment,fit_score,stage,do_not_contact,next_action FROM leads"
    params: tuple = ()
    if args.stage:
        sql += " WHERE stage=?"
        params = (args.stage,)
    sql += " ORDER BY updated_at DESC, id DESC"
    rows = conn.execute(sql, params).fetchall()
    if not rows:
        print("No leads yet.")
        return
    print("ID | Company | Score | Stage | DNC | Next action | Website")
    for r in rows:
        print(f"{r['id']} | {r['company']} | {r['fit_score'] if r['fit_score'] is not None else '-'} | "
              f"{r['stage']} | {'YES' if r['do_not_contact'] else 'no'} | "
              f"{r['next_action']} | {r['website']}")


def update(args: argparse.Namespace) -> None:
    allowed = {"stage", "fit_score", "score_reason", "observation", "next_action",
               "next_action_date", "public_contact", "notes", "source_url", "checked_at"}
    changes = {k: v for k, v in vars(args).items() if k in allowed and v is not None}
    if not changes:
        raise SystemExit("Provide at least one field to update.")
    if "stage" in changes and changes["stage"] not in STAGES:
        raise SystemExit("Invalid stage: " + changes["stage"])
    if "fit_score" in changes and not 0 <= changes["fit_score"] <= 10:
        raise SystemExit("fit-score must be between 0 and 10.")
    conn = connect()
    if not conn.execute("SELECT id FROM leads WHERE id=?", (args.id,)).fetchone():
        raise SystemExit(f"No lead with id {args.id}.")
    changes["updated_at"] = now()
    conn.execute(
        "UPDATE leads SET " + ",".join(f"{k}=?" for k in changes) + " WHERE id=?",
        list(changes.values()) + [args.id],
    )
    event(conn, args.id, "updated", ", ".join(k for k in changes if k != "updated_at"))
    conn.commit()
    print(f"Updated lead {args.id}.")


def suppress(args: argparse.Namespace) -> None:
    conn = connect()
    row = conn.execute("SELECT company FROM leads WHERE id=?", (args.id,)).fetchone()
    if not row:
        raise SystemExit(f"No lead with id {args.id}.")
    conn.execute(
        "UPDATE leads SET do_not_contact=1,stage='suppressed',updated_at=? WHERE id=?",
        (now(), args.id),
    )
    event(conn, args.id, "suppressed", args.reason.strip() or "Do not contact")
    conn.commit()
    print(f"Lead {args.id} ({row['company']}) marked DO NOT CONTACT.")


def export_csv(args: argparse.Namespace) -> None:
    conn = connect()
    rows = conn.execute("SELECT " + ",".join(FIELDS) + " FROM leads ORDER BY id").fetchall()
    out = Path(args.path)
    with out.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        for row in rows:
            record = dict(row)
            record["do_not_contact"] = bool(record["do_not_contact"])
            writer.writerow(record)
    print(f"Exported {len(rows)} leads to {out}")


def import_csv(args: argparse.Namespace) -> None:
    path = Path(args.path)
    if not path.exists():
        raise SystemExit(f"File not found: {path}")
    conn = connect()
    added = skipped = 0
    with path.open(newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            company = (row.get("company") or "").strip()
            website = (row.get("website") or "").strip()
            if not company:
                skipped += 1
                continue
            if conn.execute("SELECT 1 FROM leads WHERE company=? AND website=?", (company, website)).fetchone():
                skipped += 1
                continue
            raw_score = (row.get("fit_score") or "").strip()
            score = int(raw_score) if raw_score else None
            if score is not None and not 0 <= score <= 10:
                skipped += 1
                continue
            dnc = str(row.get("do_not_contact", "")).strip().lower() in {"1", "true", "yes", "y"}
            stage = (row.get("stage") or "research").strip()
            if stage not in STAGES:
                stage = "research"
            stamp = now()
            vals = {
                "company": company, "website": website, "segment": row.get("segment", ""),
                "source_url": row.get("source_url", ""), "observation": row.get("observation", ""),
                "checked_at": row.get("checked_at", ""), "fit_score": score,
                "score_reason": row.get("score_reason", ""), "contact_name": row.get("contact_name", ""),
                "contact_role": row.get("contact_role", ""), "public_contact": row.get("public_contact", ""),
                "stage": "suppressed" if dnc else stage, "next_action": row.get("next_action", ""),
                "next_action_date": row.get("next_action_date", ""), "do_not_contact": int(dnc),
                "notes": row.get("notes", ""),
            }
            cols = list(vals)
            cur = conn.execute(
                f"INSERT INTO leads({','.join(cols)},created_at,updated_at) VALUES({','.join('?' for _ in cols)},?,?)",
                [vals[k] for k in cols] + [stamp, stamp],
            )
            event(conn, cur.lastrowid, "imported", f"CSV: {path.name}")
            added += 1
    conn.commit()
    print(f"Imported {added}; skipped {skipped} (empty, duplicate or invalid).")


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="River Ways local, zero-cost prospect tracker")
    sub = p.add_subparsers(dest="command", required=True)
    sub.add_parser("init", help="create the local database")
    a = sub.add_parser("add", help="add one manually verified company")
    for flag, kw in [
        ("company", {"required": True}), ("website", {}), ("segment", {}),
        ("source-url", {}), ("observation", {}), ("checked-at", {}),
        ("fit-score", {"type": int}), ("score-reason", {}),
        ("public-contact", {}), ("next-action", {}), ("notes", {}),
    ]:
        a.add_argument("--" + flag, **kw)
    a.set_defaults(func=add)
    l = sub.add_parser("list", help="list leads")
    l.add_argument("--stage", choices=STAGES)
    l.set_defaults(func=list_leads)
    u = sub.add_parser("update", help="update a lead")
    u.add_argument("id", type=int)
    u.add_argument("--stage", choices=STAGES)
    u.add_argument("--fit-score", type=int)
    for flag in ("score-reason", "observation", "next-action", "next-action-date",
                 "public-contact", "notes", "source-url", "checked-at"):
        u.add_argument("--" + flag)
    u.set_defaults(func=update)
    s = sub.add_parser("suppress", help="mark lead do-not-contact")
    s.add_argument("id", type=int)
    s.add_argument("--reason", default="")
    s.set_defaults(func=suppress)
    e = sub.add_parser("export-csv", help="export a portable CSV backup")
    e.add_argument("path")
    e.set_defaults(func=export_csv)
    i = sub.add_parser("import-csv", help="import a CSV")
    i.add_argument("path")
    i.set_defaults(func=import_csv)
    return p


def main() -> None:
    args = parser().parse_args()
    if args.command == "init":
        connect().close()
        print(f"Database ready: {DB_PATH}")
    else:
        args.func(args)


if __name__ == "__main__":
    main()
