// src/components/DailyStats.jsx
import { formatDuration } from "../utils/calcDuration";

export function DailyStats({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-10 text-lava-orange/60">
        <span className="text-4xl mb-4 block">📊</span>
        <p>Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

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
          {stats.map((day, index) => (
            <tr
              key={day.key}
              className={`
                border-b border-lava-red/10
                transition-all duration-300
                hover:bg-lava-red/10 hover:shadow-lava
                ${index % 2 === 0 ? "bg-hell-blood/30" : "bg-hell-black/50"}
              `}
            >
              <td className="py-3 px-4 text-lava-yellow font-medium">
                {day.dateObj.toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "numeric",
                  month: "numeric",
                })}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-hell-blood rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-lava-red to-lava-orange transition-all duration-500"
                      style={{
                        width: `${Math.min((day.dryingSec / 86400) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-lava-yellow/80 text-sm">
                    {formatDuration(day.dryingSec)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-hell-blood rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-700 to-green-500 transition-all duration-500"
                      style={{
                        width: `${Math.min((day.inSec / 86400) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-lava-yellow/80 text-sm">
                    {formatDuration(day.inSec)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lava-red/20 text-lava-orange font-bold text-sm">
                  {day.count}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailyStats;
