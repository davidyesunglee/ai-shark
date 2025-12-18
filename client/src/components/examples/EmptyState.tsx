import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="w-full max-w-xl">
      <EmptyState onUpload={() => console.log("Upload clicked")} />
    </div>
  );
}
