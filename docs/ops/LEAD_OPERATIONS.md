# River Ways — Lead Operations

**Schema:** UUID-based lead model in migrations 0001–0003.  
**System of record:** Cloudflare D1 `LEADS_DB`.  
**Scope:** Internal operating procedure; not a public website feature.

## Lead lifecycle

The current schema's `stage` field is the single commercial lifecycle field:

| Stage | Meaning | Next action |
|---|---|---|
| `new` | Enquiry received, not yet reviewed | Assign an owner and review fit |
| `qualified` | Relevant opportunity | Contact the prospect and set a next action |
| `meeting` | Discovery meeting arranged or held | Record outcome and next step |
| `proposal` | Scope or proposal in progress/sent | Set decision follow-up |
| `nurture` | Relevant, but not ready for an active sales process | Set a review date |
| `won` | Work accepted | Move into client onboarding |
| `lost` | Opportunity closed without a sale | Record a concise, non-sensitive reason |

Every open lead should have an owner and next-action date. Do not leave a lead unassigned or without a follow-up plan.


## Enquiry handoff and notification truth

The public enquiry endpoint stores the lead in D1 before attempting the Resend notification.

- A successful API response with `notification: "sent"` means the Resend API accepted the notification request (HTTP success). It does **not** prove that the message reached the destination inbox or was read.
- A saved enquiry whose notification is not confirmed returns an accepted response with a reference. The visitor is told that the enquiry was saved but the team notification could not be confirmed; the visitor is given the approved direct email fallback.
- The form must not tell a visitor that an enquiry was lost when D1 confirms it was saved.
- No background notification retry worker is currently implemented. Review `pending`, `failed` and `not_configured` records operationally. A repeated identical submission may retry a failed notification only within the short duplicate window; do not ask customers to resubmit as the normal recovery process.
- Confirm actual delivery in the Resend event/log view before recording inbox delivery as verified. Provider acceptance and inbox delivery are different states.

The diagnostic handoff may carry only a validated journey identifier and engagement preference. These values are appended as minimal context to the existing enquiry details field for compatibility with the current schema. Diagnostic answers, scores and response payloads must never be copied into the enquiry, URL or notification.

## Daily operating rhythm

1. Review new submissions and notification exceptions.
2. Assign each new lead to an owner.
3. Check overdue next actions and respond where appropriate.
4. Update the stage, owner, and next-action date after meaningful interactions.
5. Review qualified opportunities, upcoming meetings, and proposals.
6. Reconcile D1 records with the notification inbox. Email is a notification channel, not the system of record.

## D1 review queries

Run these against the **Preview** database first. These queries are read-only unless explicitly labelled as updates.

### New and unassigned leads

```sql
SELECT id, created_at, name, email, company, goal, notification_status
FROM leads
WHERE stage = 'new' AND assigned_to IS NULL
ORDER BY created_at ASC;
```

### Overdue follow-ups

```sql
SELECT id, name, email, company, stage, assigned_to, next_action_at
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
  SUM(CASE WHEN stage IN ('qualified', 'meeting', 'proposal', 'won') THEN 1 ELSE 0 END) AS progressed
FROM leads
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY enquiries DESC;
```

### Update a lead after review

```sql
UPDATE leads
SET stage = 'qualified',
    assigned_to = 'OWNER_IDENTIFIER',
    next_action_at = '2026-11-06T12:00:00Z',
    updated_at = datetime('now')
WHERE id = 'LEAD_UUID';
```

Use a stable internal owner identifier, not an employee's personal details. Use the text UUID as the lead ID.

## Notification failure handling

A saved lead is the system-of-record event; notification delivery is separate. Review the notification exceptions query daily. For a failed notification:

1. Confirm the D1 record exists.
2. Alert the assigned owner through an approved internal channel.
3. Contact the prospect from the approved business inbox.
4. Record the next action in the lead lifecycle.
5. Investigate Resend status and sender-domain verification separately.

Do not mark a notification as sent manually unless delivery is confirmed in Resend.

## Response standard

Until River Ways approves a public service level, use this as an internal pilot target: review new leads within one business day and acknowledge qualified enquiries within one business day. This is not a public guarantee.

## Data handling

- Limit D1 access to people who need it to handle enquiries.
- Do not copy lead data into public documents, GitHub issues, screenshots, or unapproved spreadsheets.
- Do not store passwords, payment details, or sensitive personal data in lead notes.
- Establish and enforce a retention/deletion schedule before production lead capture.
- Use Preview for test submissions and clearly label test records; do not pollute production data.
- Keep D1 as the system of record; email is only a notification channel.

## Migration safety

Migration 0003 is designed for the UUID-based schema in migrations 0001–0002 on this branch. It is not interchangeable with PR #24's integer-ID / `pipeline_status` migration sequence. Inspect the target D1 schema before applying it. Do not run it against an existing Preview or production database until its migration history and current columns are verified.
