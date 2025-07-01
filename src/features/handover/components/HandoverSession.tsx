import { useState, useEffect } from 'react';
import { X, Clock, Users, CheckCircle, ArrowRight, Save, Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Import consolidated data and types from patients store
import { 
  getHandoverPatients,
  mockCollaborators
} from '../../../store/patients.store';
import { type Patient } from '../../../common/types';

// Extended type for handover session that includes collaborator details
export interface PatientHandover extends Patient {
  collaboratorDetails?: Array<{
    name: string;
    role: string;
  }>;
  ipass: {
    illness: {
      severity: string;
      justification: string;
    };
    patientSummary: string;
    actionList: string[];
    situationAwareness: string[];
    synthesis: string;
  };
  alerts: Array<{
    level: 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
    description: string;
  }>;
  priority: 'high' | 'medium' | 'low';
}

interface HandoverSessionProps {
  onClose: () => void;
  selectedPatientId?: number | null; // Optional prop to start with specific patient
}

export function HandoverSession({ onClose, selectedPatientId }: HandoverSessionProps) {
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('illness');

  // Create mock handover data based on existing patients
  const createHandoverPatients = (): PatientHandover[] => {
    const basePatients = getHandoverPatients();
    
    return basePatients.map(patient => ({
      ...patient,
      // Convert collaborators count to actual collaborator objects
      collaboratorDetails: mockCollaborators[patient.id] ? 
        mockCollaborators[patient.id].map((name, index) => ({
          name,
          role: index === 0 ? 'Attending' : index === 1 ? 'Resident' : 'Nurse'
        })) : 
        [{ name: 'Dr. Unknown', role: 'Attending' }],
      
      // Add mock I-PASS data
      ipass: {
        illness: {
          severity: patient.illnessSeverity,
          justification: getIllnessJustification(patient.illnessSeverity, patient.diagnosis)
        },
        patientSummary: getPatientSummary(patient),
        actionList: getActionList(patient),
        situationAwareness: getSituationAwareness(patient),
        synthesis: ''
      },
      
      // Convert alerts to handover format
      alerts: patient.alerts.map(alert => ({
        level: alert.level,
        description: alert.alertCatalogItem.description
      })),
      
      // Ensure priority exists
      priority: patient.priority || 'medium'
    }));
  };

  const mockPatients: PatientHandover[] = createHandoverPatients();

  // Set initial patient if selectedPatientId is provided
  useEffect(() => {
    if (selectedPatientId) {
      const patientIndex = mockPatients.findIndex(p => p.id === selectedPatientId);
      if (patientIndex !== -1) {
        setCurrentPatientIndex(patientIndex);
      }
    }
  }, [selectedPatientId, mockPatients]);

  const currentPatient = mockPatients[currentPatientIndex];
  const completedCount = mockPatients.filter(p => p.status === 'complete').length;
  const progressPercentage = (completedCount / mockPatients.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Helper functions to generate mock I-PASS content
  function getIllnessJustification(severity: string, diagnosis: string): string {
    const justifications = {
      unstable: `Patient remains critically unstable due to ${diagnosis.split(' - ')[0]}. Requires continuous monitoring and potential intervention.`,
      watcher: `Patient shows concerning signs related to ${diagnosis.split(' - ')[0]}. Close monitoring required for potential deterioration.`,
      stable: `Patient is clinically stable with ${diagnosis.split(' - ')[0]}. Routine monitoring and standard care protocols.`
    };
    return justifications[severity as keyof typeof justifications] || justifications.stable;
  }

  function getPatientSummary(patient: Patient): string {
    return `${patient.age}-year-old patient admitted with ${patient.diagnosis}. Currently in ${patient.room}. ${patient.collaborators > 2 ? 'Complex case requiring multidisciplinary care.' : 'Standard care protocols in place.'}`;
  }

  function getActionList(patient: Patient): string[] {
    const actions = [
      'Continue current medication regimen',
      'Monitor vital signs every 4 hours',
      'Family education regarding condition'
    ];
    
    if (patient.illnessSeverity === 'unstable') {
      actions.unshift('Continuous cardiac monitoring', 'Hourly neurological assessments');
    }
    
    return actions;
  }

  function getSituationAwareness(patient: Patient): string[] {
    const awareness = [
      'If patient shows signs of deterioration, call attending immediately',
      'Family is aware of current condition and prognosis'
    ];
    
    if (patient.alerts.length > 0) {
      awareness.unshift('Multiple active alerts - review all precautions');
    }
    
    return awareness;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'stable': return 'bg-green-600 text-white';
      case 'watcher': return 'bg-yellow-600 text-white';
      case 'unstable': return 'bg-red-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'border-red-500 bg-red-50 text-red-700';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'INFORMATIONAL': return 'border-blue-500 bg-blue-50 text-blue-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const handleNextPatient = () => {
    if (currentPatientIndex < mockPatients.length - 1) {
      setCurrentPatientIndex(currentPatientIndex + 1);
      setActiveSection('illness');
    }
  };

  const handlePreviousPatient = () => {
    if (currentPatientIndex > 0) {
      setCurrentPatientIndex(currentPatientIndex - 1);
      setActiveSection('illness');
    }
  };

  // If no patients available, show message
  if (!currentPatient) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Patients Available</DialogTitle>
            <DialogDescription>
              No patients are currently scheduled for handover.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Handover Session</h1>
            <Badge variant="outline" className="px-3">
              I-PASS Format
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {completedCount} / {mockPatients.length}
              </span>
              <Progress value={progressPercentage} className="w-24" />
            </div>
            
            {/* Collaborators */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex -space-x-1">
                {(currentPatient.collaboratorDetails || []).map((collaborator, index) => (
                  <Avatar key={index} className="w-8 h-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Patient List Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium mb-4">Handover Patients ({mockPatients.length})</h3>
            <div className="space-y-2">
              {mockPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === currentPatientIndex
                      ? 'bg-primary text-primary-foreground'
                      : patient.status === 'complete'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentPatientIndex(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{patient.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {patient.room}
                      </Badge>
                    </div>
                    {patient.status === 'complete' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={patient.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {patient.priority}
                    </Badge>
                    {patient.alerts.filter(a => a.level === 'HIGH').length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {patient.alerts.filter(a => a.level === 'HIGH').length} alerts
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Patient Header */}
          <div className="border-b bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{currentPatient.name}</h2>
                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                  <span>MRN: {currentPatient.mrn}</span>
                  <span>•</span>
                  <span>Room: {currentPatient.room}</span>
                  <span>•</span>
                  <Badge className={getSeverityColor(currentPatient.ipass.illness.severity)}>
                    {currentPatient.ipass.illness.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousPatient}
                  disabled={currentPatientIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextPatient}
                  disabled={currentPatientIndex === mockPatients.length - 1}
                >
                  Next Patient
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Critical Alerts */}
            {currentPatient.alerts.filter(alert => alert.level === 'HIGH').length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-700">Critical Alerts</h4>
                </div>
                <div className="space-y-1">
                  {currentPatient.alerts.filter(alert => alert.level === 'HIGH').map((alert, index) => (
                    <div key={index} className="text-sm text-red-700">
                      • {alert.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* I-PASS Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="illness">Illness Severity</TabsTrigger>
                <TabsTrigger value="patient">Patient Summary</TabsTrigger>
                <TabsTrigger value="action">Action List</TabsTrigger>
                <TabsTrigger value="situation">Situation Awareness</TabsTrigger>
                <TabsTrigger value="synthesis">Synthesis</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="illness" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Illness Severity Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        {['stable', 'watcher', 'unstable'].map((severity) => (
                          <Badge
                            key={severity}
                            className={
                              currentPatient.ipass.illness.severity === severity
                                ? getSeverityColor(severity)
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {severity.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Clinical Justification</label>
                        <Textarea
                          value={currentPatient.ipass.illness.justification}
                          className="min-h-[100px]"
                          placeholder="Explain the clinical reasoning for the illness severity assessment..."
                          readOnly
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="patient" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={currentPatient.ipass.patientSummary}
                        className="min-h-[150px]"
                        placeholder="Brief patient summary including key diagnoses, treatments, and current status..."
                        readOnly
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="action" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Action List</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPatient.ipass.actionList.map((action, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p>{action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="situation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Situation Awareness & Contingency Planning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPatient.ipass.situationAwareness.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <p>{item}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="synthesis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Synthesis by Receiver</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={currentPatient.ipass.synthesis}
                        className="min-h-[120px]"
                        placeholder="Receiving provider's summary and understanding of the handover..."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}