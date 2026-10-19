# River Ways zero-budget prospect pipeline

This tool runs on Python 3.11+ and uses only the standard library. It makes no network calls, uses no AI/API keys, sends no email, and has no subscription.

## Start

```bash
python sales-engine/free-pilot/pipeline.py init
python sales-engine/free-pilot/pipeline.py --help
```

The SQLite database is created beside the script as `river_ways_leads.sqlite3`. Keep this local file private and back it up using your normal local backup method. It is intentionally not committed to Git.

## Add and review a prospect

```bash
python sales-engine/free-pilot/pipeline.py add \
  --company "Example Business" \
  --website "https://example.com" \
  --segment "Professional services" \
  --source-url "https://example.com/about" \
  --observation "Record a specific, verifiable observation from the public page." \
  --fit-score 7 \
  --score-reason "Service fit and evidence are strong; timing still needs confirmation." \
  --next-action "Manually review service fit and an appropriate public contact route"
python sales-engine/free-pilot/pipeline.py list
```

Replace the example with a real business you have checked. Never leave example data in a real prospect list. The tracker does not fetch sites or validate claims for you.

## Update stage and suppress contacts

```bash
python sales-engine/free-pilot/pipeline.py update 1 --stage qualified --next-action "Review website journey"
python sales-engine/free-pilot/pipeline.py suppress 1 --reason "Opted out"
```

A suppression action sets both the do-not-contact flag and the stage to `suppressed`. Check this flag before any future contact. This pilot does not send messages.

## Import/export and backup

```bash
python sales-engine/free-pilot/pipeline.py export-csv backup.csv
python sales-engine/free-pilot/pipeline.py import-csv backup.csv
```

Imports skip duplicate company+website pairs, empty company names, and invalid scores. Review a CSV before importing; do not put credentials in CSV files. Export regularly and store backups privately.

## Fields and qualification

Each prospect should have an official website, source URL, observation, date checked, fit score (0–10), score rationale, stage and next action. The score is a prioritisation aid, not permission to contact. Keep claims grounded in the linked source and avoid collecting unnecessary personal data.

## Boundaries

- No AI runtime, external service, sending, enrichment or scraping is included.
- Research manually using public pages and respect site rules and applicable law.
- Keep the database local; do not commit it or publish it in a web app.
- Do not add model APIs or paid integrations unless the zero-budget policy changes explicitly.
