// RELEVO - Patient Data Store with Composable Patient Entity System
// All patient data using the new composable types with proper Alert system

import { 
  type Patient, 
  type DesktopPatient, 
  type ClinicalPatient,
  type Alert,
  getAlertCount,
  getCriticalAlertCount 
} from '../common/types';

// Mock alerts data using proper Alert schema
const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    patientId: '1',
    type: 'INFECTION_CONTROL',
    alertCatalogItem: {
      code: '70',
      description: 'Germen Multi Resistente'
    },
    observations: 'OXA48/163',
    level: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-01-20',
    creationDetails: {
      author: 'lab_auto',
      timestamp: '2025-01-20T10:00:00Z',
      source: 'Laboratory System'
    }
  },
  {
    id: 'alert-002',
    patientId: '1',
    type: 'ALLERGY',
    alertCatalogItem: {
      code: '15',
      description: 'Alergia al Látex'
    },
    observations: 'Prevención al Látex',
    level: 'MEDIUM',
    status: 'ACTIVE',
    startDate: '2025-01-19',
    creationDetails: {
      author: 'dr.smith',
      timestamp: '2025-01-19T14:30:00Z',
      source: 'Manual Entry'
    }
  },
  {
    id: 'alert-003',
    patientId: '2',
    type: 'ADVERSE_REACTION',
    alertCatalogItem: {
      code: '25',
      description: 'Reacción a Vancomicina'
    },
    observations: 'Rash con Vancomicina',
    level: 'MEDIUM',
    status: 'ACTIVE',
    startDate: '2025-01-21',
    creationDetails: {
      author: 'nurse.garcia',
      timestamp: '2025-01-21T08:15:00Z',
      source: 'Nursing Assessment'
    }
  },
  {
    id: 'alert-004',
    patientId: '3',
    type: 'RELEVANT_PATHOLOGY',
    alertCatalogItem: {
      code: '85',
      description: 'Paciente Anticoagulado'
    },
    observations: 'Warfarina 5mg diarios',
    level: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-01-18',
    creationDetails: {
      author: 'dr.martinez',
      timestamp: '2025-01-18T12:00:00Z',
      source: 'Physician Assessment'
    }
  },
  {
    id: 'alert-005',
    patientId: '4',
    type: 'SPECIFIC_RISK',
    alertCatalogItem: {
      code: '45',
      description: 'Riesgo de Caídas'
    },
    observations: 'Historia de más de 5 entradas a quirófano',
    level: 'MEDIUM',
    status: 'ACTIVE',
    startDate: '2025-01-22',
    creationDetails: {
      author: 'pt.johnson',
      timestamp: '2025-01-22T16:45:00Z',
      source: 'Physical Therapy'
    }
  },
  {
    id: 'alert-006',
    patientId: '5',
    type: 'ADMINISTRATIVE',
    alertCatalogItem: {
      code: '99',
      description: 'Paciente VIP'
    },
    level: 'INFORMATIONAL',
    status: 'ACTIVE',
    startDate: '2025-01-23',
    creationDetails: {
      author: 'admin.system',
      timestamp: '2025-01-23T09:00:00Z',
      source: 'Administrative System'
    }
  }
];

// Helper function to get alerts for a patient
const getPatientAlerts = (patientId: number): Alert[] => {
  return mockAlerts.filter(alert => alert.patientId === patientId.toString());
};

// CLEANED: Patient data focusing on medical information, not handover states
export const patients: Patient[] = [
  {
    // Demographics
    id: 1,
    name: 'Maria Rodriguez',
    age: 8,
    mrn: 'A211370',
    room: 'PICU-01',
    admissionDate: '2025-01-20',

    // Medical Priority - Focus on medical severity, not handover status
    status: 'active', // CLEANED: Simple status, not handover-specific
    illnessSeverity: 'watcher',
    priority: 'high',
    lastUpdate: '2h ago',
    collaborators: 3,

    // Medical with proper Alert objects
    diagnosis: 'Acute Respiratory Failure - Community-acquired pneumonia, Asthma exacerbation',
    alerts: getPatientAlerts(1),

    // Care Team
    team: {
      attending: 'Dr. Sarah Chen',
      resident: 'Dr. Michael Torres'
    },

    // I-PASS Documentation
    ipassEntries: [
      { id: 'ip-001', type: 'illness_severity', timestamp: new Date(Date.now() - 3600000), author: 'Dr. Michael Torres', isComplete: true },
      { id: 'ip-002', type: 'patient_summary', timestamp: new Date(Date.now() - 7200000), author: 'Dr. Sarah Chen', isComplete: true }
    ],
    lastIPassUpdate: {
      section: 'illness_severity',
      timestamp: new Date(Date.now() - 3600000),
      author: 'Dr. Michael Torres'
    }
  },
  {
    // Demographics
    id: 2,
    name: 'Carlos Gonzalez',
    age: 12,
    mrn: 'B334455',
    room: 'PICU-03',
    admissionDate: '2025-01-21',

    // Medical Priority
    status: 'active',
    illnessSeverity: 'stable',
    priority: 'medium',
    lastUpdate: '1h ago',
    collaborators: 2,

    // Medical with proper Alert objects
    diagnosis: 'Post-operative monitoring - Cardiac catheterization',
    alerts: getPatientAlerts(2),

    // Care Team
    team: {
      attending: 'Dr. Elena Vasquez',
      resident: 'Dr. James Park'
    },

    // I-PASS Documentation
    ipassEntries: [
      { id: 'ip-003', type: 'patient_summary', timestamp: new Date(Date.now() - 1800000), author: 'Dr. James Park', isComplete: true }
    ],
    lastIPassUpdate: {
      section: 'patient_summary',
      timestamp: new Date(Date.now() - 1800000),
      author: 'Dr. James Park'
    }
  },
  {
    // Demographics
    id: 3,
    name: 'Ana Silva',
    age: 15,
    mrn: 'C445566',
    room: 'PICU-05',
    admissionDate: '2025-01-18',

    // Medical Priority
    status: 'active',
    illnessSeverity: 'unstable',
    priority: 'high',
    lastUpdate: '30m ago',
    collaborators: 4,

    // Medical with proper Alert objects
    diagnosis: 'Diabetic Ketoacidosis - Type 1 diabetes mellitus, Severe dehydration',
    alerts: getPatientAlerts(3),

    // Care Team
    team: {
      attending: 'Dr. Roberto Martinez',
      resident: 'Dr. Lisa Wang'
    },

    // I-PASS Documentation
    ipassEntries: [
      { id: 'ip-004', type: 'illness_severity', timestamp: new Date(Date.now() - 900000), author: 'Dr. Lisa Wang', isComplete: true },
      { id: 'ip-005', type: 'action_list', timestamp: new Date(Date.now() - 1800000), author: 'Dr. Roberto Martinez', isComplete: true },
      { id: 'ip-006', type: 'situation_awareness', timestamp: new Date(Date.now() - 2700000), author: 'Dr. Lisa Wang', isComplete: true }
    ],
    lastIPassUpdate: {
      section: 'illness_severity',
      timestamp: new Date(Date.now() - 900000),
      author: 'Dr. Lisa Wang'
    }
  },
  {
    // Demographics
    id: 4,
    name: 'David Kim',
    age: 10,
    mrn: 'D556677',
    room: 'PICU-07',
    admissionDate: '2025-01-22',

    // Medical Priority
    status: 'active',
    illnessSeverity: 'watcher',
    priority: 'medium',
    lastUpdate: '45m ago',
    collaborators: 1,

    // Medical with proper Alert objects
    diagnosis: 'Seizure disorder - New onset seizures, EEG monitoring',
    alerts: getPatientAlerts(4),

    // Care Team
    team: {
      attending: 'Dr. Amanda Foster',
      resident: 'Dr. Kevin Chen'
    },

    // I-PASS Documentation
    ipassEntries: [
      { id: 'ip-007', type: 'patient_summary', timestamp: new Date(Date.now() - 2700000), author: 'Dr. Kevin Chen', isComplete: false }
    ],
    lastIPassUpdate: {
      section: 'patient_summary',
      timestamp: new Date(Date.now() - 2700000),
      author: 'Dr. Kevin Chen'
    }
  },
  {
    // Demographics
    id: 5,
    name: 'Sophie Martin',
    age: 6,
    mrn: 'E667788',
    room: 'PICU-09',
    admissionDate: '2025-01-23',

    // Medical Priority
    status: 'active',
    illnessSeverity: 'stable',
    priority: 'low',
    lastUpdate: '2h ago',
    collaborators: 2,

    // Medical with proper Alert objects
    diagnosis: 'Post-surgical recovery - Appendectomy, Pain management',
    alerts: getPatientAlerts(5),

    // Care Team
    team: {
      attending: 'Dr. Maria Gonzalez',
      resident: 'Dr. Alex Johnson'
    },

    // I-PASS Documentation
    ipassEntries: [
      { id: 'ip-008', type: 'action_list', timestamp: new Date(Date.now() - 7200000), author: 'Dr. Alex Johnson', isComplete: true }
    ],
    lastIPassUpdate: {
      section: 'action_list',
      timestamp: new Date(Date.now() - 7200000),
      author: 'Dr. Alex Johnson'
    }
  },
  {
    // Demographics
    id: 6,
    name: 'Lucas Brown',
    age: 14,
    mrn: 'F778899',
    room: 'PICU-11',
    admissionDate: '2025-01-19',

    // Medical Priority
    status: 'active',
    illnessSeverity: 'stable',
    priority: 'low',
    lastUpdate: '3h ago',
    collaborators: 1,

    // Medical with proper Alert objects
    diagnosis: 'Asthma exacerbation - Allergic asthma, Environmental triggers',
    alerts: [],

    // Care Team
    team: {
      attending: 'Dr. Patricia Lee',
      resident: 'Dr. Marcus Thompson'
    },

    // I-PASS Documentation
    ipassEntries: [
      { id: 'ip-009', type: 'illness_severity', timestamp: new Date(Date.now() - 10800000), author: 'Dr. Marcus Thompson', isComplete: true },
      { id: 'ip-010', type: 'patient_summary', timestamp: new Date(Date.now() - 10800000), author: 'Dr. Marcus Thompson', isComplete: true },
      { id: 'ip-011', type: 'action_list', timestamp: new Date(Date.now() - 10800000), author: 'Dr. Patricia Lee', isComplete: true },
      { id: 'ip-012', type: 'situation_awareness', timestamp: new Date(Date.now() - 10800000), author: 'Dr. Marcus Thompson', isComplete: true }
    ],
    lastIPassUpdate: {
      section: 'situation_awareness',
      timestamp: new Date(Date.now() - 10800000),
      author: 'Dr. Marcus Thompson'
    }
  }
];

// Enhanced patient data for desktop views with I-PASS focused historical information
export const getDesktopPatients = (): DesktopPatient[] => {
  return patients.map(patient => ({
    ...patient,
    handoverHistory: [
      {
        id: `history-${patient.id}-1`,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        from: 'Dr. Night Resident',
        to: patient.team?.resident || 'Dr. Day Resident',
        type: 'incoming' as const,
        status: 'completed' as const,
        duration: 15
      }
    ],
    recentActivity: [
      {
        id: `activity-${patient.id}-1`,
        timestamp: patient.lastIPassUpdate?.timestamp || new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: 'I-PASS Documentation',
        author: patient.lastIPassUpdate?.author || patient.team?.resident || 'Dr. Resident',
        details: patient.lastIPassUpdate ? 
          `Updated ${patient.lastIPassUpdate.section.replace('_', ' ')} section for ${patient.name}` :
          `Added documentation for ${patient.name}`,
        section: patient.lastIPassUpdate?.section
      },
      {
        id: `activity-${patient.id}-2`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        action: 'Patient Assessment',
        author: patient.team?.attending || 'Dr. Attending',
        details: `Clinical assessment completed for ${patient.name}`,
      }
    ]
  }));
};

// Handover patient data for handover sessions
export const getHandoverPatients = (): Patient[] => {
  // Return patients with additional handover-specific data
  return patients.map(patient => ({
    ...patient,
    // Add any handover-specific fields if needed
  }));
};

// Clinical patient data for documentation interface
export const getClinicalPatients = (): ClinicalPatient[] => {
  return patients.map(patient => ({
    ...patient,
    clinicalEntries: patient.id === 1 ? [
      {
        id: 'clinical-001',
        type: 'assessment',
        title: 'Morning Assessment - Day 3',
        content: 'Patient showing gradual improvement in respiratory status. Decreased work of breathing noted. FiO2 weaned from 60% to 45% overnight. Family remains anxious but engaged in care discussions.',
        author: {
          name: 'Dr. Sarah Chen',
          role: 'Attending Physician',
          specialty: 'Pediatric Critical Care'
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isPrivate: false,
        tags: ['respiratory', 'improvement', 'family']
      }
    ] : []
  }));
};

// CLEANED: Utility functions focusing on medical criteria, not handover status
export const sortPatients = (patients: Patient[], sortBy: string): Patient[] => {
  return [...patients].sort((a, b) => {
    switch (sortBy) {
      case 'severity':
        const severityOrder = { unstable: 3, watcher: 2, stable: 1 };
        return severityOrder[b.illnessSeverity] - severityOrder[a.illnessSeverity];
      
      case 'alerts':
        // Sort by number of critical alerts first, then total alerts
        const aCritical = getCriticalAlertCount(a.alerts);
        const bCritical = getCriticalAlertCount(b.alerts);
        if (aCritical !== bCritical) return bCritical - aCritical;
        return getAlertCount(b.alerts) - getAlertCount(a.alerts);
      
      case 'collaboration':
        return b.collaborators - a.collaborators;
      
      case 'name':
        return a.name.localeCompare(b.name);
      
      default:
        return 0;
    }
  });
};

// CLEANED: Statistics focusing on medical information
export const getPatientStats = () => {
  const totalAlerts = patients.reduce((sum, patient) => sum + getAlertCount(patient.alerts), 0);
  const criticalAlerts = patients.reduce((sum, patient) => sum + getCriticalAlertCount(patient.alerts), 0);

  return {
    total: patients.length,
    unstable: patients.filter(p => p.illnessSeverity === 'unstable').length,
    watcher: patients.filter(p => p.illnessSeverity === 'watcher').length,
    stable: patients.filter(p => p.illnessSeverity === 'stable').length,
    withAlerts: patients.filter(p => getAlertCount(p.alerts) > 0).length,
    totalAlerts,
    criticalAlerts,
    totalNotes: patients.reduce((sum, patient) => sum + (patient.ipassEntries?.length || 0), 0)
  };
};

// Mock detailed alerts data for backwards compatibility
export const mockDetailedAlerts: Record<number, Array<{
  id: string;
  type: 'allergy' | 'infection' | 'medication' | 'critical';
  message: string;
  priority: 'high' | 'medium' | 'low';
}>> = {
  1: [
    { id: 'alert-1-1', type: 'infection', message: 'Germen Multi Resistente - OXA48/163', priority: 'high' },
    { id: 'alert-1-2', type: 'allergy', message: 'Alergia al Látex', priority: 'medium' }
  ],
  2: [
    { id: 'alert-2-1', type: 'medication', message: 'Reacción a Vancomicina', priority: 'medium' }
  ],
  3: [
    { id: 'alert-3-1', type: 'critical', message: 'Paciente Anticoagulado', priority: 'high' }
  ]
};

// Mock collaborators data
export const mockCollaborators: Record<number, string[]> = {
  1: ['Dr. Sarah Chen', 'Dr. Michael Torres', 'Nurse Martinez'],
  2: ['Dr. Elena Vasquez', 'Dr. James Park'],
  3: ['Dr. Roberto Martinez', 'Dr. Lisa Wang', 'Nurse Johnson', 'Respiratory Therapist'],
  4: ['Dr. Amanda Foster'],
  5: ['Dr. Maria Gonzalez', 'Dr. Alex Johnson']
};

// Daily Setup Patient Data - Simplified format for setup wizard
export const dailySetupPatients = patients.map(patient => ({
  id: patient.id,
  name: patient.name,
  age: patient.age,
  room: patient.room,
  diagnosis: patient.diagnosis,
  status: patient.status,
  severity: patient.illnessSeverity, // Map illnessSeverity to severity for DailySetup
}));

// Utility functions for searching and filtering patients
export const getPatientById = (id: number) => {
  return patients.find(patient => patient.id === id);
};

export const getPatientsBySeverity = (severity: string) => {
  return patients.filter(p => p.illnessSeverity === severity);
};

export const getPatientsByStatus = (status: string) => {
  return patients.filter(p => p.status === status);
};

export const searchPatients = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return patients.filter(p => 
    p.name.toLowerCase().includes(lowerCaseQuery) ||
    p.room.toLowerCase().includes(lowerCaseQuery) ||
    p.diagnosis.toLowerCase().includes(lowerCaseQuery) ||
    p.mrn?.toLowerCase().includes(lowerCaseQuery)
  );
};

// Backward compatibility exports
export const mockPatients = patients; // Alias for backward compatibility