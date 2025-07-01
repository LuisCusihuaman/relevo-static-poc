import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCheck,
  Settings, // NEW: For setup change button
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Patient } from '../../../common/types';

interface HandoverDashboardProps {
  selectedPatients: number[];
  unit: string;
  onChangeSetup?: () => void; // NEW: Optional callback for changing setup
  patients: Patient[];
}

// Mock data for upcoming handovers - in real app this would come from shift management system
const upcomingHandovers = [
  {
    id: 1,
    nextShiftDoctor: "Dr. Sarah Martinez",
    nextShiftTime: "18:00",
    shiftType: "Night Shift",
    patientsToHandover: [
      { name: "Emma Rodriguez", room: "PICU-301", severity: "watcher" },
      { name: "Michael Chen", room: "PICU-305", severity: "stable" }
    ],
    status: "confirmed",
    avatar: "SM"
  },
  {
    id: 2,
    nextShiftDoctor: "Dr. James Wilson",
    nextShiftTime: "20:00",
    shiftType: "Night Shift",
    patientsToHandover: [
      { name: "David Kim", room: "PICU-302", severity: "unstable" }
    ],
    status: "pending",
    avatar: "JW"
  },
  {
    id: 3,
    nextShiftDoctor: "Dr. Ana Garcia",
    nextShiftTime: "06:00 +1",
    shiftType: "Morning Shift",
    patientsToHandover: [
      { name: "Sarah Johnson", room: "PICU-304", severity: "stable" },
      { name: "Lucas Brown", room: "PICU-306", severity: "watcher" }
    ],
    status: "confirmed",
    avatar: "AG"
  }
];

export function HandoverDashboard({ 
  selectedPatients, 
  unit, 
  onChangeSetup, // NEW: Accept the change setup callback
  patients 
}: HandoverDashboardProps) {
  const [currentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  // Filter patients for current shift
  const myPatients = patients.filter(p => selectedPatients.includes(p.id));

  // Check mobile
  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Today's schedule (mock data)
  const todaySchedule = [
    {
      time: '08:00',
      type: 'handover',
      title: 'Shift Handover',
      description: 'Night to day shift transition',
      status: 'completed',
      participants: ['Dr. Martinez', 'Dr. Chen']
    },
    {
      time: '10:30',
      type: 'rounds',
      title: 'Patient Rounds',
      description: 'PICU morning rounds',
      status: 'in-progress',
      participants: ['Medical Team']
    },
    {
      time: '13:00',
      type: 'consultation',
      title: 'Family Consultation',
      description: 'Patient Emma Rodriguez',
      status: 'upcoming',
      participants: ['Family Meeting']
    },
    {
      time: '15:30',
      type: 'documentation',
      title: 'I-PASS Documentation',
      description: 'End of shift documentation',
      status: 'upcoming',
      participants: ['Documentation Review']
    },
    {
      time: '18:00',
      type: 'handover',
      title: 'Evening Handover',
      description: 'Day to night shift transition',
      status: 'upcoming',
      participants: ['Night Team']
    }
  ];

  const getShiftTime = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 14) return 'Morning';
    if (hour >= 14 && hour < 22) return 'Afternoon';
    return 'Night';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'upcoming': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600 font-semibold';
      case 'upcoming': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getHandoverStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 border-green-200 text-green-700';
      case 'pending': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'bg-red-50 border-red-200 text-red-700';
      case 'watcher': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'stable': return 'bg-green-50 border-green-200 text-green-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Mobile Dashboard - Compact and efficient
  if (isMobile) {
    return (
      <div className="min-h-full">
        <div className="space-y-3 p-4 pb-6">
          {/* Mobile Header - Compact */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground">Schedule</h1>
              {onChangeSetup && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onChangeSetup}
                  className="text-muted-foreground hover:text-foreground p-2"
                  title="Change setup"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getShiftTime()} Shift</span>
              </div>
              <span>•</span>
              <span>{unit}</span>
              <span>•</span>
              <span>{myPatients.length} patients assigned</span>
            </div>
          </div>

          {/* Today Schedule - Compact */}
          <Card className="medical-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Today Schedule
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative">
                <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-hidden">
                  {todaySchedule.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 py-1">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`text-xs font-medium px-2 py-1 rounded-md ${getTimeColor(item.status)}`}>
                          {item.time}
                        </div>
                        {index < todaySchedule.length - 1 && (
                          <div className="w-px h-4 bg-border mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground leading-tight">{item.title}</h4>
                            <p className="text-xs text-muted-foreground leading-tight">{item.description}</p>
                          </div>
                          <Badge variant="outline" className={`text-xs whitespace-nowrap ${getStatusColor(item.status)}`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Handovers - Compact */}
          <Card className="medical-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Upcoming Handovers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {upcomingHandovers.map((handover) => (
                  <div key={handover.id} className="p-3 border border-border/50 rounded-lg bg-muted/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs font-medium">
                            {handover.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground leading-tight">{handover.nextShiftDoctor}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{handover.shiftType} • {handover.nextShiftTime}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getHandoverStatusColor(handover.status)}`}>
                        {handover.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Patients to handover:</p>
                      {handover.patientsToHandover.map((patient, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <span className="text-foreground">{patient.name} • {patient.room}</span>
                          <Badge variant="outline" className={`text-xs ${getSeverityColor(patient.severity)}`}>
                            {patient.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Desktop Dashboard - Optimized spacing and density
  return (
    <div className="space-y-4">
      {/* Header - Compact and professional */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Schedule
          </h1>
          
          {onChangeSetup && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onChangeSetup}
              className="text-muted-foreground hover:text-foreground gap-2"
              title="Change setup"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Setup</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{getShiftTime()} Shift</span>
          </div>
          <span>•</span>
          <span>{unit}</span>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{myPatients.length} patients assigned</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Optimized spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Schedule - Compact layout */}
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today Schedule
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-start gap-3 py-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`text-sm font-medium px-2 py-1 rounded-md ${getTimeColor(item.status)}`}>
                      {item.time}
                    </div>
                    {index < todaySchedule.length - 1 && (
                      <div className="w-px h-5 bg-border mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground leading-snug">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs whitespace-nowrap ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Handovers - Compact layout */}
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Upcoming Handovers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingHandovers.map((handover) => (
                <div key={handover.id} className="p-3 border border-border/50 rounded-lg bg-muted/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="text-sm font-medium">
                          {handover.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground leading-snug">{handover.nextShiftDoctor}</p>
                        <p className="text-sm text-muted-foreground leading-snug">{handover.shiftType} • {handover.nextShiftTime}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getHandoverStatusColor(handover.status)}`}>
                      {handover.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Patients to handover:</p>
                    <div className="space-y-1">
                      {handover.patientsToHandover.map((patient, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border/30">
                          <span className="text-sm text-foreground">{patient.name} • {patient.room}</span>
                          <Badge variant="outline" className={`text-xs ${getSeverityColor(patient.severity)}`}>
                            {patient.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}