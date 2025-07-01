import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Clock, User, AlertCircle, ArrowRight, Calendar, Users } from 'lucide-react';

interface DailyWorkflowProps {
  currentUser: {
    name: string;
    role: string;
    shift: string;
    initials: string;
  };
  onSetupComplete?: () => void;
}

export function DailyWorkflow({ currentUser, onSetupComplete }: DailyWorkflowProps) {
  const [selectedPatients, setSelectedPatients] = useState<string[]>(['MR-001', 'MR-003']);
  const [workflowSetup, setWorkflowSetup] = useState(false);

  // Available patients for assignment
  const availablePatients = [
    {
      id: 'MR-001',
      name: 'Maria Rodriguez',
      room: '302A',
      age: 72,
      condition: 'COPD Exacerbation',
      severity: 'stable',
      handoverStatus: 'active',
      nextHandover: '19:00',
      team: 'Internal Medicine'
    },
    {
      id: 'MR-002',
      name: 'John Smith',
      room: '305B',
      age: 58,
      condition: 'Post-op Recovery',
      severity: 'stable',
      handoverStatus: 'pending',
      nextHandover: '19:00',
      team: 'Surgery'
    },
    {
      id: 'MR-003',
      name: 'Anna Chen',
      room: '308C',
      age: 45,
      condition: 'Diabetes Management',
      severity: 'guarded',
      handoverStatus: 'completed',
      nextHandover: '07:00 (tomorrow)',
      team: 'Endocrinology'
    },
    {
      id: 'MR-004',
      name: 'Robert Johnson',
      room: '311A',
      age: 67,
      condition: 'Cardiac Monitoring',
      severity: 'unstable',
      handoverStatus: 'urgent',
      nextHandover: '17:30',
      team: 'Cardiology'
    }
  ];

  // Shift schedule information
  const shiftSchedule = {
    current: 'Day Shift (07:00 - 19:00)',
    next: 'Evening Shift (19:00 - 07:00)',
    changeTime: '19:00',
    timeRemaining: '2h 15min'
  };

  // Active handovers requiring attention
  const activeHandovers = availablePatients.filter(p => 
    selectedPatients.includes(p.id) && ['active', 'urgent'].includes(p.handoverStatus)
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'guarded': return 'bg-yellow-100 text-yellow-800';
      case 'unstable': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHandoverStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePatientToggle = (patientId: string) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const startWorkflow = () => {
    setWorkflowSetup(true);
    onSetupComplete?.();
  };

  if (workflowSetup) {
    return (
      <div className="space-y-6">
        {/* Daily Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Today's Workflow - {new Date().toLocaleDateString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">My Patients</h4>
                <p className="text-2xl font-bold text-blue-600">{selectedPatients.length}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Active Handovers</h4>
                <p className="text-2xl font-bold text-orange-600">{activeHandovers.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Next Shift</h4>
                <p className="text-lg font-bold text-green-600">{shiftSchedule.timeRemaining}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Handovers */}
        {activeHandovers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Urgent Handovers Requiring Attention</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeHandovers.map((patient) => (
                  <div key={patient.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-red-100 text-red-600">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className={getSeverityColor(patient.severity)}>
                          {patient.severity.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-600">Due: {patient.nextHandover}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Patient List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>My Assigned Patients</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setWorkflowSetup(false)}>
                Modify Assignment
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availablePatients
                .filter(p => selectedPatients.includes(p.id))
                .map((patient) => (
                  <div key={patient.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{patient.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {patient.room}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(patient.severity)}>
                            {patient.severity}
                          </Badge>
                          <Badge className={getHandoverStatusColor(patient.handoverStatus)}>
                            {patient.handoverStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">Next: {patient.nextHandover}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Daily Workflow Setup</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Welcome, {currentUser.name}. Set up your patient assignments for today.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Shift Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">{shiftSchedule.current}</h4>
              <p className="text-sm text-blue-700">
                Next shift change: {shiftSchedule.changeTime} ({shiftSchedule.timeRemaining} remaining)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">{currentUser.role}</p>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentUser.shift}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Patient Assignment */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Select Your Patients for Today</h4>
          <div className="space-y-3">
            {availablePatients.map((patient) => (
              <div key={patient.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={selectedPatients.includes(patient.id)}
                  onCheckedChange={() => handlePatientToggle(patient.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{patient.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {patient.room}
                          </Badge>
                          <span className="text-sm text-gray-500">Age {patient.age}</span>
                        </div>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(patient.severity)}>
                          {patient.severity}
                        </Badge>
                        <Badge className={getHandoverStatusColor(patient.handoverStatus)}>
                          {patient.handoverStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">Next handover: {patient.nextHandover}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedPatients.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Today's Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-700">Total Patients: {selectedPatients.length}</p>
                <p className="text-green-700">
                  Active Handovers: {availablePatients.filter(p => 
                    selectedPatients.includes(p.id) && ['active', 'urgent'].includes(p.handoverStatus)
                  ).length}
                </p>
              </div>
              <div>
                <p className="text-green-700">
                  Pending: {availablePatients.filter(p => 
                    selectedPatients.includes(p.id) && p.handoverStatus === 'pending'
                  ).length}
                </p>
                <p className="text-green-700">Next shift change: {shiftSchedule.timeRemaining}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <Button 
            onClick={startWorkflow}
            disabled={selectedPatients.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Today's Workflow
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}