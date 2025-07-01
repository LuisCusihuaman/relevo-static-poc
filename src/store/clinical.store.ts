// RELEVO - Clinical Store
// I-PASS blocks, clinical documentation, and medical protocols

import { type IPassBlock, type QuickAction } from '../common/types';

// ========================================
// I-PASS BLOCK DEFINITIONS
// ========================================

export const ipassBlocks: IPassBlock[] = [
  {
    id: 'illness_severity',
    name: 'Illness Severity',
    shortName: 'Severity',
    icon: 'AlertTriangle', // String identifier instead of React component
    color: 'bg-red-100 border-red-300 text-red-700',
    placeholder: `Document patient stability level and critical actions...

Examples:
• "Illness Severity: Watcher - requires close monitoring q2h"
• "Key concerns: respiratory distress, risk of intubation"  
• "Critical actions: monitor work of breathing, ABG if needed"

Tap quick actions below or start typing freely...`,
    quickActions: [
      {
        label: 'Set Severity',
        text: 'Illness Severity: '
      },
      {
        label: 'Key Concerns',
        text: 'Key Concerns:\n• '
      },
      {
        label: 'Critical Actions',
        text: 'Critical Actions:\n• '
      }
    ]
  },
  {
    id: 'patient_summary',
    name: 'Patient Summary',
    shortName: 'Summary',
    icon: 'User', // String identifier instead of React component
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    placeholder: `Document patient overview, diagnosis, and current status...

Examples:
• "7F admitted 01/20 with acute respiratory failure secondary to pneumonia"
• "Hospital course: started on high-flow O2, antibiotics, improving over 48h"
• "Current status: stable on 45% FiO2, tolerating PO, family present"

Tap quick actions below or start typing freely...`,
    quickActions: [
      {
        label: 'Demographics',
        text: 'Patient Summary:\nAge: \nAdmission: \nDiagnosis: '
      },
      {
        label: 'Hospital Course',
        text: 'Hospital Course:\n• '
      },
      {
        label: 'Current Status',
        text: 'Current Status:\n• '
      }
    ]
  },
  {
    id: 'action_list',
    name: 'Action List',
    shortName: 'Actions',
    icon: 'Target', // String identifier instead of React component
    color: 'bg-green-100 border-green-300 text-green-700',
    placeholder: `Document tasks, interventions, and follow-up items...

Examples:
• "Immediate: monitor respiratory rate q2h, ABG if increased distress"
• "Ongoing: continue high-flow O2, antibiotics per protocol"
• "Pending: chest X-ray results, respiratory therapy assessment"

Tap quick actions below or start typing freely...`,
    quickActions: [
      {
        label: 'Immediate',
        text: 'Immediate Actions:\n• '
      },
      {
        label: 'Ongoing Tasks',
        text: 'Ongoing:\n• '
      },
      {
        label: 'Pending Results',
        text: 'Pending:\n• '
      }
    ]
  },
  {
    id: 'situation_awareness',
    name: 'Situation Awareness',
    shortName: 'Awareness',
    icon: 'Eye', // String identifier instead of React component
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    placeholder: `Document contingency plans and anticipatory guidance...

Examples:
• "Anticipate: potential for respiratory deterioration, watch for increased WOB"
• "If respiratory distress increases, then prepare for intubation, call anesthesia"
• "Communication: update family q8h, notify attending if concerns"

Tap quick actions below or start typing freely...`,
    quickActions: [
      {
        label: 'Anticipate',
        text: 'Anticipate:\n• '
      },
      {
        label: 'If-Then Plans',
        text: 'If-Then Planning:\n• If [condition], then [action]\n• '
      },
      {
        label: 'Communication',
        text: 'Communication:\n• '
      }
    ]
  }
];

// ========================================
// CLINICAL TEMPLATES
// ========================================

export interface ClinicalTemplate {
  id: string;
  name: string;
  category: 'respiratory' | 'cardiac' | 'neurological' | 'general' | 'emergency';
  severity: 'stable' | 'watcher' | 'unstable';
  blocks: {
    illness_severity?: string;
    patient_summary?: string;
    action_list?: string;
    situation_awareness?: string;
  };
  commonDiagnoses: string[];
}

export const clinicalTemplates: ClinicalTemplate[] = [
  {
    id: 'respiratory-watcher',
    name: 'Respiratory Distress - Watcher',
    category: 'respiratory',
    severity: 'watcher',
    blocks: {
      illness_severity: `Illness Severity: Watcher

Key Concerns:
• Respiratory status requires close monitoring - on high-flow oxygen
• Risk of progression to intubation if work of breathing increases

Critical Actions Required:
• Monitor respiratory rate and work of breathing q2h
• Arterial blood gas if increased distress`,
      patient_summary: `Patient Summary:
Age: [AGE]
Admission Date: [DATE]
Primary Diagnosis: Acute respiratory failure secondary to [CAUSE]

Hospital Course:
• Admitted from ED with respiratory distress
• Started on high-flow oxygen and supportive care
• [CURRENT STATUS]

Current Status:
• Stable on [FiO2]% oxygen
• [RESPIRATORY STATUS]
• Tolerating oral intake, family present`,
      action_list: `Immediate Actions:
• Monitor respiratory rate and work of breathing q2h
• Arterial blood gas if increased distress
• Notify MD if RR >30 or increased accessory muscle use

Ongoing:
• Continue high-flow oxygen as tolerated
• Chest physiotherapy q6h
• Monitor fluid balance

Pending:
• Chest X-ray results
• Respiratory therapy assessment`,
      situation_awareness: `Anticipate:
• Potential for respiratory deterioration
• Watch for increased work of breathing

If-Then Planning:
• If respiratory distress increases, then prepare for intubation
• If oxygen requirements increase, then call attending
• If family has concerns, then provide updates q8h

Communication:
• Update family q8h on respiratory status
• Notify attending if oxygen requirements change`
    },
    commonDiagnoses: ['Pneumonia', 'Asthma Exacerbation', 'Bronchiolitis', 'Respiratory Failure']
  },
  {
    id: 'cardiac-stable',
    name: 'Post-Operative Cardiac - Stable',
    category: 'cardiac',
    severity: 'stable',
    blocks: {
      illness_severity: `Illness Severity: Stable

Patient Status:
• Post-operative day [DAY] following [PROCEDURE]
• Hemodynamically stable
• Chest tubes draining minimal output

Monitoring:
• Routine post-operative monitoring
• Standard cardiac surgery protocol`,
      patient_summary: `Patient Summary:
Age: [AGE]
Procedure: [CARDIAC PROCEDURE]
Post-Op Day: [DAY]

Hospital Course:
• Underwent [PROCEDURE] on [DATE]
• Smooth post-operative recovery
• Chest tubes with minimal drainage

Current Status:
• Hemodynamically stable
• Pain well controlled
• Family involved in care decisions`,
      action_list: `Ongoing:
• Continue post-operative cardiac monitoring
• Chest tube care per protocol
• Pain management as needed
• Activity as tolerated

Pending:
• Echo results
• Surgical team evaluation
• Discharge planning discussion`,
      situation_awareness: `Anticipate:
• Continued stable recovery
• Gradual increase in activity level

Communication:
• Family updates on recovery progress
• Coordinate with surgical team for discharge planning`
    },
    commonDiagnoses: ['VSD Repair', 'ASD Repair', 'Tetralogy of Fallot', 'Cardiac Surgery']
  }
];

// ========================================
// CLINICAL PROTOCOLS
// ========================================

export interface ClinicalProtocol {
  id: string;
  name: string;
  category: string;
  steps: string[];
  triggers: string[];
  contraindications?: string[];
  emergencyContacts?: string[];
}

export const clinicalProtocols: ClinicalProtocol[] = [
  {
    id: 'respiratory-distress',
    name: 'Respiratory Distress Protocol',
    category: 'respiratory',
    steps: [
      'Assess airway, breathing, circulation',
      'Apply oxygen via appropriate delivery method',
      'Monitor oxygen saturation continuously',
      'Position patient for optimal breathing',
      'Prepare for potential intubation if indicated',
      'Notify attending physician',
      'Document interventions and response'
    ],
    triggers: [
      'Respiratory rate >30 or <10',
      'Oxygen saturation <90%',
      'Increased work of breathing',
      'Cyanosis',
      'Altered mental status with respiratory symptoms'
    ],
    contraindications: [
      'Pneumothorax (relative - requires chest tube first)',
      'Severe facial trauma affecting airway'
    ],
    emergencyContacts: [
      'PICU Attending: ext 2345',
      'Respiratory Therapy: ext 3456',
      'Anesthesia (for intubation): ext 4567'
    ]
  },
  {
    id: 'cardiac-arrest',
    name: 'Pediatric Cardiac Arrest Protocol',
    category: 'emergency',
    steps: [
      'Call for help - activate code blue',
      'Begin CPR immediately (30:2 ratio)',
      'Apply monitors/defibrillator',
      'Establish IV/IO access',
      'Administer epinephrine 0.01 mg/kg',
      'Continue CPR cycles',
      'Consider reversible causes (H&T)',
      'Post-arrest care if ROSC achieved'
    ],
    triggers: [
      'Unresponsive patient',
      'No pulse',
      'Agonal breathing or apnea'
    ],
    emergencyContacts: [
      'Code Blue Team: 911',
      'PICU Attending: ext 2345',
      'Pharmacy: ext 5678'
    ]
  }
];

// ========================================
// ICON MAPPING UTILITY
// ========================================

/**
 * Map icon names to their string identifiers
 * Components will need to resolve these to actual React components
 */
export const iconMap = {
  AlertTriangle: 'AlertTriangle',
  User: 'User',
  Target: 'Target',
  Eye: 'Eye',
  FileText: 'FileText',
  Activity: 'Activity',
  Search: 'Search',
  Calendar: 'Calendar'
} as const;

// ========================================
// CLINICAL UTILITIES
// ========================================

/**
 * Get I-PASS block by ID
 */
export const getIPassBlock = (blockId: string): IPassBlock | undefined => {
  return ipassBlocks.find(block => block.id === blockId);
};

/**
 * Get clinical template by severity and category
 */
export const getClinicalTemplate = (
  severity: 'stable' | 'watcher' | 'unstable',
  category?: 'respiratory' | 'cardiac' | 'neurological' | 'general' | 'emergency'
): ClinicalTemplate[] => {
  return clinicalTemplates.filter(template => {
    const severityMatch = template.severity === severity;
    const categoryMatch = !category || template.category === category;
    return severityMatch && categoryMatch;
  });
};

/**
 * Get suggested template based on diagnosis
 */
export const getSuggestedTemplate = (diagnosis: string): ClinicalTemplate | undefined => {
  return clinicalTemplates.find(template =>
    template.commonDiagnoses.some(commonDx =>
      diagnosis.toLowerCase().includes(commonDx.toLowerCase())
    )
  );
};

/**
 * Get clinical protocol by category
 */
export const getClinicalProtocol = (category: string): ClinicalProtocol[] => {
  return clinicalProtocols.filter(protocol => protocol.category === category);
};

/**
 * Format I-PASS entry timestamp
 */
export const formatIPassTimestamp = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp);
};

/**
 * Generate quick action text with patient context
 */
export const generateContextualQuickAction = (
  action: QuickAction,
  patientName?: string,
  patientAge?: number
): QuickAction => {
  let contextualText = action.text;
  
  if (patientName && action.text.includes('Patient Summary:')) {
    contextualText = contextualText.replace(
      'Patient Summary:',
      `Patient Summary:\nName: ${patientName}\nAge: ${patientAge || '[AGE]'}`
    );
  }
  
  return {
    ...action,
    text: contextualText
  };
};

// ========================================
// CLINICAL SCORING SYSTEMS
// ========================================

export interface ClinicalScore {
  id: string;
  name: string;
  category: string;
  parameters: string[];
  interpretation: Record<string, string>;
}

export const clinicalScores: ClinicalScore[] = [
  {
    id: 'pews',
    name: 'Pediatric Early Warning Score (PEWS)',
    category: 'general',
    parameters: [
      'Heart Rate',
      'Respiratory Rate',
      'Systolic Blood Pressure',
      'Oxygen Saturation',
      'Level of Consciousness',
      'Temperature'
    ],
    interpretation: {
      '0-1': 'Low risk - routine monitoring',
      '2-3': 'Medium risk - increased monitoring',
      '4+': 'High risk - urgent medical review'
    }
  },
  {
    id: 'gcs',
    name: 'Glasgow Coma Scale (Pediatric)',
    category: 'neurological',
    parameters: [
      'Eye Opening',
      'Verbal Response',
      'Motor Response'
    ],
    interpretation: {
      '13-15': 'Mild impairment',
      '9-12': 'Moderate impairment',
      '3-8': 'Severe impairment'
    }
  }
];

/**
 * Get clinical scores by category
 */
export const getClinicalScores = (category: string): ClinicalScore[] => {
  return clinicalScores.filter(score => score.category === category);
};