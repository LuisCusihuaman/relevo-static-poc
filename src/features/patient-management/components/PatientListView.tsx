import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import HandoverApp from "../../handover/handover";
import { SimplePatientCard } from "./SimplePatientCard";

// Import consolidated data and utilities from patients store
import {
  formatDiagnosis,
  getPatientStats,
  mockPatients,
  sortPatients,
} from "../../../store/patients.store";

interface PatientListViewProps {
  onPatientSelect?: (patientId: number) => void; // NEW: Optional patient selection handler
}

export function PatientListView({ onPatientSelect }: PatientListViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("severity");
  const [handoverPatient, setHandoverPatient] = useState<number | null>(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Simple filtering - just by search term, no status filters
  const filteredPatients = sortPatients(
    mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDiagnosis(patient.diagnosis)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (patient.room &&
          patient.room.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (patient.mrn && patient.mrn.includes(searchTerm)),
    ),
    sortBy,
  );

  // Use store function for stats
  const stats = getPatientStats();

  const handleOpenHandover = (patientId: number) => {
    setHandoverPatient(patientId);
  };

  // Show collaborative handover if patient selected
  if (handoverPatient) {
    return (
      <div className="relative min-h-screen bg-background">
        <HandoverApp onBack={() => setHandoverPatient(null)} />
      </div>
    );
  }

  // The patient objects from the store now contain all necessary data.
  const patientsWithDetailedAlerts = filteredPatients;

  return (
    <div className="flex min-h-0 w-full flex-col bg-background">
      <div className="mx-auto w-full max-w-7xl">
        {/* ENHANCED: Header with Better Contrast */}
        <div className="flex-shrink-0 bg-background">
          <div className="p-4 lg:p-6">
            {/* Mobile: Clean Header */}
            {isMobile ? (
              <div className="mb-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-semibold text-foreground">
                        Your Patients
                      </h1>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{stats.totalPatients} assigned to you</span>
                        <span>•</span>
                        <span>Morning Shift</span>
                        {/* NEW: Add tap hint for mobile users */}
                        {onPatientSelect && (
                          <>
                            <span>•</span>
                            <span className="text-primary">
                              Tap to view details
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-sm text-primary"
                    >
                      PICU Unit
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop: Enhanced Header */
              <Card className="rounded-xl border border-border/50 bg-background">
                <CardHeader className="p-4 lg:p-6">
                  <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-start lg:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <h1 className="text-2xl font-semibold text-foreground lg:text-3xl">
                          Your Patients
                        </h1>
                        <Badge
                          variant="outline"
                          className="self-start border-primary/30 bg-primary/10 text-sm text-primary sm:self-auto"
                        >
                          PICU Unit
                        </Badge>
                      </div>

                      <p className="mb-3 text-sm text-muted-foreground">
                        Patients assigned to you for this shift
                        {/* NEW: Desktop hint for clickable cards */}
                        {onPatientSelect && (
                          <span className="text-primary">
                            {" "}
                            • Click cards to view detailed information
                          </span>
                        )}
                      </p>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>January 23, 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Morning Shift (08:00-16:00)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Edit3 className="h-4 w-4" />
                          <span>{stats.totalNotes} documentation entries</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ENHANCED: Medical Priority Stats */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-border/30 bg-muted/30 p-3 text-center">
                      <div className="text-2xl font-semibold text-foreground">
                        {stats.totalPatients}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Your Patients
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-red-200 bg-red-50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-red-700">
                        <AlertTriangle className="h-5 w-5" />
                        {stats.unstable}
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        Unstable
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-yellow-700">
                        <Eye className="h-5 w-5" />
                        {stats.watcher}
                      </div>
                      <div className="text-sm font-medium text-yellow-600">
                        Watcher
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        {stats.totalPatients - stats.unstable - stats.watcher}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Stable
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>

          {/* Mobile: Enhanced Medical Priority Summary */}
          {isMobile && (
            <div className="mb-4 px-4">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 font-semibold text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      {stats.unstable}
                    </div>
                    <div className="text-xs font-medium text-red-600">
                      Unstable
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 font-semibold text-yellow-700">
                      <Eye className="h-4 w-4" />
                      {stats.watcher}
                    </div>
                    <div className="text-xs font-medium text-yellow-600">
                      Watcher
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 font-semibold text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      {stats.totalPatients - stats.unstable - stats.watcher}
                    </div>
                    <div className="text-xs font-medium text-green-600">
                      Stable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENHANCED: Search and Sort */}
          <div className="mb-4 bg-background px-4 lg:px-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Search your patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border-border/50 bg-background pl-10 focus:border-primary/50"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full border-border/50 bg-background sm:w-56">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="severity">Medical Priority</SelectItem>
                  <SelectItem value="alerts">Critical Alerts</SelectItem>
                  <SelectItem value="name">Patient Name</SelectItem>
                  <SelectItem value="collaboration">Recent Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* CLEANED: Patient List - Simple spacing-based separation */}
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-4 py-4 lg:px-6">
              {isMobile ? (
                // Mobile: Single column
                <div className="space-y-4">
                  {patientsWithDetailedAlerts.map((patient) => (
                    <SimplePatientCard
                      key={patient.id}
                      patient={patient}
                      onOpenHandover={handleOpenHandover}
                      onPatientSelect={onPatientSelect} // NEW: Pass patient selection handler
                    />
                  ))}
                </div>
              ) : (
                // Desktop: Two columns for better space utilization
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {patientsWithDetailedAlerts.map((patient) => (
                    <SimplePatientCard
                      key={patient.id}
                      patient={patient}
                      onOpenHandover={handleOpenHandover}
                      onPatientSelect={onPatientSelect} // NEW: Pass patient selection handler
                    />
                  ))}
                </div>
              )}
            </div>
            {filteredPatients.length === 0 && (
              <div className="flex h-full items-center justify-center p-10 text-center">
                <div>
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    No patients found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your search for &quot;{searchTerm}&quot; did not match any
                    patients.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
