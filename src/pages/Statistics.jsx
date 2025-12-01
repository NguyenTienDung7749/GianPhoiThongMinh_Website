// src/pages/Statistics.jsx
import { useHistory } from "../hooks/useHistory";
import { useDailyStats } from "../hooks/useDailyStats";
import { formatDuration } from "../utils/calcDuration";
import { formatTime, formatState, formatReason, formatMode } from "../utils/formatTime";
import DailyStats from "../components/DailyStats";
import ChartBlock from "../components/ChartBlock";
import LoadingHellfire from "../components/LoadingHellfire";

export function Statistics() {
  const { logs, loading } = useHistory(500);
  const { todayStats, dailyStats, weeklyTotal } = useDailyStats(logs);

  if (loading) {
    return <LoadingHellfire />;
  }

  // Get 10 most recent logs for activity table
  const recentLogs = [...logs]
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lava-orange animate-glow mb-2">
          📊 Thống Kê Tổng Quan
        </h1>
        <p className="text-lava-yellow/60">
          Phân tích hoạt động của giàn phơi trong 7 ngày gần nhất
        </p>
      </div>

      {/* Today Stats Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span> Hôm Nay
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Today drying time */}
          <div className="relative overflow-hidden bg-gradient-to-br from-lava-red/30 to-hell-blood rounded-xl border-2 border-lava-red/40 p-6 shadow-lava animate-pulse-lava">
            <div className="absolute top-0 right-0 text-6xl opacity-10">☀️</div>
            <div className="relative z-10">
              <p className="text-lava-orange/80 text-sm uppercase tracking-wider mb-2">
                Thời gian phơi
              </p>
              <p className="text-3xl font-bold text-lava-yellow animate-glow">
                {formatDuration(todayStats.dryingSec)}
              </p>
            </div>
          </div>

          {/* Today in time */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900/30 to-hell-blood rounded-xl border-2 border-green-700/40 p-6">
            <div className="absolute top-0 right-0 text-6xl opacity-10">🏠</div>
            <div className="relative z-10">
              <p className="text-green-400/80 text-sm uppercase tracking-wider mb-2">
                Thời gian thu
              </p>
              <p className="text-3xl font-bold text-green-400">
                {formatDuration(todayStats.inSec)}
              </p>
            </div>
          </div>

          {/* Today changes */}
          <div className="relative overflow-hidden bg-gradient-to-br from-lava-orange/30 to-hell-blood rounded-xl border-2 border-lava-orange/40 p-6">
            <div className="absolute top-0 right-0 text-6xl opacity-10">🔄</div>
            <div className="relative z-10">
              <p className="text-lava-orange/80 text-sm uppercase tracking-wider mb-2">
                Số lần chuyển
              </p>
              <p className="text-3xl font-bold text-lava-orange">
                {todayStats.count} lần
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Summary Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">🏆</span> Tổng Quan 7 Ngày
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total drying time */}
          <div className="relative overflow-hidden bg-gradient-to-br from-lava-red/20 to-hell-blood rounded-xl border border-lava-red/30 p-5">
            <div className="absolute top-0 right-0 text-5xl opacity-10">☀️</div>
            <div className="relative z-10">
              <p className="text-lava-orange/70 text-sm uppercase tracking-wider mb-2">
                Tổng thời gian phơi
              </p>
              <p className="text-2xl font-bold text-lava-yellow">
                {formatDuration(weeklyTotal.dryingSec)}
              </p>
            </div>
          </div>

          {/* Total in time */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900/20 to-hell-blood rounded-xl border border-green-700/30 p-5">
            <div className="absolute top-0 right-0 text-5xl opacity-10">🏠</div>
            <div className="relative z-10">
              <p className="text-green-400/70 text-sm uppercase tracking-wider mb-2">
                Tổng thời gian thu
              </p>
              <p className="text-2xl font-bold text-green-400">
                {formatDuration(weeklyTotal.inSec)}
              </p>
            </div>
          </div>

          {/* Total changes */}
          <div className="relative overflow-hidden bg-gradient-to-br from-lava-orange/20 to-hell-blood rounded-xl border border-lava-orange/30 p-5">
            <div className="absolute top-0 right-0 text-5xl opacity-10">🔄</div>
            <div className="relative z-10">
              <p className="text-lava-orange/70 text-sm uppercase tracking-wider mb-2">
                Tổng lần chuyển
              </p>
              <p className="text-2xl font-bold text-lava-orange">
                {weeklyTotal.count} lần
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">📈</span> Biểu Đồ Hoạt Động
        </h2>
        
        <div className="bg-gradient-to-br from-hell-blood to-hell-black rounded-xl border-2 border-lava-red/30 overflow-hidden shadow-lava">
          <ChartBlock dailyStats={dailyStats} />
        </div>
      </section>

      {/* Daily Stats Table */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span> Chi Tiết Theo Ngày
        </h2>
        
        <div className="bg-gradient-to-br from-hell-blood to-hell-black rounded-xl border-2 border-lava-red/30 overflow-hidden shadow-lava">
          <DailyStats stats={dailyStats} />
        </div>
      </section>

      {/* Recent Activity Table */}
      <section>
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span> Hoạt Động Gần Đây
        </h2>
        
        <div className="bg-gradient-to-br from-hell-blood to-hell-black rounded-xl border-2 border-lava-red/30 overflow-hidden shadow-lava">
          {recentLogs.length === 0 ? (
            <div className="text-center py-10 text-lava-orange/60">
              <span className="text-4xl mb-4 block">📋</span>
              <p>Chưa có hoạt động nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-lava-red/30">
                    <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
                      🕐 Thời gian
                    </th>
                    <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
                      📍 Trạng thái
                    </th>
                    <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
                      ⚙️ Chế độ
                    </th>
                    <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
                      💡 Lý do
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log, index) => (
                    <tr
                      key={log.ts || index}
                      className={`
                        border-b border-lava-red/10
                        transition-all duration-300
                        hover:bg-lava-red/10
                        ${index % 2 === 0 ? "bg-hell-blood/30" : "bg-hell-black/50"}
                      `}
                    >
                      <td className="py-3 px-4 text-lava-yellow/80 text-sm">
                        {formatTime(log.ts)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
                          ${log.state === "out" 
                            ? "bg-lava-red/20 text-lava-orange" 
                            : "bg-green-900/30 text-green-400"
                          }
                        `}>
                          {log.state === "out" ? "☀️" : "🏠"} {formatState(log.state)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-lava-yellow/70 text-sm">
                        {formatMode(log.mode)}
                      </td>
                      <td className="py-3 px-4 text-lava-yellow/60 text-sm">
                        {formatReason(log.reason)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Statistics;
