// src/hooks/usePing.js
import { useState, useEffect, useCallback } from "react";

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

// Ping interval: 25 seconds (between 20-30 as requested)
const PING_INTERVAL_MS = 25000;

/**
 * Hook to measure Web ↔ Firebase latency
 * @returns {Object} { latencyMs, latencyStatus }
 * - latencyMs: Round-trip time in milliseconds (null if not measured yet)
 * - latencyStatus: 'good' (<100ms), 'moderate' (100-300ms), 'poor' (>300ms)
 */
export function usePing() {
  const [latencyMs, setLatencyMs] = useState(isDemoMode ? 45 : null);
  const [latencyStatus, setLatencyStatus] = useState(isDemoMode ? "good" : null);

  // Determine latency status based on round-trip time
  const getLatencyStatus = useCallback((ms) => {
    if (ms === null) return null;
    if (ms < 100) return "good";
    if (ms <= 300) return "moderate";
    return "poor";
  }, []);

  // Ping function to measure latency
  const measurePing = useCallback(async () => {
    if (isDemoMode) {
      // In demo mode, simulate latency between 30-80ms
      const simulatedLatency = 30 + Math.floor(Math.random() * 50);
      setLatencyMs(simulatedLatency);
      setLatencyStatus(getLatencyStatus(simulatedLatency));
      return;
    }

    try {
      const [{ ref, set, serverTimestamp }, { db }] = await Promise.all([
        import("firebase/database"),
        import("../firebase/config"),
      ]);

      const start = performance.now();
      
      // Write to Firebase ping path
      await set(ref(db, "system/ping/webClient"), serverTimestamp());
      
      const end = performance.now();
      const roundTripMs = Math.round(end - start);
      
      setLatencyMs(roundTripMs);
      setLatencyStatus(getLatencyStatus(roundTripMs));
    } catch (error) {
      console.error("Ping measurement failed:", error);
      setLatencyMs(null);
      setLatencyStatus(null);
    }
  }, [getLatencyStatus]);

  // Initial ping and periodic measurement
  useEffect(() => {
    // Measure immediately on mount
    measurePing();

    // Set up periodic ping
    const pingInterval = setInterval(measurePing, PING_INTERVAL_MS);

    return () => clearInterval(pingInterval);
  }, [measurePing]);

  return { latencyMs, latencyStatus };
}
