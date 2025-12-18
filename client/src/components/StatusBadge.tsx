import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export type AssessmentStatus = "analyzing" | "complete" | "needs_review" | "failed";

interface StatusBadgeProps {
  status: AssessmentStatus;
}

const statusConfig = {
  analyzing: {
    label: "Analyzing",
    variant: "secondary" as const,
    icon: Loader2,
    iconClass: "animate-spin",
  },
  complete: {
    label: "Complete",
    variant: "default" as const,
    icon: CheckCircle,
    iconClass: "",
  },
  needs_review: {
    label: "Needs Review",
    variant: "secondary" as const,
    icon: AlertCircle,
    iconClass: "",
  },
  failed: {
    label: "Failed",
    variant: "destructive" as const,
    icon: XCircle,
    iconClass: "",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className={`h-3 w-3 ${config.iconClass}`} />
      {config.label}
    </Badge>
  );
}
