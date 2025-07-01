import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Users, Clock, Edit3, Activity, CheckCircle, AlertTriangle, MessageSquare, Eye, User } from 'lucide-react';
import { SimplePatientCard } from './SimplePatientCard';
import { CollaborativeHandover } from '../../handover/components/CollaborativeHandover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import consolidated data and utilities from patients store
import { 
  mockPatients, 
  mockDetailedAlerts, 
  mockCollaborators,
  getPatientStats,
  sortPatients 
} from '../../../store/patients.store';

interface PatientListViewProps {
  onPatientSelect?: (patientId: number) => void; // NEW: Optional patient selection handler
}

export function PatientListView({ onPatientSelect }: PatientListViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('severity');
  const [handoverPatient, setHandoverPatient] = useState<number | null>(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Simple filtering - just by search term, no status filters
  const filteredPatients = sortPatients(
    mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.includes(searchTerm)
    ),
    sortBy
  );

  // Use store function for stats
  const stats = getPatientStats();

  const handleOpenHandover = (patientId: number) => {
    setHandoverPatient(patientId);
  };

  // Show collaborative handover if patient selected
  if (handoverPatient) {
    const patient = mockPatients.find(p => p.id === handoverPatient);
    return (
      <div className="relative min-h-screen bg-background">
        <Button
          variant="outline"
          onClick={() => setHandoverPatient(null)}
          className="fixed top-4 right-4 z-50"
        >
          ← Back to Patient List
        </Button>
        <CollaborativeHandover 
          patientId={handoverPatient} 
          patientName={patient?.name || 'Unknown Patient'} 
        />
      </div>
    );
  }

  // Transform patients to include detailed alerts for SimplePatientCard compatibility
  const patientsWithDetailedAlerts = filteredPatients.map(patient => ({
    ...patient,
    alerts: mockDetailedAlerts[patient.id] || [],
    collaborators: mockCollaborators[patient.id] || []
  }));

  return (
    <div className="w-full min-h-0 flex flex-col bg-background">
      {/* ENHANCED: Header with Better Contrast */}
      <div className="flex-shrink-0 bg-background">
        <div className="p-4 lg:p-6">
          {/* Mobile: Clean Header */}
          {isMobile ? (
            <div className="bg-muted/20 border border-border/50 rounded-xl p-4 mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">Your Patients</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{stats.total} assigned to you</span>
                      <span>•</span>
                      <span>Morning Shift</span>
                      {/* NEW: Add tap hint for mobile users */}
                      {onPatientSelect && (
                        <>
                          <span>•</span>
                          <span className="text-primary">Tap to view details</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm bg-primary/10 text-primary border-primary/30">
                    PICU Unit
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop: Enhanced Header */
            <Card className="bg-background border border-border/50 rounded-xl">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 lg:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">Your Patients</h1>
                      <Badge variant="outline" className="text-sm self-start sm:self-auto bg-primary/10 text-primary border-primary/30">
                        PICU Unit
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      Patients assigned to you for this shift
                      {/* NEW: Desktop hint for clickable cards */}
                      {onPatientSelect && (
                        <span className="text-primary"> • Click cards to view detailed information</span>
                      )}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>January 23, 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Morning Shift (08:00-16:00)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        <span>{stats.totalNotes} documentation entries</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ENHANCED: Medical Priority Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/30">
                    <div className="text-2xl font-semibold text-foreground">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Your Patients</div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-3 text-center border-2 border-red-200">
                    <div className="text-2xl font-semibold text-red-700 flex items-center justify-center gap-1">
                      <AlertTriangle className="w-5 h-5" />
                      {stats.unstable}
                    </div>
                    <div className="text-sm text-red-600 font-medium">Unstable</div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-3 text-center border-2 border-yellow-200">
                    <div className="text-2xl font-semibold text-yellow-700 flex items-center justify-center gap-1">
                      <Eye className="w-5 h-5" />
                      {stats.watcher}
                    </div>
                    <div className="text-sm text-yellow-600 font-medium">Watcher</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3 text-center border-2 border-green-200">
                    <div className="text-2xl font-semibold text-green-700 flex items-center justify-center gap-1">
                      <CheckCircle className="w-5 h-5" />
                      {stats.stable}
                    </div>
                    <div className="text-sm text-green-600 font-medium">Stable</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* Mobile: Enhanced Medical Priority Summary */}
        {isMobile && (
          <div className="px-4 mb-4">
            <div className="bg-muted/20 border border-border/50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="space-y-1">
                  <div className="text-red-700 font-semibold flex items-center justify-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {stats.unstable}
                  </div>
                  <div className="text-xs text-red-600 font-medium">Unstable</div>
                </div>
                <div className="space-y-1">
                  <div className="text-yellow-700 font-semibold flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" />
                    {stats.watcher}
                  </div>
                  <div className="text-xs text-yellow-600 font-medium">Watcher</div>
                </div>
                <div className="space-y-1">
                  <div className="text-green-700 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {stats.stable}
                  </div>
                  <div className="text-xs text-green-600 font-medium">Stable</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENHANCED: Search and Sort */}
        <div className="px-4 lg:px-6 mb-4 bg-background">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search your patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border-border/50 focus:border-primary/50 bg-background"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-56 border-border/50 bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="severity">Medical Priority</SelectItem>
                <SelectItem value="alerts">Critical Alerts</SelectItem>
                <SelectItem value="name">Patient Name</SelectItem>
                <SelectItem value="collaboration">Recent Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* CLEANED: Patient List - Simple spacing-based separation */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 lg:px-6 py-4 space-y-4">
            {isMobile ? (
              // Mobile: Single column
              <div className="space-y-4">
                {patientsWithDetailedAlerts.map((patient) => (
                  <SimplePatientCard 
                    key={patient.id} 
                    patient={patient}
                    onOpenHandover={handleOpenHandover}
                    onPatientSelect={onPatientSelect} // NEW: Pass patient selection handler
                  />
                ))}
              </div>
            ) : (
              // Desktop: Grid layout
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {patientsWithDetailedAlerts.map((patient) => (
                  <SimplePatientCard 
                    key={patient.id} 
                    patient={patient}
                    onOpenHandover={handleOpenHandover}
                    onPatientSelect={onPatientSelect} // NEW: Pass patient selection handler
                  />
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {filteredPatients.length === 0 && (
              <div className="bg-muted/20 border border-border/50 rounded-xl p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">No patients found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No patients match your search'}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')} className="border-border/50">
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}