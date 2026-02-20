
CREATE TABLE public.feedback_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  source_channel TEXT NOT NULL CHECK (source_channel IN ('Email', 'Twitter', 'Support Ticket', 'App Store')),
  sentiment_score FLOAT8 NOT NULL CHECK (sentiment_score >= 0.0 AND sentiment_score <= 1.0),
  sentiment_label TEXT NOT NULL CHECK (sentiment_label IN ('Positive', 'Neutral', 'Negative', 'Critical')),
  category TEXT NOT NULL CHECK (category IN ('Billing', 'Technical', 'Product', 'Shipping', 'Legal')),
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  ai_summary TEXT,
  resolution_status TEXT NOT NULL DEFAULT 'New' CHECK (resolution_status IN ('New', 'In-Progress', 'Resolved')),
  assigned_agent TEXT
);

ALTER TABLE public.feedback_logs ENABLE ROW LEVEL SECURITY;

-- Public read/write for this dashboard (no auth required)
CREATE POLICY "Allow public read" ON public.feedback_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.feedback_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.feedback_logs FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_logs;
