// RELEVO - Configuration Store (Spanish)
// Units, shifts, colors, and system configuration in Spanish

import { type ShiftConfig, type UnitConfig } from "../common/types";

// ========================================
// HOSPITAL UNITS CONFIGURATION (Spanish)
// ========================================

export const unitsConfigES: UnitConfig[] = [
  { id: "picu", name: "UCIP", description: "Unidad de Cuidados Intensivos Pediátricos" },
  { id: "nicu", name: "UCIN", description: "Unidad de Cuidados Intensivos Neonatales" },
  {
    id: "general",
    name: "Pediatría General",
    description: "Pabellón de pediatría general",
  },
  {
    id: "cardiology",
    name: "Cardiología Pediátrica",
    description: "Unidad de cuidados cardíacos",
  },
  { id: "surgery", name: "Cirugía Pediátrica", description: "Unidad quirúrgica" },
];

export const unitsES: Record<string, string> = {
  picu: "UCIP",
  nicu: "UCIN",
  general: "Pediatría General",
  cardiology: "Cardiología Pediátrica",
  surgery: "Cirugía Pediátrica",
};


// ========================================
// SHIFT CONFIGURATION (Spanish)
// ========================================

export const shiftsConfigES: ShiftConfig[] = [
  { id: "morning", name: "Mañana", time: "07:00 - 15:00" },
  { id: "afternoon", name: "Tarde", time: "15:00 - 23:00" },
  { id: "night", name: "Noche", time: "23:00 - 07:00" },
];

export const shiftsES: Record<string, string> = {
  morning: "Mañana",
  afternoon: "Tarde",
  night: "Noche",
}; 