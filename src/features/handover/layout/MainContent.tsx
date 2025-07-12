import {
  activeCollaborators,
  getIpassGuidelines,
  patientData,
} from "@/common/constants";
import { patientDataES } from "@/common/constants.es";
import type {
  ExpandedSections,
  FullscreenComponent,
  SyncStatus,
  User,
} from "@/common/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ActionList,
  IllnessSeverity,
  PatientSummary,
  SituationAwareness,
  SynthesisByReceiver,
} from "..";

interface MainContentProps {
  focusMode: boolean;
  layoutMode: "single" | "columns";
  expandedSections: ExpandedSections;
  handleOpenDiscussion: () => void;
  handleOpenFullscreenEdit: (
    component: FullscreenComponent,
    autoEdit?: boolean,
  ) => void;
  syncStatus: SyncStatus;
  setSyncStatus: (status: SyncStatus) => void;
  setHandoverComplete: (complete: boolean) => void;
  getSessionDuration: () => string;
  currentUser: User;
}

export function MainContent({
  focusMode,
  layoutMode,
  expandedSections,
  handleOpenDiscussion,
  handleOpenFullscreenEdit,
  syncStatus,
  setSyncStatus,
  setHandoverComplete,
  getSessionDuration,
  currentUser,
}: MainContentProps) {
  const { t, i18n } = useTranslation(["handover", "mainContent"]);
  const ipassGuidelines = getIpassGuidelines(t);
  const activeUsers = activeCollaborators.filter(
    (user) => user.status === "active" || user.status === "viewing",
  );
  const currentPatientData = i18n.language === "es" ? patientDataES : patientData;

  if (focusMode) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {t("focusTitle")}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentPatientData.name} • {t("focusExit")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {t("session", { duration: getSessionDuration() })}
              </p>
              <p className="text-xs text-gray-500">
                {t("participants", { count: activeUsers.length })}
              </p>
            </div>
          </div>

          {/* I-PASS Sections */}
          <div className="space-y-8 sm:space-y-10">
            {/* I - Illness Severity */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-gray-700 text-sm sm:text-base">
                    I
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {t("mainContent:sections.illnessSeverity")}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {ipassGuidelines.illness.title}
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {ipassGuidelines.illness.points.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-1"
                          >
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <IllnessSeverity
                focusMode={focusMode}
                currentUser={currentUser}
                assignedPhysician={currentPatientData.assignedPhysician}
              />
            </div>

            {/* P - Patient Summary */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-gray-700 text-sm sm:text-base">
                    P
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {t("mainContent:sections.patientSummary")}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {ipassGuidelines.patient.title}
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {ipassGuidelines.patient.points.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-1"
                          >
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <PatientSummary
                onOpenThread={handleOpenDiscussion}
                focusMode={focusMode}
                currentUser={currentUser}
                assignedPhysician={currentPatientData.assignedPhysician}
                onRequestFullscreen={() =>
                  handleOpenFullscreenEdit("patient-summary", true)
                }
                syncStatus={syncStatus}
                onSyncStatusChange={setSyncStatus}
              />
            </div>

            {/* A - Action List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-gray-700 text-sm sm:text-base">
                    A
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {t("mainContent:sections.actionList")}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {ipassGuidelines.actions.title}
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {ipassGuidelines.actions.points.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-1"
                          >
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <ActionList
                expanded={true}
                collaborators={activeCollaborators}
                onOpenThread={handleOpenDiscussion}
                focusMode={focusMode}
              />
            </div>

            {/* S - Current Situation */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-gray-700 text-sm sm:text-base">
                    S
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {t("mainContent:sections.situationAwareness")}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {ipassGuidelines.awareness.title}
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {ipassGuidelines.awareness.points.map(
                          (point, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-1"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <SituationAwareness
                collaborators={activeCollaborators}
                onOpenThread={handleOpenDiscussion}
                focusMode={focusMode}
                onRequestFullscreen={() =>
                  handleOpenFullscreenEdit("situation-awareness", true)
                }
                syncStatus={syncStatus}
                onSyncStatusChange={setSyncStatus}
              />
            </div>

            {/* S - Synthesis by Receiver */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-gray-700 text-sm sm:text-base">
                    S
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {t("mainContent:sections.synthesisByReceiver")}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {ipassGuidelines.synthesis.title}
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {ipassGuidelines.synthesis.points.map(
                          (point, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-1"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <SynthesisByReceiver
                onOpenThread={handleOpenDiscussion}
                onComplete={setHandoverComplete}
                focusMode={focusMode}
                currentUser={currentUser}
                receivingPhysician={currentPatientData.receivingPhysician}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Mode
  return (
    <div className="space-y-6">
      {/* I-PASS Sections - Column Layout for Desktop */}
      {layoutMode === "columns" ? (
        <div className="hidden xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* I - Illness Severity */}
            <div className="bg-white rounded-lg border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-700">I</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {t("mainContent:sections.illnessSeverity")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("mainContent:sections.illnessSeverityDescription")}
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {ipassGuidelines.illness.title}
                        </h4>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {ipassGuidelines.illness.points.map(
                            (point, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-1"
                              >
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="p-6">
                <IllnessSeverity
                  focusMode={focusMode}
                  currentUser={currentUser}
                  assignedPhysician={currentPatientData.assignedPhysician}
                />
              </div>
            </div>

            {/* P - Patient Summary */}
            <div className="bg-white rounded-lg border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-700">P</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {t("mainContent:sections.patientSummary")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("mainContent:sections.patientSummaryDescription")}
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {ipassGuidelines.patient.title}
                        </h4>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {ipassGuidelines.patient.points.map(
                            (point, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-1"
                              >
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <PatientSummary
                onOpenThread={handleOpenDiscussion}
                focusMode={focusMode}
                currentUser={currentUser}
                assignedPhysician={currentPatientData.assignedPhysician}
                onRequestFullscreen={() =>
                  handleOpenFullscreenEdit("patient-summary")
                }
                syncStatus={syncStatus}
                onSyncStatusChange={setSyncStatus}
              />
            </div>

            {/* S - Current Situation */}
            <div className="bg-white rounded-lg border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-700">S</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {t("mainContent:sections.situationAwareness")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("mainContent:sections.situationAwarenessDescription")}
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {ipassGuidelines.awareness.title}
                        </h4>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {ipassGuidelines.awareness.points.map(
                            (point, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-1"
                              >
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <SituationAwareness
                collaborators={activeCollaborators}
                onOpenThread={handleOpenDiscussion}
                focusMode={focusMode}
                onRequestFullscreen={() =>
                  handleOpenFullscreenEdit("situation-awareness", true)
                }
                syncStatus={syncStatus}
                onSyncStatusChange={setSyncStatus}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 space-y-6">
            {/* A - Action List */}
            <div className="sticky top-32">
              <div className="bg-white rounded-lg border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">A</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {t("mainContent:sections.actionList")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("mainContent:sections.actionListDescription")}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {ipassGuidelines.actions.title}
                          </h4>
                          <ul className="space-y-1 text-xs text-gray-600">
                            {ipassGuidelines.actions.points.map(
                              (point, index) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-1"
                                >
                                  <span className="text-gray-400 mt-0.5">
                                    •
                                  </span>
                                  <span>{point}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="p-6">
                  <ActionList
                    expanded={true}
                    collaborators={activeCollaborators}
                    onOpenThread={handleOpenDiscussion}
                    focusMode={focusMode}
                    compact={true}
                  />
                </div>
              </div>

              {/* S - Synthesis by Receiver */}
              <div className="bg-white rounded-lg border border-gray-100 mt-6">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-purple-700">S</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {t("mainContent:sections.synthesisByReceiver")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("synthesisByReceiver.description")}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {ipassGuidelines.synthesis.title}
                          </h4>
                          <ul className="space-y-1 text-xs text-gray-600">
                            {ipassGuidelines.synthesis.points.map(
                              (point, index) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-1"
                                >
                                  <span className="text-gray-400 mt-0.5">
                                    •
                                  </span>
                                  <span>{point}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="p-6">
                  <SynthesisByReceiver
                    onOpenThread={handleOpenDiscussion}
                    onComplete={setHandoverComplete}
                    focusMode={focusMode}
                    currentUser={currentUser}
                    receivingPhysician={currentPatientData.receivingPhysician}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Single Column Layout - Subtle Borders & I-PASS Guidelines */}
      <div
        className={`space-y-3 ${layoutMode === "columns" ? "xl:hidden" : ""}`}
      >
        {/* I - Illness Severity */}
        <Collapsible asChild>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">I</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {t("mainContent:sections.illnessSeverity")}
                        </h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                              <Info className="w-3 h-3 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                          >
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {ipassGuidelines.illness.title}
                              </h4>
                              <ul className="space-y-1 text-xs text-gray-600">
                                {ipassGuidelines.illness.points.map(
                                  (point, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-1"
                                    >
                                      <span className="text-gray-400 mt-0.5">
                                        •
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-700">
                        {t("mainContent:sections.illnessSeverityDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedSections.illness ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6">
                <IllnessSeverity
                  focusMode={focusMode}
                  currentUser={currentUser}
                  assignedPhysician={currentPatientData.assignedPhysician}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* P - Patient Summary */}
        <Collapsible asChild>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">P</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {t("mainContent:sections.patientSummary")}
                        </h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                              <Info className="w-3 h-3 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                          >
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {ipassGuidelines.patient.title}
                              </h4>
                              <ul className="space-y-1 text-xs text-gray-600">
                                {ipassGuidelines.patient.points.map(
                                  (point, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-1"
                                    >
                                      <span className="text-gray-400 mt-0.5">
                                        •
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-700">
                        {t("mainContent:sections.patientSummaryDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedSections.patient ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6">
                <PatientSummary
                  onOpenThread={handleOpenDiscussion}
                  focusMode={focusMode}
                  currentUser={currentUser}
                  assignedPhysician={currentPatientData.assignedPhysician}
                  onRequestFullscreen={() =>
                    handleOpenFullscreenEdit("patient-summary")
                  }
                  syncStatus={syncStatus}
                  onSyncStatusChange={setSyncStatus}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* A - Action List */}
        <Collapsible asChild>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">A</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {t("mainContent:sections.actionList")}
                        </h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                              <Info className="w-3 h-3 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                          >
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {ipassGuidelines.actions.title}
                              </h4>
                              <ul className="space-y-1 text-xs text-gray-600">
                                {ipassGuidelines.actions.points.map(
                                  (point, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-1"
                                    >
                                      <span className="text-gray-400 mt-0.5">
                                        •
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-700">
                        {t("mainContent:sections.actionListDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedSections.actions ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6">
                <ActionList
                  expanded={true}
                  collaborators={activeCollaborators}
                  onOpenThread={handleOpenDiscussion}
                  focusMode={focusMode}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* S - Current Situation */}
        <Collapsible asChild>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">S</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {t("mainContent:sections.situationAwareness")}
                        </h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                              <Info className="w-3 h-3 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                          >
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {ipassGuidelines.awareness.title}
                              </h4>
                              <ul className="space-y-1 text-xs text-gray-600">
                                {ipassGuidelines.awareness.points.map(
                                  (point, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-1"
                                    >
                                      <span className="text-gray-400 mt-0.5">
                                        •
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-700">
                        {t("mainContent:sections.situationAwarenessDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedSections.awareness ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SituationAwareness
                collaborators={activeCollaborators}
                onOpenThread={handleOpenDiscussion}
                focusMode={focusMode}
                onRequestFullscreen={() =>
                  handleOpenFullscreenEdit("situation-awareness", true)
                }
                syncStatus={syncStatus}
                onSyncStatusChange={setSyncStatus}
              />
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* S - Synthesis by Receiver */}
        <Collapsible asChild>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-purple-700">S</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {t("mainContent:sections.synthesisByReceiver")}
                        </h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                              <Info className="w-3 h-3 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-white border border-gray-200 shadow-lg p-4 max-w-sm"
                          >
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {ipassGuidelines.synthesis.title}
                              </h4>
                              <ul className="space-y-1 text-xs text-gray-600">
                                {ipassGuidelines.synthesis.points.map(
                                  (point, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-1"
                                    >
                                      <span className="text-gray-400 mt-0.5">
                                        •
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-700">
                        {t("synthesisByReceiver.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedSections.synthesis ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6">
                <SynthesisByReceiver
                  onOpenThread={handleOpenDiscussion}
                  onComplete={setHandoverComplete}
                  focusMode={focusMode}
                  currentUser={currentUser}
                  receivingPhysician={currentPatientData.receivingPhysician}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
