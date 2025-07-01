import { Badge } from '@/components/ui/badge';
import {
  Brain,
  CheckCircle2,
  Clock,
  Edit, Eye,
  Heart,
  Stethoscope,
  Thermometer,
  User, Wifi
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Compact severity levels with simpler styling
const severityLevels = [
  {
    id: 'stable',
    label: 'Stable',
    description: 'Patient condition is stable with minimal intervention needed',
    icon: Thermometer,
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300'
  },
  {
    id: 'guarded',
    label: 'Guarded', 
    description: 'Patient requires close monitoring with potential for change',
    icon: Heart,
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300'
  },
  {
    id: 'unstable',
    label: 'Unstable',
    description: 'Patient condition is unstable requiring immediate intervention',
    icon: Brain,
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  {
    id: 'critical',
    label: 'Critical',
    description: 'Patient in critical condition requiring urgent care',
    icon: Stethoscope,
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400'
  }
];

interface IllnessSeverityProps {
  currentUser?: {
    name: string;
    initials: string;
    role: string;
  };
  assignedPhysician?: {
    name: string;
    initials: string;
    role: string;
  };
}

export function IllnessSeverity({ 
  currentUser = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' },
  assignedPhysician = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' }
}: IllnessSeverityProps) {
  const [selectedSeverity, setSelectedSeverity] = useState('stable');
  const [canEdit] = useState(currentUser.name === assignedPhysician.name);
  const [realtimeUpdate, setRealtimeUpdate] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const handleSeverityChange = (severityId: string) => {
    if (canEdit) {
      setSelectedSeverity(severityId);
      setRealtimeUpdate(true);
      setLastUpdated('Just now');
      
      // Simulate real-time update animation
      setTimeout(() => {
        setRealtimeUpdate(false);
      }, 2000);
      
      console.log(`Severity updated to: ${severityId}`);
    }
  };

  // Simulate receiving real-time updates from other users
  useEffect(() => {
    if (!canEdit) {
      const simulateRealtimeUpdate = () => {
        setRealtimeUpdate(true);
        setTimeout(() => {
          setRealtimeUpdate(false);
        }, 1500);
      };
      
      // Simulate occasional updates for demo purposes
      const interval = setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every second
          simulateRealtimeUpdate();
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [canEdit]);

  return (
    <div className="space-y-3">
      {/* Real-time status and permissions header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${realtimeUpdate ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} transition-colors`} />
          <p className="text-sm text-gray-600">
            {canEdit ? 'You can edit severity assessment' : 'Live severity assessment'}
          </p>
          {realtimeUpdate && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 animate-pulse">
              <Wifi className="w-3 h-3 mr-1" />
              Live update
            </Badge>
          )}
        </div>
        
        <Badge variant="outline" className={`text-xs ${canEdit ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-gray-600'}`}>
          {canEdit ? (
            <>
              <Edit className="w-3 h-3 mr-1" />
              Editor
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Viewer
            </>
          )}
        </Badge>
      </div>

      {/* Severity Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {severityLevels.map((level) => {
          const IconComponent = level.icon;
          const isSelected = selectedSeverity === level.id;
          const isClickable = canEdit;
          
          return (
            <button
              key={level.id}
              onClick={() => handleSeverityChange(level.id)}
              disabled={!isClickable}
              className={`medical-severity-option group relative p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                isSelected 
                  ? `${level.borderColor} ${level.bgColor} ${realtimeUpdate ? 'realtime-update' : ''}` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? `${level.bgColor} border ${level.borderColor}` : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <IconComponent className={`w-4 h-4 ${
                    isSelected ? level.textColor : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className={`font-medium ${
                      isSelected ? level.textColor : 'text-gray-900 group-hover:text-gray-800'
                    }`}>
                      {level.label}
                    </h5>
                    
                    {isSelected && (
                      <CheckCircle2 className={`w-4 h-4 ${level.textColor} flex-shrink-0`} />
                    )}
                  </div>
                  
                  <p className={`text-sm mt-0.5 leading-relaxed ${
                    isSelected 
                      ? level.textColor.replace('600', '500').replace('700', '600')
                      : 'text-gray-600 group-hover:text-gray-700'
                  }`}>
                    {level.description}
                  </p>
                  
                  {/* Assessment metadata - only for selected item */}
                  {isSelected && (
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Set by {assignedPhysician.initials}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{lastUpdated}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time collaboration status */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>
          {canEdit 
            ? 'Changes are automatically synced to all viewers in real-time'
            : `Only ${assignedPhysician.initials} (${assignedPhysician.role}) can modify this assessment`
          }
        </p>
        {!canEdit && (
          <p className="text-gray-400">
            You will see updates automatically as they are made
          </p>
        )}
      </div>
    </div>
  );
}