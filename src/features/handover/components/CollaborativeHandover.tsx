import { useState } from 'react';
import { MessageSquare, Users, Clock, Save, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PatientAlerts } from '../../patient-management/components/PatientAlerts';
import type { Alert } from '../../../common/types';

interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  cursor?: { section: string; position: number };
  lastSeen: Date;
}

interface Comment {
  id: string;
  user: CollaborativeUser;
  content: string;
  timestamp: Date;
  section: string;
  resolved: boolean;
}

interface CollaborativeHandoverProps {
  patientId: number;
  patientName: string;
}

export function CollaborativeHandover({ patientId, patientName }: CollaborativeHandoverProps) {
  const [activeUsers] = useState<CollaborativeUser[]>([
    { id: '1', name: 'Dr. Sarah Chen', color: '#007AFF', lastSeen: new Date() },
    { id: '2', name: 'Dr. Michael Torres', color: '#FF9500', cursor: { section: 'patient-summary', position: 45 }, lastSeen: new Date() },
    { id: '3', name: 'Dr. Lisa Park', color: '#30D158', lastSeen: new Date(Date.now() - 2 * 60 * 1000) }
  ]);

  // Patient-specific alerts using the proper schema
  const [patientAlerts] = useState<Alert[]>([
    {
      id: "alert-1",
      patientId: patientId.toString(),
      type: "ALLERGY",
      alertCatalogItem: {
        code: "25",
        description: "Penicillin Allergy"
      },
      observations: "Anaphylaxis history. PREMEDICAR!",
      level: "HIGH",
      status: "ACTIVE",
      startDate: "2024-01-15",
      creationDetails: {
        author: "dr.martinez",
        timestamp: "2024-01-15T09:30:00Z",
        source: "Admission Records"
      }
    },
    {
      id: "alert-2",
      patientId: patientId.toString(),
      type: "INFECTION_CONTROL",
      alertCatalogItem: {
        code: "70",
        description: "Germen Multi Resistente"
      },
      observations: "OXA48/163",
      level: "MEDIUM",
      status: "ACTIVE",
      startDate: "2025-06-09",
      creationDetails: {
        author: "lab_auto",
        timestamp: "2025-06-09T10:00:00Z",
        source: "Laboratory System"
      }
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: activeUsers[1],
      content: 'Check cardiac enzymes trend. Last CK was 2,456',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      section: 'action-list',
      resolved: false
    }
  ]);

  const [handoverData, setHandoverData] = useState({
    illnessSeverity: 'Stable',
    justification: 'Patient requires high-flow oxygen support but has shown improvement over the past 12 hours with decreased work of breathing and lower FiO2 requirements (from 60% to 40%). Still at risk for deterioration given underlying pneumonia and history of asthma.',
    patientSummary: '9 year old male with history of asthma, admitted 3 days ago with acute respiratory failure secondary to community-acquired pneumonia. Currently on high-flow nasal cannula with improving respiratory status.',
    actionList: [
      'Wean oxygen as tolerated - target SpO2 >94%',
      'Complete 7-day course of antibiotics (Day 4 of 7)',
      'Respiratory therapy BID',
      'Consider stepping down from ICU if stable x24h'
    ],
    situationAwareness: [
      'Lives 3 hours from hospital - discharge planning needs early coordination',
      'Parents very anxious about respiratory status',
      'Previous ICU admission 8 months ago for similar presentation',
      'School nurse needs education about inhaler technique'
    ],
    synthesis: 'Clinically improving respiratory failure. Plan for step-down to ward if continues current trajectory. Focus on family education and discharge planning.'
  });

  const [newComment, setNewComment] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState(new Date());

  const addComment = (section: string) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: activeUsers[0],
      content: newComment,
      timestamp: new Date(),
      section,
      resolved: false
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setActiveSection(null);
  };

  const updateSection = (section: string, value: string | string[]) => {
    setHandoverData(prev => ({ ...prev, [section]: value }));
    setLastSaved(new Date());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with collaboration info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{patientName}</CardTitle>
              <p className="text-muted-foreground">MRN: 123345 | Bed: PICU-01 | DOB: 2015-03-15</p>
            </div>
            
            {/* Active Alerts Badge */}
            <div className="flex items-center gap-3">
              {patientAlerts.filter(alert => alert.status === 'ACTIVE').length > 0 && (
                <Badge variant="destructive" className="text-sm">
                  🚨 {patientAlerts.filter(alert => alert.status === 'ACTIVE').length} Active Alert{patientAlerts.filter(alert => alert.status === 'ACTIVE').length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Collaboration Bar */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {activeUsers.map((user) => (
                    <Avatar key={user.id} className="w-8 h-8 border-2 border-background">
                      <AvatarFallback 
                        className="text-xs"
                        style={{ backgroundColor: user.color + '20', color: user.color }}
                      >
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  <span>Saved {Math.floor((Date.now() - lastSaved.getTime()) / 1000)}s ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.filter(c => !c.resolved).length} comments</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-4 gap-6">
        {/* Patient Alerts Sidebar */}
        <div className="col-span-1">
          <PatientAlerts 
            alerts={patientAlerts} 
            compact={false}
          />
        </div>

        {/* Main Handover Document */}
        <div className="col-span-3 space-y-6">
          {/* Illness Severity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Illness Severity
                  <span className="text-sm text-muted-foreground">10 mins ago</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={handoverData.illnessSeverity === 'Stable' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSection('illnessSeverity', 'Stable')}
                  >
                    ✅ Stable
                  </Button>
                  <Button
                    variant={handoverData.illnessSeverity === 'Watcher' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSection('illnessSeverity', 'Watcher')}
                  >
                    👁️ Watcher
                  </Button>
                  <Button
                    variant={handoverData.illnessSeverity === 'Unstable' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => updateSection('illnessSeverity', 'Unstable')}
                  >
                    ⚠️ Unstable
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Justification */}
          <Card>
            <CardHeader>
              <CardTitle>Justification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={handoverData.justification}
                  onChange={(e) => updateSection('justification', e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Explain clinical reasoning for illness severity assessment..."
                />
                {activeUsers[1].cursor?.section === 'justification' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {activeUsers[1].name} is typing...
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Summary</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection(activeSection === 'patient-summary' ? null : 'patient-summary')}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={handoverData.patientSummary}
                onChange={(e) => updateSection('patientSummary', e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Brief patient summary including key diagnoses, treatments, and current status..."
              />
              
              {/* Comments Section */}
              {activeSection === 'patient-summary' && (
                <div className="mt-4 space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addComment('patient-summary')}
                    />
                    <Button size="sm" onClick={() => addComment('patient-summary')}>
                      Comment
                    </Button>
                  </div>
                  
                  {comments
                    .filter(c => c.section === 'patient-summary' && !c.resolved)
                    .map((comment) => (
                      <div key={comment.id} className="flex gap-2 p-2 bg-background rounded">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs" style={{ backgroundColor: comment.user.color + '20' }}>
                            {comment.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="text-muted-foreground">{comment.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Action List</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection(activeSection === 'action-list' ? null : 'action-list')}
                >
                  <MessageSquare className="w-4 h-4" />
                  {comments.filter(c => c.section === 'action-list' && !c.resolved).length > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      {comments.filter(c => c.section === 'action-list' && !c.resolved).length}
                    </Badge>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {handoverData.actionList.map((action, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <span className="text-primary">•</span>
                    <Input
                      value={action}
                      onChange={(e) => {
                        const newActions = [...handoverData.actionList];
                        newActions[index] = e.target.value;
                        updateSection('actionList', newActions);
                      }}
                      className="border-0 p-0 h-auto"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSection('actionList', [...handoverData.actionList, ''])}
                  className="w-full"
                >
                  + Add Action
                </Button>
              </div>

              {/* Comments for Action List */}
              {activeSection === 'action-list' && (
                <div className="mt-4 space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment about actions..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addComment('action-list')}
                    />
                    <Button size="sm" onClick={() => addComment('action-list')}>
                      Comment
                    </Button>
                  </div>
                  
                  {comments
                    .filter(c => c.section === 'action-list' && !c.resolved)
                    .map((comment) => (
                      <div key={comment.id} className="flex gap-2 p-2 bg-background rounded">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs" style={{ backgroundColor: comment.user.color + '20' }}>
                            {comment.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="text-muted-foreground">{comment.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Situation Awareness & Contingency */}
          <Card>
            <CardHeader>
              <CardTitle>Situation Awareness & Contingency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {handoverData.situationAwareness.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <span className="text-primary">•</span>
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...handoverData.situationAwareness];
                        newItems[index] = e.target.value;
                        updateSection('situationAwareness', newItems);
                      }}
                      className="border-0 p-0 h-auto"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSection('situationAwareness', [...handoverData.situationAwareness, ''])}
                  className="w-full"
                >
                  + Add Awareness Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Synthesis by Receiver */}
          <Card>
            <CardHeader>
              <CardTitle>Synthesis by Receiver</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={handoverData.synthesis}
                onChange={(e) => updateSection('synthesis', e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="Receiving provider's summary and understanding..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}