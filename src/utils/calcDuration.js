// src/utils/calcDuration.js
import { isSameDay } from "./formatTime";

/**
 * Tính tổng thời gian phơi (OUT) trong danh sách log
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
 * Tính span của một ngày (giây)
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
 * Format duration từ giây sang chuỗi dễ đọc
 * @param {number} sec - Số giây
 * @returns {string} Chuỗi định dạng thời gian
 */
export function formatDuration(sec) {
  if (!sec || sec <= 0) return "0 giây";
  if (sec < 60) return `${sec} giây`;
  if (sec < 3600) return `${Math.floor(sec / 60)} phút`;
  return `${(sec / 3600).toFixed(1)} giờ`;
}

/**
 * Nhóm logs theo ngày
 * @param {Array} logs - Danh sách logs
 * @returns {Object} Object với key là YYYY-MM-DD
 */
export function groupLogsByDay(logs) {
  const grouped = {};
  
  logs.forEach((log) => {
    if (!log.ts) return;
    const d = new Date(log.ts * 1000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  });
  
  return grouped;
}
