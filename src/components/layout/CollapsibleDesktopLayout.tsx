import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Activity,
  Bell,
  Clock,
  Command,
  FileText,
  Menu,
  Plus,
  Search,
  Settings,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CollapsibleDesktopLayoutProps {
  children: React.ReactNode;
  currentDoctor: string;
  unit: string;
  shift: string;
  patientCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCommandPalette: () => void;
  onQuickAction?: (action: string) => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: Activity,
    id: "dashboard",
    description: "Handover overview and schedule",
  },
  {
    title: "Patients",
    icon: Users,
    id: "patients",
    description: "Patient list and clinical information",
  },
  {
    title: "Documentation",
    icon: FileText,
    id: "documentation",
    description: "I-PASS clinical documentation",
  },
  {
    title: "Search",
    icon: Search,
    id: "search",
    description: "Search patients and records",
  },
];

export function CollapsibleDesktopLayout({
  children,
  currentDoctor,
  unit,
  shift,
  patientCount,
  activeTab,
  onTabChange,
  onCommandPalette,
  onQuickAction,
}: CollapsibleDesktopLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  R
                </span>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-semibold text-lg">RELEVO</h1>
                  <p className="text-xs text-muted-foreground">
                    Medical Handover Platform
                  </p>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {/* Context Information */}
              {sidebarOpen && (
                <div className="px-4 py-3 space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium">{unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                      <Clock className="w-3 h-3" />
                      <span>{shift} Shift</span>
                      <span>•</span>
                      <span>{patientCount} Patients</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">
                      {currentTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="px-2">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => onTabChange(item.id)}
                      className="w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      {sidebarOpen && (
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>

              {/* Quick Actions */}
              {sidebarOpen && (
                <div className="px-4 py-3 border-t mt-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Quick Actions
                  </h4>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuickAction?.("handover")}
                      className="w-full justify-start gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Start Handover
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onCommandPalette}
                      className="w-full justify-start gap-2"
                    >
                      <Command className="w-4 h-4" />
                      Command Palette
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuickAction?.("add-patient")}
                      className="w-full justify-start gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Patient
                    </Button>
                  </div>
                </div>
              )}

              {/* User Section */}
              <div className="mt-auto px-4 py-3 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"} gap-2`}
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-xs">
                          {currentDoctor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {sidebarOpen && (
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {currentDoctor}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Online
                          </div>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onCommandPalette}>
                      <Command className="w-4 h-4 mr-2" />
                      Command Palette
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="border-b bg-card px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <SidebarTrigger>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SidebarTrigger>

                {/* Command Palette Trigger */}
                <div
                  className="hidden md:flex flex-1 max-w-md cursor-pointer"
                  onClick={onCommandPalette}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCommandPalette();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Open command palette"
                >
                  <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors w-full">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Search patients, create documentation...
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <Command className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Mobile Command Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCommandPalette}
                  className="md:hidden"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
