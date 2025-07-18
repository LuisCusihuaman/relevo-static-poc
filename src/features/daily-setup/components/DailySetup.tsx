import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  AlertCircle,
  Baby,
  Building2,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Heart,
  MapPin,
  Scissors,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type DailySetupData,
  dailySetupPatients,
  shiftsConfig,
  unitsConfig,
} from "../../../common/mockData";
import { PatientSelectionCard } from "./PatientSelectionCard";

interface DailySetupProps {
  onSetupComplete: (setup: DailySetupData) => void;
  existingSetup?: DailySetupData | null; // NEW: For editing existing setup
  isEditing?: boolean; // NEW: Flag to indicate editing mode
}

export function DailySetup({
  onSetupComplete,
  existingSetup,
  isEditing = false,
}: DailySetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Setup data - NEW: Initialize with existing data if editing
  const [doctorName, setDoctorName] = useState(existingSetup?.doctorName || "");
  const [unit, setUnit] = useState(existingSetup?.unit || "");
  const [shift, setShift] = useState(existingSetup?.shift || "");
  const [selectedPatients, setSelectedPatients] = useState<number[]>(
    existingSetup?.selectedPatients || [],
  );
  const [showValidationError, setShowValidationError] = useState(false);

  // Helper function to get medical icons for different units
  const getUnitIcon = (unitId: string) => {
    switch (unitId) {
      case "picu":
        return Heart; // Pediatric Intensive Care - Heart for critical care
      case "nicu":
        return Baby; // Neonatal ICU - Baby icon
      case "general":
        return Stethoscope; // General Pediatrics - Classic medical icon
      case "cardiology":
        return Activity; // Cardiology - Heart activity/EKG
      case "surgery":
        return Scissors; // Surgery - Surgical scissors
      default:
        return Building2; // Fallback
    }
  };

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handlePatientToggle = (patientId: number) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId],
    );
    if (showValidationError) {
      setShowValidationError(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === dailySetupPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(dailySetupPatients.map((p) => p.id));
    }

    if (showValidationError) {
      setShowValidationError(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return doctorName.trim() !== "";
      case 1:
        return unit !== "";
      case 2:
        return shift !== "";
      case 3:
        return selectedPatients.length > 0;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep === 3 && selectedPatients.length === 0) {
      setShowValidationError(true);
      return;
    }

    if (canProceedToNextStep()) {
      if (currentStep === 3) {
        onSetupComplete({
          unit,
          shift,
          selectedPatients,
          doctorName: doctorName.trim(),
        });
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setShowValidationError(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Clean Professional Header - Modified for editing */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white border border-border rounded-xl flex items-center justify-center mx-auto shadow-sm">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-lg">
                    R
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {isEditing ? "Update Your Setup" : "Welcome to RELEVO"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Modify your shift and patient assignments"
                    : "Digital medical handover platform for Hospital Garrahan"}
                </p>
                {!isEditing && (
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-1">
                    <span>I-PASS Protocol</span>
                    <span>•</span>
                    <span>Secure Documentation</span>
                  </div>
                )}
              </div>
            </div>

            {/* Clean Professional Name Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="doctorName"
                  className="text-base font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-primary" />
                  Your Name
                </Label>
                <Input
                  id="doctorName"
                  type="text"
                  placeholder="Dr. Maria Gonzalez"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="h-12 text-base border-border focus:border-primary bg-white"
                />
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Update your name if needed"
                    : "This will be used to identify your documentation and handover sessions"}
                </p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Clean Step Header */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Hello, {doctorName}!
              </h2>
              <p className="text-muted-foreground">
                {isEditing
                  ? "Update your unit assignment"
                  : "Let's configure your shift details"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">
                  {isEditing ? "Change your unit" : "Select your unit"}
                </h3>
              </div>

              {/* MOBILE SCROLLABLE UNIT LIST */}
              <div className="space-y-3 mobile-scroll-fix">
                {unitsConfig.map((unitOption) => {
                  const UnitIcon = getUnitIcon(unitOption.id);
                  return (
                    <button
                      key={unitOption.id}
                      onClick={() => setUnit(unitOption.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left medical-card-hover ${
                        unit === unitOption.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            unit === unitOption.id
                              ? "bg-primary/10"
                              : "bg-muted/50"
                          }`}
                        >
                          <UnitIcon
                            className={`w-5 h-5 ${unit === unitOption.id ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {unitOption.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {unitOption.description}
                          </div>
                        </div>
                        {unit === unitOption.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isEditing ? "Update your shift" : "Select your shift"}
              </h3>
              <p className="text-muted-foreground">
                {isEditing
                  ? "Change your shift assignment if needed"
                  : "When will you be providing care?"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">
                  Available shifts
                </h3>
              </div>

              {/* MOBILE SCROLLABLE SHIFT LIST */}
              <div className="space-y-3 mobile-scroll-fix">
                {shiftsConfig.map((shiftOption) => (
                  <button
                    key={shiftOption.id}
                    onClick={() => setShift(shiftOption.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left medical-card-hover ${
                      shift === shiftOption.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          shift === shiftOption.id
                            ? "bg-primary/10"
                            : "bg-muted/50"
                        }`}
                      >
                        <Calendar
                          className={`w-5 h-5 ${shift === shiftOption.id ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {shiftOption.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {shiftOption.time}
                        </div>
                      </div>
                      {shift === shiftOption.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col h-full">
            {/* SIMPLIFIED HEADER - ESSENTIAL INFO ONLY */}
            <div className="flex-shrink-0 space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {isEditing ? "Update your patients" : "Select your patients"}
                </h3>

                {/* PROMINENT COUNTER */}
                <Badge
                  variant="outline"
                  className={`text-base px-4 py-2 ${
                    selectedPatients.length > 0
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/30 border-border/50 text-muted-foreground"
                  }`}
                >
                  {selectedPatients.length} of {dailySetupPatients.length}{" "}
                  patients selected
                </Badge>

                {/* NEW: Show current selection status for editing */}
                {isEditing && existingSetup && (
                  <p className="text-sm text-muted-foreground">
                    Previously had {existingSetup.selectedPatients.length}{" "}
                    patients assigned
                  </p>
                )}
              </div>

              {/* SIMPLIFIED CONTROLS */}
              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2"
                >
                  {selectedPatients.length === dailySetupPatients.length ? (
                    <>
                      <Circle className="w-4 h-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>

              {/* VALIDATION ERROR */}
              {showValidationError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      Please select at least one patient
                    </p>
                    <p className="text-sm">
                      You need to assign yourself to patients to continue
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PATIENT LIST */}
            <div className="flex-1 min-h-0 mt-6">
              <div className="h-full overflow-y-auto mobile-scroll-fix">
                <div className="space-y-3 pb-4">
                  {dailySetupPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientToggle(patient.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handlePatientToggle(patient.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer"
                    >
                      <PatientSelectionCard
                        patient={patient}
                        isSelected={selectedPatients.includes(patient.id)}
                        onToggle={handlePatientToggle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return isEditing ? "Update Information" : "Your Information";
      case 1:
        return isEditing ? "Update Unit" : "Unit Selection";
      case 2:
        return isEditing ? "Update Shift" : "Shift Selection";
      case 3:
        return isEditing ? "Update Patients" : "Patient Selection";
      default:
        return "Setup";
    }
  };

  if (isMobile) {
    return (
      <div
        className="bg-background flex flex-col"
        style={{
          height: "100dvh",
          maxHeight: "100dvh",
        }}
      >
        {/* Mobile Header - With Safe Area */}
        <div
          className="flex-shrink-0 p-4 bg-white border-b border-border"
          style={{
            paddingTop: "max(env(safe-area-inset-top), 16px)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold text-primary">RELEVO</h1>
              <p className="text-xs text-muted-foreground">
                {isEditing ? "Update Setup" : "Medical Handover Setup"}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of 4
            </div>
          </div>

          {/* Clean Progress Bar */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content - ENHANCED MOBILE SCROLLING WITH PROPER BOTTOM SPACING */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto mobile-scroll-fix">
            <div className="p-4 pb-32">{renderStepContent()}</div>
          </div>
        </div>

        {/* Floating Action Buttons - Like Main App Bottom Nav */}
        <div
          className="fixed bottom-0 left-0 right-0 z-30"
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
          }}
        >
          <div className="bg-background/95 backdrop-blur-md mx-3 mb-3 rounded-2xl px-3 py-4 border border-border/40 shadow-lg">
            <div className="flex items-center gap-3">
              {/* Back Button - Show on all steps except first */}
              {currentStep > 0 && (
                <Button
                  onClick={handleBackStep}
                  variant="outline"
                  className="gap-2 h-12 px-6 rounded-xl"
                  size="lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}

              {/* Next/Complete Button - Takes remaining space */}
              <Button
                onClick={handleNextStep}
                disabled={!canProceedToNextStep()}
                className="flex-1 gap-2 h-12 rounded-xl"
                size="lg"
              >
                {currentStep === 3
                  ? isEditing
                    ? "Save Changes"
                    : "Start Using RELEVO"
                  : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Validation Help Text */}
        {currentStep === 3 && selectedPatients.length === 0 && (
          <div
            className="fixed bottom-0 left-0 right-0 z-20 bg-red-50 border-t border-red-200 px-4 py-2"
            style={{
              paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
              marginBottom: "96px", // Space for floating buttons
            }}
          >
            <p className="text-xs text-red-700 text-center">
              Select at least one patient to continue
            </p>
          </div>
        )}
      </div>
    );
  }

  // Enhanced Desktop Layout
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl bg-white shadow-sm border border-border">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white border border-border rounded-xl flex items-center justify-center shadow-sm">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">R</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">
                {isEditing ? "Update RELEVO Setup" : "RELEVO Setup"}
              </CardTitle>
              <p className="text-muted-foreground">
                {currentStep === 0
                  ? isEditing
                    ? "Modify your configuration"
                    : "Configure your handover session"
                  : `${isEditing ? "Update" : "Configure"} your handover session, ${doctorName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-primary">
              {getStepTitle()}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of 4
            </div>
          </div>

          {/* Clean Progress Bar */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Compact Desktop Unit/Shift Selection */}
          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Hello, {doctorName}!
                </h2>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Update your unit assignment"
                    : "Let's configure your shift details"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    {isEditing ? "Change your unit" : "Select your unit"}
                  </h3>
                </div>

                {/* Compact Grid Layout for Units */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {unitsConfig.map((unitOption) => {
                    const UnitIcon = getUnitIcon(unitOption.id);
                    return (
                      <button
                        key={unitOption.id}
                        onClick={() => setUnit(unitOption.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          unit === unitOption.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              unit === unitOption.id
                                ? "bg-primary/10"
                                : "bg-muted/50"
                            }`}
                          >
                            <UnitIcon
                              className={`w-4 h-4 ${unit === unitOption.id ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm">
                              {unitOption.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {unitOption.description}
                            </div>
                          </div>
                          {unit === unitOption.id && (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {isEditing ? "Update your shift" : "Select your shift"}
                </h3>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Change your shift assignment if needed"
                    : "When will you be providing care?"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    Available shifts
                  </h3>
                </div>

                {/* Compact Grid Layout for Shifts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {shiftsConfig.map((shiftOption) => (
                    <button
                      key={shiftOption.id}
                      onClick={() => setShift(shiftOption.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        shift === shiftOption.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            shift === shiftOption.id
                              ? "bg-primary/10"
                              : "bg-muted/50"
                          }`}
                        >
                          <Calendar
                            className={`w-4 h-4 ${shift === shiftOption.id ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">
                            {shiftOption.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {shiftOption.time}
                          </div>
                        </div>
                        {shift === shiftOption.id && (
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : currentStep === 3 ? (
            /* SIMPLIFIED DESKTOP PATIENT SELECTION */
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {isEditing ? "Update your patients" : "Select your patients"}
                </h3>

                {/* PROMINENT COUNTER - DESKTOP */}
                <Badge
                  variant="outline"
                  className={`text-base px-4 py-2 ${
                    selectedPatients.length > 0
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/30 border-border/50 text-muted-foreground"
                  }`}
                >
                  {selectedPatients.length} of {dailySetupPatients.length}{" "}
                  patients selected
                </Badge>

                {/* NEW: Show current selection status for editing */}
                {isEditing && existingSetup && (
                  <p className="text-sm text-muted-foreground">
                    Previously had {existingSetup.selectedPatients.length}{" "}
                    patients assigned
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2"
                >
                  {selectedPatients.length === dailySetupPatients.length ? (
                    <>
                      <Circle className="w-4 h-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>

              {/* Validation Error */}
              {showValidationError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      Please select at least one patient
                    </p>
                    <p className="text-sm">
                      You need to assign yourself to patients to continue
                    </p>
                  </div>
                </div>
              )}

              {/* PATIENT GRID */}
              <div className="relative">
                <div className="patient-scroll-container bg-muted/10 border border-border/40 rounded-xl p-4">
                  <div className="max-h-[380px] overflow-y-auto scrollbar-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {dailySetupPatients.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => handlePatientToggle(patient.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handlePatientToggle(patient.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer"
                        >
                          <PatientSelectionCard
                            patient={patient}
                            isSelected={selectedPatients.includes(patient.id)}
                            onToggle={handlePatientToggle}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderStepContent()
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6">
            {currentStep > 0 ? (
              <Button
                onClick={handleBackStep}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            <Button
              onClick={handleNextStep}
              disabled={!canProceedToNextStep()}
              className="gap-2"
            >
              {currentStep === 3
                ? isEditing
                  ? "Save Changes"
                  : "Complete Setup"
                : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
