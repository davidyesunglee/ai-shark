---
name: Stripe managed webhook desync (stripe-replit-sync)
description: Why live webhook signature verification breaks after deploys, and how to diagnose/fix the DB↔Stripe endpoint mismatch.
---

# Stripe managed webhook desync

The app uses `stripe-replit-sync`. On boot, `server/index.ts` calls
`stripeSync.findOrCreateManagedWebhook("https://aishark.org/api/stripe/webhook")`
(domain hardcoded). The signing secret is stored in Postgres table
`stripe._managed_webhooks` (schema `stripe`), not in an env var.

## Key fact: secret is read from the DB per request, not cached at boot
`processWebhook` does `SELECT secret FROM stripe._managed_webhooks WHERE account_id=$1 LIMIT 1`
on every call, then `constructEventAsync`. So verification succeeds as long as the
**DB secret matches the currently-live Stripe endpoint's secret**. This means a
desync can be fixed by reconciling the DB row — **no redeploy required**.

## Failure mode
Two rapid/overlapping production deploys race the boot-time webhook setup. One
instance creates endpoint A and writes it to the DB; the other lists Stripe, sees
A as "orphaned" (not yet in its DB view), **deletes A from Stripe**, creates
endpoint B, but its DB upsert hits the `(url, account_id)` unique constraint and
does nothing. Result: Stripe has B, DB still points at A's (now-dead) secret →
every incoming event fails signature verification.

**Why:** boot-time create/delete/upsert isn't atomic across concurrent instances,
and the unique constraint is on `(url, account_id)` while upsert keys on `id`.

## Diagnose
- List live endpoints: `curl -s "https://api.stripe.com/v1/webhook_endpoints?limit=20" -u "$STRIPE_LIVE_SECRET_KEY:"`
- Inspect DB: `psql "$DATABASE_URL" -c "SELECT id, LEFT(secret,10), created, updated_at FROM stripe._managed_webhooks;"`
- Healthy = exactly ONE endpoint in Stripe AND one DB row with the **same id** and
  matching created/updated timestamp. Mismatched ids = broken.

## Fix
- The library self-heals once deploys settle into a single instance: a clean boot
  matches DB↔Stripe again. Confirm by re-querying both until ids match and the
  state is stable across two checks.
- If it does NOT self-heal: you cannot re-read an existing endpoint's secret
  (Stripe reveals it only at creation). So delete the live endpoint + the DB row,
  create ONE fresh endpoint (metadata `managed_by: stripe-sync`, same
  `enabled_events`, correct url), capture its returned `secret`, and insert a
  matching row (id, url, secret, account_id, enabled_events, status=enabled).

## Prevention
**Avoid rapid consecutive production redeploys** — that's what triggers the race.
Deploy once and let boot settle before deploying again.
