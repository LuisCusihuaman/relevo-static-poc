import { CheckCircle, AlertTriangle, Eye, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Simplified patient type for setup
interface SetupPatient {
  id: number;
  name: string;
  age: number;
  room: string;
  diagnosis: string;
  severity: 'stable' | 'watcher' | 'unstable';
  status: 'pending' | 'in-progress' | 'complete';
}

interface PatientSelectionCardProps {
  patient: SetupPatient;
  isSelected: boolean;
  onToggle: (patientId: number) => void;
}

export function PatientSelectionCard({ patient, isSelected, onToggle }: PatientSelectionCardProps) {

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'unstable':
        return { 
          color: 'text-red-700', 
          bgColor: 'bg-red-50', 
          borderColor: 'border-red-200',
          icon: AlertTriangle 
        };
      case 'watcher':
        return { 
          color: 'text-yellow-700', 
          bgColor: 'bg-yellow-50', 
          borderColor: 'border-yellow-200',
          icon: Eye 
        };
      case 'stable':
        return { 
          color: 'text-green-700', 
          bgColor: 'bg-green-50', 
          borderColor: 'border-green-200',
          icon: CheckCircle 
        };
      default:
        return { 
          color: 'text-gray-700', 
          bgColor: 'bg-gray-50', 
          borderColor: 'border-gray-200',
          icon: Activity 
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'text-orange-700', bgColor: 'bg-orange-50' };
      case 'in-progress':
        return { label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-50' };
      case 'complete':
        return { label: 'Complete', color: 'text-green-700', bgColor: 'bg-green-50' };
      default:
        return { label: 'Unknown', color: 'text-gray-700', bgColor: 'bg-gray-50' };
    }
  };

  const severityConfig = getSeverityConfig(patient.severity);
  const statusConfig = getStatusConfig(patient.status);
  const SeverityIcon = severityConfig.icon;

  return (
    <Card 
      className={`transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border border-border/40 hover:border-border/60 hover:bg-muted/20'
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate">{patient.name}</h3>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Age {patient.age}</span>
                <span>•</span>
                <span className="font-medium">{patient.room}</span>
              </div>
            </div>

            {/* Status Badges Column */}
            <div className="flex flex-col items-end gap-1 ml-3">
              {/* Severity Badge - CLEAN DESIGN WITHOUT VERTICAL BAR */}
              <Badge className={`text-xs ${severityConfig.color} ${severityConfig.bgColor} ${severityConfig.borderColor} border`}>
                <SeverityIcon className="w-3 h-3 mr-1" />
                {patient.severity.charAt(0).toUpperCase() + patient.severity.slice(1)}
              </Badge>
              
              {/* Status Badge */}
              <Badge className={`text-xs border border-border/30 ${statusConfig.color} ${statusConfig.bgColor}`}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <p className="text-sm text-foreground leading-relaxed line-clamp-2">
              {patient.diagnosis}
            </p>
          </div>

          {/* Selection Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-border/20">
            <div className="text-xs text-muted-foreground">
              Click to {isSelected ? 'remove from' : 'add to'} assignment
            </div>
            {isSelected && (
              <div className="flex items-center gap-1 text-primary text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Selected
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}