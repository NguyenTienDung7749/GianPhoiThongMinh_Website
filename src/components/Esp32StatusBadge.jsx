// src/components/Esp32StatusBadge.jsx

/**
 * Badge component to display ESP32 online/offline status
 * @param {Object} props
 * @param {boolean} props.online - Whether ESP32 is online
 */
export function Esp32StatusBadge({ online }) {
  return (
    <span
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-300
        ${online
          ? "bg-green-900/30 text-green-400 border border-green-700/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
          : "bg-red-900/30 text-red-400 border border-red-700/50 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse"
        }
      `}
    >
      <span className="text-base">{online ? "🟢" : "🔴"}</span>
      ESP32: {online ? "ONLINE" : "MẤT KẾT NỐI"}
    </span>
  );
}

export default Esp32StatusBadge;
