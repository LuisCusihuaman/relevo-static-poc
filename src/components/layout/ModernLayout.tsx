import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

interface ModernLayoutProps {
  children: React.ReactNode;
  currentDoctor: string;
  unit: string;
  shift: string;
  patientCount: number;
  onViewModeChange?: (mode: "compact" | "detailed") => void;
  viewMode?: "compact" | "detailed";
}

export function ModernLayout({
  children,
  currentDoctor,
  unit,
  shift,
  patientCount,
  onViewModeChange,
  viewMode = "detailed",
}: ModernLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, _setNotifications] = useState(3);

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-30 glass-card border-b">
        <div className="flex items-center justify-between p-4">
          {/* Left Section - Logo & Context */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  R
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">RELEVO</h1>
                <p className="text-sm text-muted-foreground">
                  Hospital Garrahan
                </p>
              </div>
            </div>

            {/* Context Pills */}
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {unit}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {shift} Shift
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {patientCount} Patients
              </Badge>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search patients, notes, or alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/30"
              />
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            {onViewModeChange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onViewModeChange(
                    viewMode === "compact" ? "detailed" : "compact",
                  )
                }
                className="hidden md:flex"
              >
                {viewMode === "compact" ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Quick Actions */}
            <Button size="sm" className="hidden md:flex">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 pl-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-sm">
                      {currentDoctor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium">
                    {currentDoctor}
                  </span>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

// Enhanced Kanban-style Layout Component
interface KanbanLayoutProps {
  sections: {
    id: string;
    title: string;
    count: number;
    color: string;
    items: React.ReactNode[];
  }[];
  onSectionAction?: (sectionId: string, action: string) => void;
}

export function KanbanLayout({ sections, onSectionAction }: KanbanLayoutProps) {
  return (
    <div className="p-6">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {sections.map((section) => (
          <div key={section.id} className="flex-shrink-0 w-80">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: section.color }}
                />
                <h3 className="font-semibold">{section.title}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {section.count}
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => onSectionAction?.(section.id, "filter")}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter Section
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSectionAction?.(section.id, "sort")}
                  >
                    Sort by Priority
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Section Content */}
            <div className="space-y-3 min-h-[200px]">
              {section.items.length > 0 ? (
                section.items
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                  </div>
                  <p className="text-sm">
                    No items in {section.title.toLowerCase()}
                  </p>
                </div>
              )}
            </div>

            {/* Add Item Button */}
            <Button
              variant="ghost"
              className="w-full mt-4 border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40"
              onClick={() => onSectionAction?.(section.id, "add")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to {section.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact Patient Card for Kanban
interface CompactPatientCardProps {
  patient: {
    id: number;
    name: string;
    room: string;
    diagnosis: string;
    priority: "high" | "medium" | "low";
    alertCount: number;
    lastUpdate: string;
  };
  onClick?: () => void;
}

export function CompactPatientCard({
  patient,
  onClick,
}: CompactPatientCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive bg-destructive/5";
      case "medium":
        return "border-l-chart-1 bg-chart-1/5";
      case "low":
        return "border-l-chart-2 bg-chart-2/5";
      default:
        return "border-l-border";
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${getPriorityColor(patient.priority)}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{patient.name}</h4>
          <Badge variant="outline" className="text-xs">
            {patient.room}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {patient.diagnosis}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {patient.alertCount > 0 && (
              <Badge variant="destructive" className="text-xs px-1">
                {patient.alertCount}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs capitalize">
              {patient.priority}
            </Badge>
          </div>

          <span className="text-xs text-muted-foreground">
            {patient.lastUpdate}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
