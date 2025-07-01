import { useState } from 'react';
import { User, Settings, Bell, Shield, KeyRound, ChevronRight, Building2, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface ProfileViewProps {
  doctorName: string;
  unit: string;
  shift: string;
  onBack?: () => void; // Keep for API compatibility but don't use
  isMobile?: boolean;
}

type ProfileSection = 'profile' | 'settings' | 'notifications' | 'security' | 'account';

export function ProfileView({ doctorName, unit, shift, isMobile = false }: ProfileViewProps) {
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');
  const [displayName, setDisplayName] = useState(doctorName);
  const [bio, setBio] = useState('');

  // Get doctor initials for avatar
  const getDoctorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const sidebarItems = [
    {
      id: 'profile' as ProfileSection,
      label: 'My Profile',
      icon: User,
      description: 'Personal information and preferences'
    },
    {
      id: 'settings' as ProfileSection,
      label: 'Application Settings',
      icon: Settings,
      description: 'App preferences and configuration'
    },
    {
      id: 'notifications' as ProfileSection,
      label: 'Notifications & Alerts',
      icon: Bell,
      description: 'Alert preferences and notification settings'
    },
    {
      id: 'security' as ProfileSection,
      label: 'Security & Privacy',
      icon: Shield,
      description: 'Account security and privacy settings'
    },
    {
      id: 'account' as ProfileSection,
      label: 'Account Settings',
      icon: KeyRound,
      description: 'Account management and preferences'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-primary">
                    {getDoctorInitials(doctorName)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">{doctorName}</h2>
                <p className="text-muted-foreground">Senior Practitioner</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge variant="outline" className="bg-primary/5 border-primary/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    {unit}
                  </Badge>
                  <Badge variant="outline" className="bg-muted/30 border-border/50">
                    <Clock className="w-3 h-3 mr-1" />
                    {shift}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active • On Duty
                  </Badge>
                </div>
              </div>
            </div>

            {/* Hospital Information - Read Only */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-sm">Hospital Information</CardTitle>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Provided by Hospital System
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Specialty</Label>
                    <div className="medical-input-readonly">
                      Pediatric Critical Care
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Experience</Label>
                    <div className="medical-input-readonly">
                      5 years
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <div className="medical-input-readonly">
                      Pediatric Intensive Care Unit (PICU)
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Employee ID</Label>
                    <div className="medical-input-readonly">
                      HG-2024-1157
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Preferences */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Personal Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input 
                    id="display-name" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="medical-input"
                    placeholder="How you'd like to be addressed"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how your name appears to other staff members
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="medical-textarea"
                    placeholder="Brief professional summary (optional)"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional bio visible to other healthcare providers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Application Settings</h2>
              <p className="text-sm text-muted-foreground">Configure your RELEVO experience</p>
            </div>

            {/* Interface Preferences */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Interface Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Dark Mode</div>
                      <div className="medical-setting-description">
                        Use dark theme for reduced eye strain
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Compact Mode</div>
                      <div className="medical-setting-description">
                        Show more information in less space
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">High Contrast</div>
                      <div className="medical-setting-description">
                        Increase contrast for better visibility
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Handover Preferences */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Handover Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Auto-save Drafts</div>
                      <div className="medical-setting-description">
                        Automatically save handover drafts every 30 seconds
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">I-PASS Template</div>
                      <div className="medical-setting-description">
                        Use structured I-PASS template for all handovers
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Quick Actions</div>
                      <div className="medical-setting-description">
                        Show quick action buttons for common tasks
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Notifications & Alerts</h2>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>

            {/* Critical Alerts */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">High Priority Alerts</div>
                      <div className="medical-setting-description">
                        Immediate notifications for critical patient changes
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Handover Reminders</div>
                      <div className="medical-setting-description">
                        Notifications for upcoming handover sessions
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Sound Alerts</div>
                      <div className="medical-setting-description">
                        Play sound for critical notifications
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Communication Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Team Updates</div>
                      <div className="medical-setting-description">
                        Notifications when team members make updates
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">System Announcements</div>
                      <div className="medical-setting-description">
                        Important system updates and maintenance notices
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Security & Privacy</h2>
              <p className="text-sm text-muted-foreground">Manage your account security settings</p>
            </div>

            {/* Account Security */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Two-Factor Authentication</div>
                      <div className="medical-setting-description">
                        Additional security layer for your account
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Session Timeout</div>
                      <div className="medical-setting-description">
                        Automatically log out after 4 hours of inactivity
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Activity Logging</div>
                      <div className="medical-setting-description">
                        Track login attempts and security events
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Data Analytics</div>
                      <div className="medical-setting-description">
                        Help improve RELEVO by sharing usage analytics
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="medical-setting-row">
                  <div className="medical-setting-info">
                    <div>
                      <div className="medical-setting-label">Error Reporting</div>
                      <div className="medical-setting-description">
                        Automatically send error reports to help fix issues
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Account Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your account preferences</p>
            </div>

            {/* Account Management */}
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value="eduardo@hospitalgarrahan.gov.ar"
                    className="medical-input"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email address is managed by the hospital system
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="medical-card border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-700">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Clear All Data</h4>
                  <p className="text-sm text-red-700 mb-3">
                    This will permanently delete all your handover data, notes, and preferences. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm">
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Mobile Layout - ENHANCED WITH PROPER SCROLLING
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Tab Navigation */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex overflow-x-auto gap-2 scrollbar-hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content - PROPER SCROLLING CONTAINER */}
        <div className="flex-1 overflow-y-auto mobile-scroll-fix">
          <div className="p-4 pb-8">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout - ENHANCED SCROLLING
  return (
    <div className="h-full flex flex-col">
      {/* Desktop Header - REMOVED BACK BUTTON */}
      <div className="flex-shrink-0 pt-6 px-6">
        <div className="max-w-7xl mx-auto mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your RELEVO profile and preferences</p>
          </div>
        </div>
      </div>

      {/* Desktop Content - PROPER FLEX SCROLLING */}
      <div className="flex-1 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Sidebar - Fixed Height */}
            <div className="col-span-12 lg:col-span-3">
              <Card className="medical-card h-fit sticky top-6">
                <CardContent className="p-0">
                  <div className="space-y-1 p-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                          activeSection === item.id
                            ? 'bg-primary/10 border border-primary/20 text-primary'
                            : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activeSection === item.id
                              ? 'bg-primary/10'
                              : 'bg-muted/30 group-hover:bg-muted/50'
                          }`}>
                            <item.icon className={`w-4 h-4 ${
                              activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${
                              activeSection === item.id ? 'text-primary' : 'text-foreground'
                            }`}>
                              {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          </div>
                          {activeSection === item.id && (
                            <ChevronRight className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area - SCROLLABLE */}
            <div className="col-span-12 lg:col-span-9 overflow-y-auto">
              <div className="space-y-6 pb-8">
                {renderSectionContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}