import { useState, useEffect } from 'react';
import { PatientListView } from './features/patient-management';
import { ProfileView } from './features/profile';
import { HandoverSession } from './features/handover';
import { DailySetup } from './features/daily-setup';
import { ContextAwareDashboard } from './features/dashboard';
import { FigmaDesktopLayout } from './components/layout/FigmaDesktopLayout';
import { CommandPalette, useCommandPalette } from './components/CommandPalette';
import { ClinicalDocumentation } from './features/clinical-documentation';
import { PatientDetailView } from './features/patient-management';
import { AppSidebar } from './components/layout/app-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { ChevronRight, ChevronLeft, Menu } from 'lucide-react';

// Import consolidated data from patients store using new composable types
import { patients, getDesktopPatients, getClinicalPatients } from './store/patients.store';
import { units, shifts, type DailySetupData, type Patient } from './common/mockData';

// Import hospital patients from CommandPalette for detail view
const hospitalPatients = [
  // PICU Patients (some assigned to user, some not)
  {
    id: 1, name: 'Maria Rodriguez', age: 8, mrn: 'A211370', room: 'PICU-01',
    unit: 'picu', assignedTo: 'current-user',
    illnessSeverity: 'watcher', diagnosis: 'Acute Respiratory Failure - Community-acquired pneumonia, Asthma exacerbation', 
    status: 'active', lastUpdate: '2h ago', collaborators: 3, alerts: [], 
    admissionDate: '2025-01-20', priority: 'high', ipassEntries: []
  },
  {
    id: 2, name: 'Ana Silva', age: 15, mrn: 'C445566', room: 'PICU-05',
    unit: 'picu', assignedTo: 'current-user',
    illnessSeverity: 'unstable', diagnosis: 'Diabetic Ketoacidosis - Type 1 diabetes mellitus, Severe dehydration', 
    status: 'active', lastUpdate: '30m ago', collaborators: 4, alerts: [], 
    admissionDate: '2025-01-23', priority: 'critical', ipassEntries: []
  },
  {
    id: 3, name: 'David Kim', age: 10, mrn: 'P556677', room: 'PICU-08',
    unit: 'picu', assignedTo: 'current-user',
    illnessSeverity: 'watcher', diagnosis: 'Post-operative monitoring - Cardiac surgery recovery', 
    status: 'active', lastUpdate: '45m ago', collaborators: 2, alerts: [], 
    admissionDate: '2025-01-22', priority: 'medium', ipassEntries: []
  },
  {
    id: 7, name: 'Carlos Mendoza', age: 5, mrn: 'P778899', room: 'PICU-12',
    unit: 'picu', assignedTo: 'dr.martinez',
    illnessSeverity: 'unstable', diagnosis: 'Severe sepsis, multi-organ dysfunction', 
    status: 'active', lastUpdate: '15m ago', collaborators: 5, alerts: [], 
    admissionDate: '2025-01-23', priority: 'critical', ipassEntries: []
  },
  {
    id: 8, name: 'Isabella Santos', age: 12, mrn: 'P889900', room: 'PICU-14',
    unit: 'picu', assignedTo: 'dr.chen',
    illnessSeverity: 'stable', diagnosis: 'Post-operative monitoring - Neurosurgery', 
    status: 'active', lastUpdate: '1h ago', collaborators: 2, alerts: [], 
    admissionDate: '2025-01-22', priority: 'medium', ipassEntries: []
  },
  {
    id: 9, name: 'Baby Thompson', age: 0, mrn: 'N112233', room: 'NICU-A03',
    unit: 'nicu', assignedTo: 'dr.patel',
    illnessSeverity: 'watcher', diagnosis: 'Premature birth, respiratory distress syndrome', 
    status: 'active', lastUpdate: '30m ago', collaborators: 3, alerts: [], 
    admissionDate: '2025-01-20', priority: 'high', ipassEntries: []
  },
  {
    id: 10, name: 'Baby García', age: 0, mrn: 'N223344', room: 'NICU-B01',
    unit: 'nicu', assignedTo: 'dr.wilson',
    illnessSeverity: 'unstable', diagnosis: 'Congenital heart defect, cardiac surgery recovery', 
    status: 'active', lastUpdate: '10m ago', collaborators: 4, alerts: [], 
    admissionDate: '2025-01-21', priority: 'critical', ipassEntries: []
  },
  {
    id: 11, name: 'Emma Watson', age: 7, mrn: 'G334455', room: 'Gen-201',
    unit: 'general', assignedTo: 'dr.rodriguez',
    illnessSeverity: 'stable', diagnosis: 'Pneumonia, responding to treatment', 
    status: 'active', lastUpdate: '2h ago', collaborators: 1, alerts: [], 
    admissionDate: '2025-01-22', priority: 'low', ipassEntries: []
  },
  {
    id: 12, name: 'Alex Johnson', age: 14, mrn: 'G445566', room: 'Gen-205',
    unit: 'general', assignedTo: 'dr.lopez',
    illnessSeverity: 'stable', diagnosis: 'Appendectomy recovery, pain management', 
    status: 'active', lastUpdate: '4h ago', collaborators: 1, alerts: [], 
    admissionDate: '2025-01-21', priority: 'low', ipassEntries: []
  },
  {
    id: 13, name: 'Sophie Chen', age: 10, mrn: 'C556677', room: 'Card-101',
    unit: 'cardiology', assignedTo: 'dr.kim',
    illnessSeverity: 'watcher', diagnosis: 'Arrhythmia monitoring, cardiac catheterization prep', 
    status: 'active', lastUpdate: '1h ago', collaborators: 2, alerts: [], 
    admissionDate: '2025-01-23', priority: 'medium', ipassEntries: []
  },
  {
    id: 14, name: 'Michael Zhang', age: 16, mrn: 'C667788', room: 'Card-103',
    unit: 'cardiology', assignedTo: 'dr.singh',
    illnessSeverity: 'stable', diagnosis: 'Post-cardiac surgery, valve replacement recovery', 
    status: 'active', lastUpdate: '3h ago', collaborators: 3, alerts: [], 
    admissionDate: '2025-01-19', priority: 'medium', ipassEntries: []
  },
  {
    id: 15, name: 'Olivia Martinez', age: 9, mrn: 'S778899', room: 'Surg-302',
    unit: 'surgery', assignedTo: 'dr.taylor',
    illnessSeverity: 'stable', diagnosis: 'Post-orthopedic surgery, fracture repair', 
    status: 'active', lastUpdate: '6h ago', collaborators: 2, alerts: [], 
    admissionDate: '2025-01-22', priority: 'low', ipassEntries: []
  }
];

export type TabType = 'schedule' | 'patients' | 'profile';

// Enhanced Sidebar Trigger Component - Clean, No Tooltip
function EnhancedSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, open, isMobile } = useSidebar();
  
  const getIcon = () => {
    if (isMobile) {
      return <Menu className="w-4 h-4" />;
    }
    return open ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />;
  };
  
  const getAriaLabel = () => {
    if (isMobile) {
      return "Toggle navigation menu";
    }
    return open ? "Collapse sidebar" : "Expand sidebar";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={`
        relative h-8 w-8 
        bg-background hover:bg-primary/5 
        border border-border/40 hover:border-primary/30
        text-muted-foreground hover:text-primary
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        enhanced-sidebar-trigger
        ${className}
      `}
      aria-label={getAriaLabel()}
      title={getAriaLabel()} // Simple browser tooltip for those who need it
    >
      <div className="transition-transform duration-200 ease-in-out">
        {getIcon()}
      </div>
      
      {/* Subtle indicator dot for mobile */}
      {isMobile && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-60 mobile-indicator" />
      )}
    </Button>
  );
}

export default function App() {
  // ========================================
  // APPLICATION STATE - PURE REACT
  // ========================================
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [isMobile, setIsMobile] = useState(false);
  
  // Setup & Configuration
  const [setupComplete, setSetupComplete] = useState(false);
  const [dailySetup, setDailySetup] = useState<DailySetupData | null>(null);
  const [showSetupChange, setShowSetupChange] = useState(false);
  
  // Modal States
  const [clinicalDocOpen, setClinicalDocOpen] = useState(false);
  
  // Navigation States
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<number | null>(null);
  const [showHandoverView, setShowHandoverView] = useState(false);
  
  // Selected Items
  const [selectedPatientForDoc, setSelectedPatientForDoc] = useState<number | null>(null);
  const [selectedPatientForHandover, setSelectedPatientForHandover] = useState<number | null>(null);
  const [lastDocumentedPatient, setLastDocumentedPatient] = useState<number | null>(null);
  const [defaultDocType, setDefaultDocType] = useState('action_list');

  // Command Palette
  const { isOpen: commandPaletteOpen, setIsOpen: setCommandPaletteOpen, openCommandPalette } = useCommandPalette();

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleSetupComplete = (setup: DailySetupData) => {
    setDailySetup(setup);
    setSetupComplete(true);
    setShowSetupChange(false);
  };

  const handleChangeSetup = () => {
    setShowSetupChange(true);
  };

  const handleStartHandover = (patientId?: number) => {
    setSelectedPatientForHandover(patientId || null);
    setShowHandoverView(true);
    setSelectedPatientDetail(null);
  };

  const handlePatientHandover = (patientId: number) => {
    setSelectedPatientForHandover(patientId);
    setShowHandoverView(true);
  };

  const handleCloseHandover = () => {
    setShowHandoverView(false);
    setSelectedPatientForHandover(null);
  };

  const handlePatientSelect = (patientId: number) => {
    setCommandPaletteOpen(false);
    setSelectedPatientDetail(patientId);
  };

  const handlePatientDetailBack = () => {
    setSelectedPatientDetail(null);
  };

  const handleClinicalEntry = (patientId: number, type: string = 'action_list') => {
    setSelectedPatientForDoc(patientId);
    setDefaultDocType(type);
    setLastDocumentedPatient(patientId);
    setClinicalDocOpen(true);
    setSelectedPatientDetail(null);
  };

  const handleFastClinicalEntry = () => {
    const defaultPatient = lastDocumentedPatient || 
                          patients.find(p => p.illnessSeverity === 'watcher')?.id ||
                          patients.find(p => p.status === 'in-progress')?.id ||
                          patients[0]?.id;
    
    if (defaultPatient) {
      handleClinicalEntry(defaultPatient, 'action_list');
    }
  };

  const handleNavigate = (section: string) => {
    if (section === 'search') {
      openCommandPalette();
    } else if (section === 'profile') {
      setActiveTab('profile');
    } else if (section === 'documentation') {
      handleFastClinicalEntry();
    } else {
      setActiveTab(section as TabType);
    }
  };

  // Show handover view if active
  if (showHandoverView) {
    return (
      <div className="min-h-screen relative">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-50">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCloseHandover}
            className="bg-white/90 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to {activeTab === 'schedule' ? 'Schedule' : 'Patients'}
          </Button>
        </div>
        <HandoverSession />
      </div>
    );
  }

  // Show daily setup if not completed
  if (!setupComplete) {
    return <DailySetup onSetupComplete={handleSetupComplete} />;
  }

  // Show patient detail view if selected
  if (selectedPatientDetail) {
    const detailPatient = hospitalPatients.find(p => p.id === selectedPatientDetail);
    if (detailPatient) {
      return (
        <PatientDetailView
          patient={detailPatient as Patient}
          onBack={handlePatientDetailBack}
          onStartHandover={handleStartHandover}
          onOpenDocumentation={handleClinicalEntry}
        />
      );
    }
  }

  const getUnitName = (unitId: string) => {
    return units[unitId as keyof typeof units] || unitId.toUpperCase();
  };

  const getShiftName = (shiftId: string) => {
    return shifts[shiftId as keyof typeof shifts] || shiftId;
  };

  // ========================================
  // RENDER FUNCTIONS
  // ========================================

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ContextAwareDashboard />;
      case 'patients':
        // Use different layouts based on screen size
        return isMobile ? (
          <PatientListView 
            onPatientSelect={handlePatientSelect}
          />
        ) : (
          <FigmaDesktopLayout
            patients={getDesktopPatients()}
            currentDoctor={dailySetup?.doctorName || 'Dr. Unknown'}
            unit={getUnitName(dailySetup?.unit || '')}
            shift={getShiftName(dailySetup?.shift || '')}
            onCommandPalette={openCommandPalette}
            onStartHandover={handleStartHandover}
            onPatientHandover={handlePatientHandover}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            doctorName={dailySetup?.doctorName || 'Eduardo'}
            unit={getUnitName(dailySetup?.unit || '')}
            shift={getShiftName(dailySetup?.shift || '')}
            isMobile={isMobile}
          />
        );
      default:
        return <ContextAwareDashboard />;
    }
  };

  // ========================================
  // CLEAN HEADER - NO DUPLICATION
  // ========================================
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <SidebarInset>
        {/* Simplified Header - Only Essential Navigation */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          {/* Left Side - Simple Tab Indicator */}
          <div className="flex items-center gap-2 px-4">
            <span className="font-medium text-sm">
              {activeTab === 'schedule' && 'Schedule'}
              {activeTab === 'patients' && 'Patients'}
              {activeTab === 'profile' && 'Profile & Settings'}
            </span>
          </div>
          
          {/* Right Side - Just Sidebar Trigger */}
          <div className="ml-auto flex items-center gap-2 px-4">
            <EnhancedSidebarTrigger className="-mr-1" />
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-4 pt-0">
            {renderContent()}
          </div>
        </div>
      </SidebarInset>
      
      <AppSidebar 
        currentDoctor={dailySetup?.doctorName || 'Dr. Eduardo Martinez'}
        unit={getUnitName(dailySetup?.unit || '')}
        shift={getShiftName(dailySetup?.shift || '')}
        onNavigate={handleNavigate}
        onOpenCommandPalette={openCommandPalette}
        activeTab={activeTab}
        patientCount={patients.length}
        collapsible={isMobile ? "icon" : "icon"} // Force icon mode on mobile, allow icon mode on desktop
        side="right"
      />

      {/* Modals and Overlays */}
      <Dialog open={showSetupChange} onOpenChange={setShowSetupChange}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[85vh] p-0 bg-background border border-border/40" aria-describedby="setup-change-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Change Setup</DialogTitle>
            <DialogDescription id="setup-change-description">
              Update your shift details and patient assignments for today's handover sessions.
            </DialogDescription>
          </DialogHeader>
          <DailySetup 
            onSetupComplete={handleSetupComplete}
            existingSetup={dailySetup}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        patients={patients}
        onPatientSelect={handlePatientSelect}
        onQuickNote={handleClinicalEntry}
        onNavigate={handleNavigate}
        currentUnit={dailySetup?.unit || 'picu'}
      />

      <ClinicalDocumentation
        isOpen={clinicalDocOpen}
        onClose={() => {
          setClinicalDocOpen(false);
          setSelectedPatientForDoc(null);
        }}
        patients={getClinicalPatients()}
        doctorName={dailySetup?.doctorName || 'Dr. Unknown'}
        selectedPatientId={selectedPatientForDoc || undefined}
        defaultType={defaultDocType}
      />
    </SidebarProvider>
  );
}