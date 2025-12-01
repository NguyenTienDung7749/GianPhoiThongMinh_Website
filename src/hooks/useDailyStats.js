// src/hooks/useDailyStats.js
import { useMemo } from "react";
import { 
  getLast7DaysRange, 
  findStateBeforeTimestamp, 
  calcDryingTimeForDay, 
  calcRetractTimeForDay,
  groupLogsByDayGMT7
} from "../utils/calcDuration";

/**
 * Hook tính thống kê theo ngày với xử lý đúng GMT+7 và day boundaries
 * @param {Array} logs - Danh sách logs
 * @returns {Object} { todayStats, dailyStats, weeklyTotal }
 */
export function useDailyStats(logs) {
  const stats = useMemo(() => {
    // Sort logs by timestamp ascending for proper state tracking
    const sortedLogs = [...logs].sort((a, b) => (a.ts || 0) - (b.ts || 0));
    
    // Group logs by day using GMT+7
    const groupedByDay = groupLogsByDayGMT7(sortedLogs);
    
    // Get the exact 7-day range
    const last7Days = getLast7DaysRange();
    
    // Calculate stats for each of the 7 days
    const dailyStats = last7Days.map((day, index) => {
      const { key, dayStartSec, dayEndSec, dateObj } = day;
      
      // Get logs for this specific day
      const dayLogs = groupedByDay[key] || [];
      
      // Find the initial state at the start of this day
      // (the state from the last log before this day started)
      const initialState = findStateBeforeTimestamp(sortedLogs, dayStartSec);
      
      // Calculate drying and retract time with proper boundaries
      const dryingSec = calcDryingTimeForDay(dayLogs, dayStartSec, dayEndSec, initialState);
      const inSec = calcRetractTimeForDay(dayLogs, dayStartSec, dayEndSec, initialState);
      
      return {
        key,
        dateObj,
        dayStartSec,
        dayEndSec,
        dryingSec,
        inSec,
        count: dayLogs.length,
        isToday: index === 0,
      };
    });
    
    // Today's stats is the first entry
    const todayStats = {
      dryingSec: dailyStats[0]?.dryingSec || 0,
      inSec: dailyStats[0]?.inSec || 0,
      count: dailyStats[0]?.count || 0,
    };
    
    // Calculate weekly totals
    const weeklyTotal = {
      dryingSec: dailyStats.reduce((sum, d) => sum + d.dryingSec, 0),
      inSec: dailyStats.reduce((sum, d) => sum + d.inSec, 0),
      count: dailyStats.reduce((sum, d) => sum + d.count, 0),
    };
    
    return { todayStats, dailyStats, weeklyTotal };
  }, [logs]);
  
  return stats;
}
