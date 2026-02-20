import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeedbackItem } from "./FeedbackItem";
import { FeedbackDetailSheet } from "./FeedbackDetailSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Radio } from "lucide-react";
import type { FeedbackLog } from "@/hooks/useFeedbackLogs";

interface WarRoomFeedProps {
  data: FeedbackLog[];
  isLoading: boolean;
}

export function WarRoomFeed({ data, isLoading }: WarRoomFeedProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<FeedbackLog | null>(null);

  const filtered = data.filter((item) => {
    const matchSearch = !search || 
      item.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      item.raw_text.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.resolution_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Live Feed</h2>
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="pl-8 bg-secondary border-border/50 h-8 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] bg-secondary border-border/50 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In-Progress">In-Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-380px)]">
          <div className="space-y-2 pr-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg bg-secondary" />
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No feedback found. Add entries using the form below.
              </div>
            ) : (
              filtered.map((item) => (
                <FeedbackItem key={item.id} item={item} onClick={() => setSelectedItem(item)} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <FeedbackDetailSheet
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </>
  );
}
