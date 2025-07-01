import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, CheckSquare, Users, Clock, ShieldCheck,
  Save, AlertCircle, ThumbsUp, FileText, User, Lock,
  Target, Activity, AlertTriangle, Plus, Eye, UserCheck,
  CheckCircle2, Circle, XCircle
} from 'lucide-react';

interface SynthesisByReceiverProps {
  onOpenThread?: (section: string) => void;
  onComplete?: (completed: boolean) => void;
  focusMode?: boolean;
  currentUser?: {
    name: string;
    initials: string;
    role: string;
  };
  receivingPhysician?: {
    name: string;
    initials: string;
    role: string;
  };
}

export function SynthesisByReceiver({ 
  onOpenThread, 
  onComplete, 
  focusMode = false,
  currentUser = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' },
  receivingPhysician = { name: 'Dr. Patel', initials: 'SP', role: 'Evening Attending' }
}: SynthesisByReceiverProps) {
  // Confirmation checklist items
  const [confirmationItems, setConfirmationItems] = useState([
    {
      id: 'illness-severity',
      label: 'I understand the patient\'s current illness severity and stability',
      description: 'Patient condition, monitoring requirements, and severity assessment',
      checked: false,
      required: true
    },
    {
      id: 'clinical-background',
      label: 'I have reviewed the clinical background and patient history',
      description: 'Medical history, allergies, code status, and baseline information',
      checked: false,
      required: true
    },
    {
      id: 'action-items',
      label: 'I acknowledge all pending action items and tasks',
      description: 'Outstanding orders, pending results, and scheduled interventions',
      checked: false,
      required: true
    },
    {
      id: 'contingency-plans',
      label: 'I understand the contingency plans and potential complications',
      description: 'If-then scenarios, escalation triggers, and emergency protocols',
      checked: false,
      required: true
    },
    {
      id: 'questions-answered',
      label: 'All my questions have been answered satisfactorily',
      description: 'Any clarifications or concerns have been addressed',
      checked: false,
      required: true
    },
    {
      id: 'accept-responsibility',
      label: 'I formally accept clinical responsibility for this patient',
      description: 'Official transfer of care and responsibility',
      checked: false,
      required: true,
      critical: true
    }
  ]);

  // Check if current user is the receiving physician
  const canConfirm = currentUser.name === receivingPhysician.name;
  
  // Calculate completion
  const completedItems = confirmationItems.filter(item => item.checked).length;
  const totalItems = confirmationItems.length;
  const isComplete = completedItems === totalItems;
  const completionProgress = (completedItems / totalItems) * 100;

  // Handle checkbox changes
  const handleItemChange = (itemId: string, checked: boolean) => {
    if (!canConfirm) return;
    
    setConfirmationItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, checked } : item
      )
    );
  };

  // Handle final confirmation
  const handleFinalConfirmation = () => {
    if (!canConfirm || !isComplete) return;
    
    // Mark handover as complete
    onComplete?.(true);
    console.log('Handover officially confirmed by', receivingPhysician.name);
  };

  // Notify parent of completion status changes
  useEffect(() => {
    onComplete?.(isComplete);
  }, [isComplete, onComplete]);

  return (
    <div className="space-y-6">
      {/* Receiving Physician Info */}
      <div className="flex items-center justify-between p-4 bg-purple-25 border border-purple-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border-2 border-purple-300">
            <AvatarFallback className="bg-purple-600 text-white">
              {receivingPhysician.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-purple-900">{receivingPhysician.name}</h4>
            <p className="text-sm text-purple-700">{receivingPhysician.role}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-purple-900">Receiving Physician</p>
          <p className="text-xs text-purple-700">Confirmation Required</p>
        </div>
      </div>

      {/* Permission Notice */}
      {!canConfirm && (
        <div className="p-4 bg-amber-25 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Only {receivingPhysician.name} can confirm this handover
            </span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            The receiving physician must formally accept responsibility before handover completion.
          </p>
        </div>
      )}

      {/* Progress Indicator */}
      {!focusMode && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Confirmation Progress</h4>
            <span className="text-sm text-gray-600">{completedItems} of {totalItems}</span>
          </div>
          <Progress value={completionProgress} className="h-2" />
          {isComplete && (
            <p className="text-sm text-green-600 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>All items confirmed - ready for final handover</span>
            </p>
          )}
        </div>
      )}

      {/* Confirmation Checklist */}
      {!focusMode && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-gray-600" />
            <span>Handover Confirmation Checklist</span>
          </h4>
          
          <div className="space-y-4">
            {confirmationItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg transition-all ${
                  item.checked 
                    ? 'border-green-200 bg-green-25' 
                    : item.critical 
                    ? 'border-purple-200 bg-purple-25' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${!canConfirm ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-1">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked) => handleItemChange(item.id, checked as boolean)}
                      disabled={!canConfirm}
                      className={`${
                        item.critical ? 'border-purple-400' : 'border-gray-300'
                      } ${item.checked ? 'bg-green-500 border-green-500' : ''}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <label className={`text-sm font-medium cursor-pointer ${
                        item.checked ? 'text-green-800' : 'text-gray-900'
                      } ${!canConfirm ? 'cursor-not-allowed' : ''}`}>
                        {item.label}
                        {item.critical && (
                          <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                            Critical
                          </Badge>
                        )}
                      </label>
                      {item.checked && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      item.checked ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Confirmation Button */}
      {!focusMode && canConfirm && (
        <div className="p-4 bg-gray-25 border border-gray-200 rounded-lg">
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium text-gray-900 mb-2">
                Final Handover Confirmation
              </h4>
              <p className="text-sm text-gray-600">
                By clicking confirm, you formally accept clinical responsibility for this patient.
              </p>
            </div>
            
            <Button
              onClick={handleFinalConfirmation}
              disabled={!isComplete}
              className={`w-full ${
                isComplete 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              size="lg"
            >
              {isComplete ? (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Confirm Handover & Accept Responsibility
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Complete All Items to Continue ({completedItems}/{totalItems})
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Status Display for Non-Receiving Users */}
      {!focusMode && !canConfirm && (
        <div className="p-4 bg-gray-25 border border-gray-200 rounded-lg text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Waiting for {receivingPhysician.name} to confirm handover
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {completedItems > 0 ? (
                `${completedItems} of ${totalItems} items confirmed`
              ) : (
                'Confirmation pending'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Focus Mode - Read-Only Display */}
      {focusMode && (
        <div className="p-4 bg-gray-25 border border-gray-200 rounded-lg">
          <div className="text-center space-y-2">
            <h4 className="font-medium text-gray-900">
              Synthesis by Receiver
            </h4>
            <p className="text-sm text-gray-600">
              {receivingPhysician.name} will confirm handover completion
            </p>
            <div className="text-xs text-gray-500">
              Read-only mode - Confirmation available in interactive mode
            </div>
          </div>
        </div>
      )}


    </div>
  );
}