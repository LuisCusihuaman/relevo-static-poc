import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
    import { useTranslation } from "react-i18next";

interface Patient {
  id: number;
  name: string;
  room: string;
  diagnosis: string;
}

interface QuickNoteEntryProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctorName: string;
}

interface RecentNote {
  id: number;
  patientId: string;
  type: string;
  content: string;
  timestamp: Date;
  author: string;
}

export function QuickNoteEntry({
  isOpen,
  onClose,
  patients,
  doctorName,
}: QuickNoteEntryProps) {
  const { t } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [noteType, setNoteType] = useState<string>("");
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);

  const noteTypes = [
    {
      id: "assessment",
      label: t("quickNote.noteTypes.assessment"),
      color: "bg-blue-50 text-blue-700",
    },
    {
      id: "plan",
      label: t("quickNote.noteTypes.plan"),
      color: "bg-green-50 text-green-700",
    },
    {
      id: "observation",
      label: t("quickNote.noteTypes.observation"),
      color: "bg-purple-50 text-purple-700",
    },
    {
      id: "concern",
      label: t("quickNote.noteTypes.concern"),
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      id: "improvement",
      label: t("quickNote.noteTypes.improvement"),
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "family",
      label: t("quickNote.noteTypes.family"),
      color: "bg-pink-50 text-pink-700",
    },
  ];

  const quickTemplates = Object.values(
    t("quickNote.quickTemplates", { returnObjects: true }) as Record<
      string,
      string
    >,
  );

  useEffect(() => {
    if (isOpen && patients.length > 0) {
      setSelectedPatient(patients[0].id.toString());
    }
  }, [isOpen, patients]);

  const handleSave = async () => {
    if (!selectedPatient || !noteType || !noteContent.trim()) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newNote = {
      id: Date.now(),
      patientId: selectedPatient,
      type: noteType,
      content: noteContent,
      timestamp: new Date(),
      author: doctorName,
    };

    setRecentNotes((prev) => [newNote, ...prev.slice(0, 4)]);

    // Reset form
    setNoteContent("");
    setNoteType("");
    setIsSaving(false);

    // Auto-close after successful save
    setTimeout(onClose, 500);
  };

  const handleTemplateClick = (template: string) => {
    setNoteContent((prev) => (prev ? `${prev}\n${template}` : template));
  };

  const selectedPatientData = patients.find(
    (p) => p.id.toString() === selectedPatient,
  );
  const selectedNoteType = noteTypes.find((nt) => nt.id === noteType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-4 bottom-4 max-w-md mx-auto">
        <Card className="h-full flex flex-col glass-card">
          {/* Header */}
          <CardHeader className="flex-shrink-0 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("quickNote.title")}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Doctor Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {doctorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{doctorName}</span>
              <span>•</span>
              <span>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-auto">
            {/* Patient Selection */}
            <div>
              <label
                htmlFor="patient-select"
                className="text-sm font-medium mb-2 block"
              >
                {t("quickNote.patientLabel")}
              </label>
              <Select
                value={selectedPatient}
                onValueChange={setSelectedPatient}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("quickNote.selectPatientPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{patient.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {patient.room}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPatientData && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPatientData.diagnosis}
                </p>
              )}
            </div>

            {/* Note Type */}
            <div>
              <h4 className="text-sm font-medium mb-2 block">
                {t("quickNote.noteTypeLabel")}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {noteTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNoteType(type.id)}
                    className={`p-3 rounded-lg text-sm font-medium border transition-all ${
                      noteType === type.id
                        ? `${type.color} border-current shadow-sm`
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            {noteType && (
              <div>
                <h4 className="text-sm font-medium mb-2 block">
                  {t("quickNote.quickTemplatesLabel")}
                </h4>
                <div className="space-y-1">
                  {quickTemplates.slice(0, 3).map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateClick(template)}
                      className="w-full text-left p-2 text-sm bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Note Content */}
            <div>
              <label
                htmlFor="note-content"
                className="text-sm font-medium mb-2 block"
              >
                {t("quickNote.yourNoteLabel")}
              </label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t("quickNote.yourNotePlaceholder", {
                  noteType:
                    selectedNoteType?.label.toLowerCase() || t("quickNote.note"),
                })}
                className="min-h-[120px] resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {t("quickNote.characters", { count: noteContent.length })}
                </span>
                {noteContent.length > 500 && (
                  <span className="text-xs text-yellow-600">
                    {t("quickNote.suggestion")}
                  </span>
                )}
              </div>
            </div>

            {/* Recent Notes Preview */}
            {recentNotes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 block">
                  {t("quickNote.recentNotesLabel")}
                </h4>
                <div className="space-y-2">
                  {recentNotes.slice(0, 2).map((note) => (
                    <div key={note.id} className="p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {noteTypes.find((nt) => nt.id === note.type)?.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {note.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer Actions */}
          <div className="flex-shrink-0 p-4 border-t space-y-3">
            <Button
              onClick={handleSave}
              disabled={
                !selectedPatient || !noteType || !noteContent.trim() || isSaving
              }
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {t("quickNote.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t("quickNote.saveNote")}
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                {t("quickNote.cancel")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNoteContent("");
                  setNoteType("");
                }}
                className="flex-1"
                disabled={!noteContent && !noteType}
              >
                {t("quickNote.clear")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Floating Action Button Component
interface QuickNoteButtonProps {
  onClick: () => void;
  hasUnreadNotes?: boolean;
}

export function QuickNoteButton({
  onClick,
  hasUnreadNotes,
}: QuickNoteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
    >
      <Plus className="w-6 h-6" />
      {hasUnreadNotes && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
          <span className="text-xs text-white">!</span>
        </div>
      )}
    </button>
  );
}
