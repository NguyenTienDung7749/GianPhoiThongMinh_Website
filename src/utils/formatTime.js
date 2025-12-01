// src/utils/formatTime.js

/**
 * GMT+7 offset in milliseconds (7 hours * 60 minutes * 60 seconds * 1000 ms)
 * ESP32 firmware uses GMT+7 for Vietnam timezone
 */
const GMT7_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Get Date object adjusted to GMT+7 timezone
 * @param {Date|number} dateOrTs - Date object or Unix timestamp (seconds)
 * @returns {Date} Date object in GMT+7
 */
export function getDateInGMT7(dateOrTs) {
  const ms = typeof dateOrTs === "number" ? dateOrTs * 1000 : dateOrTs.getTime();
  // Create a new date that represents the GMT+7 time
  return new Date(ms + GMT7_OFFSET_MS);
}

/**
 * Format timestamp thành chuỗi ngày giờ Việt Nam (GMT+7)
 * @param {number} ts - Unix timestamp (giây)
 * @returns {string} Chuỗi định dạng ngày giờ
 */
export function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

/**
 * Format timestamp thành chỉ ngày (GMT+7)
 * @param {number} ts - Unix timestamp (giây)
 * @returns {string} Chuỗi định dạng ngày
 */
export function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

/**
 * Format timestamp to time only (HH:mm) in GMT+7
 * @param {number} ts - Unix timestamp (seconds)
 * @returns {string} Time string in format "HH:mm"
 */
export function formatTimeOnly(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Kiểm tra hai Date có cùng ngày không (legacy - uses browser timezone)
 * @param {Date} d1 
 * @param {Date} d2 
 * @returns {boolean}
 */
export function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Kiểm tra hai timestamp có cùng ngày không theo GMT+7
 * @param {number} ts1 - Unix timestamp (seconds)
 * @param {number} ts2 - Unix timestamp (seconds)
 * @returns {boolean}
 */
export function isSameDayGMT7(ts1, ts2) {
  const d1 = getDateInGMT7(ts1);
  const d2 = getDateInGMT7(ts2);
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

/**
 * Lấy timestamp bắt đầu ngày (00:00:00) theo GMT+7
 * @param {Date|number} dateOrTs - Date object or Unix timestamp (seconds)
 * @returns {number} Unix timestamp (seconds) of start of day in GMT+7
 */
export function getStartOfDayGMT7(dateOrTs) {
  const d = getDateInGMT7(dateOrTs);
  // Create date at 00:00:00 UTC (which represents 00:00:00 GMT+7)
  const startUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
  // Subtract GMT+7 offset to get actual Unix timestamp
  return Math.floor((startUTC - GMT7_OFFSET_MS) / 1000);
}

/**
 * Lấy timestamp kết thúc ngày (23:59:59) theo GMT+7
 * @param {Date|number} dateOrTs - Date object or Unix timestamp (seconds)
 * @returns {number} Unix timestamp (seconds) of end of day in GMT+7
 */
export function getEndOfDayGMT7(dateOrTs) {
  const d = getDateInGMT7(dateOrTs);
  // Create date at 23:59:59 UTC (which represents 23:59:59 GMT+7)
  const endUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999);
  // Subtract GMT+7 offset to get actual Unix timestamp
  return Math.floor((endUTC - GMT7_OFFSET_MS) / 1000);
}

/**
 * Lấy key ngày theo định dạng YYYY-MM-DD (legacy - uses browser timezone)
 * @param {Date} date 
 * @returns {string}
 */
export function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Lấy key ngày theo định dạng YYYY-MM-DD từ timestamp theo GMT+7
 * @param {number} ts - Unix timestamp (seconds)
 * @returns {string} Date key in format "YYYY-MM-DD"
 */
export function getDateKeyFromTimestamp(ts) {
  const d = getDateInGMT7(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Lấy label ngày (Hôm nay, Hôm qua, hoặc ngày cụ thể)
 * @param {number} ts - Unix timestamp (seconds)
 * @returns {string} Label for the day
 */
export function getDayLabel(ts) {
  const nowSec = Math.floor(Date.now() / 1000);
  const todayStart = getStartOfDayGMT7(nowSec);
  const yesterdayStart = todayStart - 86400; // 24 hours in seconds
  const dayStart = getStartOfDayGMT7(ts);
  
  if (dayStart === todayStart) {
    return "Hôm nay";
  } else if (dayStart === yesterdayStart) {
    return "Hôm qua";
  } else {
    return formatDayName(ts);
  }
}

/**
 * Format ngày dạng "T2, 01/12" (thứ, ngày/tháng) theo GMT+7
 * @param {number} ts - Unix timestamp (seconds)
 * @returns {string} Formatted day name
 */
export function formatDayName(ts) {
  const d = new Date(ts * 1000);
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  
  // Get day of week in GMT+7
  const dayOfWeek = d.toLocaleDateString("en-US", { timeZone: "Asia/Ho_Chi_Minh", weekday: "short" });
  const dayNum = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayOfWeek.slice(0, 3));
  const weekday = weekdays[dayNum >= 0 ? dayNum : d.getDay()];
  
  // Get day and month in GMT+7
  const day = d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit" });
  const month = d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", month: "2-digit" });
  
  return `${weekday}, ${day}/${month}`;
}

/**
 * Format mode thành tiếng Việt
 * @param {string} mode 
 * @returns {string}
 */
export function formatMode(mode) {
  return mode === "manual" ? "Thủ công" : "Tự động";
}

/**
 * Format state thành tiếng Việt
 * @param {string} state 
 * @returns {string}
 */
export function formatState(state) {
  switch (state) {
    case "out":
      return "Phơi";
    case "in":
      return "Thu";
    default:
      return "Chờ";
  }
}

/**
 * Format reason thành tiếng Việt
 * @param {string} reason 
 * @returns {string}
 */
export function formatReason(reason) {
  switch (reason) {
    case "manual_in":
      return "Thu vào thủ công";
    case "manual_out":
      return "Phơi ra thủ công";
    case "auto_rain":
      return "Trời mưa";
    case "auto_rain_cleared":
      return "Trời ngừng mưa";
    case "auto_bright":
      return "Trời sáng";
    case "auto_dark":
      return "Trời tối";
    default:
      return reason || "-";
  }
}
