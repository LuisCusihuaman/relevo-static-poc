// RELEVO - User Store
// Doctor profile, metrics, daily setup, and user-related data

import { type DoctorMetrics, type DailySetupData } from './types';

// ========================================
// DOCTOR METRICS DATA
// ========================================

export const mockMetrics: DoctorMetrics = {
  patientsAssigned: 5,
  documentationEntries: 12,
  clinicalNotesAdded: 8,
  shiftStartTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  weeklyDocumentations: 45,
  weeklyGoal: 50,
  performanceGrade: 'Senior Practitioner',
  unitRanking: 'Top 10%',
  totalClinicalHours: 38,
  patientsHandedOver: 23
};

// ========================================
// USER PROFILE DATA
// ========================================

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  specializations: string[];
  experience: {
    years: number;
    level: 'Resident' | 'Senior Resident' | 'Fellow' | 'Attending';
  };
  credentials: string[];
  currentShift?: {
    unit: string;
    shift: string;
    startTime: Date;
    patients: number[];
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    defaultView: 'dashboard' | 'patients';
    autoSave: boolean;
  };
  statistics: {
    totalPatients: number;
    totalDocumentations: number;
    averageHandoverTime: number; // minutes
    successfulHandovers: number;
  };
}

export const mockUserProfile: UserProfile = {
  id: 'dr-001',
  name: 'Dr. Eduardo Martinez',
  title: 'Senior Resident',
  department: 'Pediatric Intensive Care',
  licenseNumber: 'MD-123456',
  phone: '+54 11 1234-5678',
  email: 'eduardo.martinez@garrahan.gov.ar',
  specializations: ['Pediatric Critical Care', 'Emergency Medicine'],
  experience: {
    years: 4,
    level: 'Senior Resident'
  },
  credentials: ['MD', 'Pediatric Board Certified', 'PALS Certified'],
  preferences: {
    theme: 'system',
    notifications: true,
    defaultView: 'dashboard',
    autoSave: true
  },
  statistics: {
    totalPatients: 847,
    totalDocumentations: 2156,
    averageHandoverTime: 8.5,
    successfulHandovers: 451
  }
};

// ========================================
// DAILY SETUP UTILITIES
// ========================================

/**
 * Create initial daily setup data
 */
export const createDailySetup = (
  doctorName: string,
  unit: string,
  shift: string,
  selectedPatients: number[]
): DailySetupData => {
  return {
    doctorName,
    unit,
    shift,
    selectedPatients
  };
};

/**
 * Validate daily setup data
 */
export const validateDailySetup = (setup: Partial<DailySetupData>): boolean => {
  return !!(
    setup.doctorName?.trim() &&
    setup.unit &&
    setup.shift &&
    setup.selectedPatients &&
    setup.selectedPatients.length > 0
  );
};

// ========================================
// METRICS UTILITIES
// ========================================

/**
 * Calculate time on shift
 */
export const calculateTimeOnShift = (shiftStartTime: Date): number => {
  return Math.floor((Date.now() - shiftStartTime.getTime()) / (1000 * 60 * 60 * 100)) / 10;
};

/**
 * Calculate weekly progress percentage
 */
export const calculateWeeklyProgress = (current: number, goal: number): number => {
  return Math.round((current / goal) * 100);
};

/**
 * Get performance level based on metrics
 */
export const getPerformanceLevel = (metrics: DoctorMetrics): 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' => {
  const weeklyProgress = calculateWeeklyProgress(metrics.weeklyDocumentations, metrics.weeklyGoal);
  
  if (weeklyProgress >= 90) return 'Excellent';
  if (weeklyProgress >= 75) return 'Good';
  if (weeklyProgress >= 60) return 'Average';
  return 'Needs Improvement';
};

/**
 * Format time duration
 */
export const formatTimeDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(1)}h`;
};

// ========================================
// USER PREFERENCES
// ========================================

export interface NotificationPreferences {
  newPatients: boolean;
  criticalAlerts: boolean;
  handoverReminders: boolean;
  documentationDue: boolean;
  shiftChanges: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
}

export const defaultNotificationPreferences: NotificationPreferences = {
  newPatients: true,
  criticalAlerts: true,
  handoverReminders: true,
  documentationDue: true,
  shiftChanges: true,
  email: true,
  push: true,
  sound: false
};

// ========================================
// AUTHENTICATION & SESSION
// ========================================

export interface SessionData {
  isAuthenticated: boolean;
  loginTime: Date;
  lastActivity: Date;
  sessionTimeout: number; // minutes
  dailySetup?: DailySetupData;
}

export const createSession = (dailySetup?: DailySetupData): SessionData => {
  const now = new Date();
  return {
    isAuthenticated: true,
    loginTime: now,
    lastActivity: now,
    sessionTimeout: 480, // 8 hours
    dailySetup
  };
};

/**
 * Check if session is valid
 */
export const isSessionValid = (session: SessionData): boolean => {
  const now = new Date();
  const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
  const timeoutMs = session.sessionTimeout * 60 * 1000;
  
  return session.isAuthenticated && timeSinceActivity < timeoutMs;
};

/**
 * Update session activity
 */
export const updateSessionActivity = (session: SessionData): SessionData => {
  return {
    ...session,
    lastActivity: new Date()
  };
};

// ========================================
// QUICK ACTIONS & SHORTCUTS
// ========================================

export interface QuickAccessAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  shortcut?: string;
  action: string;
  data?: any;
}

export const quickAccessActions: QuickAccessAction[] = [
  {
    id: 'fast-ipass',
    label: 'Quick I-PASS Entry',
    description: 'Add documentation for priority patient',
    icon: 'FileText',
    shortcut: '⌘N',
    action: 'clinical_entry'
  },
  {
    id: 'start-handover',
    label: 'Start Handover',
    description: 'Begin patient handover process',
    icon: 'Activity',
    shortcut: '⌘H',
    action: 'start_handover'
  },
  {
    id: 'search-patients',
    label: 'Search Patients',
    description: 'Find patients quickly',
    icon: 'Search',
    shortcut: '⌘K',
    action: 'open_search'
  },
  {
    id: 'view-alerts',
    label: 'View Critical Alerts',
    description: 'Check urgent patient alerts',
    icon: 'AlertTriangle',
    shortcut: '⌘A',
    action: 'view_alerts'
  }
];

/**
 * Get user's frequently used actions
 */
export const getFrequentActions = (userId: string): QuickAccessAction[] => {
  // This would typically come from user behavior analytics
  return quickAccessActions.slice(0, 3);
};