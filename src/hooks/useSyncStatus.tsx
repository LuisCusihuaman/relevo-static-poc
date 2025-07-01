import { AlertTriangle, CheckCircle, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

type SyncStatus = "synced" | "syncing" | "pending" | "offline" | "error";

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced");

  // Simulate network status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("syncing");
      setTimeout(() => setSyncStatus("synced"), 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Real-time collaboration sync status indicator
  const getSyncStatusDisplay = () => {
    switch (syncStatus) {
      case "syncing":
        return {
          icon: (
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          ),
          text: "Syncing...",
          color: "text-amber-600",
        };
      case "pending":
        return {
          icon: (
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
          ),
          text: "Pending...",
          color: "text-gray-500",
        };
      case "offline":
        return {
          icon: <WifiOff className="w-3 h-3 text-red-500" />,
          text: "Offline",
          color: "text-red-600",
        };
      case "error":
        return {
          icon: <AlertTriangle className="w-3 h-3 text-red-500" />,
          text: "Sync Error",
          color: "text-red-600",
        };
      default:
        return {
          icon: <CheckCircle className="w-3 h-3 text-green-500" />,
          text: "All changes saved",
          color: "text-green-600",
        };
    }
  };

  return {
    isOnline,
    syncStatus,
    setSyncStatus,
    getSyncStatusDisplay,
  };
}
