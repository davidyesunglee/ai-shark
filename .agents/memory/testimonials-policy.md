---
name: Testimonials policy
description: How landing-page testimonials are handled — real quotes only, gated on data
---

The landing testimonial section renders only when `shared/testimonials.ts` has entries; it ships empty by design.

**Why:** Never publish invented customer quotes (deceptive marketing / legal risk). User will collect real quotes from beta users.

**How to apply:** When the user provides real quotes (with permission), add them to `shared/testimonials.ts` — the section appears automatically. Don't "seed" it with samples.
