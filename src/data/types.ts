// RELEVO - Composable Patient Entity System
// This file contains all patient-related types using a composable architecture

// ========================================
// CORE ALERT SYSTEM
// ========================================

export interface Alert {
  id: string;
  patientId: string;
  type: 'INFECTION_CONTROL' | 'ALLERGY' | 'ADVERSE_REACTION' | 'RELEVANT_PATHOLOGY' | 'SPECIFIC_RISK' | 'ADMINISTRATIVE' | 'OTHER';
  alertCatalogItem: {
    code: string;
    description: string;
  };
  observations?: string;
  level: 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
  status: 'ACTIVE' | 'INACTIVE' | 'VOIDED';
  startDate: string;
  endDate?: string;
  creationDetails: {
    author: string;
    timestamp: string;
    source: string;
  };
}

// ========================================
// COMPOSABLE PATIENT MODULES
// ========================================

// Basic demographic and identification information
export interface Demographics {
  id: number;
  name: string;
  age?: number;
  mrn?: string;
  room: string;
  admissionDate?: string;
}

// Patient workflow status and priorities
export interface Workflow {
  status: 'pending' | 'in-progress' | 'complete';
  illnessSeverity: 'stable' | 'watcher' | 'unstable';
  priority?: 'high' | 'medium' | 'low';
  lastUpdate: string;
  collaborators: number;
}

// Medical information and diagnosis
export interface Medical {
  diagnosis: string;
  alerts: Alert[];  // Proper Alert objects instead of simple alertCount
}

// Care team information
export interface CareTeam {
  team?: {
    attending: string;
    resident: string;
  };
}

// I-PASS documentation entries and tracking
export interface Documentation {
  ipassEntries?: Array<{
    id: string;
    type: 'illness_severity' | 'patient_summary' | 'action_list' | 'situation_awareness';
    timestamp: Date;
    author?: string;
    isComplete?: boolean;
  }>;
  lastIPassUpdate?: {
    section: 'illness_severity' | 'patient_summary' | 'action_list' | 'situation_awareness';
    timestamp: Date;
    author: string;
  };
}

// Historical data for desktop views
export interface History {
  handoverHistory?: Array<{
    id: string;
    timestamp: Date;
    from: string;
    to: string;
    type: 'incoming' | 'outgoing';
    status: 'completed' | 'pending';
    duration?: number;
  }>;
  recentActivity?: Array<{
    id: string;
    timestamp: Date;
    action: string;
    author: string;
    details: string;
    section?: 'illness_severity' | 'patient_summary' | 'action_list' | 'situation_awareness';
  }>;
}

// ========================================
// CLINICAL DOCUMENTATION TYPES
// ========================================

export interface Author {
  name: string;
  role: string;
  specialty: string;
}

export interface ClinicalEntry {
  id: string;
  type: 'assessment' | 'plan' | 'progress' | 'family_communication' | 'discharge_planning' | 'procedure' | 'consultation';
  title: string;
  content: string;
  author: Author;
  timestamp: Date;
  isPrivate: boolean;
  tags: string[];
  collaborators?: string[];
}

// ========================================
// PATIENT TYPE COMPOSITIONS
// ========================================

// Base patient with core information
export type BasePatient = Demographics & Workflow & Medical;

// Standard patient for most views (mobile, lists, etc.) - NO VITALS
export type Patient = BasePatient & CareTeam & Documentation;

// Enhanced patient for desktop views with full historical data
export type DesktopPatient = Patient & History;

// Clinical documentation patient with detailed clinical entries
export type ClinicalPatient = Patient & {
  clinicalEntries?: ClinicalEntry[];
};

// Utility functions for working with alerts
export const getActiveAlerts = (alerts: Alert[]): Alert[] => {
  return alerts.filter(alert => alert.status === 'ACTIVE');
};

export const getCriticalAlerts = (alerts: Alert[]): Alert[] => {
  return getActiveAlerts(alerts).filter(alert => alert.level === 'HIGH');
};

export const getAlertCount = (alerts: Alert[]): number => {
  return getActiveAlerts(alerts).length;
};

export const getCriticalAlertCount = (alerts: Alert[]): number => {
  return getCriticalAlerts(alerts).length;
};

// Helper function to check if patient has critical alerts
export const hasCriticalAlerts = (patient: { alerts: Alert[] }): boolean => {
  return getCriticalAlertCount(patient.alerts) > 0;
};

// Helper function to get alert summary for patient cards
export const getAlertSummary = (alerts: Alert[]): { critical: number; total: number } => {
  const activeAlerts = getActiveAlerts(alerts);
  const criticalAlerts = getCriticalAlerts(alerts);
  
  return {
    critical: criticalAlerts.length,
    total: activeAlerts.length
  };
};

// Helper functions for I-PASS documentation
export const getIPassCompletionStatus = (entries?: Documentation['ipassEntries']) => {
  if (!entries) return { completed: 0, total: 4 };
  
  const requiredSections = ['illness_severity', 'patient_summary', 'action_list', 'situation_awareness'];
  const completedSections = requiredSections.filter(section => 
    entries.some(entry => entry.type === section && entry.isComplete !== false)
  );
  
  return {
    completed: completedSections.length,
    total: requiredSections.length
  };
};

export const getLastIPassActivity = (patient: Patient): string => {
  if (patient.lastIPassUpdate) {
    const sectionNames = {
      illness_severity: 'Illness Severity',
      patient_summary: 'Patient Summary', 
      action_list: 'Action List',
      situation_awareness: 'Situation Awareness'
    };
    return `${sectionNames[patient.lastIPassUpdate.section]} updated`;
  }
  
  if (patient.ipassEntries && patient.ipassEntries.length > 0) {
    const latest = patient.ipassEntries[patient.ipassEntries.length - 1];
    const sectionNames = {
      illness_severity: 'Illness Severity',
      patient_summary: 'Patient Summary',
      action_list: 'Action List', 
      situation_awareness: 'Situation Awareness'
    };
    return `${sectionNames[latest.type]} documented`;
  }
  
  return 'No I-PASS documentation yet';
};

// ========================================
// CONFIGURATION TYPES
// ========================================

export interface UnitConfig {
  id: string;
  name: string;
  description: string;
}

export interface ShiftConfig {
  id: string;
  name: string;
  time: string;
}

// ========================================
// DAILY SETUP TYPES
// ========================================

export interface DailySetupData {
  unit: string;
  shift: string;
  selectedPatients: number[];
  doctorName: string;
}