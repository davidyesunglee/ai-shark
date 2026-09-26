---
name: AI Shark branding system
description: Canonical brand color and hybrid logo rules (minimal mark vs mascot)
---

# AI Shark branding

Rule: canonical brand blue is **#0846AA** — the hex equivalent of the CSS token `--primary: 217 91% 35%`. All brand surfaces (logo mark SVG, favicon, PDF report logo, `theme-color` meta) must use this exact value; never introduce a second blue.

Hybrid logo system (user-chosen):
- **Minimal fin mark** (blue fin cutting through a waterline) — used in all headers, footers, favicon, and reports.
- **Shark mascot** (transparent-background cutout of the original mascot art) — reserved for "fun" spots, currently the landing hero only.

**Why:** a code review found three different blues in play (#0A3C82 mark, hsl primary, #0a4d8c theme-color); user explicitly picked the hybrid direction over replacing or keeping the mascot alone.

**How to apply:** when adding any new branded surface (emails, OG images, PDFs), fill with #0846AA and use the fin mark unless it's a playful marketing spot.
