// src/pages/Statistics.jsx
import { useHistory } from "../hooks/useHistory";
import { useDailyStats } from "../hooks/useDailyStats";
import { formatDuration } from "../utils/calcDuration";
import DailyStats from "../components/DailyStats";
import ChartBlock from "../components/ChartBlock";
import LoadingHellfire from "../components/LoadingHellfire";

export function Statistics() {
  const { logs, loading } = useHistory(500);
  const { dailyStats } = useDailyStats(logs);

  if (loading) {
    return <LoadingHellfire />;
  }

  // Tính tổng các chỉ số
  const totalDryingSec = dailyStats.reduce((sum, d) => sum + d.dryingSec, 0);
  const totalInSec = dailyStats.reduce((sum, d) => sum + d.inSec, 0);
  const totalChanges = dailyStats.reduce((sum, d) => sum + d.count, 0);

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

      {/* Summary Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">🏆</span> Tổng Quan 7 Ngày
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total drying time */}
          <div className="relative overflow-hidden bg-gradient-to-br from-lava-red/30 to-hell-blood rounded-xl border-2 border-lava-red/40 p-6 shadow-lava animate-pulse-lava">
            <div className="absolute top-0 right-0 text-6xl opacity-10">☀️</div>
            <div className="relative z-10">
              <p className="text-lava-orange/80 text-sm uppercase tracking-wider mb-2">
                Tổng thời gian phơi
              </p>
              <p className="text-3xl font-bold text-lava-yellow animate-glow">
                {formatDuration(totalDryingSec)}
              </p>
            </div>
          </div>

          {/* Total in time */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900/30 to-hell-blood rounded-xl border-2 border-green-700/40 p-6">
            <div className="absolute top-0 right-0 text-6xl opacity-10">🏠</div>
            <div className="relative z-10">
              <p className="text-green-400/80 text-sm uppercase tracking-wider mb-2">
                Tổng thời gian thu
              </p>
              <p className="text-3xl font-bold text-green-400">
                {formatDuration(totalInSec)}
              </p>
            </div>
          </div>

          {/* Total changes */}
          <div className="relative overflow-hidden bg-gradient-to-br from-lava-orange/30 to-hell-blood rounded-xl border-2 border-lava-orange/40 p-6">
            <div className="absolute top-0 right-0 text-6xl opacity-10">🔄</div>
            <div className="relative z-10">
              <p className="text-lava-orange/80 text-sm uppercase tracking-wider mb-2">
                Tổng lần chuyển
              </p>
              <p className="text-3xl font-bold text-lava-orange">
                {totalChanges} lần
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
      <section>
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span> Chi Tiết Theo Ngày
        </h2>
        
        <div className="bg-gradient-to-br from-hell-blood to-hell-black rounded-xl border-2 border-lava-red/30 overflow-hidden shadow-lava">
          <DailyStats stats={dailyStats} />
        </div>
      </section>
    </div>
  );
}

export default Statistics;
