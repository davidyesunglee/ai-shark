interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

export function ScoreBar({ label, score, maxScore = 100 }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;

  const getBarColor = () => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-sm text-muted-foreground">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
