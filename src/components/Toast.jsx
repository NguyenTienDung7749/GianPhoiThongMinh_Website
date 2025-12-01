// src/components/Toast.jsx
import { useEffect } from "react";

/**
 * Toast notification component for displaying warnings and alerts
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {string} props.type - 'warning', 'error', 'success', or 'info'
 * @param {function} props.onClose - Callback when toast is closed
 * @param {number} props.duration - Auto-dismiss duration in ms (0 for no auto-dismiss)
 */
export function Toast({ message, type = "warning", onClose, duration = 5000 }) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Type-specific styles
  const typeStyles = {
    warning: "bg-yellow-900/90 border-yellow-600/50 text-yellow-200",
    error: "bg-red-900/90 border-red-600/50 text-red-200",
    success: "bg-green-900/90 border-green-600/50 text-green-200",
    info: "bg-blue-900/90 border-blue-600/50 text-blue-200",
  };

  const iconMap = {
    warning: "⚠️",
    error: "❌",
    success: "✅",
    info: "ℹ️",
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-start gap-3
        px-4 py-3 rounded-xl
        border-2 shadow-lg
        max-w-md
        animate-slide-in
        ${typeStyles[type]}
      `}
      role="alert"
    >
      <span className="text-xl flex-shrink-0">{iconMap[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
          aria-label="Đóng thông báo"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Toast;
