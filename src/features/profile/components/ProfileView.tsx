import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Building2,
  ChevronRight,
  Clock,
  KeyRound,
  MapPin,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ProfileViewProps {
  doctorName: string;
  unit: string;
  shift: string;
  onBack?: () => void; // Keep for API compatibility but don't use
  isMobile?: boolean;
}

type ProfileSection =
  | "profile"
  | "settings"
  | "notifications"
  | "security"
  | "account";

export function ProfileView({
  doctorName,
  unit,
  shift,
  isMobile = false,
}: ProfileViewProps) {
  const { t } = useTranslation("profileView");
  const [activeSection, setActiveSection] = useState<ProfileSection>("profile");
  const [displayName, setDisplayName] = useState(doctorName);
  const [bio, setBio] = useState("");

  // Get doctor initials for avatar
  const getDoctorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sidebarItems = [
    {
      id: "profile" as ProfileSection,
      label: t("sidebar.profile"),
      icon: User,
      description: t("sidebar.profileDescription"),
    },
    {
      id: "settings" as ProfileSection,
      label: t("sidebar.settings"),
      icon: Settings,
      description: t("sidebar.settingsDescription"),
    },
    {
      id: "notifications" as ProfileSection,
      label: t("sidebar.notifications"),
      icon: Bell,
      description: t("sidebar.notificationsDescription"),
    },
    {
      id: "security" as ProfileSection,
      label: t("sidebar.security"),
      icon: Shield,
      description: t("sidebar.securityDescription"),
    },
    {
      id: "account" as ProfileSection,
      label: t("sidebar.account"),
      icon: KeyRound,
      description: t("sidebar.accountDescription"),
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-primary">
                    {getDoctorInitials(doctorName)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {doctorName}
                </h2>
                <p className="text-muted-foreground">{t("profile.role")}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 border-primary/30"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {unit}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-muted/30 border-border/50"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {shift}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-50 border-green-200 text-green-700"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {t("profile.status")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Hospital Information - Read Only */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-sm">
                    {t("profile.hospitalInfo")}
                  </CardTitle>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {t("profile.hospitalInfoProvider")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("profile.specialty")}
                    </Label>
                    <div className="medical-input-readonly">
                      {t("profile.specialtyValue")}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("profile.experience")}
                    </Label>
                    <div className="medical-input-readonly">
                      {t("profile.experienceValue", { count: 5 })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("profile.department")}
                    </Label>
                    <div className="medical-input-readonly">
                      {t("profile.departmentValue")}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("profile.employeeId")}
                    </Label>
                    <div className="medical-input-readonly">HG-2024-1157</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Preferences */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {t("profile.preferences")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">{t("profile.displayName")}</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="medical-input"
                    placeholder={t("profile.displayNamePlaceholder")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("profile.displayNameDescription")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t("profile.bio")}</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="medical-textarea"
                    placeholder={t("profile.bioPlaceholder")}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("profile.bioDescription")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {t("settings.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("settings.subtitle")}
              </p>
            </div>

            {/* Interface Preferences */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {t("settings.interface")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("settings.darkMode")}
                      </div>
                      <div className="medical-setting-description">
                        {t("settings.darkModeDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("settings.compactMode")}
                      </div>
                      <div className="medical-setting-description">
                        {t("settings.compactModeDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("settings.highContrast")}
                      </div>
                      <div className="medical-setting-description">
                        {t("settings.highContrastDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Handover Preferences */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {t("settings.handover")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("settings.autosave")}
                      </div>
                      <div className="medical-setting-description">
                        {t("settings.autosaveDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("settings.ipassTemplate")}
                      </div>
                      <div className="medical-setting-description">
                        {t("settings.ipassTemplateDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("settings.quickActions")}
                      </div>
                      <div className="medical-setting-description">
                        {t("settings.quickActionsDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {t("notifications.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("notifications.subtitle")}
              </p>
            </div>

            {/* Critical Alerts */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {t("notifications.critical")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("notifications.highPriority")}
                      </div>
                      <div className="medical-setting-description">
                        {t("notifications.highPriorityDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("notifications.handoverReminders")}
                      </div>
                      <div className="medical-setting-description">
                        {t("notifications.handoverRemindersDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("notifications.sound")}
                      </div>
                      <div className="medical-setting-description">
                        {t("notifications.soundDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {t("notifications.communication")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("notifications.teamUpdates")}
                      </div>
                      <div className="medical-setting-description">
                        {t("notifications.teamUpdatesDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("notifications.systemAnnouncements")}
                      </div>
                      <div className="medical-setting-description">
                        {t("notifications.systemAnnouncementsDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {t("security.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("security.subtitle")}
              </p>
            </div>

            {/* Account Security */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t("security.account")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("security.twoFactor")}
                      </div>
                      <div className="medical-setting-description">
                        {t("security.twoFactorDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("security.sessionTimeout")}
                      </div>
                      <div className="medical-setting-description">
                        {t("security.sessionTimeoutDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("security.activityLogging")}
                      </div>
                      <div className="medical-setting-description">
                        {t("security.activityLoggingDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t("security.privacy")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("security.dataAnalytics")}
                      </div>
                      <div className="medical-setting-description">
                        {t("security.dataAnalyticsDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">
                        {t("security.errorReporting")}
                      </div>
                      <div className="medical-setting-description">
                        {t("security.errorReportingDescription")}
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {t("account.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("account.subtitle")}
              </p>
            </div>

            {/* Account Management */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {t("account.management")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("account.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value="eduardo@hospitalgarrahan.gov.ar"
                    className="medical-input"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("account.emailDescription")}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <KeyRound className="w-4 h-4 mr-2" />
                    {t("account.changePassword")}
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    {t("account.exportData")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="medical-card border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-700">
                  {t("account.dangerZone")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">
                    {t("account.clearDataTitle")}
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    {t("account.clearDataDescription")}
                  </p>
                  <Button variant="destructive" size="sm">
                    {t("account.clearDataButton")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Mobile Layout - ENHANCED WITH PROPER SCROLLING
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Tab Navigation */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex overflow-x-auto gap-2 scrollbar-hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content - PROPER SCROLLING CONTAINER */}
        <div className="flex-1 overflow-y-auto mobile-scroll-fix">
          <div className="p-4 pb-8">{renderSectionContent()}</div>
        </div>
      </div>
    );
  }

  // Desktop Layout - ENHANCED SCROLLING
  return (
    <div className="h-full flex flex-col">
      {/* Desktop Header - REMOVED BACK BUTTON */}
      <div className="flex-shrink-0 pt-6 px-6">
        <div className="max-w-7xl mx-auto mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              {t("header.title")}
            </h1>
            <p className="text-muted-foreground">{t("header.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Desktop Content - PROPER FLEX SCROLLING */}
      <div className="flex-1 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Sidebar - Fixed Height */}
            <div className="col-span-12 lg:col-span-3">
              <Card className="medical-card h-fit sticky top-6">
                <CardContent className="p-0">
                  <div className="space-y-1 p-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                          activeSection === item.id
                            ? "bg-primary/10 border border-primary/20 text-primary"
                            : "hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              activeSection === item.id
                                ? "bg-primary/10"
                                : "bg-muted/30 group-hover:bg-muted/50"
                            }`}
                          >
                            <item.icon
                              className={`w-4 h-4 ${
                                activeSection === item.id
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium text-sm ${
                                activeSection === item.id
                                  ? "text-primary"
                                  : "text-foreground"
                              }`}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          </div>
                          {activeSection === item.id && (
                            <ChevronRight className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area - SCROLLABLE */}
            <div className="col-span-12 lg:col-span-9 overflow-y-auto">
              <div className="space-y-6 pb-8">{renderSectionContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
