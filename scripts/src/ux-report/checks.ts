// Verified with getDeploymentInfo on 2026-09-25. No customer credentials
// or session cookies are attached to these requests.
export const SITE = "https://aishark.org";
export type Result = { name: string; status: "pass" | "warn" | "fail"; detail: string; durationMs: number };
type Verdict = { ok: boolean; detail: string };
export async function checks(fetcher: typeof fetch = fetch): Promise<Result[]> {
  const results: Result[] = [];
  async function probe(name: string, path: string, test: (r: Response) => Promise<Verdict>, init?: RequestInit) {
    const start = Date.now();
    try {
      const r = await fetcher(`${SITE}${path}`, {
        ...init, redirect: "error", signal: AbortSignal.timeout(15000),
        headers: { "user-agent": "AI-Shark-UX-Report-Bot/1.0" },
      });
      const verdict = await test(r);
      const durationMs = Date.now() - start;
      results.push({ name, status: !verdict.ok ? "fail" : durationMs > 5000 ? "warn" : "pass",
        detail: verdict.detail + (durationMs > 5000 ? "; response exceeded 5 seconds" : ""), durationMs });
    } catch {
      // Do not include arbitrary upstream bodies/errors in logs or emails.
      results.push({ name, status: "fail", detail: "Request timed out, redirected, or could not be completed.", durationMs: Date.now() - start });
    }
  }
  for (const path of ["/", "/pricing", "/signup", "/education", "/guides", "/sample"]) {
    await probe(`HTML shell: ${path}`, path, async r => {
      const body = await r.text();
      return { ok: r.status === 200 && (r.headers.get("content-type") || "").includes("text/html") && /<script\b/i.test(body) && /id=["']root["']/.test(body),
        detail: `HTTP ${r.status}; HTML shell and JavaScript entry checked (not browser rendering).` };
    });
  }
  await probe("Paid pricing catalog", "/api/products", async r => {
    const body: unknown = await r.json();
    const isRecord = (value: unknown): value is Record<string, unknown> =>
      typeof value === "object" && value !== null;
    if (!isRecord(body) || !Array.isArray(body.products)) {
      return { ok: false, detail: `HTTP ${r.status}; invalid pricing catalog structure.` };
    }
    const products = body.products;
    const expected = { one_time: 1399, subscription: 699, subscription_pro: 4900, subscription_advisor: 9900 };
    const missing = Object.entries(expected).filter(([tier, amount]) =>
      !products.some((p: unknown) => isRecord(p) && isRecord(p.metadata) &&
        p.metadata.tier === tier && Array.isArray(p.prices) && p.prices.some((price: unknown) =>
        isRecord(price) && price.unit_amount === amount && price.currency === "usd" &&
        (tier === "one_time" ? price.recurring === null :
          isRecord(price.recurring) && price.recurring.interval === "month" && price.recurring.interval_count === 1))));
    return { ok: r.status === 200 && missing.length === 0, detail: missing.length ? `Missing or unexpected prices: ${missing.map(([t]) => t).join(", ")}` : "Four expected USD plans and billing intervals present." };
  });
  const form = new FormData();
  form.append("text", "Automated check: missing email, no file.");
  await probe("Free-score email requirement", "/api/teaser", async r => ({
    ok: r.status === 400 && /valid email/i.test(await r.text()),
    detail: `HTTP ${r.status}; missing-email rejection expected. No valid email or document submitted.`,
  }), { method: "POST", body: form });
  // Non-hex value cannot match the cryptographically generated hex tokens.
  await probe("Invalid unsubscribe link", "/api/unsubscribe?token=ux-check-invalid-not-hex", async r => ({
    ok: r.status === 400 && /Link not valid/i.test(await r.text()),
    detail: `HTTP ${r.status}; invalid-link rejection expected. No real recipient changed.`,
  }));
  for (const [path, method] of [["/api/billing/status", "GET"], ["/api/billing/portal", "POST"], ["/api/assessments", "GET"]]) {
    await probe(`Sign-in protection: ${path}`, path!, async r => ({
      ok: r.status === 401, detail: `HTTP ${r.status}; unauthenticated request must be rejected.`,
    }), { method });
  }
  await probe("Sitemap", "/sitemap.xml", async r => {
    const body = await r.text();
    return { ok: r.status === 200 && /<urlset\b/.test(body) && ["/pricing", "/education", "/guides"].every(path => body.includes(`${SITE}${path}`)),
      detail: `HTTP ${r.status}; XML sitemap and key public URLs checked.` };
  });
  return results;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
export function report(results: Result[]) {
  const status = results.some(r => r.status === "fail") ? "ACTION NEEDED" : results.some(r => r.status === "warn") ? "PASS WITH WARNINGS" : "PASS";
  const text = `${status}\n${results.map(r => `${r.status.toUpperCase()} ${r.name}: ${r.detail} (${r.durationMs} ms)`).join("\n")}\n\nAutomated HTTP checks only. Not a visual, accessibility, authenticated checkout, cancellation, or successful unsubscribe test. No automatic fixes or publishing are performed.\nPublishing reminder: if reviewed fixes are ready in the workspace, publish them to make them live. This report cannot detect unpublished changes.`;
  return { status, text, html: `<html><body style="font-family:Arial,sans-serif;color:#172033"><h1>AI Shark Sunday UX Health Report</h1><h2>${status}</h2><table cellpadding="8"><tr><th>Check</th><th>Status</th><th>Detail</th><th>Time</th></tr>${results.map(r => `<tr><td>${escapeHtml(r.name)}</td><td>${r.status}</td><td>${escapeHtml(r.detail)}</td><td>${r.durationMs} ms</td></tr>`).join("")}</table><p>Automated HTTP checks only. Not a visual, accessibility, authenticated checkout, cancellation, or successful unsubscribe test. No automatic fixes or publishing are performed.</p><p><strong>Publishing reminder:</strong> if reviewed fixes are ready in the workspace, publish them to make them live. This report cannot detect unpublished changes.</p></body></html>` };
}