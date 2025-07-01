
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CollaborationPanel } from '../CollaborationPanel';
import { HandoverHistory } from '../HandoverHistory';
import { 
  Clock, Activity, Users, MessageSquare, History,
  Maximize2, User
} from 'lucide-react';
import { activeCollaborators, patientData } from '../../../../common/constants';
import type { User as UserType } from '../../../../../../relevo-app-vite/src/common/types';

interface MobileMenusProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
  setFocusMode: (focus: boolean) => void;
  focusMode: boolean;
  fullscreenEditing: boolean;
  getTimeUntilHandover: () => string;
  getSessionDuration: () => string;
  handleNavigateToSection: (section: string) => void;
  currentUser: UserType;
}

export function MobileMenus({
  showMobileMenu,
  setShowMobileMenu,
  showHistory,
  setShowHistory,
  showComments,
  setShowComments,
  setFocusMode,
  focusMode,
  fullscreenEditing,
  getTimeUntilHandover,
  getSessionDuration,
  handleNavigateToSection,
  currentUser
}: MobileMenusProps) {
  const activeUsers = activeCollaborators.filter(user => user.status === 'active' || user.status === 'viewing');

  return (
    <>
      {/* Mobile Menu Sheet */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="right" className="w-80 bg-white border-l border-gray-200">
          <SheetHeader className="pb-4 border-b border-gray-100">
            <SheetTitle className="text-left text-gray-900">Handover Controls</SheetTitle>
            <SheetDescription className="text-left text-gray-600">
              Access patient information, team collaboration tools, and handover controls for {patientData.name}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-4 space-y-4">
            {/* Patient Information */}
            <div className="bg-blue-50 border border-blue-200 p-3">
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-900">Patient Information</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Age:</span>
                  <span className="text-blue-900 font-medium">{patientData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">MRN:</span>
                  <span className="text-blue-900 font-mono text-xs">{patientData.mrn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Diagnosis:</span>
                  <span className="text-blue-900 font-medium text-right">{patientData.primaryDiagnosis}</span>
                </div>
              </div>
            </div>

            {/* Session Status */}
            <div className="bg-gray-50 border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Active Session</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{getSessionDuration()}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{getTimeUntilHandover()} until handover</span>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 px-1">
                <Users className="w-4 h-4 text-gray-700" />
                <h4 className="text-sm font-medium text-gray-900">Team Collaboration</h4>
              </div>
              
              <div className="space-y-2">
                {/* Discussion - Now opens mobile Sheet */}
                <Button
                  variant={showComments ? "default" : "outline"}
                  onClick={() => {
                    setShowComments(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start h-auto p-3"
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Discussion</div>
                    <div className="text-xs opacity-75">Handover conversation</div>
                  </div>
                </Button>

                {/* History - Now opens mobile Sheet */}
                <Button
                  variant={showHistory ? "default" : "outline"}
                  onClick={() => {
                    setShowHistory(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start h-auto p-3"
                >
                  <History className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Handover History</div>
                    <div className="text-xs opacity-75">Previous records</div>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Focus Mode */}
            <Button
              variant="outline"
              onClick={() => {
                setFocusMode(true);
                setShowMobileMenu(false);
              }}
              className="w-full justify-start h-auto p-3"
            >
              <Maximize2 className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="text-sm font-medium">Focus Mode</div>
                <div className="text-xs opacity-75">Distraction-free view</div>
              </div>
            </Button>

            {/* Active Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-700" />
                  <h4 className="text-sm font-medium text-gray-900">Active Team</h4>
                </div>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {activeUsers.length} online
                </Badge>
              </div>
              
              <div className="space-y-2">
                {activeUsers.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 border border-gray-200 bg-white">
                    <div className="relative">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className={`${user.color} text-white text-xs`}>
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        {user.presenceType === 'assigned-current' && (
                          <Badge variant="outline" className="text-xs px-1 py-0 bg-blue-50 text-blue-700 border-blue-200">
                            Current
                          </Badge>
                        )}
                        {user.presenceType === 'assigned-receiving' && (
                          <Badge variant="outline" className="text-xs px-1 py-0 bg-purple-50 text-purple-700 border-purple-200">
                            Receiving
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                  </div>
                ))}
                {activeUsers.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    +{activeUsers.length - 3} more active
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile History Sheet */}
      {showHistory && !focusMode && !fullscreenEditing && (
        <Sheet open={showHistory} onOpenChange={setShowHistory}>
          <SheetContent side="left" className="w-80 bg-white border-r border-gray-200 p-0">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle className="text-left text-gray-900">Handover History</SheetTitle>
              <SheetDescription className="text-left text-gray-600">
                Previous handover records for {patientData.name}.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-auto">
              <HandoverHistory onClose={() => setShowHistory(false)} patientData={patientData} hideHeader={true} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Collaboration Sheet */}
      {showComments && !focusMode && !fullscreenEditing && (
        <Sheet open={showComments} onOpenChange={setShowComments}>
          <SheetContent side="right" className="w-80 bg-white border-l border-gray-200 p-0">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle className="text-left text-gray-900">Handover Collaboration</SheetTitle>
              <SheetDescription className="text-left text-gray-600">
                Team discussion and collaboration tools for {patientData.name}.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-auto">
              <CollaborationPanel 
                onClose={() => setShowComments(false)} 
                onNavigateToSection={handleNavigateToSection}
                hideHeader={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}