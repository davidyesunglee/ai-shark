import { checks, report } from "./checks.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !["--dry-run", "--send"].includes(args[0]!)) {
    throw new Error("Use exactly --dry-run or --send.");
  }
  const dryRun = args[0] === "--dry-run";
  if (!dryRun && !process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is required.");
  const results = await checks();
  const output = report(results);
  process.stdout.write(`${output.text}\n`);
  if (!dryRun) {
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    // Retries within Resend's 24-hour idempotency window reuse this key.
    // A duplicate with a different payload is rejected rather than emailed twice.
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json",
        "Idempotency-Key": `ai-shark-ux-${date}` },
      body: JSON.stringify({ from: "AI Shark <info@aishark.org>", to: ["vemangum@gmail.com"],
        subject: `AI Shark Weekly UX Report — ${output.status}`, html: output.html, text: output.text }),
    });
    if (!response.ok) throw new Error(`Email provider rejected report (HTTP ${response.status}).`);
    const data = await response.json() as { id?: string };
    if (!data.id) throw new Error("Email provider did not confirm acceptance.");
    process.stdout.write("Email accepted by provider.\n");
  }
  if (results.some(r => r.status === "fail")) process.exitCode = 1;
}
main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.message : "Report failed"}\n`);
  process.exitCode = 1;
});