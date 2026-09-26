import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileUp, ScanSearch, FileCheck2 } from "lucide-react";

const STEP_DURATION = 5000;

const steps = [
  {
    icon: FileUp,
    title: "Upload Your Plan",
    description:
      "Upload your business plan in PDF, DOCX, or TXT format. We support files up to 10MB.",
  },
  {
    icon: ScanSearch,
    title: "AI Analysis",
    description:
      "Our AI evaluates your plan against the 10 key bank financing criteria used by lenders.",
  },
  {
    icon: FileCheck2,
    title: "Get Your Report",
    description:
      "Receive detailed scores, strengths, weaknesses, and specific recommendations.",
  },
];

const criteriaLabels = [
  "Financial Viability",
  "Cash Flow & DSCR",
  "Market Analysis",
  "Management Team",
  "Collateral & Risk",
];

function UploadScene({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <motion.div
        initial={reduced ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-36 h-44 rounded-lg border-2 border-dashed border-primary/40 bg-background shadow-sm p-4 flex flex-col gap-2"
        aria-hidden="true"
      >
        <div className="h-2 w-3/4 rounded bg-muted-foreground/30" />
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
        <div className="h-2 w-5/6 rounded bg-muted-foreground/20" />
        <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
        <motion.div
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 18 }}
          className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          <FileUp className="w-5 h-5" />
        </motion.div>
      </motion.div>
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-muted-foreground"
      >
        business-plan.pdf · 2.4 MB
      </motion.p>
    </div>
  );
}

function AnalysisScene({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col justify-center h-full gap-3 px-8" aria-hidden="true">
      {criteriaLabels.map((label, i) => (
        <motion.div
          key={label}
          initial={reduced ? false : { x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3"
        >
          <motion.div
            initial={reduced ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.35, type: "spring", stiffness: 400, damping: 20 }}
            className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6.5 5 9l5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="text-sm">{label}</span>
          <motion.div
            className="ml-auto h-1.5 rounded-full bg-primary/70"
            initial={{ width: 0 }}
            animate={{ width: `${[72, 58, 80, 64, 48][i]}px` }}
            transition={reduced ? { duration: 0 } : { delay: 0.6 + i * 0.35, duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      ))}
      {!reduced && (
        <motion.div
          className="absolute inset-x-6 h-10 rounded bg-primary/5 border-y border-primary/20 pointer-events-none"
          initial={{ top: "12%" }}
          animate={{ top: ["12%", "75%", "12%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function ReportScene({ reduced }: { reduced: boolean }) {
  const score = 82;
  const r = 40;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center justify-center h-full gap-8" aria-hidden="true">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-muted" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - score / 100) }}
            transition={reduced ? { duration: 0 } : { duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Score</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {["Strengths", "Weaknesses", "Next steps"].map((label, i) => (
          <motion.div
            key={label}
            initial={reduced ? false : { x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.25 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksExplainer() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % steps.length);
    }, STEP_DURATION);
    return () => clearInterval(timerRef.current);
  }, [paused, active]);

  const scenes = [UploadScene, AnalysisScene, ReportScene];
  const Scene = scenes[active];

  return (
    <div
      className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="flex flex-col gap-2" role="list">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === active;
          return (
            <button
              key={step.title}
              role="listitem"
              onClick={() => setActive(i)}
              aria-current={isActive ? "step" : undefined}
              data-testid={`button-explainer-step-${i + 1}`}
              className={`relative text-left rounded-lg p-4 transition-colors border ${
                isActive
                  ? "bg-background border-primary/30 shadow-sm"
                  : "border-transparent hover:bg-background/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
              {isActive && !paused && !reduced && (
                <motion.div
                  key={`progress-${i}`}
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary/60 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className="relative h-72 rounded-xl border bg-muted/40 overflow-hidden"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Scene reduced={reduced} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
