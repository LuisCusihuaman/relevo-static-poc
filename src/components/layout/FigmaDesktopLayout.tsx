import { useState } from 'react';
import { Plus, Users, Clock, AlertTriangle, FileText, Target, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import types
import { type DesktopPatient } from '../../common/types';

interface FigmaDesktopLayoutProps {
  patients?: DesktopPatient[];
  currentDoctor: string;
  unit: string;
  shift: string;
  onCommandPalette: () => void;
  onStartHandover: (patientId?: number) => void;
  onPatientHandover: (patientId: number) => void;
}

// Simplified Action Items - More realistic
const actionItems = [
  {
    id: 1,
    patient: 'Maria Rodriguez',
    room: 'PICU-01',
    title: 'Respiratory therapy consultation',
    description: 'Evaluate O2 requirements and weaning potential',
    priority: 'high',
    status: 'pending',
    timeframe: 'Within 2 hours',
    assignedTo: 'Dr. Martinez',
    assignedInitials: 'DM',
    completed: false
  },
  {
    id: 2,
    patient: 'Carlos Gonzalez',
    room: 'PICU-03',
    title: 'Monitor O2 saturation',
    description: 'Check q2h, maintain SpO2 >92%',
    priority: 'high',
    status: 'active',
    timeframe: 'Every 2 hours',
    assignedTo: 'Nursing Team',
    assignedInitials: 'NT',
    completed: false
  },
  {
    id: 3,
    patient: 'Ana Silva',
    room: 'PICU-05',
    title: 'Family meeting - discharge planning',
    description: 'Discuss timeline and home care needs',
    priority: 'medium',
    status: 'scheduled',
    timeframe: 'Tomorrow 2 PM',
    assignedTo: 'Dr. Wilson',
    assignedInitials: 'DW',
    completed: false
  },
  {
    id: 4,
    patient: 'David Kim',
    room: 'PICU-07',
    title: 'Social work consultation',
    description: 'Assess discharge needs and home safety',
    priority: 'medium',
    status: 'completed',
    timeframe: 'Completed 1h ago',
    assignedTo: 'Social Worker',
    assignedInitials: 'SW',
    completed: true
  }
];

// Recent Activity - For right sidebar
const recentUpdates = [
  {
    id: 1,
    type: 'Clinical summary updated',
    timestamp: '11:39 AM',
    author: 'fwefewewewf',
    details: 'Updated patient overview and current medications'
  },
  {
    id: 2,
    type: 'Action items reviewed',
    timestamp: '10:15 AM',
    author: 'Dr. Martinez',
    details: 'Reviewed respiratory therapy consultation status'
  },
  {
    id: 3,
    type: 'Severity assessment updated',
    timestamp: '9:42 AM',
    author: 'Nursing Team',
    details: 'Patient condition assessment and monitoring updates'
  },
  {
    id: 4,
    type: 'Medication review completed',
    timestamp: '8:30 AM',
    author: 'Dr. Wilson',
    details: 'Reviewed current medication list and dosages'
  },
  {
    id: 5,
    type: 'Lab results reviewed',
    timestamp: '7:15 AM',
    author: 'Dr. Chen',
    details: 'Morning lab results analysis and documentation'
  },
  {
    id: 6,
    type: 'Family communication',
    timestamp: '6:45 AM',
    author: 'Social Worker',
    details: 'Updated family on patient status and discharge planning'
  }
];

// Clinical Summary Content (I-PASS: P - Patient Summary)
const clinicalSummaryText = `72-year-old female with acute COPD exacerbation, admitted 3 days ago for increased dyspnea and productive cough. Patient has been responding well to bronchodilator therapy and systemic corticosteroids.

Past Medical History: COPD (moderate to severe), Hypertension, Type 2 Diabetes Mellitus, Former smoker (quit 5 years ago)

Current medications showing good response. Patient ambulating with minimal assistance and oxygen requirements have decreased from 4L to 2L over past 24 hours.

Social History: Lives with daughter, Independent in ADLs prior to admission, No advance directives on file

Physical Exam: Alert and oriented x3, Respiratory: Decreased breath sounds bilaterally, mild expiratory wheeze, Cardiovascular: Regular rate and rhythm, No acute distress currently

Hospital Course:
Day 1: Admitted with acute respiratory distress, started on bronchodilators and systemic steroids
Day 2: Improved oxygen saturation, reduced oxygen requirements
Day 3: Continued improvement, ambulating with assistance, preparing for discharge planning

Treatment Plan: Continue current therapy, taper steroids as tolerated, PT evaluation for discharge readiness.`;

// Illness Severity Assessment Content (I-PASS: I)
const illnessSeverityText = `Patient is currently stable but requires close monitoring due to respiratory status changes.

Vital Signs: BP 128/82, HR 88, RR 18, SpO2 94% on 2L O2, Temp 98.6°F

Recent Changes: O2 requirements reduced from 4L to 2L over past 24h. Increased mobility and appetite noted.

Concerns: Watch for signs of respiratory fatigue. Monitor SpO2 closely during activity.

Current Interventions: Bronchodilators q4h, corticosteroids tapering, chest physiotherapy BID.

Assessment: Patient stable, O2 requirements reduced to 2L, vitals stable...`;

// Situation Awareness & Contingency Content (I-PASS: S)
const situationAwarenessText = `Contingency Plans and Situation Awareness:

If respiratory distress develops:
• Increase O2 to 4L, assess for nebulizer treatment
• Consider chest X-ray if symptoms worsen
• Call respiratory therapy for evaluation

Discharge Planning:
• Patient education on inhaler technique
• Home O2 assessment if needed
• Follow-up with pulmonology in 1 week

What to Watch For:
• Decreased SpO2 <90% despite increased O2
• Increased work of breathing or accessory muscle use
• Changes in mental status or increased fatigue

Key Phone Numbers:
• Respiratory Therapy: ext 4521
• Pulmonology Fellow: ext 3892

Contingency plans for respiratory distress, discharge planning in progress...`;

export function FigmaDesktopLayout({
  patients = [],
  currentDoctor,
  unit,
  shift,
  onCommandPalette,
  onStartHandover,
  onPatientHandover
}: FigmaDesktopLayoutProps) {
  // Safe array operations with fallbacks
  const safePatients = Array.isArray(patients) ? patients : [];
  const [selectedPatient, setSelectedPatient] = useState<DesktopPatient | null>(
    safePatients.length > 0 ? safePatients[0] : null
  );
  const [actionItemsState, setActionItemsState] = useState(actionItems);
  
  // Progressive disclosure states
  const [clinicalSummaryExpanded, setClinicalSummaryExpanded] = useState(false);
  const [illnessSeverityExpanded, setIllnessSeverityExpanded] = useState(true);
  const [situationAwarenessExpanded, setSituationAwarenessExpanded] = useState(false);

  const getPatientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'Critical';
      case 'watcher': return 'Watch';
      case 'stable': return 'Stable';
      default: return 'Unknown';
    }
  };

  // Much more subtle, professional medical colors - barely visible dots
  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'bg-neutral-400/40';    // Very subtle neutral with slight tint
      case 'watcher': return 'bg-neutral-400/35';     // Very subtle neutral with slight tint
      case 'stable': return 'bg-neutral-400/30';      // Very subtle neutral with slight tint
      default: return 'bg-neutral-300/50';
    }
  };

  // Much more muted text colors - professional neutral grays
  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'text-neutral-600';     // Neutral gray (no red)
      case 'watcher': return 'text-neutral-600';      // Neutral gray (no amber) 
      case 'stable': return 'text-neutral-600';       // Neutral gray (no green)
      default: return 'text-neutral-500';
    }
  };

  const getSeverityUrgency = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'high';
      case 'watcher': return 'medium';
      case 'stable': return 'low';
      default: return 'low';
    }
  };

  const handleActionToggle = (actionId: number) => {
    setActionItemsState(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { 
              ...action, 
              completed: !action.completed,
              status: !action.completed ? 'completed' : 'pending'
            } 
          : action
      )
    );
  };

  // Calculate severity counts
  const severityCounts = safePatients.reduce((acc, patient) => {
    if (patient && patient.illnessSeverity) {
      acc[patient.illnessSeverity] = (acc[patient.illnessSeverity] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get critical information for selected patient
  const getCriticalInfo = (patient: DesktopPatient | null) => {
    if (!patient) return null;
    
    const urgency = getSeverityUrgency(patient.illnessSeverity);
    const hasAlerts = patient.alerts && patient.alerts > 0;
    
    return {
      needsAttention: urgency === 'high' || hasAlerts,
      nextAction: urgency === 'high' ? 'Monitor closely' : urgency === 'medium' ? 'Check in 2h' : 'Routine care',
      timeframe: urgency === 'high' ? 'Immediate' : urgency === 'medium' ? '2 hours' : '4-6 hours'
    };
  };

  // Early return for no patients
  if (!safePatients || safePatients.length === 0) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Patients Available</h3>
          <p className="text-muted-foreground">Please check your patient data or contact support.</p>
        </div>
      </div>
    );
  }

  const criticalInfo = getCriticalInfo(selectedPatient);
  const pendingActions = actionItemsState.filter(a => !a.completed).length;
  const highPriorityActions = actionItemsState.filter(a => !a.completed && a.priority === 'high').length;

  return (
    <div className="h-full bg-background">
      {/* Simplified Header - Focus on Critical Info */}
      <div className="border-b border-border/20 bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {selectedPatient ? selectedPatient.name : 'Patient Overview'}
                </h1>
                {selectedPatient && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getSeverityDot(selectedPatient.illnessSeverity)}`} />
                      <span className="text-sm text-muted-foreground">{getSeverityText(selectedPatient.illnessSeverity)}</span>
                    </div>
                    {criticalInfo?.needsAttention && (
                      <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-700">
                        Needs Attention
                      </Badge>
                    )}
                  </>
                )}
              </div>
              {selectedPatient && (
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span><strong>Room:</strong> {selectedPatient.room}</span>
                  <span><strong>Age:</strong> {selectedPatient.age}</span>
                  <span><strong>MRN:</strong> A211370</span>
                  <span><strong>Diagnosis:</strong> {selectedPatient.primaryDiagnosis}</span>
                  {criticalInfo && (
                    <span className="text-primary"><strong>Next:</strong> {criticalInfo.nextAction} ({criticalInfo.timeframe})</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => selectedPatient && onStartHandover(selectedPatient.id)}
                className="bg-primary hover:bg-primary/90"
              >
                Start Handover
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout - Correct I-PASS Structure */}
      <div className="flex h-[calc(100vh-140px)]">
        
        {/* Left Sidebar - Much More Subtle Status Colors */}
        <div className="w-80 border-r border-border/20 bg-background">
          <div className="p-4 border-b border-border/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Patients</h3>
              <Badge variant="outline" className="text-xs">{safePatients.length}</Badge>
            </div>
            
            {/* Much More Subtle Priority Summary - Professional Medical Style */}
            <div className="flex items-center gap-4 p-3 bg-neutral-50/30 rounded-lg border border-border/20">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/40" />
                <span className="text-sm font-medium text-neutral-600">
                  {severityCounts.unstable || 0} Critical
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/35" />
                <span className="text-sm font-medium text-neutral-600">
                  {severityCounts.watcher || 0} Watch
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/30" />
                <span className="text-sm font-medium text-neutral-600">
                  {severityCounts.stable || 0} Stable
                </span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {/* Sort patients by severity - unstable first */}
              {safePatients
                .sort((a, b) => {
                  const severityOrder = { 'unstable': 0, 'watcher': 1, 'stable': 2 };
                  return severityOrder[a.illnessSeverity] - severityOrder[b.illnessSeverity];
                })
                .map((patient) => {
                  if (!patient || !patient.id) return null;
                  
                  const isSelected = selectedPatient?.id === patient.id;
                  const urgency = getSeverityUrgency(patient.illnessSeverity);
                  
                  return (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 border ${
                        isSelected
                          ? 'border-primary/30 bg-primary/5 shadow-sm'
                          : 'border-border/20 hover:bg-neutral-50/50 hover:border-border/40'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header - Room + Severity + Alert */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-semibold bg-primary/10 border-primary/20 text-primary px-2 py-0.5">
                              {patient.room || 'N/A'}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getSeverityDot(patient.illnessSeverity || 'stable')}`} />
                          </div>
                          {patient.alerts && patient.alerts > 0 && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>

                        {/* Patient Name - Larger and More Prominent */}
                        <div className="font-semibold text-sm text-foreground">
                          {patient.name || 'Unknown Patient'}
                        </div>

                        {/* Patient Info Row - Using Much More Subtle Colors */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Age {patient.age || 'N/A'}
                          </div>
                          <div className={`text-xs font-medium ${getSeverityTextColor(patient.illnessSeverity || 'stable')}`}>
                            {getSeverityText(patient.illnessSeverity || 'stable')}
                          </div>
                        </div>

                        {/* Show diagnosis for critical patients or when selected */}
                        {(urgency === 'high' || isSelected) && (
                          <div className="text-xs text-foreground/80 leading-relaxed">
                            {patient.primaryDiagnosis && patient.primaryDiagnosis.length > 45 
                              ? `${patient.primaryDiagnosis.substring(0, 45)}...` 
                              : patient.primaryDiagnosis || 'No diagnosis available'
                            }
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Correct I-PASS Framework Structure */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            
            {/* Clinical Summary (I-PASS: P - Patient Summary) */}
            <Collapsible open={clinicalSummaryExpanded} onOpenChange={setClinicalSummaryExpanded}>
              <div className="border-b border-border/10 bg-background">
                <CollapsibleTrigger asChild>
                  <div className="p-4 hover:bg-muted/20 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <h3 className="font-semibold text-foreground">Clinical Summary</h3>
                        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                          I-PASS: P
                        </Badge>
                        <Badge variant="outline" className="text-xs">Read-Only</Badge>
                        <Badge variant="outline" className="text-xs">Last updated 11:39 AM</Badge>
                      </div>
                      {clinicalSummaryExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Show preview when collapsed */}
                    {!clinicalSummaryExpanded && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        72-year-old female with acute COPD exacerbation, responding well to treatment...
                      </div>
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <div className="mb-3 text-xs text-muted-foreground">
                      <span>To edit this summary, use </span>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs underline"
                        onClick={() => selectedPatient && onStartHandover(selectedPatient.id)}
                      >
                        Start Handover
                      </Button>
                      <span> or mobile I-PASS documentation</span>
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto scrollbar-medical border border-border/20 rounded-lg">
                      <div className="p-3 text-sm text-foreground leading-relaxed">
                        <p className="whitespace-pre-wrap">{clinicalSummaryText}</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Current Situation (I-PASS: I - Illness Severity Assessment) */}
            <Collapsible open={illnessSeverityExpanded} onOpenChange={setIllnessSeverityExpanded}>
              <div className="border-b border-border/10 bg-background">
                <CollapsibleTrigger asChild>
                  <div className="p-4 hover:bg-muted/20 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <h3 className="font-semibold text-foreground">Current Situation</h3>
                        <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
                          I-PASS: I
                        </Badge>
                        {criticalInfo?.needsAttention && (
                          <Badge className="bg-amber-50 border-amber-200 text-amber-700 text-xs">
                            Needs Attention
                          </Badge>
                        )}
                      </div>
                      {illnessSeverityExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Show preview when collapsed */}
                    {!illnessSeverityExpanded && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Patient stable, O2 requirements reduced to 2L, vitals stable...
                      </div>
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <div className="max-h-40 overflow-y-auto scrollbar-medical border border-border/20 rounded-lg">
                      <div className="p-3 text-sm text-foreground leading-relaxed">
                        <p className="whitespace-pre-wrap">{illnessSeverityText}</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* I-PASS Plans (I-PASS: S - Situation Awareness & Contingency) */}
            <Collapsible open={situationAwarenessExpanded} onOpenChange={setSituationAwarenessExpanded}>
              <div className="border-b border-border/10 bg-background">
                <CollapsibleTrigger asChild>
                  <div className="p-4 hover:bg-muted/20 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-yellow-600" />
                        <h3 className="font-semibold text-foreground">I-PASS Plans</h3>
                        <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700">
                          I-PASS: S
                        </Badge>
                      </div>
                      {situationAwarenessExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Show preview when collapsed */}
                    {!situationAwarenessExpanded && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Contingency plans for respiratory distress, discharge planning in progress...
                      </div>
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <div className="max-h-40 overflow-y-auto scrollbar-medical border border-border/20 rounded-lg">
                      <div className="p-3 text-sm text-foreground leading-relaxed">
                        <p className="whitespace-pre-wrap">{situationAwarenessText}</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Action List (I-PASS: A) - Scrollable at Bottom */}
            <div className="flex-1 bg-background">
              <div className="p-4 border-b border-border/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Action List</h3>
                    <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                      I-PASS: A
                    </Badge>
                    {pendingActions > 0 && (
                      <Badge className="bg-orange-50 border-orange-200 text-orange-700 text-xs">
                        {pendingActions} pending
                      </Badge>
                    )}
                    {highPriorityActions > 0 && (
                      <Badge className="bg-red-50 border-red-200 text-red-700 text-xs">
                        {highPriorityActions} urgent
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Action
                  </Button>
                </div>

                {/* Action Progress Summary */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{actionItemsState.filter(a => a.completed).length} completed</span>
                  <span>{pendingActions} remaining</span>
                  {highPriorityActions > 0 && (
                    <span className="text-red-600 font-medium">{highPriorityActions} urgent</span>
                  )}
                </div>
              </div>
              
              {/* Scrollable Action List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {actionItemsState.map((action) => (
                    <div 
                      key={action.id}
                      className="flex items-start gap-3 p-3 bg-background border border-border/30 rounded-lg hover:border-border/50 transition-colors"
                    >
                      <Checkbox 
                        checked={action.completed}
                        onCheckedChange={() => handleActionToggle(action.id)}
                        className="mt-1"
                      />

                      <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                        action.priority === 'high' ? 'bg-red-500' : 
                        action.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />

                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-foreground mb-1">{action.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {action.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {action.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {action.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{action.timeframe}</span>
                        </div>
                      </div>

                      <Avatar className="w-6 h-6 border border-border/30">
                        <AvatarFallback className="text-xs font-medium">
                          {action.assignedInitials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Recent Updates Timeline */}
        <div className="w-80 border-l border-border/20 bg-background">
          <div className="p-4 border-b border-border/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Recent Updates</h3>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {recentUpdates.map((update, index) => (
                <div key={update.id} className="relative">
                  {index < recentUpdates.length - 1 && (
                    <div className="absolute left-2 top-6 w-px h-6 bg-border/30" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary/30 mt-1.5 border border-background shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-foreground truncate">{update.type}</p>
                        <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {update.details.length > 60 ? `${update.details.substring(0, 60)}...` : update.details}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">
                        by {update.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}