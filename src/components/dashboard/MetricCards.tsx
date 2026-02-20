import { MessageSquare, Gauge, AlertOctagon, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeedbackLog } from "@/hooks/useFeedbackLogs";

interface MetricCardsProps {
  data: FeedbackLog[];
}

export function MetricCards({ data }: MetricCardsProps) {
  const total = data.length;
  const avgSentiment = total > 0 ? data.reduce((s, d) => s + d.sentiment_score, 0) / total : 0;
  const urgentCount = data.filter((d) => d.is_urgent).length;
  const urgencyRatio = total > 0 ? (urgentCount / total) * 100 : 0;

  const categories = data.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  const metrics = [
    {
      label: "Total Feedback",
      value: total.toLocaleString(),
      icon: MessageSquare,
      accent: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Avg Sentiment",
      value: `${(avgSentiment * 100).toFixed(1)}%`,
      icon: Gauge,
      accent: avgSentiment > 0.6 ? "text-success" : avgSentiment > 0.3 ? "text-warning" : "text-critical",
      bg: avgSentiment > 0.6 ? "bg-success/10" : avgSentiment > 0.3 ? "bg-warning/10" : "bg-critical/10",
    },
    {
      label: "Urgency Ratio",
      value: `${urgencyRatio.toFixed(1)}%`,
      icon: AlertOctagon,
      accent: urgencyRatio > 30 ? "text-critical" : "text-warning",
      bg: urgencyRatio > 30 ? "bg-critical/10" : "bg-warning/10",
    },
    {
      label: "Top Category",
      value: topCategory ? `${topCategory[0]} (${topCategory[1]})` : "N/A",
      icon: BarChart3,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <Card key={m.label} className="glass-card glow-primary border-border/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
            <div className={`p-2 rounded-lg ${m.bg}`}>
              <m.icon className={`h-4 w-4 ${m.accent}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${m.accent}`}>{m.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
