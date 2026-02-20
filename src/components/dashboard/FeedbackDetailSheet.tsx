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
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {item.is_urgent && <AlertOctagon className="h-5 w-5 text-critical" />}
            <SheetTitle>Feedback Detail</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2.5">
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

          <Separator />

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Sentiment Analysis</h4>
            <div className="flex items-center gap-4">
              <div className={cn(
                "text-3xl font-mono font-bold",
                item.sentiment_score > 0.6 ? "text-success" : item.sentiment_score > 0.3 ? "text-warning" : "text-critical"
              )}>
                {(item.sentiment_score * 100).toFixed(0)}%
              </div>
              <Badge variant="outline" className={cn(
                "text-xs",
                item.sentiment_label === "Positive" && "border-success/40 text-success",
                item.sentiment_label === "Neutral" && "text-muted-foreground",
                item.sentiment_label === "Negative" && "border-critical/30 text-critical",
                item.sentiment_label === "Critical" && "border-critical/50 text-critical bg-critical/5"
              )}>
                {item.sentiment_label}
              </Badge>
            </div>
          </div>

          <Separator />

          {item.ai_summary && (
            <>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">AI Summary</h4>
                <p className="text-sm font-mono text-primary bg-primary/5 p-3 rounded-lg border border-primary/10">
                  {item.ai_summary}
                </p>
              </div>
              <Separator />
            </>
          )}

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Full Feedback</h4>
            <p className="text-sm leading-relaxed">{item.raw_text}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Resolution Status</h4>
            <Select
              value={item.resolution_status}
              onValueChange={(value) => updateStatus.mutate({ id: item.id, resolution_status: value })}
            >
              <SelectTrigger>
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
