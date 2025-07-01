import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, Plus, Edit, Clock, AlertTriangle, CheckSquare, 
  FileText, Activity, Users, Save, Star,
  Stethoscope, Heart, Shield, MessageSquare, Target
} from 'lucide-react';

interface QuickActionsProps {
  patient: any;
  onClose: () => void;
}

export function QuickActions({ patient, onClose }: QuickActionsProps) {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [quickNote, setQuickNote] = useState('');
  const [targetSection, setTargetSection] = useState('patient-summary');

  // I-PASS specific templates
  const ipassTemplates = [
    {
      id: 'illness-update',
      title: 'Illness Severity Update',
      icon: Activity,
      section: 'illness',
      template: 'Severity assessment: Patient appears [STABLE/GUARDED/UNSTABLE/CRITICAL]. [CLINICAL_INDICATORS]. Requires [INTERVENTION_LEVEL].',
      color: 'text-blue-600'
    },
    {
      id: 'patient-summary',
      title: 'Patient Summary Note',
      icon: FileText,
      section: 'patient',
      template: '[AGE]-year-old [GENDER] with [PRIMARY_DIAGNOSIS]. Admitted [DATE] for [REASON]. Current status: [STATUS]. Key concerns: [CONCERNS].',
      color: 'text-green-600'
    },
    {
      id: 'action-item',
      title: 'Action Item',
      icon: Target,
      section: 'actions',
      template: 'Action needed: [TASK]. Timeline: [WHEN]. Responsible: [WHO]. Priority: [HIGH/MEDIUM/LOW]. Follow-up: [FOLLOW_UP].',
      color: 'text-orange-600'
    },
    {
      id: 'situation-awareness',
      title: 'Situation Update',
      icon: AlertTriangle,
      section: 'awareness',
      template: 'Situation update: [WHAT_CHANGED]. Impact: [CLINICAL_IMPACT]. Watch for: [MONITORING_POINTS]. If-then: [CONTINGENCY].',
      color: 'text-purple-600'
    },
    {
      id: 'synthesis-note',
      title: 'Synthesis Note',
      icon: MessageSquare,
      section: 'synthesis',
      template: 'Key takeaways: [SUMMARY]. Questions: [QUESTIONS]. Confirmed understanding: [CONFIRMATION]. Next steps: [NEXT_STEPS].',
      color: 'text-red-600'
    }
  ];

  // I-PASS section tracking
  const ipassProgress = {
    illness: { complete: true, label: 'Illness Severity', icon: Activity },
    patient: { complete: true, label: 'Patient Summary', icon: FileText },
    actions: { complete: false, label: 'Action List', icon: Target },
    awareness: { complete: false, label: 'Situation Awareness', icon: AlertTriangle },
    synthesis: { complete: false, label: 'Synthesis', icon: MessageSquare }
  };

  const handleQuickSave = (content: string, section: string) => {
    // In real app, this would save to the appropriate I-PASS section
    console.log(`Saving to ${section}: ${content}`);
    setQuickNote('');
    setActiveForm(null);
    // Show success notification
  };

  const insertTemplate = (template: string, section: string) => {
    setQuickNote(template);
    setTargetSection(section);
    setActiveForm('note');
  };

  const completedSections = Object.values(ipassProgress).filter(s => s.complete).length;
  const totalSections = Object.keys(ipassProgress).length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">I-PASS Quick Actions</h3>
            <p className="text-sm text-gray-600">
              {patient.name} • Room {patient.room}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* I-PASS Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">I-PASS Progress</h4>
              <Badge variant="outline" className="text-xs">
                {completedSections}/{totalSections} Complete
              </Badge>
            </div>
            
            <div className="space-y-2">
              {Object.entries(ipassProgress).map(([key, section]) => {
                const IconComponent = section.icon;
                return (
                  <div 
                    key={key}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      section.complete 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${
                        section.complete ? 'text-green-600' : 'text-gray-500'
                      }`} />
                      <span className="text-sm">{section.label}</span>
                    </div>
                    {section.complete ? (
                      <CheckSquare className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Quick Note with I-PASS Section Targeting */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Add to I-PASS</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveForm(activeForm === 'note' ? null : 'note')}
                className="text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                {activeForm === 'note' ? 'Cancel' : 'Add'}
              </Button>
            </div>
            
            {activeForm === 'note' && (
              <div className="space-y-3">
                <Select value={targetSection} onValueChange={setTargetSection}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="illness">I - Illness Severity</SelectItem>
                    <SelectItem value="patient">P - Patient Summary</SelectItem>
                    <SelectItem value="actions">A - Action List</SelectItem>
                    <SelectItem value="awareness">S - Situation Awareness</SelectItem>
                    <SelectItem value="synthesis">S - Synthesis</SelectItem>
                  </SelectContent>
                </Select>
                
                <Textarea
                  placeholder="Enter clinical note for selected I-PASS section..."
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleQuickSave(quickNote, targetSection)}
                    disabled={!quickNote.trim()}
                    className="text-xs flex-1"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Add to {targetSection.charAt(0).toUpperCase() + targetSection.slice(1)}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuickNote('')}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* I-PASS Templates */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">I-PASS Templates</h4>
            <div className="space-y-2">
              {ipassTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate(template.template, template.section)}
                    className="justify-start text-xs h-auto py-3 w-full"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <IconComponent className={`w-4 h-4 flex-shrink-0 ${template.color}`} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{template.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.section.charAt(0).toUpperCase()}-PASS Section
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>I-PASS Progress: {Math.round((completedSections/totalSections) * 100)}%</span>
          <Button variant="ghost" size="sm" className="text-xs">
            <Star className="w-3 h-3 mr-1" />
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}