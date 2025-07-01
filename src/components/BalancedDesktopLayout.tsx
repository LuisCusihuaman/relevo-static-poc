// COMPONENT DELETED - UNUSED IN APPLICATION
// This file has been cleaned up as part of the component consolidation
// FigmaDesktopLayout.tsx is used instead for desktop patient management

export function BalancedDesktopLayout() {
  return null;
}

// Import centralized composable types
import { type DesktopPatient } from '../data/types';

interface BalancedDesktopLayoutProps {
  patients: DesktopPatient[];
  currentDoctor: string;
  unit: string;
  shift: string;
  onCommandPalette: () => void;
  onClinicalEntry: (patientId: number, type?: string) => void;
  onStartHandover?: (patientId?: number) => void;
  onPatientHandover?: (patientId: number) => void;
}

export function BalancedDesktopLayout({ 
  patients, 
  currentDoctor, 
  unit, 
  shift, 
  onCommandPalette,
  onClinicalEntry,
  onStartHandover,
  onPatientHandover
}: BalancedDesktopLayoutProps) {
  const [selectedPatient, setSelectedPatient] = useState<DesktopPatient | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchQuery === '' || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || patient.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
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

  const getVitalsBadgeColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-chart-2 bg-chart-2/10';
      case 'concerning': return 'text-chart-1 bg-chart-1/10';
      case 'critical': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handlePatientClick = (patient: DesktopPatient) => {
    setSelectedPatient(patient);
    setExpandedCard(null);
  };

  const handlePatientHandover = (patient: DesktopPatient, e: React.MouseEvent) => {
    e.stopPropagation();
    onPatientHandover?.(patient.id);
  };

  const toggleCardExpansion = (patientId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === patientId ? null : patientId);
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
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg">
              <span className="text-xs text-muted-foreground">Compact</span>
              <Switch 
                checked={!compactMode} 
                onCheckedChange={() => setCompactMode(!compactMode)}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">Detailed</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartHandover?.()}
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
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-96'} transition-all duration-200 bg-card border-r flex flex-col mt-16 relative`}>
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
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {!sidebarCollapsed && (
            <div className="mt-3 space-y-3">
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
                    <SelectItem value="all">All Status</SelectItem>
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
                    <SelectItem value="all">All Priority</SelectItem>
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
                  className={`cursor-pointer transition-all border-l-4 hover:shadow-md ${getPriorityColor(patient.priority || 'medium')} ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => handlePatientClick(patient)}
                >
                  <CardContent className={`${compactMode ? 'p-2' : 'p-3'}`}>
                    {compactMode ? (
                      /* Compact Mode */
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{patient.name}</h4>
                          <div className="flex items-center gap-1">
                            {patient.alertCount > 0 && (
                              <Badge variant="destructive" className="text-xs px-1">
                                {patient.alertCount}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => toggleCardExpansion(patient.id, e)}
                            >
                              {expandedCard === patient.id ? 
                                <ChevronUp className="w-3 h-3" /> : 
                                <ChevronDown className="w-3 h-3" />
                              }
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{patient.room}</span>
                          <Badge className={`text-xs ${getStatusBadgeColor(patient.status)}`}>
                            {patient.status}
                          </Badge>
                        </div>

                        {expandedCard === patient.id && (
                          <div className="mt-2 space-y-2 pt-2 border-t">
                            <p className="text-xs text-foreground line-clamp-2">{patient.diagnosis}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={`text-xs capitalize ${getPriorityColor(patient.priority || 'medium').split(' ')[1]}`}>
                                {patient.priority}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs px-2"
                                onClick={(e) => handlePatientHandover(patient, e)}
                              >
                                Handover
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Detailed Mode */
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{patient.name}</h4>
                            <p className="text-xs text-muted-foreground">{patient.age}y • {patient.room}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            {patient.status === 'pending' && patient.name === 'Maria Rodriguez' && (
                              <Badge variant="outline" className="text-xs">
                                <ArrowRight className="w-3 h-3 mr-1" />
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

                        {patient.vitals && (
                          <div className="flex items-center justify-between text-xs">
                            <Badge className={`text-xs ${getVitalsBadgeColor(patient.vitals.status)}`}>
                              Vitals: {patient.vitals.status}
                            </Badge>
                            <span className="text-muted-foreground">{patient.vitals.lastUpdate}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1">
                            {patient.collaborators > 1 && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {patient.collaborators}
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={(e) => handlePatientHandover(patient, e)}
                          >
                            <Stethoscope className="w-3 h-3 mr-1" />
                            Handover
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Collapsed Sidebar */
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientClick(patient)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-colors relative ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {patient.name.split(' ').map(n => n[0]).join('')}
                  {patient.alertCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{patient.alertCount}</span>
                    </div>
                  )}
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
                    {selectedPatient.vitals && (
                      <Badge className={getVitalsBadgeColor(selectedPatient.vitals.status)}>
                        {selectedPatient.vitals.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">MRN:</span>
                      <p className="font-medium">{selectedPatient.mrn || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Room:</span>
                      <p className="font-medium">{selectedPatient.room}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Update:</span>
                      <p className="font-medium">{selectedPatient.lastUpdate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team:</span>
                      <p className="font-medium">{selectedPatient.team?.attending || 'Dr. Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onClinicalEntry(selectedPatient.id, 'patient_summary')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    I-PASS Entry
                  </Button>
                  <Button 
                    onClick={() => onPatientHandover?.(selectedPatient.id)}
                    size="sm"
                    className="gap-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Start Handover
                  </Button>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-1">{selectedPatient.diagnosis.split(' - ')[0]}</h3>
                {selectedPatient.diagnosis.includes(' - ') && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.diagnosis.split(' - ')[1]}
                  </p>
                )}
              </div>
            </div>

            {/* Patient Content - Simplified for handover preparation */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="grid grid-cols-3 gap-6 h-full">
                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Quick Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusBadgeColor(selectedPatient.status)}>
                        {selectedPatient.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="capitalize">{selectedPatient.priority}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Alerts:</span>
                      <span className={selectedPatient.alertCount > 0 ? 'text-destructive' : 'text-muted-foreground'}>
                        {selectedPatient.alertCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Collaborators:</span>
                      <span>{selectedPatient.collaborators}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Last documentation</p>
                      <p className="text-muted-foreground">{selectedPatient.lastUpdate} by {selectedPatient.team?.resident || 'Dr. Torres'}</p>
                    </div>
                    {selectedPatient.vitals && (
                      <div className="text-sm">
                        <p className="font-medium">Vitals check</p>
                        <p className="text-muted-foreground">{selectedPatient.vitals.lastUpdate} - {selectedPatient.vitals.status}</p>
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-medium">Team rounds</p>
                      <p className="text-muted-foreground">This morning with {selectedPatient.team?.attending || 'Dr. Chen'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Handover Prep
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => onClinicalEntry(selectedPatient.id, 'illness_severity')}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Illness Severity
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => onClinicalEntry(selectedPatient.id, 'patient_summary')}
                    >
                      <User className="w-4 h-4" />
                      Patient Summary
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => onClinicalEntry(selectedPatient.id, 'action_list')}
                    >
                      <FileText className="w-4 h-4" />
                      Action List
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => onClinicalEntry(selectedPatient.id, 'situation_awareness')}
                    >
                      <Eye className="w-4 h-4" />
                      Situation Awareness
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Patient</h3>
              <p className="text-muted-foreground">
                Choose a patient from the list to view detailed information and prepare for handover
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}