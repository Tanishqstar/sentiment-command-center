import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Database, Radio, Shield } from "lucide-react";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <header className="h-14 border-b flex items-center px-5 gap-3">
            <SidebarTrigger />
            <SettingsIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Settings</span>
          </header>

          <div className="p-5 lg:p-6 space-y-6 overflow-y-auto h-[calc(100vh-56px)] max-w-2xl">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> Data Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Database</span><Badge variant="secondary">Lovable Cloud</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Table</span><span className="font-mono text-xs">feedback_logs</span></div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary" /> Realtime
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className="bg-success/10 text-success border-success/20 hover:bg-success/15">Connected</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Channel</span><span className="font-mono text-xs">postgres_changes</span></div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">RLS</span><Badge className="bg-success/10 text-success border-success/20 hover:bg-success/15">Enabled</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">AI Analysis</span><Badge variant="secondary">Mock (Client-side)</Badge></div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
