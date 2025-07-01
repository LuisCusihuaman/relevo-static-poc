import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  Bug,
  Calendar,
  FileText,
  Heart,
  Info,
  Shield,
  Zap
} from 'lucide-react';
import { useState } from 'react';

export type Alert = {
  id: string;
  patientId: string;
  type: 'INFECTION_CONTROL' | 'ALLERGY' | 'ADVERSE_REACTION' | 'RELEVANT_PATHOLOGY' | 'SPECIFIC_RISK' | 'ADMINISTRATIVE' | 'OTHER';
  alertCatalogItem: {
    code: string;
    description: string;
  };
  observations?: string;
  level: 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
  status: 'ACTIVE' | 'INACTIVE' | 'VOIDED';
  startDate: string;
  endDate?: string;
  creationDetails: {
    author: string;
    timestamp: string;
    source: string;
  };
}

interface PatientAlertsProps {
  alerts: Alert[];
  compact?: boolean;
}

export function PatientAlerts({ alerts, compact = false }: PatientAlertsProps) {
  const [showInactive, setShowInactive] = useState(false);

  // Use proper Lucide React icons instead of emojis
  const getAlertIcon = (type: string) => {
    const icons = {
      INFECTION_CONTROL: Bug,
      ALLERGY: AlertTriangle,
      ADVERSE_REACTION: Zap,
      RELEVANT_PATHOLOGY: Heart,
      SPECIFIC_RISK: Shield,
      ADMINISTRATIVE: FileText,
      OTHER: Info
    };
    const IconComponent = icons[type as keyof typeof icons] || Info;
    return <IconComponent className="w-4 h-4" />;
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'border-red-500 bg-red-50 text-red-700';
      case 'MEDIUM':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'INFORMATIONAL':
        return 'border-blue-500 bg-blue-50 text-blue-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'MEDIUM':
        return <Shield className="w-4 h-4 text-yellow-600" />;
      case 'INFORMATIONAL':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filter alerts - only show active alerts by default
  const activeAlerts = alerts.filter(alert => alert.status === 'ACTIVE');
  const inactiveAlerts = alerts.filter(alert => alert.status === 'INACTIVE');
  const displayAlerts = showInactive ? [...activeAlerts, ...inactiveAlerts] : activeAlerts;

  // Sort by level priority (HIGH > MEDIUM > INFORMATIONAL)
  const sortedAlerts = displayAlerts.sort((a, b) => {
    const levelOrder = { HIGH: 3, MEDIUM: 2, INFORMATIONAL: 1 };
    return levelOrder[b.level as keyof typeof levelOrder] - levelOrder[a.level as keyof typeof levelOrder];
  });

  if (sortedAlerts.length === 0) {
    return null;
  }

  if (compact) {
    // Compact view for patient cards - Only show HIGH and MEDIUM alerts to reduce noise
    const criticalAlerts = activeAlerts.filter(alert => alert.level === 'HIGH');
    const importantAlerts = activeAlerts.filter(alert => alert.level === 'MEDIUM');
    
    return (
      <div className="space-y-2">
        {/* Only show HIGH level alerts prominently */}
        {criticalAlerts.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-700 text-sm">
                {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-1">
              {criticalAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="flex items-center gap-2 text-sm">
                  {getAlertIcon(alert.type)}
                  <span className="font-medium">{alert.alertCatalogItem.description}</span>
                  {alert.observations && (
                    <span className="text-red-600 text-xs">- {alert.observations}</span>
                  )}
                </div>
              ))}
              {criticalAlerts.length > 2 && (
                <div className="text-sm text-red-600">+ {criticalAlerts.length - 2} more critical alerts</div>
              )}
            </div>
          </div>
        )}
        
        {/* Show MEDIUM alerts as small badges, less prominently */}
        {importantAlerts.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {importantAlerts.slice(0, 2).map((alert) => (
              <Badge key={alert.id} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                {getAlertIcon(alert.type)}
                <span className="ml-1">{alert.alertCatalogItem.description}</span>
              </Badge>
            ))}
            {importantAlerts.length > 2 && (
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                +{importantAlerts.length - 2} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Don't show INFORMATIONAL alerts in compact view to reduce noise */}
      </div>
    );
  }

  // Full view for detailed patient information
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Patient Alerts ({activeAlerts.length} Active)
          </CardTitle>
          {inactiveAlerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? 'Hide' : 'Show'} Inactive ({inactiveAlerts.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.level)} ${
                alert.status === 'INACTIVE' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl flex items-center justify-center">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex items-center gap-2">
                      {getLevelIcon(alert.level)}
                      <span className="font-semibold text-lg">
                        {alert.alertCatalogItem.description}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {alert.level}
                      </Badge>
                      {alert.status === 'INACTIVE' && (
                        <Badge variant="secondary" className="text-xs">
                          INACTIVE
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {alert.observations && (
                    <div className="mb-3 p-2 bg-white/70 rounded">
                      <p className="font-medium text-sm">{alert.observations}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Code:</span> {alert.alertCatalogItem.code}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {alert.type.replace(/_/g, ' ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Since:</span> {new Date(alert.startDate).toLocaleDateString()}
                    </div>
                    {alert.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Until:</span> {new Date(alert.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    Created by {alert.creationDetails.author} • {alert.creationDetails.source} • {new Date(alert.creationDetails.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedAlerts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No alerts for this patient</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}