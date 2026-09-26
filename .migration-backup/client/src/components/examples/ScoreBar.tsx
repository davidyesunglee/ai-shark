import { ScoreBar } from "../ScoreBar";

export default function ScoreBarExample() {
  return (
    <div className="w-80 space-y-4">
      <ScoreBar label="Creditworthiness" score={85} />
      <ScoreBar label="Cash Flow Analysis" score={72} />
      <ScoreBar label="Collateral Assessment" score={45} />
    </div>
  );
}
