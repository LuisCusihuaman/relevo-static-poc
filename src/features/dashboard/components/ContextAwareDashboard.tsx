import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, AlertTriangle, Activity, MessageSquare, FileText, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DoctorContext {
  id: string;
  name: string;
  role: string;
  unit: string;
  shift: string;
  assignedPatients: number[];
}

interface UnitStatus {
  name: string;
  capacity: number;
  occupied: number;
  critical: number;
  staffOnDuty: number;
  lastHandover: string;
}

export function ContextAwareDashboard() {
  const [currentDoctor] = useState<DoctorContext>({
    id: 'dr_chen_001',
    name: 'Dr. Sarah Chen',
    role: 'Pediatric ICU Attending',
    unit: 'PICU',
    shift: 'Morning (08:00-16:00)',
    assignedPatients: [1, 2, 3, 5]
  });

  const [unitStatus] = useState<UnitStatus>({
    name: 'Pediatric ICU',
    capacity: 12,
    occupied: 9,
    critical: 3,
    staffOnDuty: 8,
    lastHandover: '08:00 AM Today'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingTasks = [
    { time: '10:00', task: 'Handover session with Dr. Torres', priority: 'high' },
    { time: '11:30', task: 'Family meeting - Room PICU-01', priority: 'medium' },
    { time: '14:00', task: 'Review discharge plans', priority: 'low' },
    { time: '15:30', task: 'Medication rounds', priority: 'medium' }
  ];

  const recentActivity = [
    { time: '15 min ago', activity: 'Updated care plan for Maria Rodriguez', user: 'Dr. Sarah Chen' },
    { time: '23 min ago', activity: 'New comment on Carlos Gonzalez handover', user: 'Dr. Michael Torres' },
    { time: '1 hour ago', activity: 'Completed discharge documentation', user: 'Dr. Lisa Park' },
    { time: '2 hours ago', activity: 'Started collaborative handover session', user: 'Dr. Sarah Chen' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Welcome back, {currentDoctor.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>{currentDoctor.role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentDoctor.shift}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {unitStatus.name} Unit
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Assigned Patients */}
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-primary mb-1">
                {currentDoctor.assignedPatients.length}
              </div>
              <div className="text-sm text-muted-foreground">Assigned Patients</div>
            </div>

            {/* Unit Capacity */}
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-foreground mb-1">
                {unitStatus.occupied}/{unitStatus.capacity}
              </div>
              <div className="text-sm text-muted-foreground">Unit Capacity</div>
            </div>

            {/* Critical Patients */}
            <div className="bg-destructive/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-destructive mb-1">
                {unitStatus.critical}
              </div>
              <div className="text-sm text-muted-foreground">Critical Status</div>
            </div>

            {/* Staff on Duty */}
            <div className="bg-chart-2/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-chart-2 mb-1">
                {unitStatus.staffOnDuty}
              </div>
              <div className="text-sm text-muted-foreground">Staff on Duty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="text-sm font-medium text-primary min-w-[3rem]">
                    {task.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.task}</p>
                  </div>
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.activity}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span className="font-medium">{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Unit Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {unitStatus.name} Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Unit Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Patients:</span>
                  <span className="font-medium">{unitStatus.occupied}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available Beds:</span>
                  <span className="font-medium">{unitStatus.capacity - unitStatus.occupied}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Staff Members:</span>
                  <span className="font-medium">{unitStatus.staffOnDuty}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Handover Schedule</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Handover:</span>
                  <span className="font-medium">{unitStatus.lastHandover}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Handover:</span>
                  <span className="font-medium">16:00 PM Today</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="text-xs">Normal Operations</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Start Handover
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Team Chat
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}