import type { SyncStatus } from '@/common/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  AlertCircle,
  Edit, Plus,
  Send,
  Trash2,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Enhanced collaborator with typing indicators
interface Collaborator {
  id: number;
  name: string;
  initials: string;
  color: string;
  role: string;
  isTyping?: boolean;
  lastSeen?: string;
}

interface ContingencyPlan {
  id: number;
  condition: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'planned';
  submittedBy: string;
  submittedTime: string;
  submittedDate: string;
}

interface SituationAwarenessProps {
  collaborators?: Collaborator[];
  onOpenThread?: (section: string) => void;
  focusMode?: boolean;
  fullscreenMode?: boolean;
  autoEdit?: boolean;
  onRequestFullscreen?: () => void;
  hideControls?: boolean; // NEW PROP to hide internal save/done buttons
  onSave?: () => void; // Handler for external save button
  syncStatus?: SyncStatus;
  onSyncStatusChange?: (status: SyncStatus) => void;
  currentUser?: {
    name: string;
    initials: string;
    role: string;
  };
  assignedPhysician?: {
    name: string;
    initials: string;
    role: string;
  };
}

export function SituationAwareness({ 
  collaborators = [], 
  onOpenThread,
  focusMode = false,
  fullscreenMode = false,
  autoEdit = false,
  onRequestFullscreen,
  hideControls = false, // Default to false for backwards compatibility
  onSave, // External save handler
  syncStatus = 'synced',
  onSyncStatusChange,
  currentUser = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' },
  assignedPhysician = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' }
}: SituationAwarenessProps) {
  // Live situation documentation (collaborative)
  const [currentSituation, setCurrentSituation] = useState(`CURRENT STATUS - 16:30
• Patient stable, responding well to current interventions
• Heart rate stabilized at 82 bpm, blood pressure 128/76
• Oxygen saturation maintaining 96% on 2L nasal cannula
• Patient reports decreased shortness of breath since morning
• Ambulating with assistance, appetite improving

MONITORING PRIORITIES:
□ Hourly urine output monitoring - target >30ml/hr
□ Daily weight monitoring for fluid balance
□ Respiratory rate and oxygen requirements
□ Pain assessment q4h - current pain 3/10
□ Continue cardiac monitoring overnight

NOTES FROM TEAM:
• 14:30 - Cardiology reviewed echo results, EF improved to 40%
• 15:15 - PT evaluation completed, cleared for discharge planning
• 16:00 - Family meeting scheduled for tomorrow 10:00
• 16:15 - Evening nurse briefed on care plan

GOALS FOR NEXT SHIFT:
□ Continue diuretic therapy - monitor electrolytes
□ Advance activity as tolerated
□ Finalize discharge planning with case manager
□ Patient education on heart failure management completed`);

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [lastEdit, setLastEdit] = useState(new Date());
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Auto-start editing when in fullscreen with autoEdit
  useEffect(() => {
    if (fullscreenMode && autoEdit) {
      setIsEditing(true);
    }
  }, [fullscreenMode, autoEdit]);

  // Contingency plans
  const [contingencyPlans, setContingencyPlans] = useState<ContingencyPlan[]>([
    {
      id: 1,
      condition: "Patient experiences increased shortness of breath or O2 sat drops below 92%",
      action: "Increase oxygen to 4L, obtain arterial blood gas, notify physician immediately, prepare for possible BiPAP",
      priority: "high",
      status: "active",
      submittedBy: "Dr. Johnson",
      submittedTime: "14:20",
      submittedDate: "Today"
    },
    {
      id: 2,
      condition: "Urine output decreases to less than 20ml/hr for 2 consecutive hours",
      action: "Check catheter patency, review fluid balance, obtain creatinine and BUN, consider nephrology consult",
      priority: "medium",
      status: "active",
      submittedBy: "Dr. Martinez",
      submittedTime: "15:45",
      submittedDate: "Today"
    },
    {
      id: 3,
      condition: "Blood pressure drops below 90/60 or patient shows signs of hypotension",
      action: "Hold diuretics, fluid bolus 250ml NS, reassess in 30 minutes, notify attending physician",
      priority: "high",
      status: "planned",
      submittedBy: "Dr. Rodriguez",
      submittedTime: "16:10",
      submittedDate: "Today"
    }
  ]);

  // New plan form state
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    condition: '',
    action: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user can delete plans (only assigned physician)
  const canDeletePlans = currentUser.name === assignedPhysician.name;

  // Handle situation documentation changes with auto-save simulation
  const handleSituationChange = (value: string) => {
    setCurrentSituation(value);
    setLastEdit(new Date());
    setAutoSaveStatus('saving');
    
    // Simulate auto-save after user stops typing
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  };

  // Submit new contingency plan
  const handleSubmitPlan = () => {
    if (!newPlan.condition || !newPlan.action) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const plan: ContingencyPlan = {
        id: Date.now(),
        condition: newPlan.condition.trim(),
        action: newPlan.action.trim(),
        priority: newPlan.priority as 'low' | 'medium' | 'high',
        status: 'active',
        submittedBy: currentUser.name,
        submittedTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        submittedDate: 'Today'
      };
      
      setContingencyPlans(prev => [...prev, plan]);
      setNewPlan({ condition: '', action: '', priority: 'medium' });
      setShowNewPlanForm(false);
      setIsSubmitting(false);
    }, 500);
  };

  // Delete contingency plan (only assigned physician can delete)
  const handleDeletePlan = (planId: number) => {
    if (!canDeletePlans) return;
    setContingencyPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitPlan();
    }
  };

  // Handle click for editing or fullscreen - SIMPLIFIED FOR SINGLE CLICK
  const handleClick = () => {
    if (focusMode) return;
    
    if (fullscreenMode) {
      // If in fullscreen, just start editing
      setIsEditing(true);
    } else if (onRequestFullscreen) {
      // If not in fullscreen, go to fullscreen with auto-edit
      onRequestFullscreen();
    } else {
      // Fallback to regular editing
      setIsEditing(true);
    }
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 border-red-200';
      case 'medium': return 'text-amber-600 border-amber-200';
      case 'low': return 'text-emerald-600 border-emerald-200';
      default: return 'text-gray-600 border-gray-200';
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'planned': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Optimized height for fullscreen
  const contentHeight = fullscreenMode ? 'min-h-[60vh]' : 'h-80';

  return (
    <div className="space-y-0">
      {/* Live Situation Documentation - Optimized Border Radius */}
      <div className="space-y-4">
        {isEditing ? (
          /* Editing Mode - No top border radius */
          <div className="relative">
            <div className={`bg-white border-2 border-blue-200 ${fullscreenMode ? 'rounded-lg' : 'rounded-t-none rounded-b-none'}`}>
              {/* Enhanced Editor Header with top rounded corners */}
              <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-25/50 ${fullscreenMode ? 'rounded-t-lg' : 'rounded-t-lg'}`}>
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-medium text-blue-800">
                    {fullscreenMode ? 'Current Situation - Fullscreen Editor' : 'Current Situation'}
                  </h4>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      autoSaveStatus === 'saved' ? 'bg-green-500' :
                      autoSaveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-blue-600">
                      {autoSaveStatus === 'saved' ? 'Saved' :
                       autoSaveStatus === 'saving' ? 'Saving...' : 'Error'}
                    </span>
                  </div>
                  {/* ONLY SHOW DONE BUTTON IF NOT HIDING CONTROLS */}
                  {!hideControls && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-blue-600 hover:bg-blue-100 h-7 px-2"
                    >
                      Done
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Fixed Height Document Content Area - no border radius */}
              <div className={`relative ${contentHeight}`}>
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <Textarea
                      value={currentSituation}
                      onChange={(e) => handleSituationChange(e.target.value)}
                      className={`w-full h-full ${fullscreenMode ? 'min-h-[60vh]' : 'min-h-[320px]'} border-0 bg-transparent p-0 resize-none text-gray-900 leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none`}
                      placeholder="Document the current patient situation - everyone can contribute!

CURRENT STATUS - [Time]
• Write current clinical status and observations
• Note any changes since last update
• Include vital signs trends and patient response

MONITORING PRIORITIES:
□ List key monitoring points
□ Add checkboxes for nursing tasks
□ Note frequency of assessments

NOTES FROM TEAM:
• Team member observations and updates
• Include timestamps and initials
• Real-time communication during handover

GOALS FOR NEXT SHIFT:
□ Clear objectives for receiving team
□ Specific targets and milestones
□ Discharge planning considerations"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: fullscreenMode ? '16px' : '14px',
                        lineHeight: '1.6',
                        background: 'transparent !important'
                      }}
                      autoFocus={fullscreenMode || autoEdit}
                    />
                  </div>
                </ScrollArea>
              </div>
              
              {/* Auto-Save Status Footer - no bottom rounded corners */}
              <div className={`flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-25/30 ${fullscreenMode ? 'rounded-b-lg' : ''}`}>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{currentSituation.split('\n').length} lines</span>
                  <span>{currentSituation.split(' ').length} words</span>
                  {!hideControls && <span>Auto-saving</span>}
                  {hideControls && <span>Use fullscreen controls to save</span>}
                </div>
                <span className="text-xs text-gray-500">3 people editing</span>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode - No top border radius */
          <div className="relative group">
            <div 
              className={`bg-white ${fullscreenMode ? 'rounded-lg' : 'rounded-t-none rounded-b-none'} transition-all duration-200 ${!focusMode ? 'cursor-pointer' : ''}`}
              onClick={handleClick}
            >
              {/* Enhanced Header with top rounded corners */}
              <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-25/50 ${fullscreenMode ? 'rounded-t-lg' : 'rounded-t-lg'}`}>
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-medium text-blue-700">
                      {fullscreenMode ? 'Current Situation - Fullscreen View' : 'Current Situation'}
                    </h4>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Users className="w-3 h-3 mr-1" />
                      All can edit
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Active</span>
                </div>
              </div>
              
              {/* Fixed Height Document Content - no border radius */}
              <div className={`relative ${contentHeight}`}>
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div 
                      className="text-gray-900 leading-relaxed whitespace-pre-line"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: fullscreenMode ? '16px' : '14px',
                        lineHeight: '1.6'
                      }}
                    >
                      {currentSituation}
                    </div>
                  </div>
                </ScrollArea>
              </div>
              
              {/* Document Footer - no bottom rounded corners */}
              <div className={`flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-25/30 ${fullscreenMode ? 'rounded-b-lg' : ''}`}>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{currentSituation.split('\n').length} lines</span>
                  <span>{currentSituation.split(' ').length} words</span>
                  <span>Last updated by Dr. Rodriguez</span>
                </div>
                {!focusMode && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Edit className="w-3 h-3" />
                      <span>Click to edit</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Separator integrated as border - no gap */}
      {!fullscreenMode && <div className="border-t border-gray-200"></div>}

      {/* Submitted Contingency Plans - Clean Final Display */}
      {!fullscreenMode && (
        <div className="space-y-4 pt-6 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Active Contingency Plans</h4>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {contingencyPlans.filter(p => p.status === 'active').length} active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {contingencyPlans.filter(p => p.status === 'planned').length} planned
              </Badge>
            </div>
          </div>

          {/* Clean Submitted Plans List */}
          <div className="space-y-3">
            {contingencyPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all group"
              >
                <div className="space-y-3">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`text-xs px-2 py-1 rounded border font-medium ${getPriorityColor(plan.priority)}`}>
                        {plan.priority.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge 
                          className={`text-xs border ${getStatusBadge(plan.status)} mb-2`}
                        >
                          {plan.status === 'active' ? 'Active' : 'Planned'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Delete button - Only for assigned physician */}
                    {!focusMode && canDeletePlans && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Clean IF/THEN Content - Final Version */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-sm font-medium text-gray-700 flex-shrink-0">IF:</span>
                      <span className="text-sm text-gray-900">{plan.condition}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-sm font-medium text-gray-700 flex-shrink-0">THEN:</span>
                      <span className="text-sm text-gray-900">{plan.action}</span>
                    </div>
                  </div>
                  
                  {/* Plan Footer - Submitted info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>Submitted by {plan.submittedBy} at {plan.submittedTime}</span>
                    <span>{plan.submittedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Plan - Submit-Based Workflow */}
          {!focusMode && !showNewPlanForm ? (
            <Button
              variant="outline"
              onClick={() => setShowNewPlanForm(true)}
              className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contingency Plan
            </Button>
          ) : (!focusMode && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-25">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">New Contingency Plan</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewPlanForm(false)}
                    className="h-6 w-6 p-0"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      IF (Condition):
                    </label>
                    <Textarea
                      value={newPlan.condition}
                      onChange={(e) => setNewPlan({...newPlan, condition: e.target.value})}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., If patient temperature rises above 38.5°C..."
                      className="min-h-[60px] border-gray-300 focus:border-blue-400 focus:ring-blue-100 bg-white"
                      autoFocus
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      THEN (Action):
                    </label>
                    <Textarea
                      value={newPlan.action}
                      onChange={(e) => setNewPlan({...newPlan, action: e.target.value})}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., Obtain blood cultures, notify physician immediately..."
                      className="min-h-[60px] border-gray-300 focus:border-blue-400 focus:ring-blue-100 bg-white"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Priority:
                    </label>
                    <select
                      value={newPlan.priority}
                      onChange={(e) => setNewPlan({...newPlan, priority: e.target.value})}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-400 focus:ring-blue-100"
                      disabled={isSubmitting}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewPlanForm(false)}
                    className="text-xs border-gray-300 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitPlan}
                    disabled={!newPlan.condition || !newPlan.action || isSubmitting}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        Submit Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}