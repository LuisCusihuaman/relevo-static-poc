import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  Bell, MessageSquare,
  Send,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';

interface CollaborationPanelProps {
  onClose: () => void;
  onNavigateToSection: (section: string) => void;
  hideHeader?: boolean;
}

// Mock discussion messages for the unified handover conversation
const handoverDiscussion = [
  {
    id: 1,
    user: 'Dr. Patel',
    userInitials: 'SP',
    userColor: 'bg-purple-600',
    role: 'Evening Attending',
    message: 'Just reviewed the case. The heart failure seems stable today. Any concerns about the fluid balance?',
    time: '2 minutes ago',
    timestamp: '16:43',
    type: 'message',
    mentions: []
  },
  {
    id: 2,
    user: 'Dr. Johnson',
    userInitials: 'DJ',
    userColor: 'bg-blue-600',
    role: 'Day Attending',
    message: 'Patient has been net negative 500ml today. Responded well to the lasix adjustment this morning. Current weight is down 2kg from admission.',
    time: '1 minute ago',
    timestamp: '16:44',
    type: 'message',
    mentions: []
  },
  {
    id: 3,
    user: 'Dr. Rodriguez',
    userInitials: 'MR',
    userColor: 'bg-emerald-600',
    role: 'Resident',
    message: 'Should we continue the current diuretic dose overnight? BUN/Cr stable at 1.2.',
    time: '30 seconds ago',
    timestamp: '16:45',
    type: 'message',
    mentions: ['Dr. Patel']
  }
];

// Mock recent activity for the handover
const recentActivity = [
  {
    id: 1,
    user: 'Dr. Patel',
    userInitials: 'SP',
    userColor: 'bg-purple-600',
    action: 'joined handover session',
    section: 'General',
    time: '5 minutes ago',
    type: 'user_joined'
  },
  {
    id: 2,
    user: 'Dr. Johnson',
    userInitials: 'DJ',
    userColor: 'bg-blue-600',
    action: 'updated illness severity assessment',
    section: 'Illness Severity',
    time: '3 minutes ago',
    type: 'content_updated'
  },
  {
    id: 3,
    user: 'Dr. Rodriguez',
    userInitials: 'MR',
    userColor: 'bg-emerald-600',
    action: 'added action item about morning labs',
    section: 'Action List',
    time: '2 minutes ago',
    type: 'content_added'
  },
  {
    id: 4,
    user: 'Nurse Clara',
    userInitials: 'CJ',
    userColor: 'bg-teal-600',
    action: 'reviewed patient summary',
    section: 'Patient Summary',
    time: '1 minute ago',
    type: 'content_viewed'
  }
];

export function CollaborationPanel({ onClose, onNavigateToSection, hideHeader = false }: CollaborationPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('discussion');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Only show if not hidden */}
      {!hideHeader && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Handover Collaboration</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Real-time status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Live session</span>
            </div>
            <span className="text-gray-500">Maria Rodriguez • Room 302A</span>
          </div>
        </div>
      )}

      {/* Session status bar - Always show when header is hidden */}
      {hideHeader && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Live session</span>
            </div>
            <span className="text-gray-500">Maria Rodriguez • Room 302A</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-3 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="discussion" className="text-xs data-[state=active]:bg-white">
              <MessageSquare className="w-3 h-3 mr-1" />
              Discussion
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-white">
              <Bell className="w-3 h-3 mr-1" />
              Updates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Discussion Tab */}
        <TabsContent value="discussion" className="flex-1 flex flex-col mt-0">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">Handover Discussion</h4>
                <p className="text-xs text-blue-700">Day → Evening shift conversation</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {handoverDiscussion.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={`${message.userColor} text-white text-xs`}>
                        {message.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{message.user}</span>
                        <span className="text-xs text-gray-500">{message.role}</span>
                        <span className="text-xs text-gray-400">{message.time}</span>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {message.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add to the handover discussion..."
                  className="min-h-[60px] pr-12 resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="flex-1 flex flex-col mt-0">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Recent Updates</h4>
                <p className="text-xs text-gray-600">Live handover activity</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className={`${activity.userColor} text-white text-xs`}>
                        {activity.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.action}
                        {activity.section !== 'General' && (
                          <button
                            onClick={() => onNavigateToSection(activity.section.toLowerCase().replace(' ', ''))}
                            className="text-blue-600 hover:text-blue-700 ml-1 hover:underline"
                          >
                            in {activity.section}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.type === 'content_updated' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {activity.type === 'content_added' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {activity.type === 'user_joined' && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                      {activity.type === 'content_viewed' && (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && (
                    <div className="ml-10 mt-3 border-b border-gray-100"></div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}