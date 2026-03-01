import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAcademic } from "@/context/AcademicContext";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { config } = useAcademic();

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
