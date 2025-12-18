import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="analyzing" />
      <StatusBadge status="complete" />
      <StatusBadge status="needs_review" />
      <StatusBadge status="failed" />
    </div>
  );
}
