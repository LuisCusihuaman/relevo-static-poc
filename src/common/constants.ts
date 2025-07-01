// Mock current user
export const currentUser = {
  name: 'Dr. Johnson',
  role: 'Attending Physician',
  shift: 'Day Shift',
  initials: 'DJ'
};

// Enhanced patient data with complete physician handover information
export const patientData = {
  id: 'MR-001',
  name: 'Maria Rodriguez',
  age: 72,
  mrn: 'MRN 75678-3456-89872-78',
  admissionDate: '2024-03-15',
  currentDateTime: '16:45 PMT',
  primaryTeam: 'Internal Medicine',
  primaryDiagnosis: 'Type 2 Diabetes Management',
  severity: 'stable',
  handoverStatus: 'in-progress',
  shift: 'Day → Evening',
  room: '302A',
  unit: 'Internal Medicine - 3rd Floor',
  // ONLY the physicians assigned to THIS specific patient
  assignedPhysician: {
    name: 'Dr. Johnson',
    role: 'Day Attending',
    initials: 'DJ',
    color: 'bg-blue-600',
    shiftEnd: '17:00',
    status: 'handing-off',
    patientAssignment: 'assigned'
  },
  receivingPhysician: {
    name: 'Dr. Patel',
    role: 'Evening Attending', 
    initials: 'SP',
    color: 'bg-purple-600',
    shiftStart: '17:00',
    status: 'ready-to-receive',
    patientAssignment: 'receiving'
  },
  handoverTime: '17:00 PMT',
};

// I-PASS Guidelines for each section
export const ipassGuidelines = {
  illness: {
    title: "I-PASS Illness Severity Guidelines",
    points: [
      "Consider patient's overall clinical trajectory",
      "Factor in response to current interventions", 
      "Assess need for escalation or de-escalation of care",
      "Document any concerning trends or improvements"
    ]
  },
  patient: {
    title: "I-PASS Patient Summary Guidelines", 
    points: [
      "Include relevant past medical history",
      "Document current medications and allergies",
      "Note social history and support systems",
      "Include code status and advance directives"
    ]
  },
  actions: {
    title: "I-PASS Action List Guidelines",
    points: [
      "List all pending tasks with clear timelines",
      "Include follow-up actions and appointments", 
      "Note any urgent or time-sensitive items",
      "Specify responsible team members when applicable"
    ]
  },
  awareness: {
    title: "I-PASS Situation Awareness Guidelines",
    points: [
      "Document current patient status and trends",
      "Include monitoring requirements and frequencies",
      "Note any concerning symptoms or changes",
      "Plan for potential complications with if-then scenarios"
    ]
  },
  synthesis: {
    title: "I-PASS Synthesis Guidelines",
    points: [
      "Receiving physician confirms understanding",
      "All questions and concerns are addressed",
      "Clear acceptance of clinical responsibility",
      "Documentation of formal handover completion"
    ]
  }
};

// CURRENT SHIFT HANDOVER PARTICIPANTS - Who is present RIGHT NOW
export const currentlyPresent = [
  // Currently assigned physician
  { 
    id: 1, 
    name: 'Dr. Johnson', 
    initials: 'DJ', 
    color: 'bg-blue-600', 
    status: 'active',
    lastSeen: 'now',
    activity: 'Completing handover documentation',
    role: 'Day Attending',
    presenceType: 'assigned-current'
  },
  // Receiving physician 
  { 
    id: 2, 
    name: 'Dr. Patel', 
    initials: 'SP', 
    color: 'bg-purple-600', 
    status: 'active',
    lastSeen: '30s ago',
    activity: 'Reviewing handover content',
    role: 'Evening Attending',
    presenceType: 'assigned-receiving'
  },
  // Other doctors present in current handover session
  { 
    id: 3, 
    name: 'Dr. Martinez', 
    initials: 'AM', 
    color: 'bg-gray-600', 
    status: 'active', 
    lastSeen: '1 min ago',
    activity: 'Participating in handover session',
    role: 'Day Attending',
    presenceType: 'participating'
  },
  { 
    id: 4, 
    name: 'Dr. Chen', 
    initials: 'LC', 
    color: 'bg-gray-700', 
    status: 'active',
    lastSeen: '2 min ago',
    activity: 'Joining evening shift',
    role: 'Evening Attending',
    presenceType: 'participating'
  },
  // Residents and support staff currently present
  { 
    id: 5, 
    name: 'Dr. Rodriguez', 
    initials: 'MR', 
    color: 'bg-emerald-600', 
    status: 'active',
    lastSeen: '1 min ago',
    activity: 'Taking notes',
    role: 'Resident',
    presenceType: 'supporting'
  },
  { 
    id: 6, 
    name: 'Nurse Clara', 
    initials: 'CJ', 
    color: 'bg-teal-600', 
    status: 'viewing',
    lastSeen: '3 min ago', 
    activity: 'Reviewing care plan',
    role: 'Charge Nurse',
    presenceType: 'supporting'
  },
  { 
    id: 7, 
    name: 'Dr. Wilson', 
    initials: 'RW', 
    color: 'bg-gray-500', 
    status: 'viewing',
    lastSeen: '5 min ago',
    activity: 'Observing handover',
    role: 'Day Attending',
    presenceType: 'participating'
  }
] as const;

// Filter active participants for main interface
export const activeCollaborators = currentlyPresent.filter(p => 
  p.status === 'active' || p.status === 'viewing'
);

// Recent activity feed
export const recentActivity = [
  {
    id: 1,
    user: 'Dr. Patel',
    userInitials: 'SP',
    userColor: 'bg-purple-600',
    action: 'joined handover session',
    section: 'General',
    time: '30 seconds ago',
    type: 'user_joined'
  },
  {
    id: 2,
    user: 'Dr. Rodriguez',
    userInitials: 'MR',
    userColor: 'bg-emerald-600',
    action: 'added note about respiratory status',
    section: 'Action List',
    time: '1 minute ago',
    type: 'content_added'
  },
  {
    id: 3,
    user: 'Dr. Johnson',
    userInitials: 'DJ',
    userColor: 'bg-blue-600',
    action: 'updated patient summary',
    section: 'Patient Summary',
    time: '2 minutes ago',
    type: 'content_updated'
  },
  {
    id: 4,
    user: 'Dr. Chen',
    userInitials: 'LC',
    userColor: 'bg-gray-700',
    action: 'joined handover session',
    section: 'General',
    time: '2 minutes ago',
    type: 'user_joined'
  }
];