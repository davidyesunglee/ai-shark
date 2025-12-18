import { ScoreRing } from "../ScoreRing";

export default function ScoreRingExample() {
  return (
    <div className="flex items-center gap-8">
      <ScoreRing score={85} size="lg" />
      <ScoreRing score={62} size="md" />
      <ScoreRing score={35} size="sm" />
    </div>
  );
}
