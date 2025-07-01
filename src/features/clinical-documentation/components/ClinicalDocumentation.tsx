import { useState, useEffect, useRef } from 'react';
import { X, Save, ChevronUp, ChevronDown, Eye, Target, AlertTriangle, Plus, Clock, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/input';

// Import centralized composable types
import { type ClinicalPatient, type QuickAction, type IPassBlock } from '../../../common/types';

interface ClinicalDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
  patients: ClinicalPatient[];
  doctorName: string;
  selectedPatientId?: number;
  defaultType?: string;
}

// Icon resolver utility
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    AlertTriangle,
    Eye,
    Target
  };
  
  return iconMap[iconName] || Eye; // Fallback to Eye icon
};

// Severity Assessment Options
const severityOptions = [
  {
    id: 'stable',
    name: 'Stable',
    description: 'Patient condition is stable with minimal intervention needed',
    color: 'bg-green-50 border-green-200 text-green-700',
    icon: CheckCircle
  },
  {
    id: 'guarded',
    name: 'Guarded', 
    description: 'Patient requires close monitoring with potential for change',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    icon: AlertTriangle
  },
  {
    id: 'unstable',
    name: 'Unstable',
    description: 'Patient condition is unstable requiring immediate intervention',
    color: 'bg-red-50 border-red-200 text-red-700',
    icon: AlertTriangle
  },
  {
    id: 'critical',
    name: 'Critical',
    description: 'Patient in critical condition requiring urgent care',
    color: 'bg-red-100 border-red-300 text-red-800',
    icon: AlertTriangle
  }
];

// Task priorities
const taskPriorities = [
  { id: 'high', name: 'HIGH', color: 'bg-red-50 border-red-200 text-red-700' },
  { id: 'medium', name: 'MEDIUM', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { id: 'low', name: 'LOW', color: 'bg-blue-50 border-blue-200 text-blue-700' }
];

// Contingency plan priorities and statuses
const contingencyPriorities = [
  { id: 'high', name: 'HIGH', color: 'bg-red-50 border-red-200 text-red-700' },
  { id: 'medium', name: 'MEDIUM', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { id: 'low', name: 'LOW', color: 'bg-blue-50 border-blue-200 text-blue-700' }
];

const contingencyStatuses = [
  { id: 'active', name: 'Active', color: 'bg-green-50 border-green-200 text-green-700' },
  { id: 'planned', name: 'Planned', color: 'bg-blue-50 border-blue-200 text-blue-700' }
];

// I-PASS blocks - Updated with Contingency Planning
const ipassBlocks: IPassBlock[] = [
  {
    id: 'illness_severity',
    name: 'Illness Severity',
    shortName: 'Severity',
    icon: 'AlertTriangle',
    color: 'bg-red-50 border-red-200 text-red-700',
    placeholder: '',
    quickActions: []
  },
  {
    id: 'contingency_planning',
    name: 'Contingency Planning',
    shortName: 'Planning',
    icon: 'Eye',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    placeholder: '',
    quickActions: []
  },
  {
    id: 'action_list',
    name: 'Action List',
    shortName: 'Actions',
    icon: 'Target',
    color: 'bg-green-50 border-green-200 text-green-700',
    placeholder: '',
    quickActions: []
  }
];

interface Task {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'done';
  timestamp: string;
  assignedBy: string;
  timing?: string;
  isReadOnly?: boolean; // For existing medical tasks
}

interface ContingencyPlan {
  id: string;
  condition: string; // IF part
  action: string; // THEN part
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'planned';
  timestamp: string;
  submittedBy: string;
  isReadOnly?: boolean; // For existing medical plans
}

export function ClinicalDocumentation({ 
  isOpen, 
  onClose, 
  patients, 
  doctorName, 
  selectedPatientId, 
  defaultType = 'action_list' // Changed default to action_list
}: ClinicalDocumentationProps) {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(selectedPatientId || (patients.length > 0 ? patients[0].id : null));
  const [activeBlock, setActiveBlock] = useState(defaultType);
  const [showPatientSheet, setShowPatientSheet] = useState(false);
  
  // Structured data states
  const [selectedSeverity, setSelectedSeverity] = useState<string>('stable');
  
  // Tasks with read-only property for existing medical tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      text: 'Follow up on blood culture results from yesterday - patient spiked fever at 02:00',
      priority: 'high',
      status: 'pending',
      timestamp: '02:15',
      assignedBy: 'Dr. Park',
      timing: 'Before rounds',
      isReadOnly: true // Existing medical task - read-only
    },
    {
      id: '2',
      text: 'Cardiology consult for new murmur detected during admission',
      priority: 'medium',
      status: 'pending',
      timestamp: '23:45',
      assignedBy: 'Dr. Kim',
      timing: 'Today',
      isReadOnly: true // Existing medical task - read-only
    },
    {
      id: '3',
      text: 'Review chest X-ray results and adjust oxygen therapy accordingly',
      priority: 'high',
      status: 'pending',
      timestamp: '11:15',
      assignedBy: 'Dr. Martinez',
      timing: 'Evening rounds',
      isReadOnly: true // Existing medical task - read-only
    },
    {
      id: '4',
      text: 'Monitor urine output closely - patient had decreased output this afternoon',
      priority: 'high',
      status: 'pending',
      timestamp: '15:30',
      assignedBy: 'Nurse Clara',
      timing: 'Q2H checks',
      isReadOnly: true // Existing medical task - read-only
    },
    {
      id: '5',
      text: 'Discuss discharge planning with family - daughter will be here at 14:00',
      priority: 'medium',
      status: 'done',
      timestamp: '09:30',
      assignedBy: 'Dr. Johnson',
      timing: '',
      isReadOnly: true // Existing medical task - read-only
    }
  ]);

  // Contingency Plans State
  const [contingencyPlans, setContingencyPlans] = useState<ContingencyPlan[]>([
    {
      id: '1',
      condition: 'Patient experiences increased shortness of breath or O2 sat drops below 92%',
      action: 'Increase oxygen to 4L, obtain arterial blood gas, notify physician immediately, prepare for possible BiPAP',
      priority: 'high',
      status: 'active',
      timestamp: '14:20',
      submittedBy: 'Dr. Johnson',
      isReadOnly: true
    },
    {
      id: '2',
      condition: 'Urine output decreases to less than 20ml/hr for 2 consecutive hours',
      action: 'Check catheter patency, review fluid balance, obtain creatinine and BUN, consider nephrology consult',
      priority: 'medium',
      status: 'active',
      timestamp: '15:45',
      submittedBy: 'Dr. Martinez',
      isReadOnly: true
    },
    {
      id: '3',
      condition: 'Blood pressure drops below 90/60 or patient shows signs of hypotension',
      action: 'Hold diuretics, fluid bolus 250ml NS, reassess in 30 minutes, notify attending physician',
      priority: 'high',
      status: 'planned',
      timestamp: '16:10',
      submittedBy: 'Dr. Rodriguez',
      isReadOnly: true
    }
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  // New contingency plan states - CHANGED: Form is now open by default for fast writing
  const [showNewContingencyForm, setShowNewContingencyForm] = useState(true);
  const [newContingencyCondition, setNewContingencyCondition] = useState('');
  const [newContingencyAction, setNewContingencyAction] = useState('');
  const [newContingencyPriority, setNewContingencyPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newContingencyStatus, setNewContingencyStatus] = useState<'active' | 'planned'>('active');

  // Auto-focus for text areas only
  useEffect(() => {
    // No auto-focus needed for structured interfaces
  }, [isOpen, activeBlock]);

  const currentBlock = ipassBlocks.find(b => b.id === activeBlock);
  const currentPatient = patients.find(p => p.id === selectedPatient);

  const handleSave = () => {
    console.log('Saving I-PASS documentation:', {
      patientId: selectedPatient,
      type: activeBlock,
      severity: activeBlock === 'illness_severity' ? selectedSeverity : null,
      contingencyPlans: activeBlock === 'contingency_planning' ? contingencyPlans : null,
      tasks: activeBlock === 'action_list' ? tasks : null,
      author: doctorName
    });
    onClose();
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        priority: newTaskPriority,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        assignedBy: doctorName,
        isReadOnly: false // User-created task - can be modified/deleted
      };
      setTasks([newTask, ...tasks]);
      setNewTaskText('');
    }
  };

  const handleToggleTask = (taskId: string) => {
    // Only allow toggling for non-readonly tasks
    setTasks(tasks.map(task => 
      task.id === taskId && !task.isReadOnly
        ? { ...task, status: task.status === 'pending' ? 'done' : 'pending' }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    // Only allow deletion of non-readonly tasks (user-created)
    setTasks(tasks.filter(task => task.id !== taskId || task.isReadOnly));
  };

  const handleAddContingencyPlan = () => {
    if (newContingencyCondition.trim() && newContingencyAction.trim()) {
      const newPlan: ContingencyPlan = {
        id: Date.now().toString(),
        condition: newContingencyCondition.trim(),
        action: newContingencyAction.trim(),
        priority: newContingencyPriority,
        status: newContingencyStatus,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        submittedBy: doctorName,
        isReadOnly: false
      };
      setContingencyPlans([newPlan, ...contingencyPlans]);
      setNewContingencyCondition('');
      setNewContingencyAction('');
      // Keep form open for additional entries
      // setShowNewContingencyForm(false); // Removed this line to keep form open
    }
  };

  const handleDeleteContingencyPlan = (planId: string) => {
    // Only allow deletion of non-readonly plans (user-added)
    setContingencyPlans(contingencyPlans.filter(plan => plan.id !== planId || plan.isReadOnly));
  };

  const getPatientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'bg-red-50 border-red-200/60';
      case 'watcher': return 'bg-yellow-50 border-yellow-200/60';
      case 'stable': return 'bg-green-50 border-green-200/60';
      default: return 'bg-muted/30 border-border/40';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'Unstable';
      case 'watcher': return 'Watcher';
      case 'stable': return 'Stable';
      default: return 'Unknown';
    }
  };

  const getSeverityIndicator = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'border-l-red-500 bg-red-50/50';
      case 'watcher': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'stable': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-border bg-muted/20';
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const doneTasks = tasks.filter(t => t.status === 'done');
  
  const activeContingencyPlans = contingencyPlans.filter(p => p.status === 'active');
  const plannedContingencyPlans = contingencyPlans.filter(p => p.status === 'planned');

  const renderContent = () => {
    switch (activeBlock) {
      case 'illness_severity':
        return (
          <div className="h-full flex flex-col">
            {/* Current Assessment - Keep at top for reference */}
            <div className="flex-shrink-0 p-3 md:p-6 pb-0">
              <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-green-800">Current Assessment: Stable</h3>
                      <span className="text-xs text-green-600">Set by DJ • Just now</span>
                    </div>
                    <p className="text-sm text-green-700">Patient condition is stable with minimal intervention needed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer to push severity selection to bottom */}
            <div className="flex-1"></div>

            {/* Update Severity Assessment - FIXED AT BOTTOM for finger-friendly access */}
            <div className="flex-shrink-0 p-3 md:p-6 pt-0">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">Update Severity Assessment</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {severityOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedSeverity(option.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 min-h-[80px] touch-target ${
                          selectedSeverity === option.id
                            ? `${option.color} border-current shadow-sm`
                            : 'bg-background border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{option.name}</h4>
                            <p className="text-xs leading-relaxed">{option.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'contingency_planning':
        return (
          <div className="h-full flex flex-col">
            {/* Clean Header Area without counter */}
            <div className="flex-shrink-0 bg-background z-10 sticky top-0">
              <div className="p-3 md:p-6 pb-0">
                <div className="mb-8 bg-background py-2">
                  <h3 className="text-base font-semibold text-foreground">Active Contingency Plans</h3>
                </div>
              </div>
            </div>

            {/* Scrollable Contingency Plans List - Takes remaining space */}
            <div className="flex-1 min-h-0 px-3 md:px-6">
              <ScrollArea className="h-full">
                <div className="space-y-4 pb-4">
                  {/* Active Plans */}
                  {activeContingencyPlans.length > 0 && (
                    <div className="space-y-3">
                      {activeContingencyPlans.map((plan) => {
                        const priority = contingencyPriorities.find(p => p.id === plan.priority);
                        const status = contingencyStatuses.find(s => s.id === plan.status);
                        return (
                          <div key={plan.id} className="p-4 bg-background border border-border/50 rounded-lg">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                {priority && (
                                  <Badge variant="outline" className={`text-xs ${priority.color}`}>
                                    {priority.name}
                                  </Badge>
                                )}
                                {status && (
                                  <Badge variant="outline" className={`text-xs ${status.color}`}>
                                    {status.name}
                                  </Badge>
                                )}
                              </div>
                              {!plan.isReadOnly && (
                                <button
                                  onClick={() => handleDeleteContingencyPlan(plan.id)}
                                  className="text-muted-foreground hover:text-red-600 transition-colors touch-target"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">IF:</h4>
                                <p className="text-sm text-foreground leading-relaxed">{plan.condition}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">THEN:</h4>
                                <p className="text-sm text-foreground leading-relaxed">{plan.action}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                              <span className="text-xs text-muted-foreground">Today</span>
                              <span className="text-xs text-muted-foreground">Submitted by {plan.submittedBy} at {plan.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Planned Plans */}
                  {plannedContingencyPlans.length > 0 && (
                    <div className="space-y-3">
                      {plannedContingencyPlans.map((plan) => {
                        const priority = contingencyPriorities.find(p => p.id === plan.priority);
                        const status = contingencyStatuses.find(s => s.id === plan.status);
                        return (
                          <div key={plan.id} className="p-4 bg-muted/20 border border-border/30 rounded-lg opacity-90">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                {priority && (
                                  <Badge variant="outline" className={`text-xs ${priority.color} opacity-75`}>
                                    {priority.name}
                                  </Badge>
                                )}
                                {status && (
                                  <Badge variant="outline" className={`text-xs ${status.color}`}>
                                    {status.name}
                                  </Badge>
                                )}
                              </div>
                              {!plan.isReadOnly && (
                                <button
                                  onClick={() => handleDeleteContingencyPlan(plan.id)}
                                  className="text-muted-foreground hover:text-red-600 transition-colors touch-target"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">IF:</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{plan.condition}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">THEN:</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{plan.action}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                              <span className="text-xs text-muted-foreground">Today</span>
                              <span className="text-xs text-muted-foreground">Submitted by {plan.submittedBy} at {plan.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Add New Contingency Plan Section with clear boundaries */}
            <div className="flex-shrink-0 bg-background border-t border-border/20">
              <div className="p-3 md:p-6 mt-4">
                {!showNewContingencyForm ? (
                  <button
                    onClick={() => setShowNewContingencyForm(true)}
                    className="w-full p-4 border-2 border-dashed border-border/50 rounded-lg text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200 touch-target"
                    style={{ minHeight: '44px' }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">New Contingency Plan</span>
                    </div>
                  </button>
                ) : (
                  <div className="p-4 bg-muted/20 rounded-lg border border-border/50 space-y-4">
                    {/* Header with properly positioned close button */}
                    <div className="flex items-start justify-between gap-6 pb-2 border-b border-border/30">
                      <h4 className="text-sm font-semibold text-foreground">New Contingency Plan</h4>
                      <button
                        onClick={() => {
                          setShowNewContingencyForm(false);
                          setNewContingencyCondition('');
                          setNewContingencyAction('');
                        }}
                        className="text-muted-foreground hover:text-foreground touch-target p-2 -m-2 rounded-md"
                        style={{ minHeight: '44px', minWidth: '44px' }}
                        title="Close form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">IF (Condition):</label>
                        <Textarea
                          value={newContingencyCondition}
                          onChange={(e) => setNewContingencyCondition(e.target.value)}
                          placeholder="e.g., If patient temperature rises above 38.5°C..."
                          className="text-sm resize-none"
                          style={{ fontSize: '16px', minHeight: '60px' }}
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">THEN (Action):</label>
                        <Textarea
                          value={newContingencyAction}
                          onChange={(e) => setNewContingencyAction(e.target.value)}
                          placeholder="e.g., Obtain blood cultures, notify physician immediately..."
                          className="text-sm resize-none"
                          style={{ fontSize: '16px', minHeight: '60px' }}
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Priority:</span>
                            {contingencyPriorities.map((priority) => (
                              <button
                                key={priority.id}
                                onClick={() => setNewContingencyPriority(priority.id as any)}
                                className={`px-2 py-1 rounded text-xs font-medium border transition-colors touch-target ${
                                  newContingencyPriority === priority.id
                                    ? priority.color
                                    : 'bg-background border-border/50 text-muted-foreground hover:text-foreground'
                                }`}
                                style={{ minHeight: '32px' }}
                              >
                                {priority.name}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Status:</span>
                            {contingencyStatuses.map((status) => (
                              <button
                                key={status.id}
                                onClick={() => setNewContingencyStatus(status.id as any)}
                                className={`px-2 py-1 rounded text-xs font-medium border transition-colors touch-target ${
                                  newContingencyStatus === status.id
                                    ? status.color
                                    : 'bg-background border-border/50 text-muted-foreground hover:text-foreground'
                                }`}
                                style={{ minHeight: '32px' }}
                              >
                                {status.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleAddContingencyPlan}
                          size="sm"
                          disabled={!newContingencyCondition.trim() || !newContingencyAction.trim()}
                          className="text-xs touch-target"
                          style={{ minHeight: '44px' }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'action_list':
        return (
          <div className="h-full flex flex-col">
            {/* Header with Stats - Fixed at top */}
            <div className="flex-shrink-0 p-3 md:p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">Action List</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-blue-600 font-medium">{pendingTasks.length} pending</span>
                  <span className="text-green-600 font-medium">{doneTasks.length} done</span>
                </div>
              </div>

              {/* Shift Persistence Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Tasks persist across shifts - Read-only view of existing tasks</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">You can add new tasks and delete only those you create</p>
              </div>
            </div>

            {/* Scrollable Tasks List - Takes remaining space */}
            <div className="flex-1 min-h-0 px-3 md:px-6">
              <ScrollArea className="h-full">
                <div className="space-y-4 pb-4">
                  {/* Pending Tasks */}
                  {pendingTasks.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Circle className="w-4 h-4" />
                          Pending
                        </h4>
                        <span className="text-xs text-muted-foreground">{pendingTasks.length} active</span>
                      </div>
                      <div className="space-y-2">
                        {pendingTasks.map((task) => {
                          const priority = taskPriorities.find(p => p.id === task.priority);
                          return (
                            <div key={task.id} className={`p-3 border rounded-lg ${
                              task.isReadOnly 
                                ? 'bg-muted/20 border-border/30 opacity-75' 
                                : 'bg-background border-border/50'
                            }`}>
                              <div className="flex items-start gap-3">
                                {/* Show circle button for read-only tasks but make it non-interactive */}
                                <div className="mt-0.5">
                                  {task.isReadOnly ? (
                                    <Circle className="w-4 h-4 text-muted-foreground/50" />
                                  ) : (
                                    <button
                                      onClick={() => handleToggleTask(task.id)}
                                      className="text-muted-foreground hover:text-foreground touch-target"
                                    >
                                      <Circle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className={`text-sm leading-relaxed ${
                                      task.isReadOnly ? 'text-muted-foreground' : 'text-foreground'
                                    }`}>
                                      {task.text}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      {priority && (
                                        <Badge variant="outline" className={`text-xs ${priority.color} ${
                                          task.isReadOnly ? 'opacity-60' : ''
                                        }`}>
                                          {priority.name}
                                        </Badge>
                                      )}
                                      {!task.isReadOnly && (
                                        <button
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="text-muted-foreground hover:text-red-600 transition-colors touch-target"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{task.timing || 'Today'}</span>
                                    <span>{task.assignedBy} • {task.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Completed Tasks */}
                  {doneTasks.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </h4>
                        <span className="text-xs text-muted-foreground">{doneTasks.length} done</span>
                      </div>
                      <div className="space-y-2">
                        {doneTasks.map((task) => {
                          const priority = taskPriorities.find(p => p.id === task.priority);
                          return (
                            <div key={task.id} className="p-3 bg-muted/20 border border-border/30 rounded-lg opacity-75">
                              <div className="flex items-start gap-3">
                                {/* Show check circle for completed tasks but make read-only non-interactive */}
                                <div className="mt-0.5">
                                  {task.isReadOnly ? (
                                    <CheckCircle className="w-4 h-4 text-green-600/50" />
                                  ) : (
                                    <button
                                      onClick={() => handleToggleTask(task.id)}
                                      className="text-green-600 touch-target"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-sm text-muted-foreground line-through leading-relaxed">{task.text}</p>
                                    <div className="flex items-center gap-2">
                                      {priority && (
                                        <Badge variant="outline" className={`text-xs ${priority.color} opacity-60`}>
                                          {priority.name}
                                        </Badge>
                                      )}
                                      {!task.isReadOnly && (
                                        <button
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="text-muted-foreground hover:text-red-600 transition-colors touch-target"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{task.timing || 'Completed'}</span>
                                    <span>{task.assignedBy} • {task.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Add New Task - FIXED AT BOTTOM for finger-friendly access */}
            <div className="flex-shrink-0 p-3 md:p-6 pt-0">
              <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                <div className="space-y-3">
                  <Input
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add new task or action item..."
                    className="text-sm touch-target"
                    style={{ fontSize: '16px', minHeight: '44px' }} // Prevent iOS zoom and ensure touch target
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Priority:</span>
                      {taskPriorities.map((priority) => (
                        <button
                          key={priority.id}
                          onClick={() => setNewTaskPriority(priority.id as any)}
                          className={`px-2 py-1 rounded text-xs font-medium border transition-colors touch-target ${
                            newTaskPriority === priority.id
                              ? priority.color
                              : 'bg-background border-border/50 text-muted-foreground hover:text-foreground'
                          }`}
                          style={{ minHeight: '32px' }} // Smaller touch target for secondary actions
                        >
                          {priority.name}
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={handleAddTask}
                      size="sm"
                      disabled={!newTaskText.trim()}
                      className="text-xs touch-target"
                      style={{ minHeight: '44px' }} // Ensure primary action touch target
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Mobile-Optimized Layout with Real Mobile Constraints
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-full max-w-none m-0 p-0 bg-background border-0 rounded-none md:max-w-5xl md:w-[85vw] md:h-[65vh] md:max-h-[65vh] md:m-auto md:border md:border-border/20 md:rounded-xl md:shadow-lg [&>button]:hidden"
        style={{ 
          // Mobile: Full dynamic viewport height with safe area support
          height: '100dvh',
          maxHeight: '100dvh'
        }}
        aria-describedby="clinical-doc-description"
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>I-PASS Clinical Documentation</DialogTitle>
            <DialogDescription id="clinical-doc-description">
              Create and edit structured clinical documentation using the I-PASS protocol for patient handover.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Mobile Safe Area Container with Enhanced Layout */}
        <div 
          className="h-full grid grid-rows-[1fr_auto_auto] md:grid-rows-[auto_1fr_auto] md:grid-cols-[200px_1fr] overflow-hidden"
          style={{
            // Enhanced mobile safe area support
            paddingTop: 'max(env(safe-area-inset-top), 12px)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)'
          }}
        >
          
          {/* Enhanced Mobile Close Button - Always Accessible */}
          <div className="md:hidden fixed z-50" 
               style={{
                 top: 'max(env(safe-area-inset-top), 12px)',
                 right: 'max(env(safe-area-inset-right), 12px)'
               }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-10 w-10 p-0 bg-background/95 backdrop-blur-lg border border-border/50 shadow-lg hover:bg-muted/80 rounded-xl touch-target"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Desktop Header Only */}
          <div className="hidden md:block bg-background border-b border-border/20 md:col-span-full flex-shrink-0">
            <div className="px-4 py-3 border-b border-border/10">
              <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-4">
                {/* Patient Info */}
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  {currentPatient && (
                    <>
                      <Avatar className={`w-8 h-8 border ${getSeverityColor(currentPatient.illnessSeverity)}`}>
                        <AvatarFallback className="text-xs font-semibold">
                          {getPatientInitials(currentPatient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground leading-tight">{currentPatient.name}</div>
                        <div className="text-xs text-muted-foreground leading-tight">{currentPatient.room}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-border/30"></div>

                {/* I-PASS Blocks - Now 3 blocks with Planning */}
                <div className="grid grid-cols-3 gap-1">
                  {ipassBlocks.map((block) => {
                    const IconComponent = getIconComponent(block.icon);
                    return (
                      <button
                        key={block.id}
                        onClick={() => setActiveBlock(block.id)}
                        className={`grid grid-cols-[auto_auto] items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                          activeBlock === block.id
                            ? 'bg-primary/8 border-primary/25 text-primary shadow-sm'
                            : 'border-border/20 text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-border/40'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{block.shortName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Close Button */}
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Quick Actions Sidebar - Empty for structured interfaces */}
          <div className="hidden md:block border-r border-border/15 bg-muted/8 p-4 flex-shrink-0">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Interface</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Structured medical documentation</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentBlock?.name} uses a structured interface optimized for medical workflows.
            </div>
          </div>

          {/* Main Content Area - FIXED HEIGHT AND FLEX LAYOUT */}
          <div className="min-h-0 overflow-hidden bg-background">
            {renderContent()}
          </div>

          {/* Mobile Bottom Navigation - Touch Optimized - Now 3 blocks */}
          <div className="md:hidden bg-background border-t border-border/15 flex-shrink-0">
            <div className="px-3 py-2">
              <ScrollArea className="w-full">
                <div className="grid grid-cols-3 gap-2 pb-1">
                  {ipassBlocks.map((block) => {
                    const IconComponent = getIconComponent(block.icon);
                    return (
                      <button
                        key={block.id}
                        onClick={() => setActiveBlock(block.id)}
                        className={`grid grid-cols-[auto_auto] items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border touch-target ${
                          activeBlock === block.id
                            ? block.color
                            : 'bg-background/50 border-border/20 text-muted-foreground hover:text-foreground hover:bg-background/80'
                        }`}
                        style={{ minHeight: '44px' }} // Ensure touch target size
                      >
                        <IconComponent className="w-3 h-3" />
                        <span>{block.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Enhanced Footer - Touch Optimized */}
          <div className="bg-background border-t border-border/15 md:col-span-full flex-shrink-0">
            {/* Mobile Footer - Enhanced Touch Targets */}
            <div className="md:hidden p-3">
              <div className="grid gap-3">
                <div className="grid grid-cols-[1fr] gap-3 items-center">
                  {/* Professional Patient Selector - Enhanced Touch */}
                  <button
                    onClick={() => setShowPatientSheet(true)}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 border-l-4 rounded-lg hover:bg-muted/30 transition-all duration-200 touch-target ${
                      currentPatient ? getSeverityIndicator(currentPatient.illnessSeverity) : 'border-l-border bg-muted/20'
                    }`}
                    style={{ minHeight: '44px' }} // Ensure touch target size
                  >
                    {currentPatient && (
                      <>
                        <div className="text-left">
                          <div className="text-xs font-medium text-muted-foreground">Room</div>
                          <div className="text-sm font-semibold text-foreground">{currentPatient.room}</div>
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <div className="font-semibold text-sm text-foreground truncate leading-tight">{currentPatient.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight">{getSeverityText(currentPatient.illnessSeverity)} Patient</div>
                        </div>
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      </>
                    )}
                  </button>
                </div>

                {/* Save Row - Enhanced Touch */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="text-xs text-muted-foreground font-medium">
                    {currentBlock?.name} updated • {doctorName}
                  </div>
                  
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm px-4 py-3 text-sm font-semibold touch-target"
                    style={{ minHeight: '44px' }} // Ensure touch target size
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Documentation
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block px-6 py-3">
              <div className="grid grid-cols-[1fr_auto] items-center gap-6">
                <div className="text-xs text-muted-foreground font-medium">
                  {currentBlock?.name} updated • {doctorName}
                </div>
                
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-sm px-5 py-2 text-sm font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Patient Selection Sheet - Mobile Optimized */}
        {showPatientSheet && (
          <div className="absolute inset-0 z-50 grid grid-rows-[1fr_auto]">
            <div 
              className="bg-black/20 backdrop-blur-sm"
              onClick={() => setShowPatientSheet(false)}
            />
            
            <div 
              className="bg-background/95 backdrop-blur-md border-t border-border/20 rounded-t-2xl max-h-[60vh] grid grid-rows-[auto_1fr] shadow-xl"
              style={{
                // Ensure sheet respects safe areas
                paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)'
              }}
            >
              <div className="p-4 border-b border-border/10 grid grid-cols-[1fr_auto] items-center gap-3">
                <h3 className="text-sm font-semibold text-foreground">Select Patient</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPatientSheet(false)}
                  className="p-2 h-10 w-10 text-muted-foreground hover:text-foreground touch-target"
                  style={{ minHeight: '44px' }} // Ensure touch target size
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="">
                <div className="p-3 grid gap-2">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient.id);
                        setShowPatientSheet(false);
                      }}
                      className={`w-full p-4 border-l-4 rounded-lg hover:bg-background/80 transition-all duration-200 text-left touch-target ${
                        selectedPatient === patient.id 
                          ? `${getSeverityIndicator(patient.illnessSeverity)} border-r border-r-primary/20` 
                          : getSeverityIndicator(patient.illnessSeverity)
                      }`}
                      style={{ minHeight: '60px' }} // Larger touch target for patient selection
                    >
                      <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                        {/* Professional Room Identification */}
                        <div className="text-center">
                          <div className="text-xs font-medium text-muted-foreground">Room</div>
                          <div className="text-sm font-semibold text-foreground">{patient.room}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground mb-1 leading-tight">{patient.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight">{getSeverityText(patient.illnessSeverity)} Patient</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}