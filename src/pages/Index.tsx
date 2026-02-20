import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { WarRoomFeed } from "@/components/dashboard/WarRoomFeed";
import { ManualEntryForm } from "@/components/dashboard/ManualEntryForm";
import { useFeedbackLogs } from "@/hooks/useFeedbackLogs";
import { Activity } from "lucide-react";

const Index = () => {
  const { data: feedbackLogs = [], isLoading } = useFeedbackLogs();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          {/* Top Bar */}
          <header className="h-14 border-b flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Command Center</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">LIVE</span>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-5 lg:p-6 space-y-6 overflow-y-auto h-[calc(100vh-56px)]">
            <MetricCards data={feedbackLogs} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <WarRoomFeed data={feedbackLogs} isLoading={isLoading} />
              </div>
              <div className="space-y-6">
                <CategoryChart data={feedbackLogs} />
                <ManualEntryForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
