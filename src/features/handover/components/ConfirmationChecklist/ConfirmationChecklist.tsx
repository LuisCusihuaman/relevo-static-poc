import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ConfirmationChecklistProps {
  onComplete: (complete: boolean) => void;
}

export function ConfirmationChecklist({ onComplete }: ConfirmationChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const checklistItems = [
    {
      id: 'clinical-status',
      category: 'Clinical Status',
      item: 'I have reviewed all clinical data and patient status',
      required: true
    },
    {
      id: 'medications',
      category: 'Medications',
      item: 'I understand current medications and any pending orders',
      required: true
    },
    {
      id: 'allergies',
      category: 'Safety',
      item: 'I have noted all allergies and safety precautions',
      required: true
    },
    {
      id: 'priorities',
      category: 'Care Plan',
      item: 'I understand the immediate care priorities and action items',
      required: true
    },
    {
      id: 'contingency',
      category: 'Contingency',
      item: 'I am aware of contingency plans and when to escalate',
      required: true
    },
    {
      id: 'communication',
      category: 'Communication',
      item: 'I know who to contact for questions or emergencies',
      required: true
    },
    {
      id: 'documentation',
      category: 'Documentation',
      item: 'All documentation is complete and accurate',
      required: false
    },
    {
      id: 'family',
      category: 'Family',
      item: 'I am aware of family communication needs and scheduled meetings',
      required: false
    }
  ];

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: checked }));
  };

  const requiredItems = checklistItems.filter(item => item.required);
  const requiredChecked = requiredItems.filter(item => checkedItems[item.id]).length;
  const totalChecked = checklistItems.filter(item => checkedItems[item.id]).length;
  const allRequiredComplete = requiredChecked === requiredItems.length;
  const progressPercentage = (totalChecked / checklistItems.length) * 100;

  useEffect(() => {
    onComplete(allRequiredComplete);
  }, [allRequiredComplete, onComplete]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span>Confirmation Checklist</span>
          </div>
          <Badge variant={allRequiredComplete ? "default" : "secondary"}>
            {requiredChecked}/{requiredItems.length} Required
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Required Items */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Required Confirmations</span>
          </h4>
          <div className="space-y-3">
            {requiredItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <Checkbox
                  checked={checkedItems[item.id] || false}
                  onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{item.item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Items */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Additional Confirmations</h4>
          <div className="space-y-3">
            {checklistItems.filter(item => !item.required).map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <Checkbox
                  checked={checkedItems[item.id] || false}
                  onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs bg-white">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{item.item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Status */}
        <div className="pt-4 border-t border-gray-200">
          {allRequiredComplete ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Ready for Handover Completion</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All required items have been confirmed. The handover can now be completed.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {requiredItems.length - requiredChecked} items remaining
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Please confirm all required items to complete the handover process.
              </p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-center">
          Checklist initiated: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}