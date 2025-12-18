import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScoreBar } from "./ScoreBar";
import { 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Scale, 
  BarChart3, 
  Users 
} from "lucide-react";

export interface CriterionScore {
  id: string;
  name: string;
  score: number;
  analysis: string;
  keyFindings: string[];
}

interface CriteriaBreakdownProps {
  criteria: CriterionScore[];
}

const iconMap: Record<string, typeof CreditCard> = {
  creditworthiness: CreditCard,
  cash_flow: TrendingUp,
  collateral: Shield,
  debt_equity: Scale,
  market_viability: BarChart3,
  management: Users,
};

export function CriteriaBreakdown({ criteria }: CriteriaBreakdownProps) {
  return (
    <Accordion type="multiple" className="space-y-3">
      {criteria.map((criterion) => {
        const Icon = iconMap[criterion.id] || BarChart3;
        return (
          <AccordionItem
            key={criterion.id}
            value={criterion.id}
            className="rounded-lg border bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline" data-testid={`accordion-${criterion.id}`}>
              <div className="flex flex-1 items-center justify-between gap-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{criterion.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm font-semibold ${
                    criterion.score >= 75 ? "text-green-500" :
                    criterion.score >= 50 ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {criterion.score}/100
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                <div className="w-full max-w-sm">
                  <ScoreBar label="Score" score={criterion.score} />
                </div>
                <p className="text-sm text-muted-foreground">{criterion.analysis}</p>
                {criterion.keyFindings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Findings</h4>
                    <ul className="space-y-1">
                      {criterion.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
