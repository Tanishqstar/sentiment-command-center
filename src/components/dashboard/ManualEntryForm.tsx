import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Send } from "lucide-react";
import { useInsertFeedback } from "@/hooks/useFeedbackLogs";
import { toast } from "sonner";

const channels = ["Email", "Twitter", "Support Ticket", "App Store"];
const categories = ["Billing", "Technical", "Product", "Shipping", "Legal"];

function mockAIAnalysis(text: string) {
  const lower = text.toLowerCase();
  let score = 0.5;
  let label = "Neutral";
  let isUrgent = false;

  if (lower.includes("love") || lower.includes("great") || lower.includes("excellent") || lower.includes("amazing")) {
    score = 0.8 + Math.random() * 0.2;
    label = "Positive";
  } else if (lower.includes("terrible") || lower.includes("worst") || lower.includes("broken") || lower.includes("urgent")) {
    score = Math.random() * 0.2;
    label = "Critical";
    isUrgent = true;
  } else if (lower.includes("bad") || lower.includes("issue") || lower.includes("problem") || lower.includes("frustrated")) {
    score = 0.2 + Math.random() * 0.15;
    label = "Negative";
  }

  const words = text.split(" ").slice(0, 10).join(" ");
  const summary = words.length > 50 ? words.slice(0, 50) + "..." : words;

  return { sentiment_score: Math.round(score * 100) / 100, sentiment_label: label, is_urgent: isUrgent, ai_summary: summary };
}

export function ManualEntryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState("Email");
  const [category, setCategory] = useState("Technical");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const insertFeedback = useInsertFeedback();

  const handleSubmit = async () => {
    if (!name || !email || !text) {
      toast.error("Please fill all required fields");
      return;
    }

    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const analysis = mockAIAnalysis(text);

    insertFeedback.mutate(
      {
        customer_name: name,
        customer_email: email,
        source_channel: channel,
        category,
        raw_text: text,
        resolution_status: "New",
        assigned_agent: null,
        ...analysis,
      },
      {
        onSuccess: () => {
          toast.success("Feedback logged & analyzed");
          setName(""); setEmail(""); setText("");
          setAnalyzing(false);
        },
        onError: () => {
          toast.error("Failed to submit feedback");
          setAnalyzing(false);
        },
      }
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
          <Send className="h-3.5 w-3.5" />
          Manual Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="h-8 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Feedback</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter customer feedback..." className="text-sm min-h-[80px]" />
        </div>
        <Button onClick={handleSubmit} disabled={analyzing} className="w-full">
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Simulate AI Analysis & Submit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
