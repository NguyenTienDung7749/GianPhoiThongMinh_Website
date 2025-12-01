// src/components/DailyStats.jsx
import { formatDuration } from "../utils/calcDuration";
import { getDayLabel } from "../utils/formatTime";

export function DailyStats({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-10 text-lava-orange/60">
        <span className="text-4xl mb-4 block">📊</span>
        <p>Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  // Find max drying time for relative bar width
  const maxDryingSec = Math.max(...stats.map((d) => d.dryingSec), 1);
  const maxInSec = Math.max(...stats.map((d) => d.inSec), 1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-lava-red/30">
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              📅 Ngày
            </th>
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              ☀️ Thời gian phơi
            </th>
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              🏠 Thời gian thu
            </th>
            <th className="text-left py-4 px-4 text-lava-orange uppercase tracking-wider text-sm font-semibold">
              🔄 Số lần chuyển
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((day, index) => {
            const dayLabel = getDayLabel(day.dayStartSec || day.dateObj?.getTime() / 1000);
            const isToday = day.isToday || index === 0;
            
            return (
              <tr
                key={day.key}
                className={`
                  border-b border-lava-red/10
                  transition-all duration-300
                  hover:bg-lava-red/10 hover:shadow-lava
                  ${isToday 
                    ? "bg-gradient-to-r from-lava-red/20 to-lava-orange/10 border-l-4 border-l-lava-orange" 
                    : index % 2 === 0 ? "bg-hell-blood/30" : "bg-hell-black/50"
                  }
                `}
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className={`font-medium ${isToday ? "text-lava-orange animate-glow" : "text-lava-yellow"}`}>
                      {dayLabel}
                    </span>
                    {isToday && (
                      <span className="text-xs text-lava-orange/60 mt-0.5">
                        ⚡ Đang cập nhật
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-3 bg-hell-blood rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-lava-red to-lava-orange transition-all duration-500 ${isToday ? "animate-pulse-lava" : ""}`}
                        style={{
                          width: `${Math.min((day.dryingSec / maxDryingSec) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isToday ? "text-lava-yellow" : "text-lava-yellow/80"}`}>
                      {formatDuration(day.dryingSec)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-3 bg-hell-blood rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-700 to-green-500 transition-all duration-500"
                        style={{
                          width: `${Math.min((day.inSec / maxInSec) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isToday ? "text-lava-yellow" : "text-lava-yellow/80"}`}>
                      {formatDuration(day.inSec)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                    ${isToday 
                      ? "bg-lava-orange/30 text-lava-yellow border border-lava-orange/50" 
                      : "bg-lava-red/20 text-lava-orange"
                    }
                  `}>
                    {day.count}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DailyStats;
