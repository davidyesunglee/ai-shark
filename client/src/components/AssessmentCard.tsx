import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge, type AssessmentStatus } from "./StatusBadge";
import { FileText, Eye, Trash2 } from "lucide-react";

export interface Assessment {
  id: string;
  businessName: string;
  fileName: string;
  uploadDate: string;
  status: AssessmentStatus;
  overallScore: number | null;
}

interface AssessmentCardProps {
  assessment: Assessment;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AssessmentCard({ assessment, onView, onDelete }: AssessmentCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold" data-testid={`text-business-name-${assessment.id}`}>
              {assessment.businessName}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {assessment.fileName}
            </p>
          </div>
        </div>
        <StatusBadge status={assessment.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Uploaded {assessment.uploadDate}
          </div>
          {assessment.overallScore !== null && (
            <ScoreRing score={assessment.overallScore} size="sm" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(assessment.id)}
            disabled={assessment.status === "analyzing"}
            data-testid={`button-view-${assessment.id}`}
          >
            <Eye className="mr-1 h-4 w-4" />
            View Report
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(assessment.id)}
            data-testid={`button-delete-${assessment.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
