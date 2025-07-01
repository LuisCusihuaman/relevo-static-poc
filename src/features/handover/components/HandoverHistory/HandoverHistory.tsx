import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  FileText,
  History,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface PatientData {
  name: string;
  mrn: string;
  admissionDate: string;
}

interface HandoverHistoryProps {
  onClose: () => void;
  patientData: PatientData;
  hideHeader?: boolean;
}

export function HandoverHistory({
  onClose,
  patientData,
  hideHeader = false,
}: HandoverHistoryProps) {
  const [selectedHandover, setSelectedHandover] = useState<string | null>(null);

  const handoverHistory = [
    {
      id: "current",
      date: "2024-06-23",
      shift: "Day → Evening",
      time: "16:45",
      status: "in-progress",
      outgoingTeam: "Day Shift - Internal Medicine",
      incomingTeam: "Evening Shift - Internal Medicine",
      primaryPhysician: "Dr. Johnson",
      receivingPhysician: "Dr. Martinez",
      severity: "stable",
      keyPoints: [
        "COPD exacerbation improving",
        "O2 requirements decreased to 2L",
        "Family meeting scheduled",
      ],
    },
    {
      id: "ho-001",
      date: "2024-06-23",
      shift: "Night → Day",
      time: "07:30",
      status: "completed",
      outgoingTeam: "Night Shift - Internal Medicine",
      incomingTeam: "Day Shift - Internal Medicine",
      primaryPhysician: "Dr. Chen",
      receivingPhysician: "Dr. Johnson",
      severity: "guarded",
      keyPoints: [
        "Patient admitted with COPD exacerbation",
        "Started on corticosteroids and bronchodilators",
        "Initial O2 requirement 4L",
      ],
    },
    {
      id: "ho-002",
      date: "2024-06-22",
      shift: "Evening → Night",
      time: "23:15",
      status: "completed",
      outgoingTeam: "Evening Shift - Emergency Medicine",
      incomingTeam: "Night Shift - Internal Medicine",
      primaryPhysician: "Dr. Williams",
      receivingPhysician: "Dr. Chen",
      severity: "unstable",
      keyPoints: [
        "Emergency admission from ED",
        "Acute respiratory distress",
        "Stabilized with oxygen therapy",
      ],
    },
    {
      id: "ho-003",
      date: "2024-06-22",
      shift: "Day → Evening",
      time: "19:00",
      status: "completed",
      outgoingTeam: "Day Shift - Emergency Medicine",
      incomingTeam: "Evening Shift - Emergency Medicine",
      primaryPhysician: "Dr. Rodriguez",
      receivingPhysician: "Dr. Williams",
      severity: "critical",
      keyPoints: [
        "Patient presented with severe dyspnea",
        "Initial workup completed",
        "Chest X-ray shows COPD changes",
      ],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "stable":
        return "bg-green-100 text-green-800 border-green-200";
      case "guarded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unstable":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex flex-col h-full">
        {/* Header - Only show if not hidden */}
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-medium flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Handover History</span>
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Patient Context */}
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <h4 className="font-medium text-sm text-gray-900 mb-2">
            Patient Timeline
          </h4>
          <div className="text-sm text-gray-600">
            <p className="font-medium">{patientData.name}</p>
            <p>MRN: {patientData.mrn}</p>
            <p>Admitted: {patientData.admissionDate}</p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {handoverHistory.map((handover) => (
              <Card
                key={handover.id}
                className={`cursor-pointer transition-all border ${
                  selectedHandover === handover.id
                    ? "border-blue-300 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                } ${handover.status === "in-progress" ? "ring-2 ring-blue-200" : ""}`}
                onClick={() =>
                  setSelectedHandover(
                    selectedHandover === handover.id ? null : handover.id,
                  )
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {handover.date}
                      </span>
                    </div>
                    <Badge className={getStatusColor(handover.status)}>
                      {handover.status === "in-progress"
                        ? "Current"
                        : "Completed"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {handover.time}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {handover.shift}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Severity */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Severity</span>
                      <Badge className={getSeverityColor(handover.severity)}>
                        {handover.severity.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Team Transition */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          From: {handover.primaryPhysician}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          To: {handover.receivingPhysician}
                        </span>
                      </div>
                    </div>

                    {/* Key Points Preview */}
                    <div className="space-y-1">
                      <span className="text-xs text-gray-600">Key Points:</span>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {handover.keyPoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </li>
                        ))}
                        {handover.keyPoints.length > 2 && (
                          <li className="text-gray-500">
                            +{handover.keyPoints.length - 2} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Expanded Details */}
                    {selectedHandover === handover.id && (
                      <div className="pt-3 border-t border-gray-200 space-y-3">
                        <div>
                          <span className="text-xs text-gray-600 font-medium">
                            Teams:
                          </span>
                          <div className="text-xs text-gray-700 mt-1">
                            <p>Out: {handover.outgoingTeam}</p>
                            <p>In: {handover.incomingTeam}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-gray-600 font-medium">
                            All Key Points:
                          </span>
                          <ul className="text-xs text-gray-700 space-y-1 mt-1">
                            {handover.keyPoints.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-1"
                              >
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Full
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Compare
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {handoverHistory.length} handovers • Last 48 hours
          </div>
        </div>
      </div>
    </div>
  );
}
