---
name: Scheduled report deployment boundary
description: Avoid promising independent scheduling based on multi-artifact migration alone.
---

Do not treat multi-artifact support as proof that the available agent tools can provision an independent scheduled job alongside the website.

**Why:** Documentation describes scheduled deployments, but the artifact callbacks available during this work did not expose scheduled artifact creation or scheduling configuration. Migrating the project alone did not resolve that gap.

**How to apply:** Recheck current scheduling tooling before promising activation. Preserve the website deployment and avoid substituting an in-server timer for a requested headless scheduled job. Distinguish a verified one-shot runner from an activated recurring schedule.