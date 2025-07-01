import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertCircle, AlertTriangle, CheckCircle, ChevronRight, Clock, Eye, FileText, Heart, History, Pill, Play, Shield, Thermometer, User } from "lucide-react";
import { useState } from 'react';

// Import centralized types
import { type EnhancedPatientCardData } from '../../../common/types';

interface EnhancedPatientCardProps {
  patient: EnhancedPatientCardData;
  viewMode?: 'compact' | 'detailed' | 'handover';
  onStartHandover?: (patientId: number) => void;
}

export function EnhancedPatientCard({ patient, viewMode = 'compact', onStartHandover }: EnhancedPatientCardProps) {
  const [showIPass, setShowIPass] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-chart-1",
          textColor: "text-chart-1",
          bgColor: "bg-chart-1/10",
          label: "Pending Review",
          icon: <AlertTriangle className="w-4 h-4" />
        };
      case "in-progress":
        return {
          color: "bg-primary",
          textColor: "text-primary", 
          bgColor: "bg-primary/10",
          label: "Active Care",
          icon: <Play className="w-4 h-4" />
        };
      case "complete":
        return {
          color: "bg-chart-2",
          textColor: "text-chart-2",
          bgColor: "bg-chart-2/10", 
          label: "Stable",
          icon: <CheckCircle className="w-4 h-4" />
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
      case 'allergy':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'lab_critical':
        return <Activity className="w-4 h-4 text-destructive" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-chart-1" />;
      case 'vital':
        return <Heart className="w-4 h-4 text-destructive" />;
      case 'isolation':
        return <Shield className="w-4 h-4 text-chart-4" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getVitalStatus = (vital: string, value: number | string) => {
    switch (vital) {
      case 'heartRate':
        const hr = value as number;
        if (hr > 120 || hr < 60) return { status: 'critical', class: 'text-destructive bg-destructive/10' };
        if (hr > 100 || hr < 70) return { status: 'warning', class: 'text-chart-1 bg-chart-1/10' };
        return { status: 'normal', class: 'text-chart-2 bg-chart-2/10' };
      case 'oxygen':
        const o2 = value as number;
        if (o2 < 90) return { status: 'critical', class: 'text-destructive bg-destructive/10' };
        if (o2 < 95) return { status: 'warning', class: 'text-chart-1 bg-chart-1/10' };
        return { status: 'normal', class: 'text-chart-2 bg-chart-2/10' };
      case 'temperature':
        const temp = value as number;
        if (temp > 39 || temp < 35) return { status: 'critical', class: 'text-destructive bg-destructive/10' };
        if (temp > 38 || temp < 36) return { status: 'warning', class: 'text-chart-1 bg-chart-1/10' };
        return { status: 'normal', class: 'text-chart-2 bg-chart-2/10' };
      default:
        return { status: 'normal', class: 'text-chart-2 bg-chart-2/10' };
    }
  };

  const statusConfig = getStatusConfig(patient.status);
  const criticalAlerts = patient.criticalAlerts.filter(alert => alert.severity === 'high');

  return (
    <Card className={`glass-card rounded-2xl border-l-4 ${getPriorityBorder(patient.priority)} overflow-hidden transition-all duration-200 hover:shadow-lg ${
      criticalAlerts.length > 0 ? 'ring-2 ring-destructive/20' : ''
    }`}>
      <CardContent className="p-6">
        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
              <span className="font-semibold text-destructive">Critical Alerts ({criticalAlerts.length})</span>
            </div>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {getCriticalAlertIcon(alert.type)}
                  <span className="text-destructive font-medium">{alert.message}</span>
                </div>
              ))}
              {criticalAlerts.length > 2 && (
                <div className="text-sm text-destructive">+ {criticalAlerts.length - 2} more alerts</div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-foreground text-xl">{patient.name}</h3>
              <Badge variant="secondary" className="text-sm">
                {patient.age}y
              </Badge>
              <Badge 
                variant={patient.priority === 'high' ? 'destructive' : patient.priority === 'medium' ? 'default' : 'secondary'}
                className="text-sm capitalize"
              >
                {patient.priority} Priority
              </Badge>
              {patient.integrationData.monitoringActive && (
                <Badge variant="outline" className="text-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Monitoring
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{patient.room}</span>
              <span>•</span>
              <span>MRN: {patient.id.toString().padStart(6, '0')}</span>
              <span>•</span>
              <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <div className={statusConfig.textColor}>
                {statusConfig.icon}
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
              I-PASS
            </Button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{patient.description}</p>
        </div>

        {/* I-PASS Protocol Details */}
        {showIPass && (
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              I-PASS Structured Handover
            </h5>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-foreground">Illness Severity:</span>
                <p className="text-muted-foreground mt-1">{patient.iPassData.illness}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Patient Summary:</span>
                <p className="text-muted-foreground mt-1">{patient.iPassData.patientSummary}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Action List:</span>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  {patient.iPassData.actionList.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-foreground">Situation Awareness:</span>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  {patient.iPassData.situationAwareness.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-foreground">Synthesis:</span>
                <p className="text-muted-foreground mt-1">{patient.iPassData.synthesis}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Vitals with Critical Highlighting */}
        <div className="mb-4 p-4 bg-secondary/20 rounded-xl">
          <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-time Vitals
            <Badge variant="outline" className="text-xs">
              Updated {patient.integrationData.labLastSync}
            </Badge>
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(patient.vitals).map(([key, value]) => {
              const vitalStatus = getVitalStatus(key, value);
              const icons = {
                heartRate: Heart,
                bloodPressure: Activity,
                temperature: Thermometer,
                oxygen: Activity
              };
              const Icon = icons[key as keyof typeof icons];
              const units = {
                heartRate: 'bpm',
                bloodPressure: 'mmHg',
                temperature: '°C',
                oxygen: '%'
              };

              return (
                <div key={key} className={`text-center p-3 rounded-lg ${vitalStatus.class}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <div className="font-semibold text-lg">{value}</div>
                  <div className="text-xs opacity-80">{units[key as keyof typeof units]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medications and Allergies with Safety Highlighting */}
        <div className="mb-4 space-y-3">
          <div>
            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Current Medications
            </h5>
            <div className="flex flex-wrap gap-2">
              {patient.medications.map((med, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {med}
                </Badge>
              ))}
            </div>
          </div>
          
          {patient.allergies.length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h5 className="font-medium text-destructive mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                ⚠️ ALLERGIES - CRITICAL
              </h5>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-sm font-bold">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress for in-progress patients */}
        {patient.status === "in-progress" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Treatment Progress</span>
              <span className="text-sm font-medium text-primary">{patient.completionPercentage}%</span>
            </div>
            <Progress value={patient.completionPercentage} className="h-3" />
          </div>
        )}

        {/* Integration Status */}
        <div className="mb-4 p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
              <span className="text-muted-foreground">EHR: {patient.integrationData.ehrLastSync}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
              <span className="text-muted-foreground">Labs: {patient.integrationData.labLastSync}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Monitoring: Active</span>
            </div>
          </div>
        </div>

        {/* Handover History */}
        {showHistory && (
          <div className="mb-4 p-4 bg-muted/30 rounded-xl">
            <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Handover History
            </h5>
            <div className="space-y-2">
              {patient.handoverHistory.slice(0, 3).map((handover, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-background rounded">
                  <div>
                    <span className="font-medium">{handover.fromDoctor} → {handover.toDoctor}</span>
                    <div className="text-xs text-muted-foreground">{handover.timestamp.toLocaleString()}</div>
                  </div>
                  <Badge variant={handover.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {handover.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{patient.doctor.replace('Dr. ', '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{patient.lastUpdated}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Full
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => onStartHandover?.(patient.id)}
            >
              {patient.status === "complete" ? "Review" : patient.status === "in-progress" ? "Continue" : "Start Handover"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}