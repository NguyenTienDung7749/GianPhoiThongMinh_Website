// src/hooks/useRealtimeStatus.js
import { useState, useEffect, useCallback } from "react";

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

// ESP32 offline detection timeout in milliseconds
const ESP32_OFFLINE_TIMEOUT_MS = 30000; // 30 seconds

// Grace period after component mount (don't show offline immediately)
const INITIAL_GRACE_PERIOD_MS = 15000; // 15 seconds

// Number of consecutive failed checks before marking as offline
const OFFLINE_CHECK_THRESHOLD = 3;

// Check interval in milliseconds
const STATUS_CHECK_INTERVAL_MS = 5000; // 5 seconds

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
    consecutiveFailures: 0, // Track consecutive failed checks for debouncing
    mountedAt: Date.now(), // Track when component mounted for grace period
  });

  // Update ESP32 status when sensor data is received
  const handleSensorUpdate = useCallback((sensorData) => {
    setSensor(sensorData);
    setEsp32Status((prev) => ({
      ...prev,
      online: true,
      lastUpdateAt: Date.now(),
      consecutiveFailures: 0, // Reset failure counter on successful update
    }));
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

  // Check ESP32 online status every 5 seconds (30s timeout + debounce for offline detection)
  useEffect(() => {
    if (isDemoMode) return;

    const checkInterval = setInterval(() => {
      setEsp32Status((prev) => {
        // If no data received yet, check if we're still in grace period
        if (!prev.lastUpdateAt) {
          const timeSinceMounted = Date.now() - prev.mountedAt;
          // During grace period, stay online
          if (timeSinceMounted <= INITIAL_GRACE_PERIOD_MS) {
            return { ...prev, online: true };
          }
          // After grace period, mark as offline
          return { ...prev, online: false };
        }

        const timeSinceLastUpdate = Date.now() - prev.lastUpdateAt;
        const isCurrentlyReceivingData = timeSinceLastUpdate <= ESP32_OFFLINE_TIMEOUT_MS;

        // If receiving data, reset failure counter and mark online
        if (isCurrentlyReceivingData) {
          return {
            ...prev,
            online: true,
            consecutiveFailures: 0,
          };
        }

        // Not receiving data - increment failure counter
        const newFailureCount = prev.consecutiveFailures + 1;

        // Only mark as offline after consecutive failures exceed threshold
        const shouldBeOffline = newFailureCount >= OFFLINE_CHECK_THRESHOLD;

        return {
          ...prev,
          online: !shouldBeOffline,
          consecutiveFailures: newFailureCount,
        };
      });
    }, STATUS_CHECK_INTERVAL_MS);

    return () => clearInterval(checkInterval);
  }, []);

  return { sensor, system, loading, isDemoMode, esp32Status };
}
