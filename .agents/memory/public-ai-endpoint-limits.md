---
name: Public AI endpoint abuse controls
description: How free/unauthenticated endpoints that trigger paid AI calls are protected from cost abuse in this app.
---

# Public AI endpoint abuse controls

The free "teaser" flow lets anyone score a business plan without an account,
which triggers a paid Gemini call. Unauthenticated + paid = cost-abuse target.

## Two layers (both required)
1. **Durable per-IP daily limit.** Count prior attempts in the `site_events`
   table (label `teaser_attempt`, matching hashed IP, last 24h) and block past
   the limit. Record the attempt **before** the AI call so concurrent requests
   still count. Durable across restarts and consistent across instances — an
   in-memory Map is not, and was rejected in review for that reason.
2. **Global per-minute circuit breaker.** A simple in-memory counter caps total
   teaser AI calls per minute across all IPs. This is the only layer that
   survives IP spoofing/rotation, so it's the real hard cap on spend.

## Key facts
- **`req.ip` is trustworthy** — Express `trust proxy` is set to `1` in
  `replitAuth`. Do NOT hash raw `x-forwarded-for` for a security control; use
  `req.ip`. (Raw header parsing is fine for best-effort analytics tracking.)

**Why:** a code review flagged that trusting raw `x-forwarded-for` + in-memory-only
limits was trivially bypassable and could drive unbounded AI spend.
**How to apply:** reuse this pattern for any future public endpoint that calls a
paid model.

## Other public write endpoints
`/api/feedback` is unauthenticated (used by contact form + the satisfaction
survey). It is per-IP rate limited and skips the notification email for
anonymous satisfaction submissions to avoid inbox/quota noise.

## Reusing the full report component publicly
The dashboard's report component embeds a feedback survey that POSTs to
`/api/feedback`. Anything that renders the full report on a public/marketing
page (e.g. the `/sample` page) must pass a public/sample flag so the survey is
NOT rendered — otherwise anonymous/bot traffic pollutes feedback data.
**Why:** caught in review; a public sample page rendering the survey turns an
open write endpoint into a spam target.
