import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, ArrowDown, FileText, Upload, ListChecks, RefreshCw, CircleSlash, Check } from "lucide-react";
import { Link } from "wouter";
import { TeaserWidget } from "@/components/TeaserWidget";
import { FreePaidComparison } from "@/components/FreePaidComparison";
import { MarketingHeader, MarketingFooter, Reveal, WaveRule } from "@/components/marketing/MarketingChrome";
import mascotImage from "@/assets/shark-mascot.png";
import { useSEO, trackClick } from "@/lib/useSEO";

const CRITERIA = [
  ["Creditworthiness & Credit History", "How the plan describes borrowing history and repayment track record."],
  ["Cash Flow & Debt Service Coverage", "Whether projected cash flow is shown to cover loan payments (DSCR)."],
  ["Collateral & Asset Base", "Which assets are documented, and whether values and liens are stated."],
  ["Debt-to-Equity & Capital Structure", "How existing debt and owner investment are presented."],
  ["Market Viability & Demand", "Evidence offered for demand, market size and growth."],
  ["Management Team & Experience", "The team's relevant track record and defined roles."],
  ["Financial Projections & Assumptions", "Whether forecasts are explained and supported."],
  ["Revenue Model & Profitability", "How the business makes money and reaches profit."],
  ["Industry & Regulatory Risk", "Industry headwinds and compliance factors addressed."],
  ["Competitive Position & Differentiation", "What sets the business apart, and how that is shown."],
];

const FAQ = [
  {
    q: "Who is AI Shark for?",
    a: "Business owners who already have a written business plan and want a structured second read before talking to a bank, credit union or SBA lender. If you don't have a plan yet, our guides and calculators are a better starting point.",
  },
  {
    q: "Does a good score mean I'll be approved?",
    a: "No. AI Shark reviews how thoroughly your documents address common debt-financing considerations. It does not check your credit, verify your figures, or predict any lender's decision. Lenders make their own decisions using information we never see.",
  },
  {
    q: "What does the free preview include?",
    a: "An overall documentation score (0–100), a Lender Readiness Grade (A–F), a one-line summary and your top three gaps. No account or card is needed; we ask for an email so we can deliver the result.",
  },
  {
    q: "What file types can I upload?",
    a: "PDF, DOCX or TXT files up to 10 MB.",
  },
  {
    q: "How much does the full report cost?",
    a: "$13.99 for a single report with no recurring billing, or $6.99 per month for two reports each month if you plan to revise and re-check. You can cancel the subscription through the Stripe billing portal. Prices exclude applicable taxes.",
  },
  {
    q: "What happens to my plan?",
    a: "Your plan is used to produce your assessment and is not sold or shared with lenders. See our privacy policy for full details.",
  },
];

export default function LandingPage() {
  useSEO({
    title: "AI Shark — Review Your Business Plan Before a Lender Conversation",
    description:
      "An AI documentation review for business owners with an existing plan. See how your plan addresses 10 common debt-financing considerations. Free preview, full reports from $13.99. Not a credit check or approval prediction.",
    canonical: "/",
  });

  return (
    <div className="mk min-h-[100dvh]">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <MarketingHeader signedIn={false} />

      <main id="main-content">
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20" aria-labelledby="hero-title">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="mk-chip mk-rise">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--mk-coral))]" aria-hidden="true" />
                For owners who already have a business plan
              </p>
              <h1 id="hero-title" className="mk-display mk-rise mt-6 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl" style={{ animationDelay: "80ms" }} data-testid="text-hero-title">
                Walk into the bank knowing <span className="mk-marker">where your plan is thin.</span>
              </h1>
              <p className="mk-rise mk-ink-soft mt-6 max-w-xl text-lg leading-relaxed" style={{ animationDelay: "160ms" }} data-testid="text-hero-description">
                Upload your plan and AI Shark reviews it against ten considerations lenders commonly raise — cash flow, collateral, projections and more — then tells you what's covered, what's missing, and what to fix before the meeting.
              </p>
              <div className="mk-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
                <a href="#free-preview" className="mk-btn mk-btn-primary" data-testid="button-get-started" onClick={() => trackClick("hero_get_started")}>
                  Try the free preview
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link href="/sample" className="mk-btn mk-btn-ghost" data-testid="button-view-sample-hero" onClick={() => trackClick("hero_view_sample")}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  See a sample report
                </Link>
              </div>
              <p className="mk-rise mk-ink-soft mt-5 text-sm" style={{ animationDelay: "320ms" }}>
                Free preview: no account, no card. Full report $13.99 once, or{" "}
                <Link href="/pricing" className="mk-link" data-testid="button-view-pricing" onClick={() => trackClick("hero_view_pricing")}>see all pricing</Link>.
              </p>
            </div>

            {/* Report excerpt card */}
            <div className="relative mk-rise" style={{ animationDelay: "200ms" }}>
              <img src={mascotImage} alt="" aria-hidden="true" className="mk-bob absolute -right-2 -top-14 z-10 h-28 w-28 object-contain sm:h-32 sm:w-32" data-testid="img-hero-mascot" />
              <div className="mk-card p-6 sm:p-7" aria-label="Excerpt from a fictional sample report">
                <div className="flex items-center justify-between">
                  <p className="mk-mono mk-ink-soft">Sample excerpt · fictional</p>
                  <span className="rounded-full bg-[hsl(var(--mk-tide))] px-2.5 py-0.5 text-xs font-semibold mk-blue">Illustrative</span>
                </div>
                <p className="mk-display mt-3 text-2xl font-semibold">Riverside Coffee Roasters</p>
                <div className="mt-5 flex items-end gap-6 border-b mk-rule pb-5">
                  <div>
                    <p className="mk-mono mk-ink-soft">Score</p>
                    <p className="mk-display text-5xl font-semibold mk-blue">72</p>
                  </div>
                  <div>
                    <p className="mk-mono mk-ink-soft">Grade</p>
                    <p className="mk-display text-5xl font-semibold">B</p>
                  </div>
                  <p className="mk-ink-soft ml-auto max-w-[9rem] text-right text-xs leading-snug">Documentation completeness, not a credit decision</p>
                </div>
                <ul className="mt-5 space-y-3 text-sm">
                  {[
                    ["Covered", "Itemized use of funds with a 10% contingency", "mk-blue"],
                    ["Gap", "No month-by-month cash-flow projection for year one", "mk-coral"],
                    ["Gap", "Equipment values and existing liens not documented", "mk-coral"],
                  ].map(([tag, text, cls]) => (
                    <li key={text} className="flex gap-3">
                      <span className={`mk-mono w-16 shrink-0 pt-0.5 ${cls}`}>{tag}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sample" className="mk-link mt-6 inline-flex items-center gap-1 text-sm" data-testid="link-hero-excerpt-sample">
                  Read the full sample <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IT IS / ISN'T */}
        <section className="mk-paper2 border-y mk-rule" aria-labelledby="is-isnt-title">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <p className="mk-mono mk-coral">Plain terms</p>
              <h2 id="is-isnt-title" className="mk-display mt-3 text-3xl font-semibold sm:text-4xl">A preparation tool. Not a verdict.</h2>
              <p className="mk-ink-soft mt-4 leading-relaxed">
                Lenders look at your credit, your financial statements and a lot you'll discuss in person. AI Shark only sees the documents you upload — so it tells you how well those documents make your case.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal delay={80} className="mk-card p-6">
                <p className="font-semibold">What it does</p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {["Reads your plan the way a careful loan officer might", "Flags missing or unsupported sections", "Suggests specific additions to make", "Lets you re-check after revising"].map((t) => (
                    <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 mk-blue" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={160} className="mk-card p-6">
                <p className="font-semibold">What it doesn't do</p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {["Pull or check your credit", "Verify your numbers or documents", "Predict approval or loan terms", "Share your plan with lenders"].map((t) => (
                    <li key={t} className="flex gap-2"><CircleSlash className="mt-0.5 h-4 w-4 shrink-0 mk-coral" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FREE PREVIEW */}
        <section id="free-preview" className="scroll-mt-20 mx-auto max-w-4xl px-4 py-20" aria-labelledby="teaser-title">
          <Reveal className="text-center">
            <p className="mk-mono mk-blue">Step 1 · Free, about a minute</p>
            <h2 id="teaser-title" className="mk-display mt-3 text-3xl font-semibold sm:text-5xl" data-testid="text-teaser-title">Start with the free preview</h2>
            <p className="mk-ink-soft mx-auto mt-4 max-w-xl leading-relaxed">
              Upload your plan to get an overall score, a readiness grade and your top three gaps. No account or card needed — we ask for an email to send it.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <TeaserWidget />
          </Reveal>
          <Reveal delay={60} className="mt-14">
            <h3 className="mk-display mb-5 text-center text-2xl font-semibold">Free preview vs. full report</h3>
            <FreePaidComparison />
            <p className="mk-ink-soft mt-5 text-center text-sm">
              Want to see the whole thing first?{" "}
              <Link href="/sample" className="mk-link" data-testid="link-sample-teaser" onClick={() => trackClick("teaser_view_sample")}>View the fictional sample report</Link>
            </p>
          </Reveal>
        </section>

        <WaveRule />

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="how-it-works-title">
          <Reveal>
            <p className="mk-mono mk-coral">How it works</p>
            <h2 id="how-it-works-title" className="mk-display mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">Upload, read the gaps, revise. Repeat if you need to.</h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Upload, t: "Upload your existing plan", d: "PDF, DOCX or TXT up to 10 MB. The review usually finishes in a few minutes." },
              { icon: ListChecks, t: "See what's covered and what's thin", d: "Each consideration gets a score, findings and concrete suggestions — written in plain language." },
              { icon: RefreshCw, t: "Revise and walk in prepared", d: "Fix the gaps, then re-check if you'd like. Bring a stronger plan to your lender conversation." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.t} delay={i * 100}>
                  <li className="list-none border-t-2 border-[hsl(var(--mk-ink))] pt-5">
                    <div className="flex items-center justify-between">
                      <span className="mk-display text-4xl font-semibold mk-blue">0{i + 1}</span>
                      <Icon className="h-6 w-6 mk-ink-soft" aria-hidden="true" />
                    </div>
                    <p className="mt-4 text-lg font-semibold">{s.t}</p>
                    <p className="mk-ink-soft mt-2 text-sm leading-relaxed">{s.d}</p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </section>

        {/* CRITERIA */}
        <section className="mk-deep" aria-labelledby="evaluation-criteria-title">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr]">
              <Reveal>
                <p className="mk-mono text-[hsl(var(--mk-coral))]">What gets reviewed</p>
                <h2 id="evaluation-criteria-title" className="mk-display mt-3 text-3xl font-semibold sm:text-4xl">Ten considerations lenders commonly raise</h2>
                <p className="mt-4 leading-relaxed opacity-75">
                  Every full report scores your plan on the same ten areas, so you can compare versions as you revise. Each score reflects how well your documents address that area — not the underlying facts.
                </p>
                <Link href="/sample" className="mk-btn mk-btn-coral mt-8" data-testid="button-view-sample" onClick={() => trackClick("criteria_view_sample")}>
                  See them in the sample
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Reveal>
              <ol className="grid gap-x-8 sm:grid-cols-2">
                {CRITERIA.map(([title, desc], i) => (
                  <li key={title} className="flex gap-4 border-b border-white/15 py-4" data-testid={`card-criteria-${i}`}>
                    <span className="mk-mono pt-1 text-[hsl(var(--mk-coral))]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-1 text-sm opacity-70">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* EXAMPLE FINDINGS */}
        <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="findings-title">
          <Reveal className="max-w-2xl">
            <p className="mk-mono mk-blue">The kind of thing it flags</p>
            <h2 id="findings-title" className="mk-display mt-3 text-3xl font-semibold sm:text-4xl">Small gaps that invite hard questions</h2>
            <p className="mk-ink-soft mt-4">Illustrative examples of findings. Your report will depend on what your plan contains.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-[1.3fr_1fr_1fr]">
            {[
              { k: "Cash flow", t: "Projected DSCR sits near 1.25x with no downside case shown.", fix: "Add a slower-ramp scenario and show how payments are still covered." },
              { k: "Projections", t: "Revenue growth assumes 30% a year with no stated basis.", fix: "Tie assumptions to history, signed contracts or letters of intent." },
              { k: "Collateral", t: "Equipment is listed, but values and existing liens aren't.", fix: "Attach appraisals or invoices and disclose any liens." },
            ].map((f, i) => (
              <Reveal key={f.k} delay={i * 90} className="mk-card flex flex-col p-6" >
                <p className="mk-mono mk-coral" data-testid={`example-finding-${i}`}>{f.k}</p>
                <p className="mt-3 text-lg font-semibold leading-snug">{f.t}</p>
                <p className="mk-ink-soft mt-auto border-t mk-rule pt-4 text-sm"><span className="font-semibold text-[hsl(var(--mk-ink))]">Suggested fix: </span>{f.fix}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mk-paper2 border-y mk-rule" aria-labelledby="faq-title">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1fr_1.6fr]">
            <Reveal>
              <p className="mk-mono mk-coral">Questions</p>
              <h2 id="faq-title" className="mk-display mt-3 text-3xl font-semibold sm:text-4xl">Before you upload</h2>
              <p className="mk-ink-soft mt-4">Something else? <Link href="/contact" className="mk-link" data-testid="link-faq-contact">Contact us</Link>.</p>
            </Reveal>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`} className="border-[hsl(var(--mk-line))]" data-testid={`faq-item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline" data-testid={`faq-question-${i}`}>{item.q}</AccordionTrigger>
                  <AccordionContent className="mk-ink-soft text-[0.95rem] leading-relaxed" data-testid={`faq-answer-${i}`}>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="cta-title">
          <Reveal className="mk-card relative overflow-hidden p-8 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 id="cta-title" className="mk-display text-3xl font-semibold sm:text-4xl">Find the gaps before your lender does.</h2>
                <p className="mk-ink-soft mt-4" data-testid="text-cta-pricing">
                  Start free. If the preview is useful, the full report is $13.99 once — or $6.99/mo for two reports a month while you revise.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="#free-preview" className="mk-btn mk-btn-primary" data-testid="button-cta-bottom" onClick={() => trackClick("bottom_cta_free_preview")}>
                  Try the free preview <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link href="/pricing" className="mk-btn mk-btn-ghost" data-testid="button-cta-pricing" onClick={() => trackClick("bottom_cta_pricing")}>Compare pricing</Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t mk-rule p-3 pr-20 backdrop-blur md:hidden" style={{ background: "hsl(42 38% 96% / 0.95)" }} data-testid="sticky-cta-mobile">
        <a href="#free-preview" className="mk-btn mk-btn-primary w-full" data-testid="button-sticky-get-started" onClick={() => trackClick("sticky_get_started")}>
          Try the free preview <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <MarketingFooter extraBottomPad />
    </div>
  );
}
