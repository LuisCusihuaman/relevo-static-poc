import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Eye,
  FileText,
  Play,
  Users,
} from "lucide-react";

// Import proper Patient type and alert utilities
import {
  type Patient,
  getAlertCount,
  getCriticalAlertCount,
} from "../../../common/types";

interface SimplePatientCardProps {
  patient: Patient;
  onOpenHandover: (patientId: number) => void;
  onPatientSelect?: (patientId: number) => void; // NEW: Optional patient selection handler
}

export function SimplePatientCard({
  patient,
  onOpenHandover,
  onPatientSelect,
}: SimplePatientCardProps) {
  // Get alert counts using proper Alert system
  const criticalAlerts = getCriticalAlertCount(patient.alerts);
  const totalAlerts = getAlertCount(patient.alerts);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "unstable":
        return {
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: AlertTriangle,
        };
      case "watcher":
        return {
          color: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: Eye,
        };
      case "stable":
        return {
          color: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
        };
      default:
        return {
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: Activity,
        };
    }
  };

  const severityConfig = getSeverityConfig(patient.illnessSeverity);
  const SeverityIcon = severityConfig.icon;

  // Helper function to format section names for display
  const formatSectionName = (section: string) => {
    const formatted = section
      .replace("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Make it more clear what this means
    switch (section) {
      case "illness_severity":
        return "Severity assessed";
      case "patient_summary":
        return "Summary updated";
      case "action_list":
        return "Actions documented";
      case "situation_awareness":
        return "Situation noted";
      default:
        return formatted;
    }
  };

  // UPDATED: Handle card click to show patient details
  const handleCardClick = () => {
    if (onPatientSelect) {
      onPatientSelect(patient.id);
    }
  };

  return (
    // UPDATED: Make card clickable when onPatientSelect is provided
    <div
      className={`bg-background rounded-lg p-4 transition-colors ${
        onPatientSelect
          ? "hover:bg-muted/30 cursor-pointer"
          : "hover:bg-muted/30"
      }`}
      onClick={onPatientSelect ? handleCardClick : undefined}
      onKeyDown={
        onPatientSelect
          ? (e) => (e.key === "Enter" || e.key === " ") && handleCardClick()
          : undefined
      }
      role={onPatientSelect ? "button" : undefined}
      tabIndex={onPatientSelect ? 0 : undefined}
    >
      <div className="space-y-3">
        {/* Header Row - Streamlined */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-base truncate">
                {patient.name}
              </h3>
              {patient.status === "pending" &&
                patient.name === "Maria Rodriguez" && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Incoming
                  </Badge>
                )}
              {/* NEW: Visual indicator when card is clickable */}
              {onPatientSelect && (
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{patient.age}y</span>
              <span>•</span>
              <span className="font-medium">{patient.room}</span>
              <span>•</span>
              <span>{patient.mrn}</span>
            </div>
          </div>

          {/* Medical Priority - Clean severity badge only */}
          <Badge
            className={`text-xs font-medium ${severityConfig.color} ${severityConfig.bgColor} ${severityConfig.borderColor} border-2`}
          >
            <SeverityIcon className="w-3 h-3 mr-1" />
            {patient.illnessSeverity.charAt(0).toUpperCase() +
              patient.illnessSeverity.slice(1)}
          </Badge>
        </div>

        {/* Diagnosis - Clean and prominent */}
        <p className="text-sm text-foreground leading-relaxed font-medium">
          {patient.diagnosis.primary}
        </p>

        {/* Bottom Row - Clean information layout */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm">
            {/* Critical Alerts - Only if present */}
            {criticalAlerts > 0 && (
              <div className="flex items-center gap-1 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{criticalAlerts} Critical</span>
              </div>
            )}

            {/* Multiple Alerts - Only if no critical but many alerts */}
            {criticalAlerts === 0 && totalAlerts > 2 && (
              <div className="flex items-center gap-1 text-yellow-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{totalAlerts} Alerts</span>
              </div>
            )}

            {/* CLEARER: Last Documentation Status */}
            {patient.lastIPassUpdate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span className="text-xs">
                  {formatSectionName(patient.lastIPassUpdate.section)}
                </span>
              </div>
            )}

            {/* Active Collaboration */}
            {patient.collaborators > 1 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-xs">{patient.collaborators} active</span>
              </div>
            )}

            {/* Last Update Time */}
            <span className="text-xs text-muted-foreground">
              {patient.lastUpdate}
            </span>
          </div>

          {/* Action Button - Clean and prominent */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card click
              onOpenHandover(patient.id);
            }}
            className="h-8 text-xs px-3 gap-2 border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Play className="w-3 h-3" />
            Start Handover
          </Button>
        </div>
      </div>
    </div>
  );
}
