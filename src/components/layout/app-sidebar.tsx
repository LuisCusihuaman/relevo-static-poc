"use client"

import * as React from "react"
import {
  Calendar,
  Users,
  FileText,
  Settings,
  User,
  Stethoscope,
  Activity,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Search,
  Clock,
  Shield
} from "lucide-react"

import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentDoctor?: string
  unit?: string
  shift?: string
  onNavigate?: (section: string) => void
  onOpenCommandPalette?: () => void
  activeTab?: string
  patientCount?: number
}

export function AppSidebar({ 
  currentDoctor = "Dr. Eduardo Martinez",
  unit = "PICU", 
  shift = "Morning",
  onNavigate,
  onOpenCommandPalette,
  activeTab = "schedule",
  patientCount = 0,
  ...props 
}: AppSidebarProps) {
  const { isMobile } = useSidebar()

  // Get doctor initials for avatar
  const getDoctorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleNavigation = (section: string) => {
    if (onNavigate) {
      onNavigate(section)
    }
  }

  const mainNavigationItems = [
    {
      title: "Schedule",
      id: "schedule",
      icon: Calendar,
      isActive: activeTab === "schedule",
      description: "Today's handover schedule"
    },
    {
      title: "Patients",
      id: "patients", 
      icon: Users,
      isActive: activeTab === "patients",
      description: "Your assigned patients"
    }
  ]

  const toolsItems = [
    {
      title: "Search Patients",
      icon: Search,
      action: () => onOpenCommandPalette?.(),
      description: "Find patients across units",
      shortcut: "⌘K"
    },
    {
      title: "I-PASS Documentation",
      icon: FileText,
      action: () => handleNavigation("documentation"),
      description: "Clinical documentation"
    }
  ]

  const settingsItems = [
    {
      title: "Profile & Settings",
      icon: Settings,
      action: () => handleNavigation("profile"),
      description: "Account preferences"
    },
    {
      title: "Notifications", 
      icon: Bell,
      action: () => handleNavigation("notifications"),
      description: "Alerts and updates"
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      action: () => handleNavigation("help"),
      description: "Documentation and support"
    }
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Stethoscope className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">RELEVO</span>
                <span className="truncate text-xs">Medical Handover Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={item.isActive}
                    tooltip={item.description}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Context */}
        <SidebarGroup>
          <SidebarGroupLabel>Current Context</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="pointer-events-none">
                  <Shield className="size-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{unit} Unit</span>
                    <span className="text-xs text-muted-foreground">{shift} Shift</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="pointer-events-none">
                  <Clock className="size-4 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{patientCount} Patients Assigned</span>
                    <span className="text-xs text-muted-foreground">2 urgent items</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    tooltip={item.description}
                    onClick={item.action}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {item.shortcut && (
                      <div className="ml-auto flex items-center gap-0.5">
                        {item.shortcut.split('').map((key, i) => (
                          <kbd key={i} className="px-1 py-0.5 text-xs bg-muted rounded">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    tooltip={item.description}
                    onClick={item.action}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-xs font-semibold text-primary">
                      {getDoctorInitials(currentDoctor)}
                    </span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{currentDoctor}</span>
                    <span className="truncate text-xs">Senior Practitioner</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-xs font-semibold text-primary">
                        {getDoctorInitials(currentDoctor)}
                      </span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{currentDoctor}</span>
                      <span className="truncate text-xs">Senior Practitioner</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleNavigation("profile")}>
                    <User className="size-4" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("notifications")}>
                    <Bell className="size-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Activity className="size-4" />
                    Activity Log
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HelpCircle className="size-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}