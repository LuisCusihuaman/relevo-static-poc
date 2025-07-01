import { useState, useEffect } from 'react';

export function useHandoverSession() {
  const [handoverStartTime] = useState(new Date(Date.now() - 12 * 60 * 1000)); // Started 12 minutes ago
  const [sessionDuration, setSessionDuration] = useState(12);

  // Calculate time until handover
  const getTimeUntilHandover = () => {
    const now = new Date();
    const handoverTime = new Date();
    handoverTime.setHours(17, 0, 0, 0); // 17:00
    
    const diffMs = handoverTime.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    
    if (diffMins <= 0) return 'Handover time';
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  // Format session duration for display
  const getSessionDuration = () => {
    if (sessionDuration < 60) return `${sessionDuration} min`;
    const hours = Math.floor(sessionDuration / 60);
    const mins = sessionDuration % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Update session duration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - handoverStartTime.getTime()) / (1000 * 60));
      setSessionDuration(duration);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [handoverStartTime]);

  return {
    sessionDuration,
    getTimeUntilHandover,
    getSessionDuration
  };
}