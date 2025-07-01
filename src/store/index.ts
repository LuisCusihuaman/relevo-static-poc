// RELEVO - Data Store Index
// Central export point for all store modules

// ========================================
// TYPE EXPORTS
// ========================================
export * from '../common/types';

// ========================================
// STORE EXPORTS
// ========================================

// Configuration Store
export * from './config.store';

// Patients Store
export * from './patients.store';

// User Store
export * from './user.store';

// Shift Store
export * from './shift.store';

// Clinical Store
export * from './clinical.store';

// ========================================
// LEGACY COMPATIBILITY
// ========================================

// Re-export commonly used items for backward compatibility
export { mockPatients as patients } from './patients.store';
export { mockMetrics as metrics } from './user.store';
export { shiftSchedule as schedule } from './shift.store';
export { ipassBlocks as blocks } from './clinical.store';

// ========================================
// STORE REGISTRY
// ========================================

export const storeModules = {
  config: 'config.store',
  patients: 'patients.store',
  user: 'user.store',
  shift: 'shift.store',
  clinical: 'clinical.store'
} as const;

export type StoreModule = keyof typeof storeModules;

// ========================================
// UNIFIED DATA ACCESS
// ========================================

/**
 * Central data access interface for future Context API implementation
 */
export interface DataStores {
  config: {
    units: typeof import('./config.store').unitsConfig;
    shifts: typeof import('./config.store').shiftsConfig;
    colors: {
      severity: typeof import('./config.store').severityColors;
      status: typeof import('./config.store').statusColors;
    };
  };
  patients: {
    list: typeof import('./patients.store').mockPatients;
    collaborators: typeof import('./patients.store').mockCollaborators;
    alerts: typeof import('./patients.store').mockDetailedAlerts;
  };
  user: {
    profile: typeof import('./user.store').mockUserProfile;
    metrics: typeof import('./user.store').mockMetrics;
    preferences: typeof import('./user.store').defaultNotificationPreferences;
  };
  shift: {
    schedule: typeof import('./shift.store').shiftSchedule;
    handovers: typeof import('./shift.store').mockHandoverSessions;
    coverage: any; // Will be dynamically calculated
  };
  clinical: {
    ipassBlocks: typeof import('./clinical.store').ipassBlocks;
    templates: typeof import('./clinical.store').clinicalTemplates;
    protocols: typeof import('./clinical.store').clinicalProtocols;
  };
}

/**
 * Store initialization configuration
 */
export const storeConfig = {
  enablePersistence: true,
  persistKeys: ['user.preferences', 'user.profile'],
  refreshInterval: 30000, // 30 seconds
  maxCacheAge: 300000, // 5 minutes
  errorRetryAttempts: 3,
  enableOfflineMode: true
};

/**
 * Store state management helpers for Context API
 */
export interface StoreActions {
  // Patient actions
  updatePatient: (id: number, updates: Partial<import('./types').PatientData>) => void;
  addPatientNote: (patientId: number, note: string) => void;
  updatePatientSeverity: (patientId: number, severity: import('./types').IllnessSeverity) => void;
  
  // User actions
  updateUserProfile: (updates: Partial<import('./user.store').UserProfile>) => void;
  updateMetrics: (updates: Partial<import('./types').DoctorMetrics>) => void;
  setDailySetup: (setup: import('./types').DailySetupData) => void;
  
  // Shift actions
  updateShiftSchedule: (schedule: import('./types').ShiftDoctor[]) => void;
  startHandover: (sessionId: string) => void;
  completeHandover: (sessionId: string) => void;
  
  // Clinical actions
  saveIPassEntry: (patientId: number, entry: import('./types').IPassEntry) => void;
  updateClinicalTemplate: (templateId: string, updates: any) => void;
}

/**
 * Mock store implementation for development
 * This structure will be replaced with actual Context API providers
 */
export const createMockStore = (): DataStores => ({
  config: {
    units: require('./config.store').unitsConfig,
    shifts: require('./config.store').shiftsConfig,
    colors: {
      severity: require('./config.store').severityColors,
      status: require('./config.store').statusColors,
    },
  },
  patients: {
    list: require('./patients.store').mockPatients,
    collaborators: require('./patients.store').mockCollaborators,
    alerts: require('./patients.store').mockDetailedAlerts,
  },
  user: {
    profile: require('./user.store').mockUserProfile,
    metrics: require('./user.store').mockMetrics,
    preferences: require('./user.store').defaultNotificationPreferences,
  },
  shift: {
    schedule: require('./shift.store').shiftSchedule,
    handovers: require('./shift.store').mockHandoverSessions,
    coverage: null, // Calculated dynamically
  },
  clinical: {
    ipassBlocks: require('./clinical.store').ipassBlocks,
    templates: require('./clinical.store').clinicalTemplates,
    protocols: require('./clinical.store').clinicalProtocols,
  },
});