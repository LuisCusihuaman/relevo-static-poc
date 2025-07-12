// RELEVO - Patient Data Store with Composable Patient Entity System (Spanish)
import { type Alert, type Patient } from "../common/types";

// Helper function to get alerts for a patient
const getPatientAlerts = (_patientId: number): Alert[] => {
  // This is a placeholder as alerts are not translated in this example
  return [];
};

export const patientsES: Patient[] = [
  {
    // Demographics
    id: 1,
    name: "Maria Rodriguez",
    age: 8,
    mrn: "A211370",
    room: "PICU-01",
    admissionDate: "2025-01-20",

    // Medical Priority
    status: "in-progress",
    illnessSeverity: "watcher",
    priority: "high",
    lastUpdate: "hace 2h",
    collaborators: 3,

    // Medical with proper Alert objects
    diagnosis: {
      primary: "Insuficiencia Respiratoria Aguda",
      secondary: [
        "Neumonía adquirida en la comunidad",
        "Exacerbación de asma",
      ],
    },
    alerts: getPatientAlerts(1),

    // Care Team
    team: {
      attending: "Dra. Sarah Chen",
      residents: ["Dr. Michael Torres"],
    },

    // I-PASS Documentation
    ipassEntries: [
      {
        id: "ip-001",
        type: "illness_severity",
        timestamp: new Date(Date.now() - 3600000),
        author: "Dr. Michael Torres",
        isComplete: true,
      },
      {
        id: "ip-002",
        type: "patient_summary",
        timestamp: new Date(Date.now() - 7200000),
        author: "Dra. Sarah Chen",
        isComplete: true,
      },
    ],
    lastIPassUpdate: {
      section: "illness_severity",
      timestamp: new Date(Date.now() - 3600000),
      author: "Dr. Michael Torres",
    },
  },
  {
    // Demographics
    id: 2,
    name: "Carlos Gonzalez",
    age: 12,
    mrn: "B334455",
    room: "PICU-03",
    admissionDate: "2025-01-21",

    // Medical Priority
    status: "in-progress",
    illnessSeverity: "stable",
    priority: "medium",
    lastUpdate: "hace 1h",
    collaborators: 2,

    // Medical with proper Alert objects
    diagnosis: {
      primary: "Monitoreo postoperatorio",
      secondary: ["Cateterismo cardíaco"],
    },
    alerts: getPatientAlerts(2),

    // Care Team
    team: {
      attending: "Dra. Elena Vasquez",
      residents: ["Dr. James Park"],
    },

    // I-PASS Documentation
    ipassEntries: [
      {
        id: "ip-003",
        type: "patient_summary",
        timestamp: new Date(Date.now() - 1800000),
        author: "Dr. James Park",
        isComplete: true,
      },
    ],
    lastIPassUpdate: {
      section: "patient_summary",
      timestamp: new Date(Date.now() - 1800000),
      author: "Dr. James Park",
    },
  },
  {
    // Demographics
    id: 3,
    name: "Ana Silva",
    age: 15,
    mrn: "C445566",
    room: "PICU-05",
    admissionDate: "2025-01-18",

    // Medical Priority
    status: "in-progress",
    illnessSeverity: "unstable",
    priority: "high",
    lastUpdate: "hace 30m",
    collaborators: 4,

    // Medical with proper Alert objects
    diagnosis: {
      primary: "Cetoacidosis diabética",
      secondary: ["Diabetes tipo 1", "Deshidratación severa"],
    },
    alerts: getPatientAlerts(3),
  },
  {
    // Demographics
    id: 4,
    name: "David Kim",
    age: 10,
    mrn: "D556677",
    room: "PICU-07",
    admissionDate: "2025-01-22",

    // Medical Priority
    status: "pending",
    illnessSeverity: "watcher",
    priority: "medium",
    lastUpdate: "hace 4h",
    collaborators: 1,

    // Medical with proper Alert objects
    diagnosis: {
      primary: "Trastorno convulsivo",
      secondary: ["Convulsiones de nueva aparición", "Monitoreo EEG"],
    },
    alerts: getPatientAlerts(4),
  },
  {
    // Demographics
    id: 5,
    name: "Emily Chen",
    age: 6,
    mrn: "E667788",
    room: "PICU-02",
    admissionDate: "2025-01-23",

    // Medical Priority
    status: "complete",
    illnessSeverity: "stable",
    priority: "low",
    lastUpdate: "hace 8h",
    collaborators: 2,

    // Medical with proper Alert objects
    diagnosis: {
      primary: "Recuperación post-quirúrgica",
      secondary: ["Apendicectomía"],
    },
    alerts: getPatientAlerts(5),
  },
  {
    // Demographics
    id: 6,
    name: "Luis Garcia",
    age: 14,
    mrn: "F778899",
    room: "PICU-04",
    admissionDate: "2025-01-19",

    // Medical Priority
    status: "pending",
    illnessSeverity: "stable",
    priority: "low",
    lastUpdate: "hace 12h",
    collaborators: 1,

    // Medical with proper Alert objects
    diagnosis: {
      primary: "Observación de traumatismo craneoencefálico",
      secondary: ["Concusion leve"],
    },
    alerts: getPatientAlerts(6),
  },
]; 