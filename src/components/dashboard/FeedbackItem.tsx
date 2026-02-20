import { AlertOctagon, CheckCircle, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FeedbackLog } from "@/hooks/useFeedbackLogs";

interface FeedbackItemProps {
  item: FeedbackLog;
  onClick: () => void;
}

const sentimentBg: Record<string, string> = {
  Positive: "bg-success/5 border-success/20",
  Neutral: "border-border/30",
  Negative: "bg-critical/5 border-critical/20",
  Critical: "bg-critical/10 border-critical/40",
};

const statusIcon: Record<string, React.ReactNode> = {
  New: <Clock className="h-3.5 w-3.5 text-info" />,
  "In-Progress": <MessageSquare className="h-3.5 w-3.5 text-warning" />,
  Resolved: <CheckCircle className="h-3.5 w-3.5 text-success" />,
};

export function FeedbackItem({ item, onClick }: FeedbackItemProps) {
  const isCritical = item.sentiment_label === "Critical" || item.is_urgent;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all hover:bg-accent/50 cursor-pointer",
        sentimentBg[item.sentiment_label] || "border-border/30",
        isCritical && "animate-pulse-critical border-critical/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isCritical && <AlertOctagon className="h-4 w-4 text-critical flex-shrink-0" />}
            <span className="font-medium text-sm truncate">{item.customer_name}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/50 text-muted-foreground">
              {item.source_channel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.ai_summary || item.raw_text}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.category}</Badge>
            <div className="flex items-center gap-1">
              {statusIcon[item.resolution_status]}
              <span className="text-[10px] text-muted-foreground">{item.resolution_status}</span>
            </div>
            {isCritical && (
              <Badge className="text-[10px] px-1.5 py-0 bg-critical/20 text-critical border-critical/30">
                High Priority
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={cn(
            "text-lg font-mono font-bold",
            item.sentiment_score > 0.6 ? "text-success" : item.sentiment_score > 0.3 ? "text-warning" : "text-critical"
          )}>
            {(item.sentiment_score * 100).toFixed(0)}
          </div>
          <div className="text-[10px] text-muted-foreground">score</div>
        </div>
      </div>
    </button>
  );
}
