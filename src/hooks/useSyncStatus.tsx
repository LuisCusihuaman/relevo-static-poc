import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import type { SyncStatus } from '../../../relevo-app-vite/src/common/types';

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  // Simulate network status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 1500);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time collaboration sync status indicator
  const getSyncStatusDisplay = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />,
          text: 'Syncing...',
          color: 'text-amber-600'
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-3 h-3 text-red-500" />,
          text: 'Offline',
          color: 'text-red-600'
        };
      default:
        return {
          icon: <div className="w-2 h-2 bg-green-500 rounded-full" />,
          text: 'All changes saved',
          color: 'text-green-600'
        };
    }
  };

  return {
    isOnline,
    syncStatus,
    setSyncStatus,
    getSyncStatusDisplay
  };
}