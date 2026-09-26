import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import logoImage from "@/assets/shark-mark.svg";
import { AdPlacement } from "@/components/AdPlacement";
import "@/styles/marketing.css";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`mk-reveal ${shown ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function WaveRule({ className = "" }: { className?: string }) {
  return (
    <svg className={`mk-wave w-full h-6 ${className}`} viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 12 Q 50 0 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12 T 700 12 T 800 12 T 900 12 T 1000 12 T 1100 12 T 1200 12" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

type NavUser = { signedIn: boolean };

export function MarketingHeader({ signedIn }: NavUser) {
  return (
    <header className="sticky top-0 z-50 border-b mk-rule backdrop-blur" style={{ background: "hsl(42 38% 96% / 0.88)" }} role="banner">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <img src={logoImage} alt="AI Shark logo" className="h-9 w-auto" data-testid="img-logo" />
          <span className="mk-display text-xl font-semibold" data-testid="text-app-title">AI Shark</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          <Link href="/sample" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:text-[hsl(var(--mk-blue))] md:inline-flex" data-testid="link-sample">Sample report</Link>
          <Link href="/education" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:text-[hsl(var(--mk-blue))] md:inline-flex" data-testid="link-education">Education</Link>
          <Link href="/pricing" className="rounded-full px-3 py-2 text-sm font-semibold hover:text-[hsl(var(--mk-blue))]" data-testid="link-pricing">Pricing</Link>
          {signedIn ? (
            <Link href="/dashboard" className="mk-btn mk-btn-primary !py-2 !px-4 text-sm" data-testid="link-dashboard">Dashboard</Link>
          ) : (
            <Link href="/login" className="mk-btn mk-btn-ghost !py-2 !px-4 text-sm" data-testid="button-login-header">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

const FOOTER_LINKS: [string, string, string][] = [
  ["/about", "About", "about"],
  ["/sample", "Sample report", "sample"],
  ["/pricing", "Pricing", "pricing"],
  ["/calculator", "DSCR calculator", "calculator"],
  ["/debt-to-equity-calculator", "Debt-to-equity calculator", "dte-calculator"],
  ["/glossary", "Lending glossary", "glossary"],
  ["/guides", "Guides", "guides"],
  ["/education", "Education", "education"],
  ["/partners", "For advisors", "partners"],
  ["/privacy", "Privacy policy", "privacy"],
  ["/terms", "Terms of service", "terms"],
  ["/contact", "Contact", "contact"],
];

export function MarketingFooter({ extraBottomPad = false }: { extraBottomPad?: boolean }) {
  return (
    <footer className="mk-deep" role="contentinfo">
      <div className={`mx-auto max-w-6xl px-4 pt-14 ${extraBottomPad ? "pb-28 md:pb-10" : "pb-10"}`}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="AI Shark logo" className="h-9 w-auto rounded bg-[hsl(42_38%_96%)] p-1" data-testid="img-footer-logo" />
              <span className="mk-display text-xl font-semibold">AI Shark</span>
            </div>
            <p className="mt-4 max-w-xs text-sm opacity-75">
              A documentation review for business owners getting ready to talk to a lender. Not a lender, not a credit bureau.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
            {FOOTER_LINKS.map(([href, label, id]) => (
              <Link key={href} href={href} className="opacity-80 transition-opacity hover:opacity-100 hover:underline" data-testid={`link-footer-${id}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex justify-center">
          <AdPlacement slot="footer" className="hidden md:flex" />
        </div>
        <p className="mt-8 border-t border-white/15 pt-6 text-xs leading-relaxed opacity-70" data-testid="text-disclaimer">
          <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation for informational purposes only. Scores are not credit checks, underwriting, or predictions of any lender's decision, and are not a decision to fund or not fund any business. Always consult qualified financial professionals before making funding decisions. Questions:{" "}
          <a href="mailto:info@aishark.org" className="underline" data-testid="link-contact-email">info@aishark.org</a>.
        </p>
      </div>
    </footer>
  );
}
