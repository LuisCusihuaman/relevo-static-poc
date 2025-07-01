import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Activity, MessageSquare, History, FileText,
  Maximize2, MoreHorizontal, X, ArrowRight, Calendar, MapPin, UserPlus,
  Stethoscope
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { currentlyPresent, patientData, activeCollaborators } from '@/common/constants';

interface HeaderProps {
  focusMode: boolean;
  showCollaborators: boolean;
  setShowCollaborators: (show: boolean) => void;
  setFocusMode: (focus: boolean) => void;
  setShowComments: (show: boolean) => void;
  setShowHistory: (show: boolean) => void;
  setShowMobileMenu: (show: boolean) => void;
  showComments: boolean;
  showHistory: boolean;
  getSyncStatusDisplay: () => { icon: React.ReactNode; text: string; color: string };
  getTimeUntilHandover: () => string;
  getSessionDuration: () => string;
}

export function Header({
  focusMode,
  showCollaborators,
  setShowCollaborators,
  setFocusMode,
  setShowComments,
  setShowHistory,
  setShowMobileMenu,
  showComments,
  showHistory,
  getSyncStatusDisplay,
  getTimeUntilHandover,
  getSessionDuration
}: HeaderProps) {
  const activeUsers = activeCollaborators.filter(user => user.status === 'active' || user.status === 'viewing');

  if (focusMode) return null;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Main Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between w-full max-w-none mx-auto">
          {/* Left Section - Logo + Patient Info */}
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0 flex-1">
            {/* Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">RELEVO</h1>
            </div>

            <Separator orientation="vertical" className="h-6 hidden lg:block" />
            
            {/* Patient Name + Essential Info */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <h2 className="font-medium text-gray-900 truncate">
                {patientData.name}
              </h2>
              <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 flex-shrink-0">
                {patientData.room}
              </Badge>
              
              {/* Session duration - realistic medical tracking */}
              <div className="hidden xl:flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Session: {getSessionDuration()}</span>
              </div>
            </div>
          </div>

          {/* Center - Google Docs Style Collaborators with Tooltips */}
          <div className="flex items-center space-x-1">
            {/* Currently Present - Show first 2 active with tooltips */}
            {activeUsers.slice(0, 2).map((user) => (
              <Tooltip key={user.id}>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Avatar className="w-8 h-8 border-2 border-white hover:border-gray-200 transition-colors">
                      <AvatarFallback className={`${user.color} text-white text-xs`}>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Live indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900 text-white text-xs px-2 py-1 border-none shadow-lg">
                  <div className="text-center">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-300">{user.role}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
            
            {/* Show More Button - Google Docs Style */}
            {activeUsers.length > 2 && (
              <Popover open={showCollaborators} onOpenChange={setShowCollaborators}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-auto px-2 text-xs text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    +{activeUsers.length - 2}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 bg-white border-gray-200 shadow-lg" align="center">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900 text-sm">People with access</h3>
                    <p className="text-xs text-gray-600">{activeUsers.length} people can view and edit</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {currentlyPresent.map((person) => (
                      <div key={person.id} className="p-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={`${person.color} text-white text-sm`}>
                                {person.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              person.status === 'active' ? 'bg-green-500' : 
                              person.status === 'viewing' ? 'bg-amber-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">{person.name}</p>
                              {person.presenceType === 'assigned-current' && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-blue-50 text-blue-700 border-blue-200">
                                  Current
                                </Badge>
                              )}
                              {person.presenceType === 'assigned-receiving' && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-purple-50 text-purple-700 border-purple-200">
                                  Receiving
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{person.role}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                person.status === 'active' ? 'bg-green-500' : 
                                person.status === 'viewing' ? 'bg-amber-500' : 'bg-gray-400'
                              }`}></div>
                              <span className="text-xs text-gray-500">
                                {person.status === 'active' ? 'Active now' : 
                                 person.status === 'viewing' ? 'Viewing' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-gray-50 justify-center">
                      <UserPlus className="w-3 h-3 mr-2" />
                      Share with others
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          {/* Right Section - Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Sync status indicator */}
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-600">
              {getSyncStatusDisplay().icon}
              <span className={getSyncStatusDisplay().color}>{getSyncStatusDisplay().text}</span>
            </div>

            {/* Focus Mode Exit */}
            {focusMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFocusMode(false)}
                className="text-xs border-gray-200 bg-white hover:bg-gray-50"
              >
                <X className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">Exit Focus</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden h-8 w-8 p-0 hover:bg-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Focus Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFocusMode(true)}
                className="text-xs p-2 hover:bg-gray-100"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>

              {/* Discussion */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className={`text-xs p-2 hover:bg-gray-100 ${showComments ? 'bg-gray-100' : ''}`}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>

              {/* History */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className={`text-xs p-2 hover:bg-gray-100 ${showHistory ? 'bg-gray-100' : ''}`}
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Info Bar - Continuous with header (no gap) */}
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Age {patientData.age}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span className="font-mono text-xs">{patientData.mrn}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{patientData.unit}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>{patientData.primaryDiagnosis}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-gray-500">Handover:</span>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-5 h-5 cursor-pointer hover:ring-2 hover:ring-blue-200">
                    <AvatarFallback className={`${patientData.assignedPhysician.color} text-white text-xs`}>
                      {patientData.assignedPhysician.initials}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900 text-white text-xs px-2 py-1 border-none shadow-lg">
                  <div className="text-center">
                    <div className="font-medium">{patientData.assignedPhysician.name}</div>
                    <div className="text-gray-300">{patientData.assignedPhysician.role}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-5 h-5 cursor-pointer hover:ring-2 hover:ring-purple-200">
                    <AvatarFallback className={`${patientData.receivingPhysician.color} text-white text-xs`}>
                      {patientData.receivingPhysician.initials}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900 text-white text-xs px-2 py-1 border-none shadow-lg">
                  <div className="text-center">
                    <div className="font-medium">{patientData.receivingPhysician.name}</div>
                    <div className="text-gray-300">{patientData.receivingPhysician.role}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
              <span className="text-gray-500">in {getTimeUntilHandover()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}