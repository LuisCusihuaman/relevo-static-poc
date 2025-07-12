import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Clock,
    Heart,
    Pill,
    Play,
    Thermometer,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Define PatientCardData interface locally since it needs additional fields
interface PatientCardData {
  id: number;
  name: string;
  age: number;
  room: string;
  admissionDate: string;
  status: "pending" | "in-progress" | "complete";
  priority: "high" | "medium" | "low";
  diagnosis: string;
  description: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygen: number;
  };
  medications: string[];
  allergies: string[];
  completionPercentage: number;
  doctor: string;
  lastUpdated: string;
}

interface PatientCardProps {
  patient: PatientCardData;
}

export function PatientCard({ patient }: PatientCardProps) {
  const { t } = useTranslation("patientCard");
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-chart-1",
          textColor: "text-chart-1",
          bgColor: "bg-chart-1/10",
          label: t("status.pending"),
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case "in-progress":
        return {
          color: "bg-primary",
          textColor: "text-primary",
          bgColor: "bg-primary/10",
          label: t("status.inProgress"),
          icon: <Play className="w-4 h-4" />,
        };
      case "complete":
        return {
          color: "bg-chart-2",
          textColor: "text-chart-2",
          bgColor: "bg-chart-2/10",
          label: t("status.complete"),
          icon: <CheckCircle className="w-4 h-4" />,
        };
      default:
        return {
          color: "bg-muted",
          textColor: "text-muted-foreground",
          bgColor: "bg-muted",
          label: t("status.unknown"),
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive";
      case "medium":
        return "border-l-chart-1";
      case "low":
        return "border-l-chart-2";
      default:
        return "border-l-border";
    }
  };

  const getVitalStatus = (vital: string, value: number | string) => {
    // Simple vital status logic for demonstration
    switch (vital) {
      case "heartRate": {
        const hr = value as number;
        if (hr > 100 || hr < 60) return "warning";
        return "normal";
      }
      case "oxygen": {
        const o2 = value as number;
        if (o2 < 95) return "critical";
        if (o2 < 98) return "warning";
        return "normal";
      }
      case "temperature": {
        const temp = value as number;
        if (temp > 38 || temp < 36) return "warning";
        return "normal";
      }
      default:
        return "normal";
    }
  };

  const statusConfig = getStatusConfig(patient.status);

  return (
    <div
      className={`glass-card rounded-2xl border-l-4 ${getPriorityBorder(patient.priority)} overflow-hidden transition-all duration-200 hover:shadow-lg`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-foreground text-lg">
                {patient.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {t("age", { age: patient.age })}
              </Badge>
              <Badge
                variant={
                  patient.priority === "high"
                    ? "destructive"
                    : patient.priority === "medium"
                      ? "default"
                      : "secondary"
                }
                className="text-xs capitalize"
              >
                {t(patient.priority)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{patient.room}</span>
              <span>•</span>
              <span>
                {t("id")} {patient.id.toString().padStart(4, "0")}
              </span>
              <span>•</span>
              <span>
                {t("admitted")}:{" "}
                {new Date(patient.admissionDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
            <div className={statusConfig.textColor}>{statusConfig.icon}</div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-1">
            {patient.diagnosis}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {patient.description}
          </p>
        </div>

        {/* Vitals - Always visible on desktop, collapsible on mobile */}
        {(!isMobile || showDetails) && (
          <div className="mb-4 p-3 bg-secondary/30 rounded-xl">
            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t("vitals.title")}
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart
                    className={`w-4 h-4 ${
                      getVitalStatus("heartRate", patient.vitals.heartRate) ===
                      "warning"
                        ? "text-chart-1"
                        : "text-chart-2"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t("vitals.hr")}
                  </span>
                </div>
                <div className="font-semibold text-foreground">
                  {patient.vitals.heartRate}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("vitals.bpm")}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {t("vitals.bp")}
                  </span>
                </div>
                <div className="font-semibold text-foreground">
                  {patient.vitals.bloodPressure}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("vitals.mmHg")}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Thermometer
                    className={`w-4 h-4 ${
                      getVitalStatus(
                        "temperature",
                        patient.vitals.temperature,
                      ) === "warning"
                        ? "text-chart-1"
                        : "text-chart-2"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t("vitals.temp")}
                  </span>
                </div>
                <div className="font-semibold text-foreground">
                  {patient.vitals.temperature}°C
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("vitals.celsius")}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity
                    className={`w-4 h-4 ${
                      getVitalStatus("oxygen", patient.vitals.oxygen) ===
                      "critical"
                        ? "text-destructive"
                        : getVitalStatus("oxygen", patient.vitals.oxygen) ===
                            "warning"
                          ? "text-chart-1"
                          : "text-chart-2"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t("vitals.o2")}
                  </span>
                </div>
                <div className="font-semibold text-foreground">
                  {patient.vitals.oxygen}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("vitals.saturation")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medications and Allergies - Desktop only or when details shown */}
        {(!isMobile || showDetails) && (
          <div className="mb-4 space-y-3">
            <div>
              <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                {t("medications")}
              </h5>
              <div className="flex flex-wrap gap-1">
                {patient.medications.map((med, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {med}
                  </Badge>
                ))}
              </div>
            </div>
            {patient.allergies.length > 0 && (
              <div>
                <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  {t("allergies")}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="text-xs"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress for in-progress patients */}
        {patient.status === "in-progress" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("treatmentProgress")}
              </span>
              <span className="text-sm font-medium text-primary">
                {patient.completionPercentage}%
              </span>
            </div>
            <Progress value={patient.completionPercentage} className="h-2" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {patient.doctor.replace("Dr. ", "")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {patient.lastUpdated}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs"
              >
                {showDetails ? t("less") : t("more")}
              </Button>
            )}
            <Button size="sm" className="flex items-center gap-2">
              {t(`action.${patient.status}`)}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
