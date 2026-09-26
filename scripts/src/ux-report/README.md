# Sunday UX report runner — scheduling not activated

Dry run (no secrets or emails):

    pnpm --filter @workspace/scripts ux-report --dry-run

Send one report and exit:

    pnpm --filter @workspace/scripts ux-report --send

Recipient is fixed to the owner's requested address. Uses RESEND_API_KEY at
runtime; do not put the key in code, command arguments, or logs.

## Required deployment setup

This runner is NOT scheduled by the website. The current artifact creation API
does not offer a scheduled/headless artifact type. Do not replace the website's
deployment with a scheduled deployment or add an in-process timer.

Use a separate Scheduled Deployment with this runner and its workspace package:
- Schedule: `0 20 * * 0`
- Time zone: `America/New_York` (handles daylight saving time)
- Run command: `pnpm --filter @workspace/scripts ux-report --send`
- Install command: `pnpm install --frozen-lockfile`
- Configure RESEND_API_KEY via that deployment's secret settings.

Do not use a fixed UTC schedule: Eastern 8pm is 00:00 UTC Monday during
daylight time and 01:00 UTC Monday during standard time.

Resend idempotency keys reduce duplicate sends on same-day retries within its
24-hour window. They are not a permanent send ledger. A changed retry payload
may be rejected; the process then fails visibly rather than sending twice.
Provider rejection, missing credentials, or failed checks return nonzero.

The report checks HTTP shells and API responses, not rendered layouts, actual
checkout, cancellation, or successful unsubscribe. It does not automatically
fix code or publish. A publishing reminder is included, without claiming
unpublished changes were detected.