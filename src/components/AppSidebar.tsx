import { 
  Home, 
  Scan, 
  Search, 
  Bell, 
  User, 
  Pill,
  History,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Scan Medicine",
    url: "/scan",
    icon: Scan,
  },
  {
    title: "Search Medicine",
    url: "/search",
    icon: Search,
  },
  {
    title: "Reminders",
    url: "/reminders",
    icon: Bell,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
];

const bottomItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";
    if (isActive(path)) {
      return `${baseClasses} bg-primary text-primary-foreground shadow-md`;
    }
    return `${baseClasses} text-muted-foreground hover:bg-accent hover:text-accent-foreground`;
  };

  return (
    <Sidebar className="border-r bg-card" collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/lovable-uploads/058ea4a4-d6ff-437f-a073-69042a5d15cc.png" alt="MedGenius Logo" className="w-8 h-8 object-contain" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MedGenius
                </span>
                <span className="text-xs text-muted-foreground">Medicine Finder</span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
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