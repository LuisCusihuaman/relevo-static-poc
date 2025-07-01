// RELEVO - Shift Store
// Shift schedules, staff management, and handover coordination

import { type ShiftDoctor } from './types';

// ========================================
// SHIFT SCHEDULE DATA
// ========================================

export const shiftSchedule: ShiftDoctor[] = [
  {
    id: '1',
    name: 'Dr. Eduardo Martinez',
    role: 'Senior Resident',
    status: 'current',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    specialty: 'PICU'
  },
  {
    id: '2',
    name: 'Dr. Sarah Chen',
    role: 'Attending Physician',
    status: 'current',
    shiftStart: '07:00',
    shiftEnd: '19:00',
    specialty: 'PICU'
  },
  {
    id: '3',
    name: 'Dr. Michael Torres',
    role: 'Resident',
    status: 'current',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    specialty: 'PICU'
  },
  {
    id: '4',
    name: 'Dr. Lisa Park',
    role: 'Senior Resident',
    status: 'incoming',
    shiftStart: '15:00',
    shiftEnd: '23:00',
    specialty: 'PICU'
  },
  {
    id: '5',
    name: 'Dr. Anna Kim',
    role: 'Resident',
    status: 'incoming',
    shiftStart: '15:00',
    shiftEnd: '23:00',
    specialty: 'PICU'
  }
];

// ========================================
// EXTENDED SHIFT DATA
// ========================================

export interface ExtendedShiftDoctor extends ShiftDoctor {
  department: string;
  phone?: string;
  email?: string;
  patientLoad: number;
  experience: 'Junior' | 'Senior' | 'Attending';
  certifications: string[];
  currentLocation?: string;
  isOnCall: boolean;
  handoverStatus: 'pending' | 'in-progress' | 'completed';
  lastHandover?: Date;
}

export const extendedShiftSchedule: ExtendedShiftDoctor[] = [
  {
    id: '1',
    name: 'Dr. Eduardo Martinez',
    role: 'Senior Resident',
    status: 'current',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    specialty: 'PICU',
    department: 'Pediatric Critical Care',
    phone: '+54 11 1234-5678',
    email: 'eduardo.martinez@garrahan.gov.ar',
    patientLoad: 5,
    experience: 'Senior',
    certifications: ['PALS', 'BLS', 'Pediatric Critical Care'],
    currentLocation: 'PICU Floor 3',
    isOnCall: false,
    handoverStatus: 'pending'
  },
  {
    id: '2',
    name: 'Dr. Sarah Chen',
    role: 'Attending Physician',
    status: 'current',
    shiftStart: '07:00',
    shiftEnd: '19:00',
    specialty: 'PICU',
    department: 'Pediatric Critical Care',
    phone: '+54 11 2345-6789',
    email: 'sarah.chen@garrahan.gov.ar',
    patientLoad: 8,
    experience: 'Attending',
    certifications: ['PALS', 'BLS', 'Board Certified Pediatrics'],
    currentLocation: 'PICU Rounds',
    isOnCall: true,
    handoverStatus: 'completed',
    lastHandover: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Dr. Michael Torres',
    role: 'Resident',
    status: 'current',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    specialty: 'PICU',
    department: 'Pediatric Critical Care',
    phone: '+54 11 3456-7890',
    email: 'michael.torres@garrahan.gov.ar',
    patientLoad: 4,
    experience: 'Junior',
    certifications: ['PALS', 'BLS'],
    currentLocation: 'Patient Rooms',
    isOnCall: false,
    handoverStatus: 'in-progress'
  },
  {
    id: '4',
    name: 'Dr. Lisa Park',
    role: 'Senior Resident',
    status: 'incoming',
    shiftStart: '15:00',
    shiftEnd: '23:00',
    specialty: 'PICU',
    department: 'Pediatric Critical Care',
    phone: '+54 11 4567-8901',
    email: 'lisa.park@garrahan.gov.ar',
    patientLoad: 0,
    experience: 'Senior',
    certifications: ['PALS', 'BLS', 'Pediatric Critical Care'],
    currentLocation: 'Break Room',
    isOnCall: false,
    handoverStatus: 'pending'
  },
  {
    id: '5',
    name: 'Dr. Anna Kim',
    role: 'Resident',
    status: 'incoming',
    shiftStart: '15:00',
    shiftEnd: '23:00',
    specialty: 'PICU',
    department: 'Pediatric Critical Care',
    phone: '+54 11 5678-9012',
    email: 'anna.kim@garrahan.gov.ar',
    patientLoad: 0,
    experience: 'Junior',
    certifications: ['PALS', 'BLS'],
    currentLocation: 'Locker Room',
    isOnCall: false,
    handoverStatus: 'pending'
  }
];

// ========================================
// HANDOVER COORDINATION
// ========================================

export interface HandoverSession {
  id: string;
  fromDoctor: string;
  toDoctor: string;
  patientIds: number[];
  startTime: Date;
  estimatedDuration: number; // minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  completedAt?: Date;
  actualDuration?: number;
}

export const mockHandoverSessions: HandoverSession[] = [
  {
    id: 'handover-001',
    fromDoctor: 'Dr. Eduardo Martinez',
    toDoctor: 'Dr. Lisa Park',
    patientIds: [1, 2, 4],
    startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    estimatedDuration: 15,
    status: 'scheduled',
    priority: 'high',
    notes: 'Priority handover - unstable patient in room PICU-01'
  },
  {
    id: 'handover-002',
    fromDoctor: 'Dr. Michael Torres',
    toDoctor: 'Dr. Anna Kim',
    patientIds: [3, 5],
    startTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    estimatedDuration: 10,
    status: 'scheduled',
    priority: 'medium'
  }
];

// ========================================
// SHIFT UTILITIES
// ========================================

/**
 * Get current doctors on duty
 */
export const getCurrentDoctors = (): ShiftDoctor[] => {
  return shiftSchedule.filter(doctor => doctor.status === 'current');
};

/**
 * Get incoming doctors for next shift
 */
export const getIncomingDoctors = (): ShiftDoctor[] => {
  return shiftSchedule.filter(doctor => doctor.status === 'incoming');
};

/**
 * Get outgoing doctors ending their shift
 */
export const getOutgoingDoctors = (): ShiftDoctor[] => {
  return shiftSchedule.filter(doctor => doctor.status === 'outgoing');
};

/**
 * Get doctor by ID
 */
export const getDoctorById = (id: string): ShiftDoctor | undefined => {
  return shiftSchedule.find(doctor => doctor.id === id);
};

/**
 * Get doctors by specialty
 */
export const getDoctorsBySpecialty = (specialty: string): ShiftDoctor[] => {
  return shiftSchedule.filter(doctor => doctor.specialty === specialty);
};

/**
 * Get extended doctor information
 */
export const getExtendedDoctorInfo = (id: string): ExtendedShiftDoctor | undefined => {
  return extendedShiftSchedule.find(doctor => doctor.id === id);
};

// ========================================
// HANDOVER UTILITIES
// ========================================

/**
 * Get active handover sessions
 */
export const getActiveHandovers = (): HandoverSession[] => {
  return mockHandoverSessions.filter(session => 
    session.status === 'in-progress' || session.status === 'scheduled'
  );
};

/**
 * Get handovers for a specific doctor
 */
export const getHandoversForDoctor = (doctorName: string): HandoverSession[] => {
  return mockHandoverSessions.filter(session => 
    session.fromDoctor === doctorName || session.toDoctor === doctorName
  );
};

/**
 * Calculate time until next handover
 */
export const getTimeUntilNextHandover = (doctorName: string): number | null => {
  const nextHandover = mockHandoverSessions
    .filter(session => 
      (session.fromDoctor === doctorName || session.toDoctor === doctorName) &&
      session.status === 'scheduled'
    )
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];

  if (!nextHandover) return null;

  const timeUntil = nextHandover.startTime.getTime() - Date.now();
  return Math.max(0, Math.floor(timeUntil / (1000 * 60))); // minutes
};

/**
 * Format shift time
 */
export const formatShiftTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

/**
 * Check if doctor is on call
 */
export const isDoctorOnCall = (doctorId: string): boolean => {
  const doctor = getExtendedDoctorInfo(doctorId);
  return doctor?.isOnCall || false;
};

/**
 * Get shift change notifications
 */
export const getShiftChangeNotifications = (): string[] => {
  const notifications: string[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  // Check for upcoming shift changes
  if (currentHour >= 14 && currentHour < 15) {
    notifications.push('Afternoon shift starting in 1 hour');
  }
  if (currentHour >= 22 && currentHour < 23) {
    notifications.push('Night shift starting in 1 hour');
  }
  if (currentHour >= 6 && currentHour < 7) {
    notifications.push('Morning shift starting in 1 hour');
  }

  return notifications;
};

// ========================================
// COVERAGE & AVAILABILITY
// ========================================

export interface CoverageInfo {
  unit: string;
  minimumStaff: number;
  currentStaff: number;
  adequateCoverage: boolean;
  specialtyGaps: string[];
  urgentNeeds: string[];
}

export const getCurrentCoverage = (unit: string): CoverageInfo => {
  const currentDoctors = getCurrentDoctors().filter(doc => doc.specialty === unit);
  
  return {
    unit,
    minimumStaff: 3, // Example minimum
    currentStaff: currentDoctors.length,
    adequateCoverage: currentDoctors.length >= 3,
    specialtyGaps: currentDoctors.length < 3 ? ['General Coverage'] : [],
    urgentNeeds: currentDoctors.length < 2 ? ['Additional Resident'] : []
  };
};