// src/hooks/useRealtimeStatus.js
import { useState, useEffect, useCallback } from "react";

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

/**
 * Hook lấy trạng thái realtime từ Firebase
 * @returns {Object} { sensor, system, loading, isDemoMode, esp32Status }
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
  
  // ESP32 online/offline status tracking
  const [esp32Status, setEsp32Status] = useState({
    online: isDemoMode, // In demo mode, always show as online
    lastUpdateAt: isDemoMode ? Date.now() : null,
  });

  // Update ESP32 status when sensor data is received
  const handleSensorUpdate = useCallback((sensorData) => {
    setSensor(sensorData);
    setEsp32Status({
      online: true,
      lastUpdateAt: Date.now(),
    });
  }, []);

  useEffect(() => {
    // Demo mode - return mock data
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    // Real Firebase mode
    let isMounted = true;
    let unsubscribeSensor = null;
    let unsubscribeSystem = null;
    
    Promise.all([
      import("firebase/database"),
      import("../firebase/config")
    ]).then(([{ ref, onValue }, { db }]) => {
      if (!isMounted) return;
      
      // Lắng nghe sensor - use callback to track ESP32 updates
      const sensorRef = ref(db, "system/sensor");
      unsubscribeSensor = onValue(sensorRef, (snapshot) => {
        if (snapshot.exists()) {
          handleSensorUpdate(snapshot.val());
        }
        setLoading(false);
      });

      // Lắng nghe system (mode, state, command)
      const systemRef = ref(db, "system");
      unsubscribeSystem = onValue(systemRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          delete data.sensor;
          setSystem((prev) => ({ ...prev, ...data }));
        }
      });
    });

    return () => {
      isMounted = false;
      if (unsubscribeSensor) unsubscribeSensor();
      if (unsubscribeSystem) unsubscribeSystem();
    };
  }, [handleSensorUpdate]);

  // Check ESP32 online status every second (10s timeout for offline detection)
  useEffect(() => {
    if (isDemoMode) return;

    const checkInterval = setInterval(() => {
      setEsp32Status((prev) => {
        if (!prev.lastUpdateAt) {
          return { ...prev, online: false };
        }
        const timeSinceLastUpdate = Date.now() - prev.lastUpdateAt;
        const isOnline = timeSinceLastUpdate <= 10000; // 10 seconds timeout
        return { ...prev, online: isOnline };
      });
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  return { sensor, system, loading, isDemoMode, esp32Status };
}
