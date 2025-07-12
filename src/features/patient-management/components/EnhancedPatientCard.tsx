import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    FileText,
    Heart,
    History,
    Pill,
    Play,
    Shield,
    User
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Import centralized types
import {
    type Alert,
    type EnhancedPatientCardData,
} from "../../../common/types";

interface EnhancedPatientCardProps {
  patient: EnhancedPatientCardData;
  viewMode?: "compact" | "detailed" | "handover";
  onStartHandover?: (patientId: number) => void;
}

export function EnhancedPatientCard({
  patient,
  viewMode: _viewMode = "compact",
  onStartHandover,
}: EnhancedPatientCardProps) {
  const { t } = useTranslation("enhancedPatientCard");
  const [showIPass, setShowIPass] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
          label: t("status.stable"),
          icon: <CheckCircle className="w-4 h-4" />,
        };
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive shadow-lg shadow-destructive/20";
      case "medium":
        return "border-l-chart-1";
      case "low":
        return "border-l-chart-2";
      default:
        return "border-l-border";
    }
  };

  const getCriticalAlertIcon = (type: string) => {
    switch (type) {
      case "allergy":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "lab_critical":
        return <Activity className="w-4 h-4 text-destructive" />;
      case "medication":
        return <Pill className="w-4 h-4 text-chart-1" />;
      case "vital":
        return <Heart className="w-4 h-4 text-destructive" />;
      case "isolation":
        return <Shield className="w-4 h-4 text-chart-4" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getVitalStatus = (vital: string, value: number | string) => {
    if (typeof value !== 'number') {
      return { status: 'normal', class: 'text-chart-2 bg-chart-2/10' };
    }
    switch (vital) {
      case "heartRate": {
        const hr = value;
        if (hr > 120 || hr < 60)
          return {
            status: "critical",
            class: "text-destructive bg-destructive/10",
          };
        if (hr > 100 || hr < 70)
          return { status: "warning", class: "text-chart-1 bg-chart-1/10" };
        return { status: "normal", class: "text-chart-2 bg-chart-2/10" };
      }
      case "oxygen": {
        const o2 = value;
        if (o2 < 90)
          return {
            status: "critical",
            class: "text-destructive bg-destructive/10",
          };
        if (o2 < 95)
          return { status: "warning", class: "text-chart-1 bg-chart-1/10" };
        return { status: "normal", class: "text-chart-2 bg-chart-2/10" };
      }
      case "temperature": {
        const temp = value;
        if (temp > 39 || temp < 35)
          return {
            status: "critical",
            class: "text-destructive bg-destructive/10",
          };
        if (temp > 38 || temp < 36)
          return { status: "warning", class: "text-chart-1 bg-chart-1/10" };
        return { status: "normal", class: "text-chart-2 bg-chart-2/10" };
      }
      default:
        return { status: "normal", class: "text-chart-2 bg-chart-2/10" };
    }
  };

  const statusConfig = getStatusConfig(patient.status);
  const criticalAlerts = patient.alerts.filter(
    (alert: Alert) => alert.level === "HIGH",
  );

  return (
    <Card
      className={`glass-card rounded-2xl border-l-4 ${getPriorityBorder(patient.priority || "low")} overflow-hidden transition-all duration-200 hover:shadow-lg ${
        criticalAlerts.length > 0 ? "ring-2 ring-destructive/20" : ""
      }`}
    >
      <CardContent className="p-6">
        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
              <span className="font-semibold text-destructive">
                {t("criticalAlerts", { count: criticalAlerts.length })}
              </span>
            </div>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 2).map((alert: Alert, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {getCriticalAlertIcon(alert.type)}
                  <span className="text-destructive font-medium">
                    {alert.alertCatalogItem.description}
                  </span>
                </div>
              ))}
              {criticalAlerts.length > 2 && (
                <div className="text-sm text-destructive">
                  {t("moreAlerts", { count: criticalAlerts.length - 2 })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-foreground text-xl">
                {patient.name}
              </h3>
              <Badge variant="secondary" className="text-sm">
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
                className="text-sm capitalize"
              >
                {patient.priority && t(patient.priority)} {patient.priority && t("priority")}
              </Badge>
              {patient.integrationData?.monitoringActive && (
                <Badge variant="outline" className="text-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  {t("liveMonitoring")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{patient.room}</span>
              <span>•</span>
              <span>
                {t("mrn")} {patient.id.toString().padStart(6, "0")}
              </span>
              <span>•</span>
              <span>
                {t("admitted")}:{" "}
                {new Date(patient.admissionDate || "").toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${statusConfig?.bgColor}`}>
              <div className={statusConfig?.textColor}>
                {statusConfig?.icon}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Diagnosis and I-PASS Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">{patient.diagnosis}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIPass(!showIPass)}
              className="text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              {t("ipass.button")}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {patient.description}
          </p>
        </div>

        {/* I-PASS Protocol Details */}
        {showIPass && patient.iPassData && (
          <div className="mt-4 p-4 bg-muted/50 rounded-xl space-y-4">
            <h4 className="font-semibold text-foreground">
              {t("ipass.title")}
            </h4>
            {[
              {
                letter: "I",
                title: t("ipass.illnessSeverity"),
                content: patient.iPassData?.illness,
              },
              {
                letter: "P",
                title: t("ipass.patientSummary"),
                content: patient.iPassData?.patientSummary,
              },
              {
                letter: "A",
                title: t("ipass.actionList"),
                content: patient.iPassData?.actionList,
              },
              {
                letter: "S",
                title: t("ipass.situationAwareness"),
                content: patient.iPassData?.situationAwareness.join(", "),
              },
              {
                letter: "S",
                title: t("ipass.synthesisByReceiver"),
                content: patient.iPassData?.synthesis,
              },
            ].map((item, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                  {item.letter}
                </div>
                <div>
                  <h5 className="font-medium text-foreground">{item.title}</h5>
                  <p className="text-sm text-muted-foreground">
                    {item.content || t("ipass.notSpecified")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Vitals with Critical Highlighting */}
        {patient.vitals && (
          <div className="mb-4 p-4 bg-secondary/20 rounded-xl">
            <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t("vitals.title")}
              <Badge variant="outline" className="text-xs">
                {t("vitals.updated", {
                  time: patient.integrationData?.labLastSync,
                })}
              </Badge>
            </h5>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(patient.vitals).map(([key, value]) => {
                const vitalStatus = getVitalStatus(key, value as number);
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-lg text-center ${vitalStatus.class}`}
                  >
                    <div className="text-sm capitalize text-muted-foreground">
                      {t(`vitals.types.${key}`)}
                    </div>
                    <div className="font-semibold text-lg">{String(value)}</div>
                    <div className="text-xs opacity-80">
                      {t(`vitals.status.${vitalStatus.status}`)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Medications */}
        {patient.medications && patient.medications.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Pill className="w-4 h-4" /> {t("medications")}
            </h5>
            <div className="flex flex-wrap gap-2">
              {patient.medications.map((med: { name: string; dosage: string }, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-normal"
                >
                  {med.name} {med.dosage}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-destructive mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> {t("allergies")}
            </h5>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy: { substance: string }, index: number) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="text-xs font-normal"
                >
                  {allergy.substance}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Handover History */}
        {showHistory && patient.handoverHistory && (
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              {t("handoverHistory.title")}
            </h5>
            <ul className="space-y-2 text-sm">
              {patient.handoverHistory
                .slice(0, 3)
                .map((handover, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {t("handoverHistory.item", {
                          from: handover.from,
                          to: handover.to,
                        })}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(handover.timestamp).toLocaleDateString()}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Task Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">
              {t("carePlanProgress")}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {patient.completionPercentage || 0}%
            </span>
          </div>
          <Progress
            value={patient.completionPercentage}
            className="h-2"
          />
        </div>

        {/* Key Team Members */}
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-foreground">
            {t("keyTeamMembers")}
          </h4>
          {(patient.medications || []).map(
            (
              member: { name: string; route: string },
              index: number,
            ) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{member.name}</span>
                </div>
                <span className="text-muted-foreground">{member.route}</span>
              </div>
            ),
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{patient.doctor?.replace("Dr. ", "")}</span>
            </div>
            <Button
              onClick={() => onStartHandover && onStartHandover(patient.id)}
              size="sm"
            >
              {t("startHandover")} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
