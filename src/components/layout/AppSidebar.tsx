import {
  LayoutDashboard, Settings2, Database, Calendar, Building, Users,
  BarChart3, AlertTriangle, BookOpen, Layers
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAcademic } from "@/context/AcademicContext";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Academic Control", url: "/control", icon: Settings2 },
  { title: "Master Data", url: "/master", icon: Database },
  { title: "Clash Detection", url: "/clashes", icon: AlertTriangle },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Lookups", url: "/lookups", icon: BookOpen },
];

const viewItems = [
  { title: "Semester View", url: "/view/semester", icon: Layers },
  { title: "Room View", url: "/view/room", icon: Building },
  { title: "Teacher View", url: "/view/teacher", icon: Users },
  { title: "Year View", url: "/view/year", icon: Calendar },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { config, clashes } = useAcademic();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="p-4 border-b border-border/50">
          {!collapsed ? (
            <div>
              <h1 className="text-lg font-bold gradient-text">SATAS</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Smart Academic Timetable</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="status-active text-[9px] px-2 py-0.5 rounded-full font-medium">
                  {config.activeTerm} TERM
                </span>
                <span className="text-[9px] text-muted-foreground">{config.academicYear}</span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-bold gradient-text">S</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/'} activeClassName="bg-primary/10 text-primary">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1 flex items-center justify-between">
                          {item.title}
                          {item.url === '/clashes' && clashes.length > 0 && (
                            <span className="status-conflict text-[9px] px-1.5 py-0.5 rounded-full">
                              {clashes.length}
                            </span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Timetable Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {viewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} activeClassName="bg-primary/10 text-primary">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
