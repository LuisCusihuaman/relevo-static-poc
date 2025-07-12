// RELEVO - User Store (Spanish)
import { type UserProfile } from "./user.store";

export const mockUserProfileES: UserProfile = {
  id: "dr-001",
  name: "Dr. Eduardo Martinez",
  title: "Residente Senior",
  department: "Cuidados Intensivos Pediátricos",
  licenseNumber: "MD-123456",
  phone: "+54 11 1234-5678",
  email: "eduardo.martinez@garrahan.gov.ar",
  specializations: [
    "Cuidado Crítico Pediátrico",
    "Medicina de Emergencia",
  ],
  experience: {
    years: 4,
    level: "Senior Resident",
  },
  credentials: ["MD", "Pediatric Board Certified", "PALS Certified"],
  preferences: {
    theme: "system",
    notifications: true,
    defaultView: "dashboard",
    autoSave: true,
  },
  statistics: {
    totalPatients: 847,
    totalDocumentations: 2156,
    averageHandoverTime: 8.5,
    successfulHandovers: 451,
  },
}; 