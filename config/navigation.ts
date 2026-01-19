// config/navigation.ts

import { 
    LayoutDashboard, 
    FolderKanban, 
    CheckSquare, 
    Settings, 
    Users, 
    Box 
  } from "lucide-react";
  
  export const DASHBOARD_NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/members", label: "Node Network", icon: Users },
    { href: "/resources", label: "System Vault", icon: Box },
    { href: "/settings", label: "Settings", icon: Settings },
  ];