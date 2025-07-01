import React from 'react';
import { Button } from '@/components/ui/button';
import { patientData } from '@/common/constants';

interface FooterProps {
  focusMode: boolean;
  fullscreenEditing: boolean;
  handoverComplete: boolean;
  getTimeUntilHandover: () => string;
  getSessionDuration: () => string;
}

export function Footer({
  focusMode,
  fullscreenEditing,
  handoverComplete,
  getTimeUntilHandover,
  getSessionDuration
}: FooterProps) {
  if (focusMode || fullscreenEditing) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full max-w-none mx-auto flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Handover at {patientData.handoverTime}</span>
          <span>•</span>
          <span>{getTimeUntilHandover()} remaining</span>
          <span>•</span>
          <span>Session: {getSessionDuration()}</span>
        </div>
        <Button 
          className={`w-full sm:w-auto ${
            handoverComplete 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
          disabled={handoverComplete}
          size="sm"
        >
          {handoverComplete ? 'Handover Complete' : 'Complete Handover'}
        </Button>
      </div>
    </div>
  );
}