import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { useFeedbackLogs } from "@/hooks/useFeedbackLogs";
import { FeedbackItem } from "@/components/dashboard/FeedbackItem";
import { FeedbackDetailSheet } from "@/components/dashboard/FeedbackDetailSheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeedbackLog } from "@/hooks/useFeedbackLogs";

const Feedback = () => {
  const { data: feedbackLogs = [], isLoading } = useFeedbackLogs();
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<FeedbackLog | null>(null);

  const filtered = feedbackLogs.filter((item) => {
    const matchSearch = !search ||
      item.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      item.raw_text.toLowerCase().includes(search.toLowerCase()) ||
      item.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchSentiment = sentimentFilter === "all" || item.sentiment_label === sentimentFilter;
    const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchSearch && matchSentiment && matchCategory;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <header className="h-14 border-b flex items-center px-5 gap-3">
            <SidebarTrigger />
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">All Feedback</span>
            <span className="text-xs font-mono text-muted-foreground ml-auto">{filtered.length} entries</span>
          </header>

          <div className="p-5 lg:p-6 space-y-4 overflow-y-auto h-[calc(100vh-56px)]">
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or content..." className="pl-8 h-9 text-sm" />
              </div>
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue placeholder="Sentiment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiment</SelectItem>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">No feedback matches your filters.</div>
              ) : (
                filtered.map((item) => (
                  <FeedbackItem key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <FeedbackDetailSheet item={selectedItem} open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
    </SidebarProvider>
  );
};

export default Feedback;
