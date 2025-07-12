import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type RecentActivity } from "../../../common/types";
import {
  recentActivities,
  upcomingTasks,
} from "../../../store/shift.store";
import {
  recentActivitiesES,
  upcomingTasksES,
} from "../../../store/shift.store.es";
import { mockUserProfile } from "../../../store/user.store";
import { mockUserProfileES } from "../../../store/user.store.es";

interface DoctorContext {
  id: string;
  name: string;
  role: string;
  unit: string;
  shift: string;
  assignedPatients: number[];
}

interface UnitStatus {
  name: string;
  capacity: number;
  occupied: number;
  critical: number;
  staffOnDuty: number;
  lastHandover: string;
}

export function ContextAwareDashboard() {
  const { t, i18n } = useTranslation("contextAwareDashboard");
  const [currentDoctor] = useState<DoctorContext>({
    id: "dr_chen_001",
    name: "Dr. Sarah Chen",
    role: "Pediatric ICU Attending",
    unit: "PICU",
    shift: "Morning (08:00-16:00)",
    assignedPatients: [1, 2, 3, 5],
  });

  const [unitStatus] = useState<UnitStatus>({
    name: "Pediatric ICU",
    capacity: 12,
    occupied: 9,
    critical: 3,
    staffOnDuty: 8,
    lastHandover: "08:00 AM Today",
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  const currentUserProfile =
    i18n.language === "es" ? mockUserProfileES : mockUserProfile;
  const currentUpcomingTasks =
    i18n.language === "es" ? upcomingTasksES : upcomingTasks;
  const currentRecentActivity =
    i18n.language === "es" ? recentActivitiesES : recentActivities;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Welcome Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {t("welcome", { name: currentUserProfile.name })}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>{currentUserProfile.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentDoctor.shift}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("unit", { name: currentUserProfile.department })}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Assigned Patients */}
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-primary mb-1">
                {currentDoctor.assignedPatients.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("assignedPatients")}
              </div>
            </div>

            {/* Unit Capacity */}
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-foreground mb-1">
                {unitStatus.occupied}/{unitStatus.capacity}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("unitCapacity")}
              </div>
            </div>

            {/* Critical Patients */}
            <div className="bg-destructive/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-destructive mb-1">
                {unitStatus.critical}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("criticalStatus")}
              </div>
            </div>

            {/* Staff on Duty */}
            <div className="bg-chart-2/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-chart-2 mb-1">
                {unitStatus.staffOnDuty}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("staffOnDuty")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("todaysSchedule")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentUpcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="text-sm font-medium text-primary min-w-[3rem]">
                    {task.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {task.task}
                    </p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {t(
                      `priorities.${task.priority}`
                    )}
                  </Badge>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4" variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              {t("viewFullSchedule")}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t("recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentRecentActivity.map((activity: RecentActivity, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {activity.details}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{activity.timestamp}</span>
                      <span>•</span>
                      <span>{activity.doctor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4" variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              {t("viewAllActivity")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Unit Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("overview", { name: unitStatus.name })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{t("unitStatus")}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("currentPatients")}
                  </span>
                  <span className="font-medium">{unitStatus.occupied}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("availableBeds")}
                  </span>
                  <span className="font-medium">
                    {unitStatus.capacity - unitStatus.occupied}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("staffMembers")}
                  </span>
                  <span className="font-medium">{unitStatus.staffOnDuty}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">
                {t("handoverSchedule")}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("lastHandover")}
                  </span>
                  <span className="font-medium">{unitStatus.lastHandover}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("nextHandover")}
                  </span>
                  <span className="font-medium">16:00 PM Today</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("status")}</span>
                  <Badge variant="default" className="text-xs">
                    {t("normalOperations")}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">
                {t("quickActions")}
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {t("startHandover")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("teamChat")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {t("reportIssue")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
