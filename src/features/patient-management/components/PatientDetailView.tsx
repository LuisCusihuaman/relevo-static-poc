import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  FileText,
  MapPin,
  Play,
  Plus,
  Stethoscope,
  Target,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Import patient data types
import { type Patient } from "../../../common/types";
import { getUnitName } from "../../../store/config.store";

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
  onStartHandover: (patientId: number) => void;
  onOpenDocumentation: (patientId: number, section?: string) => void;
}

interface Action {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueTime?: string;
  timeframe?: string;
  completedTime?: string;
}

interface IPassSection {
  lastUpdated: string;
  updatedBy?: string;
  content?: string;
  section?: string;
  alerts?: { level: string; message: string }[];
  totalActions?: number;
  completed?: number;
  remaining?: number;
  urgent?: number;
  pending?: number;
  actions?: Action[];
}

interface DetailedIPassData {
  [key: number]: {
    clinicalSummary: IPassSection;
    currentSituation: IPassSection;
    ipassPlans: IPassSection;
    actionList: IPassSection;
  };
}

// Mock detailed I-PASS data (in real app, this would come from API)
const mockDetailedIPassData: DetailedIPassData = {
  1: {
    clinicalSummary: {
      lastUpdated: "11:39 AM",
      updatedBy: "Dr. Martinez",
      content: `8-year-old female with acute respiratory failure - Community-acquired pneumonia, Asthma exacerbation. Patient has been responding well to bronchodilator therapy and systemic corticosteroids.

Past Medical History: Asthma (mild persistent), no previous hospitalizations

Current Medications: Albuterol nebulizer q4h, Prednisolone 1mg/kg daily, Azithromycin 10mg/kg daily`,
      section: "patient_summary",
    },
    currentSituation: {
      lastUpdated: "10:15 AM",
      content: `Patient is currently stable but requires close monitoring due to respiratory status changes.

Vital Signs: BP 95/60, HR 110, RR 28, SpO2 96% on 2L O2, Temp 37.2°C

Recent Changes: O2 requirements reduced from 4L to 2L over past 24h. Increased mobility and appetite noted.`,
      alerts: [
        { level: "medium", message: "Monitor respiratory status q2h" },
        { level: "low", message: "Encourage oral intake and mobility" },
      ],
    },
    ipassPlans: {
      lastUpdated: "9:30 AM",
      content: `Contingency plans for respiratory distress, discharge planning in progress...

Discharge Criteria:
- SpO2 >95% on room air for 12+ hours
- Tolerating oral medications
- Parent education completed

Contingency Plans:
- If increased work of breathing: Increase O2, consider high-flow nasal cannula
- If fever >38.5°C: Blood cultures, consider antibiotic adjustment`,
      section: "synthesis_plans",
    },
    actionList: {
      lastUpdated: "8:45 AM",
      totalActions: 6,
      completed: 1,
      remaining: 3,
      urgent: 2,
      pending: 3,
      actions: [
        {
          id: 1,
          title: "Respiratory therapy consultation",
          description: "Evaluate O2 requirements and weaning potential",
          priority: "high",
          status: "pending",
          assignedTo: "DM",
          dueTime: "Within 2 hours",
          timeframe: "Within 2 hours",
        },
        {
          id: 2,
          title: "Monitor O2 saturation",
          description: "Check q2h, maintain SpO2 >92%",
          priority: "high",
          status: "pending",
          assignedTo: "NT",
          dueTime: "Ongoing",
          timeframe: "q2h",
        },
        {
          id: 3,
          title: "Parent education - discharge prep",
          description: "Inhaler technique, signs of deterioration",
          priority: "medium",
          status: "pending",
          assignedTo: "RN",
          dueTime: "Before discharge",
          timeframe: "Today",
        },
        {
          id: 4,
          title: "Chest physiotherapy",
          description: "Assess need for continued therapy",
          priority: "low",
          status: "completed",
          assignedTo: "PT",
          completedTime: "7:30 AM",
        },
      ],
    },
  },
  // Add mock data for other patients as needed
  7: {
    clinicalSummary: {
      lastUpdated: "12:15 PM",
      content: `5-year-old male with severe sepsis, multi-organ dysfunction. Patient admitted 3 days ago with fever, lethargy, and decreased oral intake.`,
      section: "patient_summary",
    },
    currentSituation: {
      lastUpdated: "11:45 AM",
      content: `Patient remains critically ill requiring intensive monitoring and support.

Vital Signs: BP 85/45 (on norepinephrine), HR 140, RR 32, SpO2 98% on mechanical ventilation
Recent Changes: Lactate trending down from 4.2 to 2.8 mmol/L`,
      alerts: [
        { level: "high", message: "Critical - requires q1h vital signs" },
        { level: "high", message: "Vasopressor dependent" },
      ],
    },
    actionList: {
      lastUpdated: "11:45 AM",
      totalActions: 8,
      completed: 2,
      remaining: 6,
      urgent: 4,
      pending: 6,
      actions: [
        {
          id: 1,
          title: "Blood cultures - follow up",
          description: "Check results and adjust antibiotics if needed",
          priority: "urgent",
          status: "pending",
          assignedTo: "MD",
          timeframe: "STAT",
        },
      ],
    },
    ipassPlans: {
      lastUpdated: "12:15 PM",
      content: "No plans documented yet.",
    },
  },
};

export function PatientDetailView({
  patient,
  onBack,
  onStartHandover,
  onOpenDocumentation,
}: PatientDetailViewProps) {
  const { t } = useTranslation("patientDetailView");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["clinical-summary"]),
  );

  // Get detailed I-PASS data for this patient
  const ipassData = mockDetailedIPassData[patient.id] || {};

  // Get severity configuration
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "unstable":
        return {
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: AlertTriangle,
          label: t("severity.unstable"),
        };
      case "watcher":
        return {
          color: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: Eye,
          label: t("severity.watcher"),
        };
      case "stable":
        return {
          color: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          label: t("severity.stable"),
        };
      default:
        return {
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: Activity,
          label: t("severity.unknown"),
        };
    }
  };

  const severityConfig = getSeverityConfig(patient.illnessSeverity);
  const SeverityIcon = severityConfig.icon;

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-700 bg-red-50 border-red-200";
      case "high":
        return "text-red-700 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-50 border-green-200";
      case "pending":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "overdue":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("header.back")}
            </Button>
            <div className="h-4 w-px bg-border/50" />
            <h1 className="font-semibold text-foreground">
              {t("header.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenDocumentation(patient.id)}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {t("header.ipass")}
            </Button>
            <Button
              onClick={() => onStartHandover(patient.id)}
              size="sm"
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {t("header.startHandover")}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Patient Header */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {patient.name}
                    </h2>
                    <Badge
                      className={`${severityConfig.color} ${severityConfig.bgColor} ${severityConfig.borderColor} border`}
                    >
                      <SeverityIcon className="w-3 h-3 mr-1" />
                      {severityConfig.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{t("patientHeader.age", { age: patient.age })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{patient.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>
                        {t("patientHeader.mrn")} {patient.mrn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Stethoscope className="w-4 h-4" />
                      <span>{getUnitName(patient.unit || "picu")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground">
                    {t("patientHeader.diagnosis")}:
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {t("patientHeader.nextCheck")}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {patient.diagnosis.primary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* I-PASS Sections */}
          <div className="space-y-4">
            {/* Clinical Summary */}
            <Collapsible
              open={expandedSections.has("clinical-summary")}
              onOpenChange={() => toggleSection("clinical-summary")}
            >
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">
                          {t("sections.clinicalSummary.title")}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs bg-primary/10 text-primary border-primary/30"
                        >
                          {t("sections.clinicalSummary.ipass")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {t("sections.readOnly")}
                        </Badge>
                        {ipassData.clinicalSummary && (
                          <span className="text-xs text-muted-foreground">
                            {t("sections.lastUpdated", {
                              time: ipassData.clinicalSummary.lastUpdated,
                            })}
                          </span>
                        )}
                      </div>
                      {expandedSections.has("clinical-summary") ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground mb-3">
                      {t("sections.clinicalSummary.editNote.start")}{" "}
                      <button
                        onClick={() =>
                          onOpenDocumentation(patient.id, "patient_summary")
                        }
                        className="text-primary hover:underline"
                      >
                        {t("header.startHandover")}
                      </button>{" "}
                      {t("sections.clinicalSummary.editNote.end")}
                    </div>
                    {ipassData.clinicalSummary ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-sm text-foreground leading-relaxed">
                          {ipassData.clinicalSummary.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {t("sections.clinicalSummary.noData")}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Current Situation */}
            <Collapsible
              open={expandedSections.has("current-situation")}
              onOpenChange={() => toggleSection("current-situation")}
            >
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <CardTitle className="text-lg">
                          {t("sections.currentSituation.title")}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                        >
                          {t("sections.currentSituation.ipass")}
                        </Badge>
                      </div>
                      {expandedSections.has("current-situation") ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {ipassData.currentSituation ? (
                      <div className="space-y-4">
                        <div className="whitespace-pre-line text-sm text-foreground leading-relaxed">
                          {ipassData.currentSituation.content}
                        </div>
                        {ipassData.currentSituation.alerts && (
                          <div className="space-y-2">
                            {ipassData.currentSituation.alerts.map((alert) => (
                              <div
                                key={alert.level}
                                className={`flex items-center gap-2 p-2 rounded-md border text-xs ${
                                  alert.level === "high"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : alert.level === "medium"
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>{alert.message}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {t("sections.currentSituation.noData")}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* I-PASS Plans */}
            <Collapsible
              open={expandedSections.has("ipass-plans")}
              onOpenChange={() => toggleSection("ipass-plans")}
            >
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg">
                          {t("sections.ipassPlans.title")}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {t("sections.ipassPlans.ipass")}
                        </Badge>
                      </div>
                      {expandedSections.has("ipass-plans") ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {ipassData.ipassPlans ? (
                      <div className="text-sm text-muted-foreground">
                        {ipassData.ipassPlans.content}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {t("sections.ipassPlans.noData")}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Action List */}
            <Collapsible
              open={expandedSections.has("action-list")}
              onOpenChange={() => toggleSection("action-list")}
            >
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-green-600" />
                        <CardTitle className="text-lg">
                          {t("sections.actionList.title")}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          {t("sections.actionList.ipass")}
                        </Badge>
                        {ipassData.actionList && (
                          <>
                            <Badge
                              variant="outline"
                              className="text-xs bg-red-50 text-red-700 border-red-200"
                            >
                              {t("sections.actionList.urgent", {
                                count: ipassData.actionList.urgent,
                              })}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                            >
                              {t("sections.actionList.pending", {
                                count: ipassData.actionList.pending,
                              })}
                            </Badge>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs ml-auto mr-4"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {t("sections.actionList.addAction")}
                        </Button>
                      </div>
                      {expandedSections.has("action-list") ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-4 space-y-4">
                    {ipassData.actionList?.actions?.map((action) => (
                      <div
                        key={action.id}
                        className={`p-3 border rounded-lg ${getStatusColor(action.status)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  action.priority === "urgent" ||
                                  action.priority === "high"
                                    ? "bg-red-500"
                                    : action.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                }`}
                              />
                              <h4 className="font-medium text-sm text-foreground">
                                {action.title}
                              </h4>
                              <Badge
                                className={`text-xs ${getPriorityColor(action.priority)}`}
                              >
                                {action.priority}
                              </Badge>
                              <Badge
                                className={`text-xs ${getStatusColor(action.status)}`}
                              >
                                {action.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {action.description}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {action.assignedTo}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {action.status === "completed"
                            ? `${t("sections.actionList.completed")}: ${action.completedTime}`
                            : `${t("sections.actionList.due")}: ${action.timeframe}`}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
