import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { useFeedbackLogs } from "@/hooks/useFeedbackLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SENTIMENT_COLORS = {
  Positive: "hsl(152, 58%, 42%)",
  Neutral: "hsl(220, 10%, 46%)",
  Negative: "hsl(38, 92%, 50%)",
  Critical: "hsl(0, 72%, 51%)",
};

const Analytics = () => {
  const { data: feedbackLogs = [] } = useFeedbackLogs();

  // Sentiment over time (sorted by created_at)
  const sorted = [...feedbackLogs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const trendData = sorted.map((item, i) => ({
    name: format(new Date(item.created_at), "MMM d HH:mm"),
    score: Math.round(item.sentiment_score * 100),
    avg: Math.round(
      (sorted.slice(0, i + 1).reduce((s, d) => s + d.sentiment_score, 0) / (i + 1)) * 100
    ),
  }));

  // Sentiment distribution
  const sentimentDist = feedbackLogs.reduce<Record<string, number>>((acc, d) => {
    acc[d.sentiment_label] = (acc[d.sentiment_label] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(sentimentDist).map(([name, value]) => ({ name, value }));

  // Channel distribution
  const channelDist = feedbackLogs.reduce<Record<string, number>>((acc, d) => {
    acc[d.source_channel] = (acc[d.source_channel] || 0) + 1;
    return acc;
  }, {});
  const channelData = Object.entries(channelDist).map(([name, count]) => ({ name, count }));

  // Stats
  const avgScore = feedbackLogs.length > 0
    ? feedbackLogs.reduce((s, d) => s + d.sentiment_score, 0) / feedbackLogs.length
    : 0;
  const positiveRate = feedbackLogs.length > 0
    ? (feedbackLogs.filter((d) => d.sentiment_label === "Positive").length / feedbackLogs.length) * 100
    : 0;
  const criticalRate = feedbackLogs.length > 0
    ? (feedbackLogs.filter((d) => d.sentiment_label === "Critical").length / feedbackLogs.length) * 100
    : 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <header className="h-14 border-b flex items-center px-5 gap-3">
            <SidebarTrigger />
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Analytics</span>
          </header>

          <div className="p-5 lg:p-6 space-y-6 overflow-y-auto h-[calc(100vh-56px)]">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardContent className="pt-5">
                  <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                  <p className={cn("text-3xl font-mono font-bold", avgScore > 0.5 ? "text-success" : "text-critical")}>
                    {(avgScore * 100).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="pt-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Positive Rate</p>
                    <p className="text-3xl font-mono font-bold text-success">{positiveRate.toFixed(0)}%</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-success mt-1" />
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="pt-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Critical Rate</p>
                    <p className="text-3xl font-mono font-bold text-critical">{criticalRate.toFixed(0)}%</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-critical mt-1" />
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Trend */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Sentiment Trend Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(220, 65%, 48%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(220, 65%, 48%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "white", border: "1px solid hsl(220, 13%, 91%)", borderRadius: 8, fontSize: 12 }}
                      formatter={(value: number, name: string) => [`${value}%`, name === "score" ? "Score" : "Running Avg"]}
                    />
                    <Area type="monotone" dataKey="score" stroke="hsl(220, 65%, 48%)" fill="url(#scoreGrad)" strokeWidth={2} dot={{ r: 3, fill: "hsl(220, 65%, 48%)" }} />
                    <Line type="monotone" dataKey="avg" stroke="hsl(152, 58%, 42%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Pie */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS] || "#888"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(220, 13%, 91%)", borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Channel bar */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Feedback by Channel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 pt-2">
                    {channelData.map((ch) => {
                      const max = Math.max(...channelData.map((c) => c.count));
                      const pct = max > 0 ? (ch.count / max) * 100 : 0;
                      return (
                        <div key={ch.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{ch.name}</span>
                            <span className="font-mono font-medium">{ch.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
