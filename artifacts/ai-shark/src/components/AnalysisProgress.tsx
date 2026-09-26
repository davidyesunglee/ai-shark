import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

// Stages mirror the real assessment criteria the AI scores against
// (canonical list lives in server/openai.ts — keep wording consistent).
const STAGES = [
  "Reading your business plan…",
  "Scanning financial projections…",
  "Evaluating cash flow & debt service coverage…",
  "Assessing management team & experience…",
  "Checking market viability & competitive position…",
  "Reviewing revenue model & industry risk…",
  "Scoring across 10 common lending considerations…",
];

// Advance through stages on a timer; hold on the last stage until done.
const STAGE_INTERVAL_MS = 6000;

export function AnalysisProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const pct = Math.round(((stageIndex + 1) / STAGES.length) * 90); // never claim 100% before results arrive

  return (
    <div className="mt-4 space-y-3" role="status" aria-live="polite" data-testid="analysis-progress">
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <ul className="mx-auto max-w-sm space-y-1.5 text-sm">
        {STAGES.slice(0, stageIndex + 1).map((stage, i) => {
          const isCurrent = i === stageIndex;
          return (
            <li
              key={stage}
              className={`flex items-center gap-2 ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}
              data-testid={`analysis-stage-${i}`}
            >
              {isCurrent ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              )}
              <span>{stage}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
