interface StatusSummaryProps {
  selectedStatus: "all" | "pending" | "in-progress" | "complete";
  onStatusChange: (
    status: "all" | "pending" | "in-progress" | "complete",
  ) => void;
}

export function StatusSummary({
  selectedStatus,
  onStatusChange,
}: StatusSummaryProps) {
  const statuses = [
    {
      key: "all" as const,
      label: "All",
      count: 9,
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
    },
    {
      key: "pending" as const,
      label: "Pending",
      count: 3,
      color: "bg-orange-50 border border-orange-200/50",
      textColor: "text-orange-700",
    },
    {
      key: "in-progress" as const,
      label: "In Handover",
      count: 3,
      color: "bg-blue-50 border border-blue-200/50",
      textColor: "text-blue-700",
    },
    {
      key: "complete" as const,
      label: "Complete",
      count: 3,
      color: "bg-green-50 border border-green-200/50",
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="mb-4">
      {/* Filter Tabs - Enhanced Background */}
      <div className="bg-background/90 backdrop-blur-md rounded-xl p-1 border border-border/40 shadow-sm">
        <div className="flex">
          {statuses.map((status) => (
            <button
              key={status.key}
              onClick={() => onStatusChange(status.key)}
              className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                selectedStatus === status.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
