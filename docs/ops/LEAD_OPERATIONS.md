# River Ways — Lead Operations

This is the operating procedure for enquiries stored in the Cloudflare D1 `LEADS_DB`. It becomes usable after migrations `0001` through `0004` are applied to the intended Preview database and the runtime probe passes.

## Lead lifecycle

| Status | Meaning | Required next action |
|---|---|---|
| `new` | Enquiry received, not yet reviewed | Assign an owner and review fit |
| `reviewing` | Context and fit are being checked | Decide qualification and next step |
| `qualified` | Relevant opportunity | Contact the prospect and schedule next action |
| `not_a_fit` | Not suitable for River Ways | Record the reason outside sensitive personal data |
| `contacted` | First human response sent | Set a follow-up date |
| `meeting` | Discovery meeting arranged or held | Record meeting outcome and next step |
| `proposal` | Scope / proposal in progress or sent | Set decision follow-up |
| `won` | Work accepted | Move into client onboarding |
| `lost` | Opportunity closed without a sale | Record a concise non-sensitive reason |

Every open lead should have an owner and a next-action date. Do not leave a lead in `new` or `qualified` without a person responsible for it.

## Daily operating rhythm

1. Review new submissions and notification failures.
2. Assign each new lead to an owner.
3. Check overdue next actions and contact the prospect where appropriate.
4. Update status and next-action date after every meaningful interaction.
5. Review the qualified pipeline and upcoming meetings/proposals.
6. Reconcile D1 records with the notification inbox; email delivery is not the system of record.

## D1 review queries

Run these in the Cloudflare D1 console for the **Preview** database first. These queries are read-only unless explicitly labelled as updates.

### New and unassigned leads
```sql
SELECT id, created_at, name, email, company, goal, notification_status
FROM leads
WHERE pipeline_status = 'new'
ORDER BY created_at ASC;
```

### Overdue follow-ups
```sql
SELECT id, name, email, company, pipeline_status, assigned_to, next_action_at
FROM ops_open_leads
WHERE follow_up_overdue = 1
ORDER BY next_action_at ASC;
```

### Notification exceptions
```sql
SELECT id, created_at, name, email, notification_status
FROM leads
WHERE notification_status IN ('pending', 'failed', 'not_configured')
ORDER BY created_at ASC;
```

### Campaign contribution
```sql
SELECT
  COALESCE(utm_source, '(direct / untagged)') AS source,
  COALESCE(utm_medium, '') AS medium,
  COALESCE(utm_campaign, '') AS campaign,
  COUNT(*) AS enquiries,
  SUM(CASE WHEN pipeline_status IN ('qualified', 'contacted', 'meeting', 'proposal', 'won') THEN 1 ELSE 0 END) AS qualified_or_progressed
FROM leads
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY enquiries DESC;
```

### Update a lead after review
```sql
UPDATE leads
SET pipeline_status = 'qualified',
    assigned_to = 'OWNER_IDENTIFIER',
    next_action_at = '2026-11-03T12:00:00Z',
    updated_at = datetime('now')
WHERE id = 123;
```

Replace placeholders deliberately. Use a stable internal owner identifier, not an employee's personal details.

## Notification failure handling

A successful form response means the enquiry was saved; it does not guarantee that the notification email was delivered. Review the notification exceptions query daily. For a failed notification:

1. Open the D1 record and confirm the lead details.
2. Notify the assigned owner through an approved internal channel.
3. Contact the prospect from the approved business inbox.
4. Record the human follow-up in the lead lifecycle.
5. Investigate Resend status and sender-domain verification separately.

The current endpoint does not automatically retry a failed Resend notification. Do not mark a notification as sent manually unless delivery is confirmed in Resend.

## Response standard

Until River Ways approves a different service level, use this internal operating target for the pilot: review new leads within one business day and acknowledge qualified enquiries within one business day. This is an operational target, not a public guarantee.

## Data handling

- Limit D1 access to people who need it to handle enquiries.
- Do not copy lead data into public documents, GitHub issues, screenshots or unapproved spreadsheets.
- Do not store passwords, payment details or sensitive personal data in lead notes.
- Establish and enforce a retention/deletion schedule before production lead capture.
- Use Preview for test submissions and clearly label test records; do not pollute production data.
- Treat the D1 database as the source of truth. Email is a notification channel only.
