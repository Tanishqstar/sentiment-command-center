import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export type FeedbackLog = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  raw_text: string;
  source_channel: string;
  sentiment_score: number;
  sentiment_label: string;
  category: string;
  is_urgent: boolean;
  ai_summary: string | null;
  resolution_status: string;
  assigned_agent: string | null;
};

export function useFeedbackLogs() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["feedback_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FeedbackLog[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("feedback_logs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback_logs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["feedback_logs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useInsertFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedback: Omit<FeedbackLog, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("feedback_logs")
        .insert(feedback)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback_logs"] });
    },
  });
}

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resolution_status }: { id: string; resolution_status: string }) => {
      const { error } = await supabase
        .from("feedback_logs")
        .update({ resolution_status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback_logs"] });
    },
  });
}
