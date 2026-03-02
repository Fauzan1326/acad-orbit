import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAcademic } from "@/context/AcademicContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { config } = useAcademic();
  const { user, userRole, signOut } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border/50" />
              <span className="text-sm text-muted-foreground">Academic Year {config.academicYear}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="status-active text-xs px-3 py-1 rounded-full font-medium">
                {config.activeTerm} Term Active
              </span>
              <div className="h-6 w-px bg-border/50" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{user?.email}</span>
                {userRole && (
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] uppercase font-medium">
                    {userRole}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
