import { useState, useEffect, useCallback } from 'react';
import { Search, Users, FileText, Stethoscope, Activity, Heart, ArrowRight, Building, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Import composable Patient type and configuration
import { type Patient } from '../../common/types';
import { unitsConfig, getUnitName } from '../../store/config.store';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onPatientSelect: (patientId: number) => void;
  onQuickNote: (patientId: number, type?: string) => void;
  onNavigate: (section: string) => void;
  currentUnit?: string; // Current user's unit
}

// EXPANDED: Hospital-wide patient database (in real app, this would come from API)
const hospitalPatients: Patient[] = [
  // PICU Patients (some assigned to user, some not)
  {
    id: 1, name: 'Maria Rodriguez', age: 8, mrn: 'A211370', room: 'PICU-01',
    unit: 'picu', assignedTo: 'current-user',
    illnessSeverity: 'watcher', diagnosis: 'Acute Respiratory Failure', 
    status: 'active', lastUpdate: '2h ago', collaborators: 3, alerts: [], 
    admissionDate: '2025-01-20', priority: 'high', ipassEntries: []
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

  // NICU Patients
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

  // General Pediatrics
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

  // Cardiology Unit
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

  // Surgery Unit
  {
    id: 15, name: 'Olivia Martinez', age: 9, mrn: 'S778899', room: 'Surg-302',
    unit: 'surgery', assignedTo: 'dr.taylor',
    illnessSeverity: 'stable', diagnosis: 'Post-orthopedic surgery, fracture repair', 
    status: 'active', lastUpdate: '6h ago', collaborators: 2, alerts: [], 
    admissionDate: '2025-01-22', priority: 'low', ipassEntries: []
  }
];

export function CommandPalette({
  isOpen,
  onClose,
  patients,
  onPatientSelect,
  onQuickNote,
  onNavigate,
  currentUnit = 'picu'
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  // FIXED: Default to the user's actual unit, not 'current'
  const [selectedUnit, setSelectedUnit] = useState<string>(currentUnit);

  // Reset query and properly set unit when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedUnit(currentUnit); // FIXED: Always default to user's current unit
    }
  }, [isOpen, currentUnit]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'unstable': return 'bg-red-100 border-red-300 text-red-700';
      case 'watcher': return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'stable': return 'bg-green-100 border-green-300 text-green-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getPatientIcon = (diagnosis: string) => {
    if (diagnosis?.toLowerCase().includes('cardiac') || diagnosis?.toLowerCase().includes('heart')) return Heart;
    if (diagnosis?.toLowerCase().includes('respiratory') || diagnosis?.toLowerCase().includes('lung')) return Activity;
    return Stethoscope;
  };

  const getPatientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // ENHANCED: Filter patients based on unit selection and search
  const getFilteredPatients = () => {
    let patientsToSearch: Patient[] = [];

    if (selectedUnit === 'all') {
      // Show all patients across all units
      patientsToSearch = hospitalPatients;
    } else {
      // Show patients from the selected unit (including current unit)
      patientsToSearch = hospitalPatients.filter(p => p.unit === selectedUnit);
    }

    // Apply search filter
    if (query) {
      patientsToSearch = patientsToSearch.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.room.toLowerCase().includes(query.toLowerCase()) ||
        patient.diagnosis?.toLowerCase().includes(query.toLowerCase()) ||
        patient.mrn?.toLowerCase().includes(query.toLowerCase())
      );
    }

    return patientsToSearch.slice(0, query ? 15 : 10); // Show more results when actively searching
  };

  const filteredPatients = getFilteredPatients();

  // Group patients by unit when showing all
  const groupedPatients = selectedUnit === 'all' ? 
    filteredPatients.reduce((groups, patient) => {
      const unit = patient.unit || 'unknown';
      if (!groups[unit]) groups[unit] = [];
      groups[unit].push(patient);
      return groups;
    }, {} as Record<string, Patient[]>) : 
    { [selectedUnit]: filteredPatients };

  const handlePatientSelect = (patientId: number) => {
    onPatientSelect(patientId);
    onClose();
  };

  const handleQuickNote = (patientId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    onQuickNote(patientId);
    onClose();
  };

  // FIXED: Get unit description for header
  const getUnitDescription = () => {
    if (selectedUnit === 'all') {
      return 'All hospital units';
    } else if (selectedUnit === currentUnit) {
      return `${getUnitName(selectedUnit)} • Your unit`;
    } else {
      return getUnitName(selectedUnit);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Hospital Patient Search</DialogTitle>
            <DialogDescription>
              Search for patients across hospital units. Change units to search patients not assigned to you.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <Command className="rounded-lg border-0 shadow-none">
          {/* ENHANCED: Header with Unit Selector */}
          <div className="px-6 py-4 border-b border-border/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <CommandInput 
                  placeholder="Search by name, room, diagnosis, or MRN..."
                  className="command-input-clean border-0 focus:ring-0 text-base h-auto py-2 px-0 bg-transparent w-full"
                  value={query}
                  onValueChange={setQuery}
                />
              </div>
            </div>
            
            {/* FIXED: Unit Selector with Proper Default Value */}
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="w-56 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* FIXED: Show user's current unit first with clear labeling */}
                  <SelectItem value={currentUnit}>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{getUnitName(currentUnit)} • Your Unit</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>All Hospital Units</span>
                    </div>
                  </SelectItem>
                  
                  {/* Other units (excluding current unit to avoid duplication) */}
                  {unitsConfig.filter(unit => unit.id !== currentUnit).map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{unit.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* FIXED: Better status display */}
              <span className="text-xs text-muted-foreground">
                {filteredPatients.length} patients • {getUnitDescription()}
              </span>
            </div>
          </div>
          
          <CommandList className="max-h-[60vh] overflow-y-auto">
            <CommandEmpty>
              <div className="py-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground mb-1">No patients found</p>
                <p className="text-sm text-muted-foreground">
                  {query ? 'Try adjusting your search criteria' : 'No patients in the selected unit'}
                </p>
              </div>
            </CommandEmpty>
            
            {/* ENHANCED: Patient Groups by Unit */}
            {Object.entries(groupedPatients).map(([unitId, unitPatients]) => {
              if (unitPatients.length === 0) return null;
              
              const unitName = getUnitName(unitId);
              const showUnitHeaders = selectedUnit === 'all' && Object.keys(groupedPatients).length > 1;
              
              return (
                <CommandGroup 
                  key={unitId}
                  heading={showUnitHeaders ? `${unitName} (${unitPatients.length})` : undefined}
                >
                  {unitPatients.map((patient) => {
                    const PatientIcon = getPatientIcon(patient.diagnosis || '');
                    const isAssignedToUser = patient.assignedTo === 'current-user';
                    
                    return (
                      <CommandItem
                        key={`patient-${patient.id}`}
                        onSelect={() => handlePatientSelect(patient.id)}
                        className="p-3 flex items-center gap-3 cursor-pointer"
                      >
                        {/* Patient Avatar with Severity */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(patient.illnessSeverity)}`}>
                          <span className="text-sm font-medium">
                            {getPatientInitials(patient.name)}
                          </span>
                        </div>
                        
                        {/* Patient Information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{patient.name}</span>
                            <Badge variant="outline" className={`text-xs ${getSeverityColor(patient.illnessSeverity)}`}>
                              {patient.illnessSeverity}
                            </Badge>
                            {isAssignedToUser && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                Assigned
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {patient.room} • {patient.diagnosis}
                          </div>
                          {selectedUnit === 'all' && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {unitName}
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleQuickNote(patient.id, e)}
                            className="h-8 px-2 text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            I-PASS
                          </Button>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>

          {/* ENHANCED: Footer with Context */}
          <div className="px-4 py-3 border-t border-border/20 bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted/50 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted/50 rounded">Enter</kbd>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                <span>
                  {selectedUnit === 'all' ? 'All hospital units' : 
                   selectedUnit === currentUnit ? `Your unit (${getUnitName(selectedUnit)})` : 
                   `${getUnitName(selectedUnit)} patients`}
                </span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Hook for command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const openCommandPalette = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    setIsOpen,
    openCommandPalette,
    closeCommandPalette
  };
}