interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreRing({ score, size = "md", showLabel = true }: ScoreRingProps) {
  const dimensions = {
    sm: { width: 64, strokeWidth: 6, fontSize: "text-sm" },
    md: { width: 100, strokeWidth: 8, fontSize: "text-xl" },
    lg: { width: 140, strokeWidth: 10, fontSize: "text-3xl" },
  };

  const { width, strokeWidth, fontSize } = dimensions[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getColor = () => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getStrokeColor = () => {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#eab308";
    return "#ef4444";
  };

  const getScoreLabel = () => {
    if (score >= 75) return "Strong";
    if (score >= 50) return "Moderate";
    return "Needs improvement";
  };

  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`Score: ${score} out of 100 - ${getScoreLabel()}`}>
      <svg
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className={`font-mono font-semibold ${fontSize} ${getColor()}`}>
            {score}
          </span>
          {size !== "sm" && (
            <span className="text-xs text-muted-foreground">/ 100</span>
          )}
        </div>
      )}
    </div>
  );
}
