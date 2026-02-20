import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: { direction: "up" | "down"; percent: number; label?: string };
  className?: string;
}

export function StatCard({ title, value, trend, className }: StatCardProps) {
  const isUp = trend.direction === "up";
  const trendLabel = trend.label ?? "vs last Month";

  return (
    <Card
      className={cn(
        "rounded-none bg-black/50 border border-secondary text-white",
        className
      )}
    >
      <CardHeader className="pb-2">
        <p className="text-2xl font-regular leading-tight tracking-tight text-white">{title}</p>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-4xl font-regular leading-tight tracking-tight text-white">{value}</p>
        {/* <p
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            isUp ? "text-primary" : "text-destructive"
          )}
        >
          {isUp ? (
            <TrendingUp className="size-4 shrink-0" />
          ) : (
            <TrendingDown className="size-4 shrink-0" />
          )}
          {isUp ? "+" : ""}
          {trend.percent}% {trendLabel}
        </p> */}
      </CardContent>
    </Card>
  );
}
