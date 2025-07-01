import { useState, useEffect } from 'react';
import { Search, User, Settings, Bell, Plus, MoreHorizontal, Zap, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedDesktopLayoutProps {
  children: React.ReactNode;
  currentDoctor: string;
  unit: string;
  shift: string;
  patientCount: number;
  onCommandPalette: () => void;
  onQuickAction?: (action: string) => void;
}

export function EnhancedDesktopLayout({ 
  children, 
  currentDoctor, 
  unit, 
  shift, 
  patientCount,
  onCommandPalette,
  onQuickAction
}: EnhancedDesktopLayoutProps) {
  const [notifications] = useState(2);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Streamlined Header */}
      <header className="sticky top-0 z-30 glass-card border-b">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Section - Branding & Context */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">R</span>
              </div>
              <div className="hidden md:block">
                <h1 className="font-semibold text-lg">RELEVO</h1>
                <p className="text-xs text-muted-foreground">Medical Handover Platform</p>
              </div>
            </div>
            
            {/* Context Information */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {unit}
              </div>
              <div className="px-3 py-1 bg-secondary rounded-full text-sm">
                {shift} Shift
              </div>
              <div className="px-3 py-1 bg-chart-2/10 text-chart-2 rounded-full text-sm">
                {patientCount} Patients
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Center Section - Quick Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div 
              className="relative w-full cursor-pointer"
              onClick={onCommandPalette}
            >
              <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search patients, create notes...</span>
                <div className="ml-auto flex items-center gap-1">
                  <Command className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickAction?.('handover')}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Start Handover
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickAction?.('add-patient')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Command Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCommandPalette}
              className="md:hidden"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs">
                      {currentDoctor.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium text-sm">{currentDoctor}</span>
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Quick Access Footer (Desktop Only) */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onCommandPalette}
            className="shadow-lg"
          >
            <Command className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Patient List Component for better desktop use
interface EnhancedPatientListProps {
  patients: Array<{
    id: number;
    name: string;
    room: string;
    diagnosis: string;
    priority: 'high' | 'medium' | 'low';
    alertCount: number;
    lastUpdate: string;
    status: 'pending' | 'in-progress' | 'complete';
    collaborators: number;
    unreadComments: number;
  }>;
  viewMode: 'list' | 'grid';
  onPatientClick?: (patientId: number) => void;
  onQuickNote?: (patientId: number) => void;
}

export function EnhancedPatientList({ 
  patients, 
  viewMode, 
  onPatientClick, 
  onQuickNote 
}: EnhancedPatientListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-chart-1 bg-chart-1/5';
      case 'low': return 'border-l-chart-2 bg-chart-2/5';
      default: return 'border-l-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-chart-1 bg-chart-1/10';
      case 'in-progress': return 'text-primary bg-primary/10';
      case 'complete': return 'text-chart-2 bg-chart-2/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {patients.map((patient) => (
          <Card 
            key={patient.id}
            className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${getPriorityColor(patient.priority)}`}
            onClick={() => onPatientClick?.(patient.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{patient.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {patient.room}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </Badge>
                    {patient.alertCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {patient.alertCount} alerts
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{patient.diagnosis}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Updated {patient.lastUpdate}</span>
                    <span>{patient.collaborators} collaborators</span>
                    {patient.unreadComments > 0 && (
                      <span className="text-primary">{patient.unreadComments} new comments</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickNote?.(patient.id);
                    }}
                  >
                    Quick Note
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Add to Handover</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <Card 
          key={patient.id}
          className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${getPriorityColor(patient.priority)}`}
          onClick={() => onPatientClick?.(patient.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">{patient.name}</h4>
                <Badge variant="outline" className="text-xs mt-1">
                  {patient.room}
                </Badge>
              </div>
              <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                {patient.status}
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
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickNote?.(patient.id);
                }}
              >
                + Note
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}