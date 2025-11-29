// src/hooks/useRealtimeStatus.js
import { useState, useEffect } from "react";

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

/**
 * Hook lấy trạng thái realtime từ Firebase
 * @returns {Object} { sensor, system, loading }
 */
export function useRealtimeStatus() {
  const [sensor, setSensor] = useState({
    temperature: isDemoMode ? 28 : 0,
    humidity: isDemoMode ? 65 : 0,
    rain: isDemoMode ? 0 : 0,
    light: isDemoMode ? 1 : 0,
  });
  
  const [system, setSystem] = useState({
    mode: "auto",
    command: "stop",
    state: isDemoMode ? "out" : "idle",
  });
  
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    // Demo mode - return mock data
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    // Real Firebase mode
    import("firebase/database").then(({ ref, onValue }) => {
      import("../firebase/config").then(({ db }) => {
        // Lắng nghe sensor
        const sensorRef = ref(db, "system/sensor");
        const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
          if (snapshot.exists()) {
            setSensor(snapshot.val());
          }
          setLoading(false);
        });

        // Lắng nghe system (mode, state, command)
        const systemRef = ref(db, "system");
        const unsubscribeSystem = onValue(systemRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            delete data.sensor;
            setSystem((prev) => ({ ...prev, ...data }));
          }
        });

        return () => {
          unsubscribeSensor();
          unsubscribeSystem();
        };
      });
    });
  }, []);

  return { sensor, system, loading, isDemoMode };
}
