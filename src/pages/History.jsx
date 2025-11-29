// src/pages/History.jsx
import { useState, useMemo } from "react";
import { useHistory } from "../hooks/useHistory";
import HistoryTable from "../components/HistoryTable";
import LoadingHellfire from "../components/LoadingHellfire";

const ITEMS_PER_PAGE = 20;

export function History() {
  const { logs, loading } = useHistory(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");

  // Lọc và sắp xếp logs
  const filteredLogs = useMemo(() => {
    let result = [...logs].reverse(); // Mới nhất trước

    if (filterDate) {
      result = result.filter((log) => {
        if (!log.ts) return false;
        const logDate = new Date(log.ts * 1000);
        const filterDateObj = new Date(filterDate);
        return (
          logDate.getFullYear() === filterDateObj.getFullYear() &&
          logDate.getMonth() === filterDateObj.getMonth() &&
          logDate.getDate() === filterDateObj.getDate()
        );
      });
    }

    return result;
  }, [logs, filterDate]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingHellfire />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lava-orange animate-glow mb-2">
          📜 Lịch Sử Hoạt Động
        </h1>
        <p className="text-lava-yellow/60">
          Xem lại lịch sử phơi và thu giàn phơi
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="filter-date" className="text-lava-orange font-medium">
            🗓️ Lọc theo ngày:
          </label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={handleFilterChange}
            className="
              bg-hell-blood border-2 border-lava-red/30 rounded-lg
              px-4 py-2 text-lava-yellow
              focus:outline-none focus:border-lava-orange
              transition-colors
            "
          />
          {filterDate && (
            <button
              onClick={() => handleFilterChange({ target: { value: "" } })}
              className="
                px-3 py-2 rounded-lg
                bg-lava-red/20 text-lava-orange
                hover:bg-lava-red/40 transition-colors
              "
            >
              ✕ Xóa lọc
            </button>
          )}
        </div>

        <div className="flex-grow"></div>

        <span className="text-lava-yellow/60 text-sm">
          Tổng cộng: <span className="text-lava-orange font-bold">{filteredLogs.length}</span> bản ghi
        </span>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-hell-blood to-hell-black rounded-xl border-2 border-lava-red/30 overflow-hidden shadow-lava">
        <HistoryTable
          logs={paginatedLogs}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default History;
