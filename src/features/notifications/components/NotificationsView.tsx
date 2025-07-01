// COMPONENT UPDATED TO USE COMPOSABLE PATIENT TYPES
// Updated to use centralized patient data instead of hardcoded patient references

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  Filter,
  Info,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Import centralized composable types and patient data
import { type Patient } from "../../../common/types";
import { patients } from "../../../store/patients.store";

interface ServiceAlert {
  id: number;
  type:
    | "infection_control"
    | "pharmacy"
    | "laboratory"
    | "nutrition"
    | "social_work"
    | "quality_safety";
  service: string;
  title: string;
  message: string;
  details: string;
  priority: "HIGH" | "MED" | "INFO";
  patientId?: number; // Reference to patient by ID instead of hardcoded name
  patientName: string | null; // Derived from patient data
  room: string;
  timestamp: Date;
  acknowledged: boolean;
  actionRequired: boolean;
  actions: string[];
}

interface NotificationsViewProps {
  patients?: Patient[]; // Accept patients as props to use our composable types
}

export function NotificationsView({
  patients: patientsProp,
}: NotificationsViewProps = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  // Use provided patients or fallback to centralized patient data
  const patientsData = patientsProp || patients;

  // Service-based alerts referencing actual patient data
  const serviceAlerts: ServiceAlert[] = [
    {
      id: 1,
      type: "infection_control",
      service: "Infection Control Service",
      title: "New MDRO Alert",
      message: `Patient ${patientsData.find((p) => p.id === 1)?.name || "Maria Rodriguez"} (${patientsData.find((p) => p.id === 1)?.room || "PICU-01"}) - OXAB/163 detected. Implement contact precautions immediately.`,
      details:
        "Multi-drug resistant organism detected in respiratory culture. Contact isolation required. Staff must use gown and gloves.",
      priority: "HIGH",
      patientId: 1,
      patientName:
        patientsData.find((p) => p.id === 1)?.name || "Maria Rodriguez",
      room: patientsData.find((p) => p.id === 1)?.room || "PICU-01",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      actionRequired: true,
      actions: [
        "Implement Contact Precautions",
        "Notify Attending Physician",
        "Update Care Plan",
      ],
    },
    {
      id: 2,
      type: "pharmacy",
      service: "Pharmacy Service",
      title: "Drug Allergy Alert",
      message: `Patient ${patientsData.find((p) => p.id === 2)?.name || "Carlos Gonzalez"} (${patientsData.find((p) => p.id === 2)?.room || "PICU-03"}) - Potential drug interaction with new cardiac medication order.`,
      details:
        "ACE inhibitor contraindicated with current diuretic regimen. Recommend alternative medication or dose adjustment.",
      priority: "HIGH",
      patientId: 2,
      patientName:
        patientsData.find((p) => p.id === 2)?.name || "Carlos Gonzalez",
      room: patientsData.find((p) => p.id === 2)?.room || "PICU-03",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      acknowledged: false,
      actionRequired: true,
      actions: [
        "Review Medication Orders",
        "Contact Prescribing Physician",
        "Consider Alternative Therapy",
      ],
    },
    {
      id: 3,
      type: "laboratory",
      service: "Laboratory Service",
      title: "Critical Lab Result",
      message: `Patient ${patientsData.find((p) => p.id === 3)?.name || "Ana Silva"} (${patientsData.find((p) => p.id === 3)?.room || "PICU-05"}) - Glucose level critically high (450 mg/dL).`,
      details:
        "Immediate intervention required. Consider adjusting insulin drip rate and monitoring ketones.",
      priority: "HIGH",
      patientId: 3,
      patientName: patientsData.find((p) => p.id === 3)?.name || "Ana Silva",
      room: patientsData.find((p) => p.id === 3)?.room || "PICU-05",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      acknowledged: true,
      actionRequired: false,
      actions: [
        "Adjust Insulin Protocol",
        "Check Ketones",
        "Notify Endocrinology",
      ],
    },
    {
      id: 4,
      type: "nutrition",
      service: "Nutrition Service",
      title: "Diet Modification Required",
      message: `Patient ${patientsData.find((p) => p.id === 4)?.name || "David Kim"} (${patientsData.find((p) => p.id === 4)?.room || "PICU-07"}) - NPO status needs to be updated for planned procedure.`,
      details:
        "Scheduled for bronchoscopy tomorrow at 10:00 AM. NPO after midnight tonight.",
      priority: "MED",
      patientId: 4,
      patientName: patientsData.find((p) => p.id === 4)?.name || "David Kim",
      room: patientsData.find((p) => p.id === 4)?.room || "PICU-07",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      acknowledged: false,
      actionRequired: true,
      actions: [
        "Update Diet Orders",
        "Notify Nursing Staff",
        "Patient/Family Education",
      ],
    },
    {
      id: 5,
      type: "social_work",
      service: "Social Work Service",
      title: "Discharge Planning Alert",
      message:
        "Patient Emma Johnson (PICU-09) - Home oxygen equipment needs to be arranged.",
      details:
        "Family requires training on home oxygen use and equipment maintenance before discharge.",
      priority: "MED",
      patientId: undefined, // Not in our current patient list
      patientName: "Emma Johnson",
      room: "PICU-09",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      acknowledged: false,
      actionRequired: true,
      actions: [
        "Coordinate Equipment",
        "Schedule Family Training",
        "Confirm Insurance Coverage",
      ],
    },
    {
      id: 6,
      type: "quality_safety",
      service: "Quality & Safety Service",
      title: "Fall Risk Assessment Update",
      message:
        "Multiple patients require fall risk reassessment after medication changes.",
      details:
        "New sedation protocols may affect mobility scores. Please reassess and update safety measures.",
      priority: "INFO",
      patientId: undefined, // Unit-wide alert
      patientName: null,
      room: "Unit-wide",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      acknowledged: true,
      actionRequired: false,
      actions: [
        "Complete Assessments",
        "Update Safety Plans",
        "Document Changes",
      ],
    },
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const getServiceIcon = (type: string) => {
    const icons = {
      infection_control: "🦠",
      pharmacy: "💊",
      laboratory: "🔬",
      nutrition: "🍽️",
      social_work: "👥",
      quality_safety: "🛡️",
    };
    return icons[type as keyof typeof icons] || "📋";
  };

  const getServiceColor = (type: string) => {
    const colors = {
      infection_control: "bg-red-100 text-red-700 border-red-200",
      pharmacy: "bg-purple-100 text-purple-700 border-purple-200",
      laboratory: "bg-blue-100 text-blue-700 border-blue-200",
      nutrition: "bg-green-100 text-green-700 border-green-200",
      social_work: "bg-yellow-100 text-yellow-700 border-yellow-200",
      quality_safety: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-l-destructive",
        };
      case "MED":
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "text-chart-1",
          bgColor: "bg-chart-1/10",
          borderColor: "border-l-chart-1",
        };
      case "INFO":
        return {
          icon: <Info className="w-4 h-4" />,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-l-primary",
        };
      default:
        return {
          icon: <Bell className="w-4 h-4" />,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-l-muted",
        };
    }
  };

  const filteredAlerts = serviceAlerts
    .filter((alert) => {
      if (!showAcknowledged && alert.acknowledged) return false;
      if (filterService !== "all" && alert.type !== filterService) return false;
      if (filterPriority !== "all" && alert.priority !== filterPriority)
        return false;
      if (
        searchTerm &&
        !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !alert.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by priority first (HIGH > MED > INFO), then by timestamp
      const priorityOrder = { HIGH: 3, MED: 2, INFO: 1 };
      const priorityDiff =
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  const stats = {
    total: serviceAlerts.length,
    unacknowledged: serviceAlerts.filter((a) => !a.acknowledged).length,
    high: serviceAlerts.filter((a) => a.priority === "HIGH").length,
    actionRequired: serviceAlerts.filter(
      (a) => a.actionRequired && !a.acknowledged,
    ).length,
  };

  const acknowledgeAlert = (alertId: number) => {
    // In real app, this would make an API call to acknowledge the alert
    console.log(`Acknowledging alert ${alertId}`);
  };

  const uniqueServices = [...new Set(serviceAlerts.map((alert) => alert.type))];

  return (
    <div className={`bg-background ${isMobile ? "" : "h-full"}`}>
      {/* Header */}
      <div className={`${isMobile ? "px-4 pt-4" : "p-6"} pb-2`}>
        <Card className="glass-card rounded-2xl mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-3xl mb-2">Service Alerts</CardTitle>
                <p className="text-muted-foreground">
                  Alerts from hospital services requiring attention
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                    <span className="text-destructive font-medium">
                      {stats.unacknowledged} unacknowledged
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Updated in real-time</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    serviceAlerts.forEach((alert) => acknowledgeAlert(alert.id))
                  }
                >
                  Acknowledge All
                </Button>
              </div>
            </div>

            {/* Desktop Stats */}
            {!isMobile && (
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-semibold text-foreground">
                    {stats.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Alerts
                  </div>
                </div>
                <div className="bg-destructive/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-semibold text-destructive">
                    {stats.high}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    High Priority
                  </div>
                </div>
                <div className="bg-chart-1/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-semibold text-chart-1">
                    {stats.unacknowledged}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Unacknowledged
                  </div>
                </div>
                <div className="bg-primary/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {stats.actionRequired}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Action Required
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className={`${isMobile ? "px-4" : "px-6"} mb-4`}>
        <div
          className={`flex gap-4 ${isMobile ? "flex-col" : "flex-row"} mb-3`}
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts, patients, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {!isMobile && (
            <>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {uniqueServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="HIGH">High Priority</SelectItem>
                  <SelectItem value="MED">Medium Priority</SelectItem>
                  <SelectItem value="INFO">Information</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAcknowledged ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAcknowledged(!showAcknowledged)}
          >
            {showAcknowledged ? "Hide" : "Show"} Acknowledged
          </Button>
        </div>
      </div>

      {/* Service Alerts List */}
      <div className={`${isMobile ? "px-4" : "px-6"} space-y-3 pb-6`}>
        {filteredAlerts.length === 0 ? (
          <Card className="glass-card rounded-2xl p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">
              No alerts found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "All alerts have been acknowledged"}
            </p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => {
            const priorityConfig = getPriorityConfig(alert.priority);

            return (
              <Card
                key={alert.id}
                className={`glass-card rounded-2xl border-l-4 ${priorityConfig.borderColor} overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  !alert.acknowledged ? "ring-1 ring-primary/20" : "opacity-75"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div
                      className={`p-3 rounded-lg border ${getServiceColor(alert.type)}`}
                    >
                      <span className="text-2xl">
                        {getServiceIcon(alert.type)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {alert.title}
                            </h3>
                            <Badge
                              variant={
                                alert.priority === "HIGH"
                                  ? "destructive"
                                  : alert.priority === "MED"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {alert.priority}
                            </Badge>
                            {alert.actionRequired && !alert.acknowledged && (
                              <Badge
                                variant="outline"
                                className="text-xs text-chart-1 border-chart-1"
                              >
                                Action Required
                              </Badge>
                            )}
                            {alert.acknowledged && (
                              <Badge
                                variant="outline"
                                className="text-xs text-chart-2 border-chart-2"
                              >
                                ✓ Acknowledged
                              </Badge>
                            )}
                          </div>

                          <div className="mb-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              {alert.service}
                            </p>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {alert.message}
                          </p>

                          {!isMobile && (
                            <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm text-foreground">
                                {alert.details}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{alert.timestamp.toLocaleString()}</span>
                            {alert.patientName && (
                              <>
                                <span>•</span>
                                <span className="font-medium">
                                  {alert.patientName}
                                </span>
                                <span>•</span>
                                <span>{alert.room}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="p-1 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {alert.actionRequired && !alert.acknowledged && (
                    <div
                      className={`flex gap-2 mt-4 pt-3 border-t border-border ${isMobile ? "flex-col" : "flex-row"}`}
                    >
                      {alert.actions
                        .slice(0, isMobile ? 2 : 3)
                        .map((action, index) => (
                          <Button
                            key={index}
                            variant={index === 0 ? "default" : "outline"}
                            size="sm"
                            className={isMobile ? "w-full" : "flex-1"}
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            {action}
                          </Button>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
