// src/components/HistoryTable.jsx
import { formatTime, formatMode, formatState, formatReason } from "../utils/formatTime";

export function HistoryTable({ logs, showPagination = false, currentPage = 1, totalPages = 1, onPageChange }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-10 text-lava-orange/60">
        <span className="text-4xl mb-4 block">🔥</span>
        <p>Chưa có lịch sử hoạt động</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-lava-red/30">
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              ⏰ Thời gian
            </th>
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              ⚙️ Chế độ
            </th>
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              📍 Trạng thái
            </th>
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              📝 Lý do
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={log.id}
              className={`
                border-b border-lava-red/10
                transition-all duration-300
                hover:bg-lava-red/10 hover:shadow-lava
                ${index % 2 === 0 ? "bg-hell-blood/30" : "bg-hell-black/50"}
              `}
            >
              <td className="py-3 px-4 text-lava-yellow/80 text-sm">
                {formatTime(log.ts)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`
                    inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${log.mode === "manual"
                      ? "bg-lava-orange/20 text-lava-orange border border-lava-orange/30"
                      : "bg-lava-yellow/20 text-lava-yellow border border-lava-yellow/30"
                    }
                  `}
                >
                  {formatMode(log.mode)}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`
                    inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${log.state === "out"
                      ? "bg-lava-red/20 text-lava-red border border-lava-red/30"
                      : log.state === "in"
                      ? "bg-green-900/30 text-green-400 border border-green-700/30"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/30"
                    }
                  `}
                >
                  {formatState(log.state)}
                </span>
              </td>
              <td className="py-3 px-4 text-lava-yellow/60 text-sm">
                {formatReason(log.reason)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-lava-red/20">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              px-4 py-2 rounded-lg transition-all
              ${currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-lava-red/20 text-lava-orange hover:bg-lava-red/40"
              }
            `}
          >
            ◀ Trước
          </button>
          
          <span className="px-4 py-2 text-lava-yellow">
            Trang {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              px-4 py-2 rounded-lg transition-all
              ${currentPage === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-lava-red/20 text-lava-orange hover:bg-lava-red/40"
              }
            `}
          >
            Sau ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;
