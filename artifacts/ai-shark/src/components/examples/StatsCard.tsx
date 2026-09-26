import { StatsCard } from "../StatsCard";
import { FileText, TrendingUp, CheckCircle } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatsCard title="Total Assessments" value={24} icon={FileText} description="All time" />
      <StatsCard title="Average Score" value="72.5" icon={TrendingUp} />
      <StatsCard title="Completed" value={21} icon={CheckCircle} />
    </div>
  );
}
