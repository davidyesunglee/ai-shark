import { test } from "node:test";
import assert from "node:assert/strict";
import { checks, report, escapeHtml } from "./checks.js";

test("all safe probes pass with expected responses; absent content-length is valid", async () => {
  const requests: { url: string; method: string }[] = [];
  const mock = async (input: any, init: any) => {
    const url = String(input);
    requests.push({ url, method: init.method || "GET" });
    if (url.endsWith("/api/products")) return Response.json({ products: Object.entries({ one_time: 1399, subscription: 699, subscription_pro: 4900, subscription_advisor: 9900 }).map(([tier, amount]) => ({
      metadata: { tier }, prices: [{ unit_amount: amount, currency: "usd", recurring: tier === "one_time" ? null : { interval: "month", interval_count: 1 } }],
    })) });
    if (url.endsWith("/api/teaser")) {
      assert.equal(init.body.has("email"), false);
      assert.equal(init.body.has("file"), false);
      return Response.json({ message: "Please enter a valid email" }, { status: 400 });
    }
    if (url.includes("/api/unsubscribe")) return new Response("Link not valid", { status: 400 });
    if (url.includes("/api/")) return new Response("", { status: 401 });
    if (url.endsWith("sitemap.xml")) return new Response(`<urlset>${["pricing", "education", "guides"].map(p => `<loc>https://aishark.org/${p}</loc>`).join("")}</urlset>`);
    return new Response('<div id="root"></div><script src="/assets/app.js"></script>', { headers: { "content-type": "text/html" } });
  };
  const results = await checks(mock as typeof fetch);
  assert.equal(results.length, 13);
  assert.ok(results.every(r => r.status === "pass"));
  assert.equal(requests.filter(r => r.method === "POST").length, 2);
  assert.equal(report(results).status, "PASS");
});
test("network failures produce a report, not an unhandled rejection", async () => {
  const results = await checks((async () => { throw new Error("sensitive upstream detail"); }) as typeof fetch);
  assert.equal(results.filter(r => r.status === "fail").length, 13);
  assert.equal(report(results).status, "ACTION NEEDED");
  assert.ok(!report(results).html.includes("sensitive upstream"));
});
test("email escapes dynamic text and distinguishes warnings", () => {
  assert.equal(escapeHtml("<b>&"), "&lt;b&gt;&amp;");
  const output = report([{ name: "<script>", status: "warn", detail: "<img>", durationMs: 6000 }]);
  assert.equal(output.status, "PASS WITH WARNINGS");
  assert.ok(!output.html.includes("<script>"));
});