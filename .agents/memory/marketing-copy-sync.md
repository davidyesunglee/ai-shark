---
name: Marketing copy must match backend truth
description: Public-facing claims (criteria count, ratios, features) must stay in sync with the AI backend or they become credibility bugs.
---

# Public copy ↔ backend consistency

The AI assessment produces exactly **10** named criteria — the canonical source is
the scoring block in `server/openai.ts` (the `ASSESSMENT_PROMPT`). Everything the
user sees must agree with it.

**Rule:** any public surface that states a criteria count or lists criteria
(landing page hero + "How It Works" + "What We Evaluate", pricing, sample report,
guides, JSON-LD, weekly report emails) must say **10** and use the same criteria
names as `server/openai.ts`. Same idea for other backend-derived numbers already in
copy: **6 financial ratios**.

**Why:** a real bug shipped where the landing page simultaneously claimed 10
(hero/teaser), 8 ("How It Works" step 2), and showed only 6 generic cards. For a
product whose whole pitch is rigor, mismatched numbers on the primary conversion
page erode trust.

**How to apply:** there is no shared config for the criteria list yet (frontend
copy is hand-written, backend list lives in openai.ts) — so when you touch either
the prompt criteria OR marketing copy, grep the other side for the count/names and
reconcile. A shared `shared/` constant would remove this drift risk if it recurs.

## Visible FAQ ↔ FAQPage JSON-LD parity

The landing page (`client/src/pages/LandingPage.tsx`) renders a visible accordion
FAQ whose 5 Q&A must stay **byte-for-byte identical** to the `FAQPage` JSON-LD in
`client/index.html`. Google flags FAQ structured data that doesn't match visible
content. When editing either, update both. (This is a second hand-maintained
copy pair with no shared source — same drift risk as the criteria list.)
