// RELEVO - Shift Store (Spanish)
import { type HandoverSession } from "./shift.store";

export const mockHandoverSessionsES: HandoverSession[] = [
  {
    id: "handover-001",
    fromDoctor: "Dr. Eduardo Martinez",
    toDoctor: "Dr. Lisa Park",
    patientIds: [1, 2, 4],
    startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    estimatedDuration: 15,
    status: "scheduled",
    priority: "high",
    notes: "Traspaso prioritario - paciente inestable en la habitación PICU-01",
  },
  {
    id: "handover-002",
    fromDoctor: "Dr. Michael Torres",
    toDoctor: "Dr. Anna Kim",
    patientIds: [3, 5],
    startTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    estimatedDuration: 10,
    status: "scheduled",
    priority: "medium",
  },
];

export const upcomingTasksES = [
  {
    time: "10:00",
    task: "Sesión de traspaso con Dr. Torres",
    priority: "high",
  },
  {
    time: "11:30",
    task: "Reunión familiar - Habitación PICU-01",
    priority: "medium",
  },
  { time: "14:00", task: "Revisar planes de alta", priority: "low" },
  { time: "15:30", task: "Rondas de medicación", priority: "medium" },
];

export const recentActivitiesES = [
  {
    id: 1,
    type: "care-plan-update",
    patient: "Maria Rodriguez",
    doctor: "Dr. Sarah Chen",
    timestamp: "hace 15 min",
    details: "Plan de cuidados actualizado para Maria Rodriguez",
  },
  {
    id: 2,
    type: "new-comment",
    patient: "Carlos Gonzalez",
    doctor: "Dr. Michael Torres",
    timestamp: "hace 23 min",
    details: "Nuevo comentario en el traspaso de Carlos Gonzalez",
  },
  {
    id: 3,
    type: "documentation-complete",
    patient: "General",
    doctor: "Dr. Lisa Park",
    timestamp: "hace 1 hora",
    details: "Documentación de alta completada",
  },
  {
    id: 4,
    type: "handover-started",
    patient: "General",
    doctor: "Dr. Sarah Chen",
    timestamp: "hace 2 horas",
    details: "Sesión de traspaso colaborativa iniciada",
  },
]; 