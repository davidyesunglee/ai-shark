---
name: Registration uniqueness migration
description: Safety constraint for applying the user registration uniqueness rule to an existing populated database.
---

Do not force or approve truncation when the schema tool proposes deleting existing user registration data to add a uniqueness constraint. Review and reconcile duplicates first.

**Why:** The development database already contained registrations when the migrated schema attempted to add uniqueness, and the non-interactive schema push proposed truncating the populated table.

**How to apply:** Before a future schema sync involving registration uniqueness, inspect duplicate user IDs read-only, decide how records should be merged or retained, and use a non-destructive migration.