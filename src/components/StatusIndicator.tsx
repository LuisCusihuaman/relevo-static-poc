interface StatusIndicatorProps {
  count: number;
  label: string;
  color: "yellow" | "green" | "red";
}

export function StatusIndicator({ count, label, color }: StatusIndicatorProps) {
  const colorClasses = {
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    red: "bg-red-500"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`}></div>
      <span className="text-sm text-gray-700">{count} {label}</span>
    </div>
  );
}