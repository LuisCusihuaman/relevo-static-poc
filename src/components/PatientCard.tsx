import { ChevronRight, Clock, User, AlertTriangle, CheckCircle, Play, Heart, Thermometer, Activity, Pill, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Import centralized types and transformation function
import { type PatientCardData } from '../data/types';

interface PatientCardProps {
  patient: PatientCardData;
}

export function PatientCard({ patient }: PatientCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-chart-1",
          textColor: "text-chart-1",
          bgColor: "bg-chart-1/10",
          label: "Pending",
          icon: <AlertTriangle className="w-4 h-4" />
        };
      case "in-progress":
        return {
          color: "bg-primary",
          textColor: "text-primary", 
          bgColor: "bg-primary/10",
          label: "In Progress",
          icon: <Play className="w-4 h-4" />
        };
      case "complete":
        return {
          color: "bg-chart-2",
          textColor: "text-chart-2",
          bgColor: "bg-chart-2/10", 
          label: "Complete",
          icon: <CheckCircle className="w-4 h-4" />
        };
      default:
        return {
          color: "bg-muted",
          textColor: "text-muted-foreground",
          bgColor: "bg-muted",
          label: "Unknown",
          icon: <Clock className="w-4 h-4" />
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
      case 'heartRate':
        const hr = value as number;
        if (hr > 100 || hr < 60) return 'warning';
        return 'normal';
      case 'oxygen':
        const o2 = value as number;
        if (o2 < 95) return 'critical';
        if (o2 < 98) return 'warning';
        return 'normal';
      case 'temperature':
        const temp = value as number;
        if (temp > 38 || temp < 36) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const statusConfig = getStatusConfig(patient.status);

  return (
    <div className={`glass-card rounded-2xl border-l-4 ${getPriorityBorder(patient.priority)} overflow-hidden transition-all duration-200 hover:shadow-lg`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-foreground text-lg">{patient.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {patient.age}y
              </Badge>
              <Badge 
                variant={patient.priority === 'high' ? 'destructive' : patient.priority === 'medium' ? 'default' : 'secondary'}
                className="text-xs capitalize"
              >
                {patient.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{patient.room}</span>
              <span>•</span>
              <span>ID: {patient.id.toString().padStart(4, '0')}</span>
              <span>•</span>
              <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
            <div className={statusConfig.textColor}>
              {statusConfig.icon}
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-1">{patient.diagnosis}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{patient.description}</p>
        </div>

        {/* Vitals - Always visible on desktop, collapsible on mobile */}
        {(!isMobile || showDetails) && (
          <div className="mb-4 p-3 bg-secondary/30 rounded-xl">
            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Vital Signs
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className={`w-4 h-4 ${getVitalStatus('heartRate', patient.vitals.heartRate) === 'warning' ? 'text-chart-1' : 'text-chart-2'}`} />
                  <span className="text-xs text-muted-foreground">HR</span>
                </div>
                <div className="font-semibold text-foreground">{patient.vitals.heartRate}</div>
                <div className="text-xs text-muted-foreground">bpm</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">BP</span>
                </div>
                <div className="font-semibold text-foreground">{patient.vitals.bloodPressure}</div>
                <div className="text-xs text-muted-foreground">mmHg</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Thermometer className={`w-4 h-4 ${getVitalStatus('temperature', patient.vitals.temperature) === 'warning' ? 'text-chart-1' : 'text-chart-2'}`} />
                  <span className="text-xs text-muted-foreground">Temp</span>
                </div>
                <div className="font-semibold text-foreground">{patient.vitals.temperature}°C</div>
                <div className="text-xs text-muted-foreground">celsius</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className={`w-4 h-4 ${getVitalStatus('oxygen', patient.vitals.oxygen) === 'critical' ? 'text-destructive' : getVitalStatus('oxygen', patient.vitals.oxygen) === 'warning' ? 'text-chart-1' : 'text-chart-2'}`} />
                  <span className="text-xs text-muted-foreground">O₂</span>
                </div>
                <div className="font-semibold text-foreground">{patient.vitals.oxygen}%</div>
                <div className="text-xs text-muted-foreground">saturation</div>
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
                Current Medications
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
                  Allergies
                </h5>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
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
              <span className="text-sm font-medium text-muted-foreground">Treatment Progress</span>
              <span className="text-sm font-medium text-primary">{patient.completionPercentage}%</span>
            </div>
            <Progress value={patient.completionPercentage} className="h-2" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{patient.doctor.replace('Dr. ', '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{patient.lastUpdated}</span>
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
                {showDetails ? 'Less' : 'More'}
              </Button>
            )}
            <Button 
              size="sm" 
              className="flex items-center gap-2"
            >
              {patient.status === "complete" ? "View" : patient.status === "in-progress" ? "Continue" : "Start"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}