import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Clock,
  Users
} from "lucide-react";
import { useState } from "react";

// Import types
import { ActivityFeed, type ActivityItem } from "@/features/handover/components/ActivityFeed";
import { MainContent } from "@/features/handover/layout/MainContent";
import type { DesktopPatient, SyncStatus, User } from "../../common/types";

interface FigmaDesktopLayoutProps {
  patients?: DesktopPatient[];
  currentDoctor: string;
  unit: string;
  shift: string;
  onCommandPalette: () => void;
  onStartHandover: (patientId?: number) => void;
  onPatientHandover: (patientId: number) => void;
}

// Simplified Action Items - More realistic
const actionItems = [
  {
    id: 1,
    patient: "Maria Rodriguez",
    room: "PICU-01",
    title: "Respiratory therapy consultation",
    description: "Evaluate O2 requirements and weaning potential",
    priority: "high",
    status: "pending",
    timeframe: "Within 2 hours",
    assignedTo: "Dr. Martinez",
    assignedInitials: "DM",
    completed: false,
  },
  {
    id: 2,
    patient: "Carlos Gonzalez",
    room: "PICU-03",
    title: "Monitor O2 saturation",
    description: "Check q2h, maintain SpO2 >92%",
    priority: "high",
    status: "active",
    timeframe: "Every 2 hours",
    assignedTo: "Nursing Team",
    assignedInitials: "NT",
    completed: false,
  },
  {
    id: 3,
    patient: "Ana Silva",
    room: "PICU-05",
    title: "Family meeting - discharge planning",
    description: "Discuss timeline and home care needs",
    priority: "medium",
    status: "scheduled",
    timeframe: "Tomorrow 2 PM",
    assignedTo: "Dr. Wilson",
    assignedInitials: "DW",
    completed: false,
  },
  {
    id: 4,
    patient: "David Kim",
    room: "PICU-07",
    title: "Social work consultation",
    description: "Assess discharge needs and home safety",
    priority: "medium",
    status: "completed",
    timeframe: "Completed 1h ago",
    assignedTo: "Social Worker",
    assignedInitials: "SW",
    completed: true,
  },
];

// Recent Activity - For right sidebar
const recentUpdates = [
  {
    id: 1,
    type: "Clinical summary updated",
    timestamp: "11:39 AM",
    author: "fwefewewewf",
    details: "Updated patient overview and current medications",
  },
  {
    id: 2,
    type: "Action items reviewed",
    timestamp: "10:15 AM",
    author: "Dr. Martinez",
    details: "Reviewed respiratory therapy consultation status",
  },
  {
    id: 3,
    type: "Severity assessment updated",
    timestamp: "9:42 AM",
    author: "Nursing Team",
    details: "Patient condition assessment and monitoring updates",
  },
  {
    id: 4,
    type: "Medication review completed",
    timestamp: "8:30 AM",
    author: "Dr. Wilson",
    details: "Reviewed current medication list and dosages",
  },
  {
    id: 5,
    type: "Lab results reviewed",
    timestamp: "7:15 AM",
    author: "Dr. Chen",
    details: "Morning lab results analysis and documentation",
  },
  {
    id: 6,
    type: "Family communication",
    timestamp: "6:45 AM",
    author: "Social Worker",
    details: "Updated family on patient status and discharge planning",
  },
];

export function FigmaDesktopLayout({
  patients = [],
  currentDoctor,
  unit: _unit,
  shift: _shift,
  onCommandPalette: _onCommandPalette,
  onStartHandover,
  onPatientHandover: _onPatientHandover,
}: FigmaDesktopLayoutProps) {
  // Safe array operations with fallbacks
  const safePatients = Array.isArray(patients) ? patients : [];
  const [selectedPatient, setSelectedPatient] = useState<DesktopPatient | null>(
    safePatients.length > 0 ? safePatients[0] : null,
  );
  const [actionItemsState, setActionItemsState] = useState(actionItems);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced");
  const [handoverComplete, setHandoverComplete] = useState(false);

  const currentUser: User = {
    name: currentDoctor,
    role: "Senior Practitioner",
    shift: _shift,
    initials: currentDoctor
      .split(" ")
      .map((n) => n[0])
      .join(""),
  };

  const activityFeedItems: ActivityItem[] = recentUpdates.map((update) => {
    const getInitials = (name: string) =>
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    let itemType: ActivityItem["type"] = "content_updated";
    if (update.type.includes("reviewed")) {
      itemType = "content_viewed";
    } else if (update.type.includes("added")) {
      itemType = "content_added";
    }

    return {
      id: update.id,
      user: update.author,
      userInitials: getInitials(update.author),
      userColor: "bg-gray-400",
      action: update.type,
      section: "Patient Record",
      time: update.timestamp,
      type: itemType,
    };
  });

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "unstable":
        return "Critical";
      case "watcher":
        return "Watch";
      case "stable":
        return "Stable";
      default:
        return "Unknown";
    }
  };

  // Much more subtle, professional medical colors - barely visible dots
  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case "unstable":
        return "bg-neutral-400/40"; // Very subtle neutral with slight tint
      case "watcher":
        return "bg-neutral-400/35"; // Very subtle neutral with slight tint
      case "stable":
        return "bg-neutral-400/30"; // Very subtle neutral with slight tint
      default:
        return "bg-neutral-300/50";
    }
  };

  // Much more muted text colors - professional neutral grays
  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "unstable":
        return "text-neutral-600"; // Neutral gray (no red)
      case "watcher":
        return "text-neutral-600"; // Neutral gray (no amber)
      case "stable":
        return "text-neutral-600"; // Neutral gray (no green)
      default:
        return "text-neutral-500";
    }
  };

  const getSeverityUrgency = (severity: string) => {
    switch (severity) {
      case "unstable":
        return "high";
      case "watcher":
        return "medium";
      case "stable":
        return "low";
      default:
        return "low";
    }
  };

  const handleActionToggle = (actionId: number) => {
    setActionItemsState((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? {
              ...action,
              completed: !action.completed,
              status: !action.completed ? "completed" : "pending",
            }
          : action,
      ),
    );
  };

  // Calculate severity counts
  const severityCounts = safePatients.reduce(
    (acc, patient) => {
      if (patient && patient.illnessSeverity) {
        acc[patient.illnessSeverity] = (acc[patient.illnessSeverity] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get critical information for selected patient
  const getCriticalInfo = (patient: DesktopPatient | null) => {
    if (!patient) return null;

    const urgency = getSeverityUrgency(patient.illnessSeverity);
    const hasAlerts = patient.alerts && patient.alerts.length > 0;

    return {
      needsAttention: urgency === "high" || hasAlerts,
      nextAction:
        urgency === "high"
          ? "Monitor closely"
          : urgency === "medium"
            ? "Check in 2h"
            : "Routine care",
      timeframe:
        urgency === "high"
          ? "Immediate"
          : urgency === "medium"
            ? "2 hours"
            : "4-6 hours",
    };
  };

  // Early return for no patients
  if (!safePatients || safePatients.length === 0) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Patients Available
          </h3>
          <p className="text-muted-foreground">
            Please check your patient data or contact support.
          </p>
        </div>
      </div>
    );
  }

  const criticalInfo = getCriticalInfo(selectedPatient);
  const pendingActions = actionItemsState.filter((a) => !a.completed).length;
  const highPriorityActions = actionItemsState.filter(
    (a) => !a.completed && a.priority === "high",
  ).length;

  return (
    <div className="h-full bg-background">
      {/* Simplified Header - Focus on Critical Info */}
      <div className="border-b border-border/20 bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {selectedPatient ? selectedPatient.name : "Patient Overview"}
                </h1>
                {selectedPatient && (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getSeverityDot(selectedPatient.illnessSeverity)}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {getSeverityText(selectedPatient.illnessSeverity)}
                      </span>
                    </div>
                    {criticalInfo?.needsAttention && (
                      <Badge
                        variant="outline"
                        className="text-xs border-amber-200 bg-amber-50 text-amber-700"
                      >
                        Needs Attention
                      </Badge>
                    )}
                  </>
                )}
              </div>
              {selectedPatient && (
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>
                    <strong>Room:</strong> {selectedPatient.room}
                  </span>
                  <span>
                    <strong>Age:</strong> {selectedPatient.age}
                  </span>
                  <span>
                    <strong>MRN:</strong> A211370
                  </span>
                  <span>
                    <strong>Diagnosis:</strong>{" "}
                    {selectedPatient.primaryDiagnosis}
                  </span>
                  {criticalInfo && (
                    <span className="text-primary">
                      <strong>Next:</strong> {criticalInfo.nextAction} (
                      {criticalInfo.timeframe})
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  selectedPatient && onStartHandover(selectedPatient.id)
                }
                className="bg-primary hover:bg-primary/90"
              >
                Start Handover
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout - Correct I-PASS Structure */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Much More Subtle Status Colors */}
        <div className="w-80 border-r border-border/20 bg-background">
          <div className="p-4 border-b border-border/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Patients</h3>
              <Badge variant="outline" className="text-xs">
                {safePatients.length}
              </Badge>
            </div>

            {/* Much More Subtle Priority Summary - Professional Medical Style */}
            <div className="flex items-center gap-4 p-3 bg-neutral-50/30 rounded-lg border border-border/20">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/40" />
                <span className="text-sm font-medium text-neutral-600">
                  {severityCounts.unstable || 0} Critical
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/35" />
                <span className="text-sm font-medium text-neutral-600">
                  {severityCounts.watcher || 0} Watch
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/30" />
                <span className="text-sm font-medium text-neutral-600">
                  {severityCounts.stable || 0} Stable
                </span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {/* Sort patients by severity - unstable first */}
              {safePatients
                .sort((a, b) => {
                  const severityOrder = { unstable: 0, watcher: 1, stable: 2 };
                  return (
                    severityOrder[a.illnessSeverity] -
                    severityOrder[b.illnessSeverity]
                  );
                })
                .map((patient) => {
                  if (!patient || !patient.id) return null;

                  const isSelected = selectedPatient?.id === patient.id;
                  const urgency = getSeverityUrgency(patient.illnessSeverity);

                  return (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 border ${
                        isSelected
                          ? "border-primary/30 bg-primary/5 shadow-sm"
                          : "border-border/20 hover:bg-neutral-50/50 hover:border-border/40"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header - Room + Severity + Alert */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs font-semibold bg-primary/10 border-primary/20 text-primary px-2 py-0.5"
                            >
                              {patient.room || "N/A"}
                            </Badge>
                            <div
                              className={`w-2 h-2 rounded-full ${getSeverityDot(patient.illnessSeverity || "stable")}`}
                            />
                          </div>
                          {patient.alerts && patient.alerts.length > 0 && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>

                        {/* Patient Name - Larger and More Prominent */}
                        <div className="font-semibold text-sm text-foreground">
                          {patient.name || "Unknown Patient"}
                        </div>

                        {/* Patient Info Row - Using Much More Subtle Colors */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Age {patient.age || "N/A"}
                          </div>
                          <div
                            className={`text-xs font-medium ${getSeverityTextColor(patient.illnessSeverity || "stable")}`}
                          >
                            {getSeverityText(
                              patient.illnessSeverity || "stable",
                            )}
                          </div>
                        </div>

                        {/* Show diagnosis for critical patients or when selected */}
                        {(urgency === "high" || isSelected) && (
                          <div className="text-xs text-foreground/80 leading-relaxed">
                            {patient.primaryDiagnosis &&
                            patient.primaryDiagnosis.length > 45
                              ? `${patient.primaryDiagnosis.substring(0, 45)}...`
                              : patient.primaryDiagnosis ||
                                "No diagnosis available"}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Correct I-PASS Framework Structure */}
        <div className="flex-1 overflow-auto">
          <MainContent
            focusMode={true}
            layoutMode="single"
            expandedSections={{
              illness: true,
              patient: true,
              actions: true,
              awareness: true,
              synthesis: true,
            }}
            handleOpenDiscussion={() => {}}
            handleOpenFullscreenEdit={() => {}}
            syncStatus={syncStatus}
            setSyncStatus={setSyncStatus}
            setHandoverComplete={setHandoverComplete}
            getSessionDuration={() => "00:00"}
            currentUser={currentUser}
          />
        </div>

        {/* Right Sidebar - Recent Updates Timeline */}
        <div className="w-80 border-l border-border/20 bg-background">
          <div className="p-4 border-b border-border/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Recent Updates</h3>
            </div>
          </div>
          <ActivityFeed items={activityFeedItems} onNavigateToSection={() => {}} />
        </div>
      </div>
    </div>
  );
}
