---
name: Registration form & user_registrations schema
description: Conventions/gotchas for the post-signup registration form and its DB table on aishark.org.
---

# Registration form (post-signup lead capture)

`user_registrations` is a post-signup gate before the tool. For conversion, keep required fields minimal — only username + email are required; phone is optional; address is not collected at all (dropped from the form) though the columns remain for legacy rows.

- **Nullable address columns:** `phone_number, street_address, city, state, zip_code` are nullable. `country` stays `NOT NULL DEFAULT 'United States'` — do NOT make it nullable (form omits it, DB default fills it; making it nullable creates a schema↔DB contract mismatch since prod DB keeps it NOT NULL).

- **Every reader must be null-safe:** any code interpolating these fields needs `|| ''` / `|| '-'`. There are multiple readers — CSV export in `server/routes.ts` AND the weekly registration report (CSV + HTML) in `server/emailScheduler.ts`. Miss one and reports show literal `null`.

- **Schema changes go through `db:push`, not migration files.** `schema.ts` is the source of truth. Migrations run only in dev (`initializeBackground` in server/index.ts) and fail harmlessly ("relation already exists"); prod skips them. The `migrations/0000_*.sql` baseline is legacy — do not hand-edit it.

- **drizzle-kit push has an interactive prompt** (e.g. adding a unique constraint asks whether to truncate). It ignores piped stdin (needs a TTY). For a safe, narrow change (like DROP NOT NULL) run the `ALTER TABLE` directly via SQL instead of fighting the prompt — and never choose the truncate option (it deletes rows).
