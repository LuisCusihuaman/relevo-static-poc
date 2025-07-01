// RELEVO Mock Data - Legacy Compatibility Layer
// This file maintains backward compatibility while data is organized into stores

// ========================================
// LEGACY RE-EXPORTS
// ========================================

// Export everything from the new store structure for backward compatibility
export * from '../store/index';

// Specific legacy exports that components expect
export { 
  mockPatients,
  dailySetupPatients,
  mockCollaborators,
  mockDetailedAlerts,
  getPatientById,
  getPatientsBySeverity,
  getPatientsByStatus,
  searchPatients
} from '../store/patients.store';

export {
  unitsConfig,
  shiftsConfig,
  units,
  shifts,
  severityColors,
  statusColors,
  getUnitName,
  getShiftName,
  getSeverityColor,
  getStatusColor
} from '../store/config.store';

export {
  mockMetrics,
  mockUserProfile,
  calculateTimeOnShift,
  calculateWeeklyProgress
} from '../store/user.store';

export {
  shiftSchedule,
  extendedShiftSchedule,
  mockHandoverSessions,
  getCurrentDoctors,
  getIncomingDoctors,
  getTimeUntilNextHandover
} from '../store/shift.store';

export {
  ipassBlocks,
  clinicalTemplates,
  clinicalProtocols,
  getIPassBlock,
  getClinicalTemplate,
  getSuggestedTemplate
} from '../store/clinical.store';

// Export types
export type { DailySetupData } from './types';

// ========================================
// MIGRATION NOTICE
// ========================================

/**
 * @deprecated This file provides backward compatibility.
 * New code should import directly from specific store files:
 * 
 * - './patients.store' for patient data
 * - './user.store' for user/doctor data  
 * - './shift.store' for shift schedules
 * - './clinical.store' for I-PASS and clinical data
 * - './config.store' for configuration and constants
 * 
 * Use './index' for comprehensive imports.
 */