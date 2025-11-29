// src/hooks/useHistory.js
import { useState, useEffect } from "react";

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

// Mock data for demo mode
const generateMockLogs = () => {
  const logs = [];
  const now = Math.floor(Date.now() / 1000);
  const states = ["in", "out"];
  const modes = ["auto", "manual"];
  const reasons = ["auto_bright", "auto_dark", "auto_rain", "auto_rain_cleared", "manual_in", "manual_out"];
  
  for (let i = 0; i < 50; i++) {
    const ts = now - (i * 3600) - Math.floor(Math.random() * 1800);
    logs.push({
      id: `log_${i}`,
      ts,
      state: states[i % 2],
      mode: modes[Math.floor(Math.random() * 2)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
    });
  }
  
  return logs.sort((a, b) => a.ts - b.ts);
};

/**
 * Hook lấy lịch sử logs từ Firebase
 * @param {number} limit - Số lượng logs tối đa
 * @returns {Object} { logs, loading }
 */
export function useHistory(limit = 500) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    // Demo mode - return mock data
    if (isDemoMode) {
      setLogs(generateMockLogs());
      setLoading(false);
      return;
    }

    // Real Firebase mode
    import("firebase/database").then(({ ref, onValue, query, orderByKey, limitToLast }) => {
      import("../firebase/config").then(({ db }) => {
        const logsRef = query(ref(db, "logs"), orderByKey(), limitToLast(limit));
        
        const unsubscribe = onValue(logsRef, (snapshot) => {
          if (!snapshot.exists()) {
            setLogs([]);
            setLoading(false);
            return;
          }
          
          const obj = snapshot.val();
          const arr = Object.keys(obj)
            .map((k) => ({ id: k, ...obj[k] }))
            .sort((a, b) => (a.ts || 0) - (b.ts || 0));
          
          setLogs(arr);
          setLoading(false);
        });

        return () => unsubscribe();
      });
    });
  }, [limit]);

  return { logs, loading };
}
