// src/utils/calcDuration.js
import { 
  isSameDay, 
  getDateKey, 
  getStartOfDayGMT7, 
  getEndOfDayGMT7,
  getDateKeyFromTimestamp
} from "./formatTime";

/**
 * Get list of last 7 days with start/end timestamps in GMT+7
 * @returns {Array} Array of { key, dayStartSec, dayEndSec, dateObj }
 */
export function getLast7DaysRange() {
  const nowSec = Math.floor(Date.now() / 1000);
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    // Calculate the start of day for (today - i days)
    const dayOffsetSec = i * 86400; // 86400 seconds in a day
    const targetDaySec = nowSec - dayOffsetSec;
    const dayStartSec = getStartOfDayGMT7(targetDaySec);
    const dayEndSec = getEndOfDayGMT7(targetDaySec);
    
    // For today, end at current time instead of 23:59:59
    const actualEndSec = i === 0 ? nowSec : dayEndSec;
    
    days.push({
      key: getDateKeyFromTimestamp(dayStartSec),
      dayStartSec,
      dayEndSec: actualEndSec,
      dateObj: new Date(dayStartSec * 1000),
    });
  }
  
  return days;
}

/**
 * Find the state of the system before a given timestamp
 * @param {Array} allLogs - All logs sorted by timestamp ascending
 * @param {number} beforeTs - Timestamp to find state before
 * @returns {string|null} "in", "out", or null if no logs before timestamp
 */
export function findStateBeforeTimestamp(allLogs, beforeTs) {
  if (!allLogs || allLogs.length === 0) return null;
  
  // Find the last log before beforeTs
  let lastState = null;
  for (const log of allLogs) {
    if (!log.ts) continue;
    if (log.ts >= beforeTs) break;
    lastState = log.state;
  }
  
  return lastState;
}

/**
 * Calculate drying time (OUT state) for a specific day with proper boundaries
 * @param {Array} dayLogs - Logs for this specific day, sorted by ts ascending
 * @param {number} dayStartSec - Start of day timestamp (seconds)
 * @param {number} dayEndSec - End of day timestamp (seconds) - can be current time for today
 * @param {string|null} initialState - State at the start of the day (from previous day's last log)
 * @returns {number} Total drying time in seconds
 */
export function calcDryingTimeForDay(dayLogs, dayStartSec, dayEndSec, initialState) {
  if (!dayLogs || dayLogs.length === 0) {
    // No logs for this day - check if initial state was "out"
    if (initialState === "out") {
      return Math.max(0, dayEndSec - dayStartSec);
    }
    return 0;
  }
  
  let total = 0;
  let currentState = initialState;
  let lastTransitionTs = dayStartSec;
  
  // If day started with "out" state, we need to count from dayStartSec
  // until the first "in" log
  
  for (const log of dayLogs) {
    if (!log.ts || !log.state) continue;
    
    // Clamp timestamp to day boundaries
    const ts = Math.max(dayStartSec, Math.min(dayEndSec, log.ts));
    
    if (log.state === "in" && currentState === "out") {
      // Transitioning from out to in - count the drying time
      total += Math.max(0, ts - lastTransitionTs);
    }
    
    currentState = log.state;
    lastTransitionTs = ts;
  }
  
  // If still in "out" state at end of day, add remaining time
  if (currentState === "out") {
    total += Math.max(0, dayEndSec - lastTransitionTs);
  }
  
  return total;
}

/**
 * Calculate retract time (IN state) for a specific day with proper boundaries
 * @param {Array} dayLogs - Logs for this specific day, sorted by ts ascending
 * @param {number} dayStartSec - Start of day timestamp (seconds)
 * @param {number} dayEndSec - End of day timestamp (seconds) - can be current time for today
 * @param {string|null} initialState - State at the start of the day (from previous day's last log)
 * @returns {number} Total retract time in seconds
 */
export function calcRetractTimeForDay(dayLogs, dayStartSec, dayEndSec, initialState) {
  if (!dayLogs || dayLogs.length === 0) {
    // No logs for this day - check if initial state was "in"
    if (initialState === "in") {
      return Math.max(0, dayEndSec - dayStartSec);
    }
    return 0;
  }
  
  let total = 0;
  let currentState = initialState;
  let lastTransitionTs = dayStartSec;
  
  for (const log of dayLogs) {
    if (!log.ts || !log.state) continue;
    
    // Clamp timestamp to day boundaries
    const ts = Math.max(dayStartSec, Math.min(dayEndSec, log.ts));
    
    if (log.state === "out" && currentState === "in") {
      // Transitioning from in to out - count the retract time
      total += Math.max(0, ts - lastTransitionTs);
    }
    
    currentState = log.state;
    lastTransitionTs = ts;
  }
  
  // If still in "in" state at end of day, add remaining time
  if (currentState === "in") {
    total += Math.max(0, dayEndSec - lastTransitionTs);
  }
  
  return total;
}

/**
 * Tính tổng thời gian phơi (OUT) trong danh sách log (LEGACY - for backward compatibility)
 * WARNING: This function has bugs for past days - use calcDryingTimeForDay instead
 * @param {Array} logList - Danh sách log
 * @param {number} nowSec - Thời gian hiện tại (giây)
 * @returns {number} Tổng thời gian phơi (giây)
 */
export function calcDryingTime(logList, nowSec) {
  if (!logList || logList.length === 0) return 0;
  
  let total = 0;
  let lastOut = null;
  
  logList.forEach((log) => {
    if (!log.ts) return;
    if (log.state === "out") {
      lastOut = log.ts;
    } else if (log.state === "in" && lastOut) {
      total += log.ts - lastOut;
      lastOut = null;
    }
  });
  
  // Nếu hiện tại vẫn đang OUT thì cộng thêm
  if (lastOut) {
    total += nowSec - lastOut;
  }
  
  return total;
}

/**
 * Tính tổng thời gian thu (IN) trong danh sách log (LEGACY - for backward compatibility)
 * WARNING: This function has bugs for past days - use calcRetractTimeForDay instead
 * @param {Array} logList - Danh sách log
 * @param {number} nowSec - Thời gian hiện tại (giây)
 * @returns {number} Tổng thời gian thu (giây)
 */
export function calcRetractTime(logList, nowSec) {
  if (!logList || logList.length === 0) return 0;
  
  let total = 0;
  let lastIn = null;
  
  logList.forEach((log) => {
    if (!log.ts) return;
    if (log.state === "in") {
      lastIn = log.ts;
    } else if (log.state === "out" && lastIn) {
      total += log.ts - lastIn;
      lastIn = null;
    }
  });
  
  // Nếu hiện tại vẫn đang IN thì cộng thêm
  if (lastIn) {
    total += nowSec - lastIn;
  }
  
  return total;
}

/**
 * Tính span của một ngày (giây) - LEGACY
 * @param {Date} dateObj - Ngày cần tính
 * @param {Date} now - Thời điểm hiện tại
 * @returns {number} Số giây trong ngày
 */
export function getDaySpanSec(dateObj, now) {
  const start = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );
  const next = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate() + 1
  );
  
  let end = next;
  if (isSameDay(dateObj, now) && now < next) {
    end = now;
  }
  
  const startSec = Math.floor(start.getTime() / 1000);
  const endSec = Math.floor(end.getTime() / 1000);
  return Math.max(endSec - startSec, 0);
}

/**
 * Format duration từ giây sang chuỗi dễ đọc (improved version)
 * @param {number} sec - Số giây
 * @returns {string} Chuỗi định dạng thời gian
 */
export function formatDuration(sec) {
  if (!sec || sec <= 0) return "0 phút";
  
  if (sec < 60) {
    return `${Math.round(sec)} giây`;
  }
  
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes} phút`;
  }
  
  if (minutes === 0) {
    return `${hours} giờ`;
  }
  
  return `${hours}h ${minutes}m`;
}

/**
 * Nhóm logs theo ngày (LEGACY)
 * @param {Array} logs - Danh sách logs
 * @returns {Object} Object với key là YYYY-MM-DD
 */
export function groupLogsByDay(logs) {
  const grouped = {};
  
  logs.forEach((log) => {
    if (!log.ts) return;
    const d = new Date(log.ts * 1000);
    const key = getDateKey(d);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  });
  
  return grouped;
}

/**
 * Nhóm logs theo ngày với GMT+7 timezone
 * @param {Array} logs - Danh sách logs
 * @returns {Object} Object với key là YYYY-MM-DD theo GMT+7
 */
export function groupLogsByDayGMT7(logs) {
  const grouped = {};
  
  logs.forEach((log) => {
    if (!log.ts) return;
    const key = getDateKeyFromTimestamp(log.ts);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  });
  
  // Sort logs within each day by timestamp ascending
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => a.ts - b.ts);
  });
  
  return grouped;
}
