import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

export interface ScorePoint {
  date: string; // formatted display date
  score: number;
  businessName: string;
}

export function ScoreTrendCard({ points }: { points: ScorePoint[] }) {
  if (points.length < 2) return null;

  const first = points[0].score;
  const latest = points[points.length - 1].score;
  const delta = latest - first;
  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const deltaColor =
    delta > 0
      ? "text-green-600 dark:text-green-500"
      : delta < 0
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <Card data-testid="card-score-trend">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Score Over Time</CardTitle>
        <Badge variant="secondary" className={`gap-1 ${deltaColor}`} data-testid="badge-score-delta">
          <DeltaIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {delta > 0 ? `+${delta}` : delta} since first assessment
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-48" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                formatter={(value: number) => [`${value}`, "Score"]}
                labelFormatter={(label: string, payload) =>
                  payload?.[0]?.payload?.businessName
                    ? `${payload[0].payload.businessName} · ${label}`
                    : label
                }
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={70}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                label={{ value: "Bankable (70)", position: "insideTopRight", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="sr-only" data-testid="text-score-trend-summary">
          Your assessment scores over time: {points.map((p) => `${p.businessName} scored ${p.score} on ${p.date}`).join("; ")}.
        </p>
      </CardContent>
    </Card>
  );
}
