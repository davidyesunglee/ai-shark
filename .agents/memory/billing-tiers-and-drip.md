---
name: Billing tiers & teaser drip
description: Rules for Stripe tier credits, webhook idempotency, and the teaser email drip
---

- Tier→credits lives in `TIER_CREDITS` in shared/schema.ts (one_time 1, subscription 2, subscription_pro 20, subscription_advisor 50). Tier comes from Stripe product metadata `tier`; webhook must never hardcode counts.
- **Why:** credit grants were once double-applied (profile upsert set creditsRemaining AND addCredits added again); credits must have a single source of change.
- Webhook grants are idempotent via transaction_records lookups (checkout session id / invoice id) and skip invoices with `billing_reason=subscription_create` (already credited by checkout event). Preserve these guards on any billing edits.
- Teaser drip (emailScheduler): stages must be processed in DESCENDING order (3,2,1) so a lead advances one stage per hourly run; unsubscribe suppresses by EMAIL across all lead rows, not just one token.
- Free preview requires an email (teaser_leads table). Drip skips registered emails. SHARK15 = 15% once promo code; checkout has allow_promotion_codes.
- Legacy unauthenticated `/api/stripe/webhook/process` route was removed — it allowed credit fraud. Never re-add billing mutations outside the signature-verified webhook.
- Stripe products.search lags on newly created products — seed scripts that check-then-create can duplicate if re-run immediately; verify with products.list before re-running.
