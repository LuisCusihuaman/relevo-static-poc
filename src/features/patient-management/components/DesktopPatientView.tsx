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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clipboard,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PatientAlerts } from "./PatientAlerts";

// Import consolidated data and types from patients store
import { type Patient } from "../../../common/types";

interface DesktopPatientViewProps {
  patients?: Patient[]; // Make optional to use store data by default
  currentDoctor: string;
  onClinicalEntry: (patientId: number, type: string) => void;
  onPatientSelect: (patientId: number) => void;
}

export function DesktopPatientView({
  patients, // Optional prop - if not provided, use store data
  currentDoctor,
  onClinicalEntry,
  onPatientSelect: _onPatientSelect,
}: DesktopPatientViewProps) {
  const { t } = useTranslation("desktopPatientView");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("priority");

  // Use consolidated data from store if not provided via props
  const enhancedPatients: Patient[] = patients || [];

  const filteredPatients = enhancedPatients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.mrn || "").includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" || patient.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getEntryTypeIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <Stethoscope className="w-4 h-4" />;
      case "plan":
        return <Clipboard className="w-4 h-4" />;
      case "observation":
        return <Eye className="w-4 h-4" />;
      case "progress":
        return <Activity className="w-4 h-4" />;
      case "discharge_planning":
        return <Calendar className="w-4 h-4" />;
      case "family_communication":
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case "assessment":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "plan":
        return "bg-green-50 text-green-700 border-green-200";
      case "observation":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "progress":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "discharge_planning":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "family_communication":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive bg-destructive/5";
      case "medium":
        return "border-l-chart-1 bg-chart-1/5";
      case "low":
        return "border-l-chart-2 bg-chart-2/5";
      default:
        return "border-l-border";
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Patient List */}
      <div className="w-96 border-r bg-card flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filter.all")}</SelectItem>
                <SelectItem value="pending">{t("filter.pending")}</SelectItem>
                <SelectItem value="in-progress">{t("filter.active")}</SelectItem>
                <SelectItem value="complete">{t("filter.complete")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">{t("sort.priority")}</SelectItem>
                <SelectItem value="room">{t("sort.room")}</SelectItem>
                <SelectItem value="name">{t("sort.name")}</SelectItem>
                <SelectItem value="recent">
                  {t("sort.recentActivity")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className={`cursor-pointer transition-all border-l-4 ${getPriorityColor(patient.priority || "low")} ${
                selectedPatient?.id === patient.id
                  ? "ring-2 ring-primary/20 bg-primary/5"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("patientInfo", {
                          age: patient.age,
                          room: patient.room,
                          bed: patient.bed,
                        })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {patient.handoverStatus === "incoming" && (
                        <Badge variant="outline" className="text-xs">
                          <ChevronRight className="w-3 h-3 mr-1" />
                          {t("incoming")}
                        </Badge>
                      )}
                      {patient.alerts.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {patient.alerts.length}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {patient.diagnosis.primary}
                    </p>
                    {patient.diagnosis.secondary.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {patient.diagnosis.secondary.slice(0, 2).join(", ")}
                        {patient.diagnosis.secondary.length > 2 && "..."}
                      </p>
                    )}
                  </div>

                  {/* Team & Activity */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {patient.team?.attending}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {patient.lastUpdate}
                      </span>
                    </div>
                  </div>

                  {/* Recent Entries Indicator */}
                  {patient.clinicalEntries &&
                    patient.clinicalEntries.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {t("clinicalEntries", {
                            count: patient.clinicalEntries.length,
                          })}
                        </span>
                        <span className="text-muted-foreground">
                          • {t("lastEntry")}:{" "}
                          {patient.clinicalEntries[0]?.author.name}
                        </span>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <>
            {/* Patient Header */}
            <div className="border-b bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-semibold">
                      {selectedPatient.name}
                    </h1>
                    <Badge variant="outline">
                      {t("yearsOld", { age: selectedPatient.age })}
                    </Badge>
                    <Badge
                      variant={
                        selectedPatient.priority === "high"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {selectedPatient.priority && t(selectedPatient.priority)}{" "}
                      {selectedPatient.priority &&
                        t("priority", {
                          context: selectedPatient.priority,
                        })}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("room")}:</span>
                      <p className="font-medium">
                        {selectedPatient.room}-{selectedPatient.bed}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("mrn")}:</span>
                      <p className="font-medium">{selectedPatient.mrn}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("admitted")}:
                      </span>
                      <p className="font-medium">
                        {selectedPatient.admission?.date}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("estDischarge")}:
                      </span>
                      <p className="font-medium">
                        {selectedPatient.milestones?.estimatedDischarge ||
                          t("tbd")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      onClinicalEntry(selectedPatient.id, "assessment")
                    }
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    {t("assessment")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onClinicalEntry(selectedPatient.id, "progress")
                    }
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {t("progressNote")}
                  </Button>
                  <Button
                    onClick={() =>
                      onClinicalEntry(selectedPatient.id, "general")
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("clinicalEntry")}
                  </Button>
                </div>
              </div>

              {/* Primary Diagnosis */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">
                  {selectedPatient.diagnosis.primary}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.diagnosis.secondary.map((diag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {diag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="clinical" className="h-full flex flex-col">
                <div className="border-b px-6">
                  <TabsList>
                    <TabsTrigger value="clinical">
                      {t("tabs.clinicalDocumentation")}
                    </TabsTrigger>
                    <TabsTrigger value="team">{t("tabs.careTeam")}</TabsTrigger>
                    <TabsTrigger value="alerts">
                      {t("tabs.alertsAndProtocols")}
                    </TabsTrigger>
                    <TabsTrigger value="family">
                      {t("tabs.familyAndDischarge")}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="clinical" className="p-6 space-y-4">
                    {selectedPatient.clinicalEntries &&
                    selectedPatient.clinicalEntries.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPatient.clinicalEntries.map((entry) => (
                          <Card key={entry.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg border ${getEntryTypeColor(entry.type)}`}
                                  >
                                    {getEntryTypeIcon(entry.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      {entry.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{entry.author.name}</span>
                                      <span>•</span>
                                      <span>{entry.author.role}</span>
                                      <span>•</span>
                                      <span>
                                        {entry.timestamp.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {entry.collaborators &&
                                    entry.collaborators.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        <Users className="w-3 h-3 mr-1" />
                                        {t("collaborators", {
                                          count: entry.collaborators.length,
                                        })}
                                      </Badge>
                                    )}
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <p className="text-sm leading-relaxed mb-3">
                                {entry.content}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {entry.tags.map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                {entry.author.name !== currentDoctor && (
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    {t("addResponse")}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">
                          {t("noClinicalDocumentation.title")}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {t("noClinicalDocumentation.description")}
                        </p>
                        <Button
                          onClick={() =>
                            onClinicalEntry(selectedPatient.id, "assessment")
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t("noClinicalDocumentation.button")}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="team" className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            {t("team.primaryTeam")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("team.attendingPhysician")}
                            </span>
                            <p className="font-medium">
                              {selectedPatient.team?.attending}
                            </p>
                          </div>
                          <Separator />
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("team.residents")}
                            </span>
                            <div className="space-y-1 mt-1">
                              {selectedPatient.team?.residents?.map(
                                (resident, index) => (
                                  <p key={index} className="text-sm">
                                    {resident}
                                  </p>
                                ),
                              )}
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("team.nursing")}
                            </span>
                            <div className="space-y-1 mt-1">
                              {selectedPatient.team?.nurses?.map(
                                (nurse, index) => (
                                  <p key={index} className="text-sm">
                                    {nurse}
                                  </p>
                                ),
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {t("team.specialists")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {selectedPatient.team?.specialists?.map(
                            (specialist, index) => (
                              <div
                                key={index}
                                className="p-2 bg-muted/30 rounded"
                              >
                                <p className="text-sm font-medium">
                                  {specialist}
                                </p>
                              </div>
                            ),
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="alerts" className="p-6">
                    <PatientAlerts
                      alerts={selectedPatient.alerts || []}
                      compact={false}
                    />
                  </TabsContent>

                  <TabsContent value="family" className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {t("familyInfo.title")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("familyInfo.primaryContact")}
                            </span>
                            <p className="font-medium">
                              {selectedPatient.familyInfo?.contactPerson}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ({selectedPatient.familyInfo?.relationship})
                            </p>
                          </div>
                          <Separator />
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("familyInfo.lastContact")}
                            </span>
                            <p className="text-sm">
                              {selectedPatient.familyInfo?.lastContact}
                            </p>
                          </div>
                          <Separator />
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("familyInfo.currentConcerns")}
                            </span>
                            <div className="space-y-1 mt-1">
                              {selectedPatient.familyInfo?.concerns?.map(
                                (concern, index) => (
                                  <p key={index} className="text-sm">
                                    • {concern.concern}
                                  </p>
                                ),
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {t("careMilestones.title")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("careMilestones.admission")}
                            </span>
                            <p className="text-sm">
                              {selectedPatient.milestones?.admission}
                            </p>
                          </div>
                          <Separator />
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("careMilestones.lastAssessment")}
                            </span>
                            <p className="text-sm">
                              {selectedPatient.milestones?.lastAssessment}
                            </p>
                          </div>
                          <Separator />
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {t("careMilestones.nextPlanned")}
                            </span>
                            <p className="text-sm">
                              {selectedPatient.milestones?.nextPlanned}
                            </p>
                          </div>
                          {selectedPatient.milestones?.estimatedDischarge && (
                            <>
                              <Separator />
                              <div>
                                <span className="text-sm text-muted-foreground">
                                  {t("careMilestones.estimatedDischarge")}
                                </span>
                                <p className="text-sm font-medium">
                                  {
                                    selectedPatient.milestones
                                      .estimatedDischarge
                                  }
                                </p>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {t("selectPatient.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("selectPatient.description")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
