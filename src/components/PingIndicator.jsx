// src/components/PingIndicator.jsx

/**
 * Component to display Web ↔ Firebase ping latency
 * @param {Object} props
 * @param {number|null} props.latencyMs - Latency in milliseconds
 * @param {string|null} props.latencyStatus - 'good', 'moderate', or 'poor'
 */
export function PingIndicator({ latencyMs, latencyStatus }) {
  // Color classes based on latency status
  const statusColors = {
    good: "text-green-400 border-green-700/50 bg-green-900/20",
    moderate: "text-yellow-400 border-yellow-700/50 bg-yellow-900/20",
    poor: "text-red-400 border-red-700/50 bg-red-900/20",
  };

  const colorClass = latencyStatus ? statusColors[latencyStatus] : "text-gray-400 border-gray-700/50 bg-gray-900/20";

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-300
        ${colorClass}
      `}
      title="Độ trễ kết nối giữa Web và Firebase"
    >
      <span className="text-base">📡</span>
      <span className="opacity-80">Độ trễ Web ↔ Firebase:</span>
      <span className="font-bold">
        {latencyMs !== null ? `${latencyMs} ms` : "Đang đo..."}
      </span>
    </div>
  );
}

export default PingIndicator;
