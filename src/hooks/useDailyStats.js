// src/hooks/useDailyStats.js
import { useMemo } from "react";
import { calcDryingTime, calcRetractTime, groupLogsByDay } from "../utils/calcDuration";
import { isSameDay } from "../utils/formatTime";

/**
 * Hook tính thống kê theo ngày
 * @param {Array} logs - Danh sách logs
 * @returns {Object} { todayStats, dailyStats }
 */
export function useDailyStats(logs) {
  const stats = useMemo(() => {
    const now = new Date();
    const nowSec = Math.floor(now.getTime() / 1000);
    
    // Lọc logs hôm nay
    const logsToday = logs.filter((log) => {
      if (!log.ts) return false;
      const d = new Date(log.ts * 1000);
      return isSameDay(d, now);
    });
    
    // Thống kê hôm nay - tính đúng từ logs
    const dryingTodaySec = calcDryingTime(logsToday, nowSec);
    const inTodaySec = calcRetractTime(logsToday, nowSec);
    
    const todayStats = {
      dryingSec: dryingTodaySec,
      inSec: inTodaySec,
      count: logsToday.length,
    };
    
    // Nhóm logs theo ngày
    const groupedByDay = groupLogsByDay(logs);
    
    // Tính thống kê từng ngày
    const dailyStats = Object.keys(groupedByDay)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((key) => {
        const list = groupedByDay[key];
        if (!list.length) return null;
        
        const d = new Date(list[0].ts * 1000);
        const drySec = calcDryingTime(list, nowSec);
        const inSec = calcRetractTime(list, nowSec);
        
        return {
          key,
          dateObj: d,
          dryingSec: drySec,
          inSec,
          count: list.length,
        };
      })
      .filter(Boolean)
      .slice(0, 7);
    
    return { todayStats, dailyStats };
  }, [logs]);
  
  return stats;
}
