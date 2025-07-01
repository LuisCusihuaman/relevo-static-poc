import { useState, useEffect } from 'react';
import { 
  Search, User, Settings, Bell, Plus, Filter, Menu, Command, 
  ChevronLeft, ChevronRight, Activity, Users, Calendar, FileText,
  Stethoscope, Clock, Home, X, AlertTriangle, Edit3, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import centralized composable types
import { type DesktopPatient, type ClinicalEntry } from '../../common/types';

interface SimpleDesktopLayoutProps {
  patients: DesktopPatient[];
  currentDoctor: string;
  unit: string;
  shift: string;
  onCommandPalette: () => void;
  onClinicalEntry: (patientId: number, type?: string) => void;
  onStartHandover?: () => void;
}

export function SimpleDesktopLayout({ 
  patients, 
  currentDoctor, 
  unit, 
  shift, 
  onCommandPalette,
  onClinicalEntry,
  onStartHandover
}: SimpleDesktopLayoutProps) {
  const [selectedPatient, setSelectedPatient] = useState<DesktopPatient | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('Priority');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock clinical entries for the selected patient - using proper ClinicalEntry type
  const mockClinicalEntries: ClinicalEntry[] = selectedPatient?.id === 1 ? [
    {
      id: '1',
      type: 'assessment',
      title: 'Morning Assessment - Day 3',
      content: 'Patient showing gradual improvement in respiratory status. Decreased work of breathing noted. FiO2 weaned from 60% to 45% overnight. Family remains anxious but engaged in care discussions.',
      author: {
        name: 'Dr. Sarah Chen',
        role: 'Attending Physician',
        specialty: 'Pediatric Critical Care'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPrivate: false,
      tags: ['respiratory', 'improvement', 'family']
    },
    {
      id: '2',
      type: 'plan',
      title: 'Treatment Plan Update', 
      content: 'Continue current antibiotic regimen. Plan for step-down to ward if stable trajectory continues for 24h. Consider respiratory therapy consultation for airway clearance.',
      author: {
        name: 'Dr. Michael Torres',
        role: 'Senior Resident',
        specialty: 'Pediatrics'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isPrivate: false,
      tags: ['antibiotics', 'step-down', 'respiratory therapy']
    },
    {
      id: '3',
      type: 'family_communication',
      title: 'Family Meeting Notes',
      content: 'Met with parents to discuss current status and plan. Explained improvement trajectory and discharge planning timeline. Parents expressed understanding and gratitude.',
      author: {
        name: 'Dr. Sarah Chen',
        role: 'Attending Physician',
        specialty: 'Pediatric Critical Care'
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isPrivate: false,
      tags: ['family meeting', 'discharge planning'],
      collaborators: ['Dr. Michael Torres', 'Social Work - Ms. Garcia']
    }
  ] : [];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchQuery === '' || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || patient.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-chart-1 bg-chart-1/5';
      case 'low': return 'border-l-chart-2 bg-chart-2/5';
      default: return 'border-l-border';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-chart-1 bg-chart-1/10';
      case 'in-progress': return 'text-primary bg-primary/10';
      case 'complete': return 'text-chart-2 bg-chart-2/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">R</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">RELEVO</h1>
                <p className="text-xs text-muted-foreground">Medical Handover Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{unit}</Badge>
              <Badge variant="outline">{shift} Shift</Badge>
              <span className="text-sm text-muted-foreground">
                {patients.length} Patients
              </span>
              <span className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div 
              className="relative cursor-pointer"
              onClick={onCommandPalette}
            >
              <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search patients, create documentation...</span>
                <div className="ml-auto flex items-center gap-1">
                  <Command className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartHandover}
              className="gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              Start Handover
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                2
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs">
                      {currentDoctor.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{currentDoctor}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCommandPalette}>
                  <Command className="w-4 h-4 mr-2" />
                  Command Palette
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-12' : 'w-80'} transition-all duration-200 bg-card border-r flex flex-col mt-16`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Patients</span>
                <Badge variant="secondary" className="text-xs">
                  {filteredPatients.length}
                </Badge>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {!sidebarCollapsed && (
            <div className="mt-3 space-y-2">
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8"
              />
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Priority">Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto p-2">
          {!sidebarCollapsed ? (
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`cursor-pointer transition-all border-l-4 hover:shadow-md ${getPriorityColor(patient.priority)} ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{patient.name}</h4>
                          <p className="text-xs text-muted-foreground">{patient.age}y • {patient.room}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {patient.status === 'pending' && patient.name === 'Maria Rodriguez' && (
                            <Badge variant="outline" className="text-xs">
                              <ChevronRight className="w-3 h-3 mr-1" />
                              Incoming
                            </Badge>
                          )}
                          {patient.alertCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {patient.alertCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-foreground line-clamp-2">{patient.diagnosis}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getStatusBadgeColor(patient.status)}`}>
                            {patient.status}
                          </Badge>
                          <span className="text-muted-foreground capitalize">{patient.priority}</span>
                        </div>
                        <span className="text-muted-foreground">{patient.lastUpdate}</span>
                      </div>

                      {patient.collaborators > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <FileText className="w-3 h-3 inline mr-1" />
                          {patient.collaborators} collaborators • Last: Dr. Sarah Chen
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-16">
        {selectedPatient ? (
          <div className="h-full flex flex-col">
            {/* Patient Header */}
            <div className="border-b bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-semibold">{selectedPatient.name}</h1>
                    <Badge variant="outline">{selectedPatient.age} years old</Badge>
                    <Badge 
                      variant={selectedPatient.priority === 'high' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {selectedPatient.priority} Priority
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">MRN:</span>
                      <p className="font-medium">{selectedPatient.mrn || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Admitted:</span>
                      <p className="font-medium">{selectedPatient.admissionDate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. Discharge:</span>
                      <p className="font-medium">2-3 days</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Room:</span>
                      <p className="font-medium">{selectedPatient.room}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Assessment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Progress Note
                  </Button>
                  <Button 
                    onClick={() => onClinicalEntry(selectedPatient.id)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Clinical Entry
                  </Button>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-1">{selectedPatient.diagnosis.split(' - ')[0]}</h3>
                {selectedPatient.diagnosis.includes(' - ') && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.diagnosis.split(' - ').slice(1).map((diagnosis, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{diagnosis}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="clinical" className="h-full flex flex-col">
                <div className="border-b px-6">
                  <TabsList>
                    <TabsTrigger value="clinical">Clinical Documentation</TabsTrigger>
                    <TabsTrigger value="team">Care Team</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts & Protocols</TabsTrigger>
                    <TabsTrigger value="family">Family & Discharge</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="clinical" className="p-6 space-y-4">
                    {mockClinicalEntries.length > 0 ? (
                      <div className="space-y-4">
                        {mockClinicalEntries.map((entry) => (
                          <Card key={entry.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                      {entry.author.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-sm">{entry.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{entry.author.name}</span>
                                      <span>•</span>
                                      <span>{entry.author.role}</span>
                                      <span>•</span>
                                      <span>{entry.timestamp.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {entry.collaborators && entry.collaborators.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      <Users className="w-3 h-3 mr-1" />
                                      {entry.collaborators.length} collaborators
                                    </Badge>
                                  )}
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-sm leading-relaxed mb-3">{entry.content}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {entry.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                {entry.author.name !== currentDoctor && (
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Add Response
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No Clinical Documentation Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start documenting this patient's clinical information
                        </p>
                        <Button onClick={() => onClinicalEntry(selectedPatient.id)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Entry
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="team" className="p-6">
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Care Team Information</h3>
                      <p className="text-muted-foreground">
                        View team members and contact information
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="alerts" className="p-6">
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Alerts & Protocols</h3>
                      <p className="text-muted-foreground">
                        Patient-specific alerts and care protocols
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="family" className="p-6">
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Family & Discharge</h3>
                      <p className="text-muted-foreground">
                        Family information and discharge planning
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Patient</h3>
              <p className="text-muted-foreground">
                Choose a patient from the list to view detailed information and clinical documentation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}