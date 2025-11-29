// src/firebase/rtdb.js
import { ref, onValue, set, query, orderByKey, limitToLast } from "firebase/database";
import { db } from "./config";

/**
 * Lắng nghe trạng thái sensor realtime
 * @param {function} callback - callback với dữ liệu sensor
 * @returns {function} unsubscribe
 */
export function listenStatus(callback) {
  const sensorRef = ref(db, "system/sensor");
  const systemRef = ref(db, "system");
  
  const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(prev => ({ ...prev, sensor: snapshot.val() }));
    }
  });
  
  const unsubscribeSystem = onValue(systemRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      // eslint-disable-next-line no-unused-vars
      const { sensor, ...rest } = data;
      callback(prev => ({ ...prev, ...rest }));
    }
  });
  
  return () => {
    unsubscribeSensor();
    unsubscribeSystem();
  };
}

/**
 * Lắng nghe lịch sử realtime
 * @param {function} callback - callback với mảng logs
 * @param {number} limit - số lượng logs tối đa
 * @returns {function} unsubscribe
 */
export function listenHistory(callback, limit = 500) {
  const logsRef = query(ref(db, "logs"), orderByKey(), limitToLast(limit));
  
  return onValue(logsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const obj = snapshot.val();
    const arr = Object.keys(obj)
      .map((k) => ({ id: k, ...obj[k] }))
      .sort((a, b) => (a.ts || 0) - (b.ts || 0));
    
    callback(arr);
  });
}

/**
 * Gửi lệnh điều khiển giàn phơi
 * @param {string} cmd - "in" | "out" | "stop"
 */
export function sendCommand(cmd) {
  return set(ref(db, "system/command"), cmd);
}

/**
 * Đổi chế độ hoạt động
 * @param {string} mode - "auto" | "manual"
 */
export function setMode(mode) {
  return set(ref(db, "system/mode"), mode);
}
