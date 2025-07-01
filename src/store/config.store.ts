// RELEVO - Configuration Store
// Units, shifts, colors, and system configuration

import { type UnitConfig, type ShiftConfig } from '../common/types';

// ========================================
// HOSPITAL UNITS CONFIGURATION
// ========================================

export const unitsConfig: UnitConfig[] = [
  { id: 'picu', name: 'PICU', description: 'Pediatric Intensive Care Unit' },
  { id: 'nicu', name: 'NICU', description: 'Neonatal Intensive Care Unit' },
  { id: 'general', name: 'General Pediatrics', description: 'General pediatric ward' },
  { id: 'cardiology', name: 'Pediatric Cardiology', description: 'Cardiac care unit' },
  { id: 'surgery', name: 'Pediatric Surgery', description: 'Surgical unit' }
];

// Legacy unit mapping for backward compatibility
export const units: Record<string, string> = {
  'picu': 'PICU',
  'nicu': 'NICU', 
  'general': 'General Pediatrics',
  'cardiology': 'Pediatric Cardiology',
  'surgery': 'Pediatric Surgery'
};

// ========================================
// SHIFT CONFIGURATION
// ========================================

export const shiftsConfig: ShiftConfig[] = [
  { id: 'morning', name: 'Morning', time: '07:00 - 15:00' },
  { id: 'afternoon', name: 'Afternoon', time: '15:00 - 23:00' },
  { id: 'night', name: 'Night', time: '23:00 - 07:00' }
];

// Legacy shift mapping for backward compatibility
export const shifts: Record<string, string> = {
  'morning': 'Morning',
  'afternoon': 'Afternoon',
  'night': 'Night'
};

// ========================================
// COLOR MAPPINGS & THEMES
// ========================================

// Severity color mapping utilities
export const severityColors: Record<string, string> = {
  unstable: 'text-red-600 bg-red-50 border-red-200',
  watcher: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  stable: 'text-green-600 bg-green-50 border-green-200'
};

// Status color mapping utilities
export const statusColors: Record<string, string> = {
  pending: 'text-orange-600',
  'in-progress': 'text-blue-600',
  complete: 'text-green-600'
};

// Alert level colors
export const alertLevelColors: Record<string, string> = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  low: 'text-blue-600 bg-blue-50 border-blue-200',
  informational: 'text-gray-600 bg-gray-50 border-gray-200'
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get unit name by ID
 */
export const getUnitName = (unitId: string): string => {
  return units[unitId] || unitId.toUpperCase();
};

/**
 * Get shift name by ID
 */
export const getShiftName = (shiftId: string): string => {
  return shifts[shiftId] || shiftId;
};

/**
 * Get unit configuration by ID
 */
export const getUnitConfig = (unitId: string): UnitConfig | undefined => {
  return unitsConfig.find(unit => unit.id === unitId);
};

/**
 * Get shift configuration by ID
 */
export const getShiftConfig = (shiftId: string): ShiftConfig | undefined => {
  return shiftsConfig.find(shift => shift.id === shiftId);
};

/**
 * Get severity color classes
 */
export const getSeverityColor = (severity: string): string => {
  return severityColors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
};

/**
 * Get status color classes
 */
export const getStatusColor = (status: string): string => {
  return statusColors[status] || 'text-gray-600';
};

/**
 * Get alert level color classes
 */
export const getAlertLevelColor = (level: string): string => {
  return alertLevelColors[level.toLowerCase()] || 'text-gray-600 bg-gray-50 border-gray-200';
};

// ========================================
// SYSTEM DEFAULTS
// ========================================

export const defaultUnit = 'picu';
export const defaultShift = 'morning';
export const defaultSeverity = 'stable';
export const defaultStatus = 'pending';

// Medical interface constants
export const medicalConstants = {
  minPatientAge: 0,
  maxPatientAge: 18,
  documentationGoal: 50, // Weekly goal
  maxAlerts: 10,
  refreshInterval: 30000, // 30 seconds
  handoverTimeout: 1800000, // 30 minutes
};