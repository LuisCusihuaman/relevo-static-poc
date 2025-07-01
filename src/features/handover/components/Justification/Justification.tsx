import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Calendar, User, Edit3, MessageSquare, Plus } from 'lucide-react';

interface JustificationProps {
  collaborators: Array<{
    id: number;
    name: string;
    initials: string;
    color: string;
    section: string;
  }>;
}

export function Justification({ collaborators }: JustificationProps) {
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState('');

  const justificationEntries = [
    {
      id: 1,
      timestamp: '14:15',
      author: 'Dr. Ana Martinez',
      initials: 'AM',
      content: 'Patient requires continued oxygen support due to acute exacerbation of COPD. Clinical improvement noted with current treatment plan including corticosteroids and bronchodilators. Recommend maintaining current O2 flow rate and monitoring for further improvement over next 24 hours.',
      priority: 'high',
      isBeingEdited: true,
      editedBy: 'Dr. Johnson'
    },
    {
      id: 2,
      timestamp: '13:45',
      author: 'Dr. Johnson',
      initials: 'DJ',
      content: 'Patient and family education completed regarding COPD management and signs of exacerbation. Discharge planning discussion initiated. Social work consultation requested for home care evaluation.',
      priority: 'medium',
      isBeingEdited: false
    }
  ];

  const activeEditor = collaborators.find(c => c.section === 'justification');

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      // In real app, this would add to the shared document
      setNewEntry('');
      setIsAddingEntry(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Clinical Justification</span>
            {activeEditor && (
              <div className="flex items-center space-x-2 ml-4">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className={`${activeEditor.color} text-white text-xs`}>
                    {activeEditor.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {activeEditor.name} is editing
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingEntry(!isAddingEntry)}
            className="flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Entry</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Entry */}
        {isAddingEntry && (
          <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-medium text-gray-900 mb-3">New Justification Entry</h4>
            <Textarea
              placeholder="Enter clinical reasoning, decision rationale, or additional context..."
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddEntry}>
                Add Entry
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingEntry(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Entries */}
        <div className="space-y-4">
          {justificationEntries.map((entry) => (
            <div 
              key={entry.id} 
              className={`border rounded-lg p-4 space-y-3 ${
                entry.isBeingEdited 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{entry.timestamp}</span>
                  <User className="w-4 h-4 ml-2" />
                  <span>{entry.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={entry.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {entry.priority.toUpperCase()}
                  </Badge>
                  {entry.isBeingEdited && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <Edit3 className="w-3 h-3" />
                      <span>Editing: {entry.editedBy}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <p className="text-sm leading-relaxed">{entry.content}</p>
                {entry.isBeingEdited && (
                  <div className="absolute inset-0 bg-blue-100 bg-opacity-30 border border-blue-300 rounded pointer-events-none"></div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-gray-400 text-white text-xs">
                      {entry.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500">
                    {entry.author}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Collaboration Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span>Last updated: 14:15 PMT</span>
            <span>•</span>
            <span>{justificationEntries.length} entries total</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Shared with team</span>
            <div className="flex -space-x-1">
              {collaborators.slice(0, 3).map((collaborator) => (
                <Avatar key={collaborator.id} className="w-5 h-5 border border-white">
                  <AvatarFallback className={`${collaborator.color} text-white text-xs`}>
                    {collaborator.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}