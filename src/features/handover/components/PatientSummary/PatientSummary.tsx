import type { SyncStatus } from '@/common/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Clock,
  Edit,
  FileText,
  Lock,
  Save,
  Shield
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PatientSummaryProps {
  onOpenThread?: (section: string) => void;
  focusMode?: boolean;
  fullscreenMode?: boolean;
  autoEdit?: boolean;
  onRequestFullscreen?: () => void;
  hideControls?: boolean; // NEW PROP to hide internal save/done buttons
  onSave?: () => void; // Handler for external save button
  onSaveReady?: (saveFunction: () => void) => void; // Provide save function to parent
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

export function PatientSummary({ 
  onOpenThread, 
  focusMode = false,
  fullscreenMode = false,
  autoEdit = false,
  onRequestFullscreen,
  hideControls = false, // Default to false for backwards compatibility
  onSave, // External save handler
  onSaveReady,
  syncStatus = 'synced',
  onSyncStatusChange,
  currentUser = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' },
  assignedPhysician = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' }
}: PatientSummaryProps) {
  const [summaryText, setSummaryText] = useState(
    "72-year-old female with acute exacerbation of COPD, admitted 3 days ago for increased dyspnea and productive cough. Patient has been responding well to bronchodilator therapy and systemic corticosteroids.\n\nPast Medical History:\n• COPD (moderate to severe)\n• Hypertension\n• Type 2 Diabetes Mellitus\n• Former smoker (quit 5 years ago)\n\nCurrent medications showing good response. Patient ambulating with minimal assistance and oxygen requirements have decreased from 4L to 2L over past 24 hours.\n\nSocial History:\n• Lives with daughter\n• Independent in ADLs prior to admission\n• No advance directives on file\n\nPhysical Exam:\n• Alert and oriented x3\n• Respiratory: Decreased breath sounds bilaterally, mild expiratory wheeze\n• Cardiovascular: Regular rate and rhythm\n• No acute distress currently\n\nDischarge Planning:\n• Social work consulted for home services\n• PT/OT evaluation completed\n• Family education on COPD management\n• Follow-up with pulmonology in 2 weeks\n\nCode Status: DNR/DNI (confirmed with family)\nAllergies: Penicillin, Sulfa\nEmergency Contact: Daughter - Sarah Rodriguez (555) 123-4567"
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date('2024-03-17T09:30:00'));
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if current user can edit (only assigned physician)
  const canEdit = currentUser.name === assignedPhysician.name;

  const handleSave = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsEditing(false);
      setLastUpdated(new Date());
      setIsUpdating(false);
      // Call external save handler if provided
      if (onSave) {
        onSave();
      }
    }, 1200);
  };

  // Auto-start editing when in fullscreen with autoEdit
  useEffect(() => {
    if (fullscreenMode && autoEdit && canEdit) {
      setIsEditing(true);
    }
  }, [fullscreenMode, autoEdit, canEdit]);

  // Provide save function to parent when ready
  useEffect(() => {
    if (onSaveReady && isEditing && fullscreenMode) {
      onSaveReady(handleSave);
    }
  }, [onSaveReady, isEditing, fullscreenMode, handleSave]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummaryText(e.target.value);
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Handle click for editing or fullscreen - SIMPLIFIED FOR SINGLE CLICK
  const handleClick = () => {
    if (!canEdit || focusMode) return;
    
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

  // In fullscreen mode, optimize for writing
  const contentHeight = fullscreenMode ? 'min-h-[60vh]' : 'h-80';

  return (
    <div className="space-y-4">
      {!focusMode && isEditing && canEdit ? (
        /* Editing Mode - Optimized border radius */
        <div className="space-y-4">
          <div className="relative">
            <div className={`relative bg-white border border-gray-300 ${fullscreenMode ? 'rounded-lg' : 'rounded-t-none rounded-b-lg'} shadow-sm`}>
              {/* Header with subtle gray background and top rounded corners */}
              <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 ${fullscreenMode ? 'rounded-t-lg' : 'rounded-t-lg'}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {fullscreenMode ? 'Clinical Record - Fullscreen Editor' : 'Editing Clinical Record'}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  {isUpdating && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content area - optimized height for fullscreen */}
              <div className={`relative ${contentHeight}`}>
                <ScrollArea className="h-full">
                  <Textarea
                    value={summaryText}
                    onChange={handleTextChange}
                    className={`w-full h-full ${fullscreenMode ? 'min-h-[60vh]' : 'min-h-[320px]'} border-0 bg-transparent p-4 resize-none text-gray-900 leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none`}
                    placeholder="Enter patient background and clinical summary..."
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontSize: fullscreenMode ? '16px' : '14px',
                      lineHeight: '1.6',
                      background: 'transparent !important'
                    }}
                    autoFocus={fullscreenMode || autoEdit}
                  />
                </ScrollArea>
              </div>
              
              {/* Footer with save controls - ONLY SHOW IF NOT HIDING CONTROLS */}
              {!hideControls && (
                <div className={`flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 ${fullscreenMode ? 'rounded-b-lg' : 'rounded-b-lg'}`}>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{summaryText.split(' ').length} words</span>
                    <span>{summaryText.split('\n').length} lines</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-gray-600 hover:bg-gray-100 h-7 px-2"
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      className="text-xs bg-gray-700 hover:bg-gray-800 text-white h-7 px-3"
                      disabled={isUpdating}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Word count footer when controls are hidden */}
              {hideControls && (
                <div className={`flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 ${fullscreenMode ? 'rounded-b-lg' : 'rounded-b-lg'}`}>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{summaryText.split(' ').length} words</span>
                    <span>{summaryText.split('\n').length} lines</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {fullscreenMode ? 'Use Save button above' : 'Use fullscreen controls to save'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* View Mode - Optimized border radius and click handling */
        <div className="relative group">
          <div 
            className={`bg-white border border-gray-200 ${fullscreenMode ? 'rounded-lg' : 'rounded-t-none rounded-b-lg'} shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 ${
              canEdit && !focusMode ? 'cursor-pointer' : ''
            }`}
            onClick={handleClick}
          >
            {/* Header with subtle gray background and top rounded corners */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50 ${fullscreenMode ? 'rounded-t-lg' : 'rounded-t-lg'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-medium text-gray-800">
                    {fullscreenMode ? 'Clinical Record - Fullscreen View' : 'Clinical Record'}
                  </h4>
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors">
                    <Shield className="w-3 h-3 mr-1" />
                    {assignedPhysician.name} only
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-500 font-medium">Current</span>
              </div>
            </div>
            
            {/* Content area - optimized height for fullscreen */}
            <div className={`relative ${contentHeight}`}>
              <ScrollArea className="h-full">
                <div 
                  className="text-gray-800 leading-relaxed whitespace-pre-line p-4"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: fullscreenMode ? '16px' : '14px',
                    lineHeight: '1.6'
                  }}
                >
                  {summaryText}
                </div>
              </ScrollArea>
            </div>
            
            {/* Footer with subtle gray background and bottom rounded corners */}
            <div className={`flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50/50 ${fullscreenMode ? 'rounded-b-lg' : 'rounded-b-lg'}`}>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {getTimeAgo()}</span>
                </div>
                <span>•</span>
                <span>{summaryText.split(' ').length} words</span>
              </div>
              {canEdit && !focusMode && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Edit className="w-3 h-3" />
                    <span>Click to edit</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Permission notice for non-authorized users */}
          {!canEdit && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-orange-700">
                <Lock className="w-4 h-4" />
                <span>
                  Only {assignedPhysician.name} can modify this clinical record.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}