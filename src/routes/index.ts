// Route configuration for the application
export const routes = {
  // Main navigation routes
  SCHEDULE: "/schedule",
  PATIENTS: "/patients",
  PROFILE: "/profile",

  // Page routes
  DAILY_SETUP: "/setup",
  HANDOVER_DASHBOARD: "/handover",
  HANDOVER_SESSION: "/handover/session",
  CLINICAL_DOCUMENTATION: "/clinical",
  PATIENT_DETAIL: "/patients/:id",
  NOTIFICATIONS: "/notifications",
  SEARCH: "/search",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];
