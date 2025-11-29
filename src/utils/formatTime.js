// src/utils/formatTime.js

/**
 * Format timestamp thành chuỗi ngày giờ Việt Nam
 * @param {number} ts - Unix timestamp (giây)
 * @returns {string} Chuỗi định dạng ngày giờ
 */
export function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString("vi-VN");
}

/**
 * Format timestamp thành chỉ ngày
 * @param {number} ts - Unix timestamp (giây)
 * @returns {string} Chuỗi định dạng ngày
 */
export function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleDateString("vi-VN");
}

/**
 * Kiểm tra hai Date có cùng ngày không
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
 * Lấy key ngày theo định dạng YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
export function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
