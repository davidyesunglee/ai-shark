import { AssessmentCard, type Assessment } from "../AssessmentCard";

// todo: remove mock functionality
const mockAssessment: Assessment = {
  id: "1",
  businessName: "TechStart Solutions",
  fileName: "business_plan_2024.pdf",
  uploadDate: "Dec 15, 2025",
  status: "complete",
  overallScore: 78,
};

export default function AssessmentCardExample() {
  return (
    <div className="w-80">
      <AssessmentCard
        assessment={mockAssessment}
        onView={(id) => console.log("View:", id)}
        onDelete={(id) => console.log("Delete:", id)}
      />
    </div>
  );
}
