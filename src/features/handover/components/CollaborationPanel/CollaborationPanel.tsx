import {
  recentActivity,
} from "@/common/constants";
import { recentActivityES } from "@/common/constants.es";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bell, MessageSquare, Send, Users, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityFeed, type ActivityItem } from "../ActivityFeed";

interface CollaborationPanelProps {
  onClose: () => void;
  onNavigateToSection: (section: string) => void;
  hideHeader?: boolean;
}

// Mock discussion messages for the unified handover conversation
const handoverDiscussion = [
  {
    id: 1,
    user: "Dr. Patel",
    userInitials: "SP",
    userColor: "bg-purple-600",
    role: "Evening Attending",
    message:
      "Just reviewed the case. The heart failure seems stable today. Any concerns about the fluid balance?",
    time: "2 minutes ago",
    timestamp: "16:43",
    type: "message",
    mentions: [],
  },
  {
    id: 2,
    user: "Dr. Johnson",
    userInitials: "DJ",
    userColor: "bg-blue-600",
    role: "Day Attending",
    message:
      "Patient has been net negative 500ml today. Responded well to the lasix adjustment this morning. Current weight is down 2kg from admission.",
    time: "1 minute ago",
    timestamp: "16:44",
    type: "message",
    mentions: [],
  },
  {
    id: 3,
    user: "Dr. Rodriguez",
    userInitials: "MR",
    userColor: "bg-emerald-600",
    role: "Resident",
    message:
      "Should we continue the current diuretic dose overnight? BUN/Cr stable at 1.2.",
    time: "30 seconds ago",
    timestamp: "16:45",
    type: "message",
    mentions: ["Dr. Patel"],
  },
];

export function CollaborationPanel({
  onClose,
  onNavigateToSection,
  hideHeader = false,
}: CollaborationPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("discussion");
  const { t, i18n } = useTranslation("collaborationPanel");
  const currentRecentActivity =
    i18n.language === "es" ? recentActivityES : recentActivity;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
            <h3 className="font-medium text-gray-900">
              {t("header.title")}
            </h3>
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
              <span className="text-gray-600">{t("header.liveSession")}</span>
            </div>
            <span className="text-gray-500">{t("header.sessionInfo")}</span>
          </div>
        </div>
      )}

      {/* Session status bar - Always show when header is hidden */}
      {hideHeader && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{t("header.liveSession")}</span>
            </div>
            <span className="text-gray-500">{t("header.sessionInfo")}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-3 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger
              value="discussion"
              className="text-xs data-[state=active]:bg-white"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              {t("tabs.discussion")}
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="text-xs data-[state=active]:bg-white"
            >
              <Bell className="w-3 h-3 mr-1" />
              {t("tabs.updates")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Discussion Tab */}
        <TabsContent value="discussion" className="flex-1 flex flex-col mt-0">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">
                  {t("discussionTab.title")}
                </h4>
                <p className="text-xs text-blue-700">
                  {t("discussionTab.subtitle")}
                </p>
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
                      <AvatarFallback
                        className={`${message.userColor} text-white text-xs`}
                      >
                        {message.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {t(`discussion.${message.user.replace("Dr. ", "user").toLowerCase()}.user`)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t(`discussion.${message.user.replace("Dr. ", "user").toLowerCase()}.role`)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {t(`discussion.${message.user.replace("Dr. ", "user").toLowerCase()}.time`)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {t(`discussion.${message.user.replace("Dr. ", "user").toLowerCase()}.message`)}
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
                  placeholder={t("messageInput.placeholder")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white min-h-[5rem] pr-20"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  className="absolute bottom-2 right-2"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t("messageInput.send")}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="flex-1 flex flex-col mt-0">
          <ActivityFeed
            items={currentRecentActivity as ActivityItem[]}
            onNavigateToSection={onNavigateToSection}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
