import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUpdateFeedbackStatus, type FeedbackLog } from "@/hooks/useFeedbackLogs";
import { AlertOctagon, Mail, User, Tag, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FeedbackDetailSheetProps {
  item: FeedbackLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDetailSheet({ item, open, onOpenChange }: FeedbackDetailSheetProps) {
  const updateStatus = useUpdateFeedbackStatus();

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border/50 w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {item.is_urgent && <AlertOctagon className="h-5 w-5 text-critical" />}
            <SheetTitle className="text-foreground">Feedback Detail</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{item.customer_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{item.customer_email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{format(new Date(item.created_at), "PPpp")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{item.source_channel}</Badge>
              <Badge variant="secondary">{item.category}</Badge>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Sentiment */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Sentiment Analysis</h4>
            <div className="flex items-center gap-4">
              <div className={cn(
                "text-3xl font-mono font-bold",
                item.sentiment_score > 0.6 ? "text-success" : item.sentiment_score > 0.3 ? "text-warning" : "text-critical"
              )}>
                {(item.sentiment_score * 100).toFixed(0)}%
              </div>
              <Badge className={cn(
                "text-xs",
                item.sentiment_label === "Positive" && "bg-success/20 text-success border-success/30",
                item.sentiment_label === "Neutral" && "bg-muted text-muted-foreground",
                item.sentiment_label === "Negative" && "bg-critical/20 text-critical border-critical/30",
                item.sentiment_label === "Critical" && "bg-critical/30 text-critical border-critical/50"
              )}>
                {item.sentiment_label}
              </Badge>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* AI Summary */}
          {item.ai_summary && (
            <>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">AI Summary</h4>
                <p className="text-sm font-mono text-primary bg-primary/5 p-3 rounded-lg border border-primary/20">
                  {item.ai_summary}
                </p>
              </div>
              <Separator className="bg-border/50" />
            </>
          )}

          {/* Raw Text */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Full Feedback</h4>
            <p className="text-sm leading-relaxed text-foreground/80">{item.raw_text}</p>
          </div>

          <Separator className="bg-border/50" />

          {/* Status Update */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Resolution Status</h4>
            <Select
              value={item.resolution_status}
              onValueChange={(value) => updateStatus.mutate({ id: item.id, resolution_status: value })}
            >
              <SelectTrigger className="bg-secondary border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
