// src/hooks/useCommandTracking.js
import { useState, useCallback, useEffect, useRef, useMemo } from "react";

// Command timeout: 8 seconds
const COMMAND_TIMEOUT_MS = 8000;

/**
 * Hook to track command execution and detect timeouts
 * @param {Object} system - Current system state from useRealtimeStatus
 * @param {Array} logs - Recent logs from useHistory
 * @returns {Object} { pendingCommand, sendTrackedCommand, commandWarning, clearWarning }
 */
export function useCommandTracking(system, logs = []) {
  const [pendingCommand, setPendingCommand] = useState(null);
  const [commandWarning, setCommandWarning] = useState(null);
  const timeoutRef = useRef(null);
  const previousStateRef = useRef(system?.state);
  const commandConfirmedRef = useRef(false);

  // Command to expected state mapping (memoized)
  const commandToExpectedState = useMemo(() => ({
    out: "out",
    in: "in",
    stop: null, // Stop doesn't change state to a specific value
  }), []);

  // Command to log reason mapping (memoized)
  const commandToReason = useMemo(() => ({
    out: "manual_out",
    in: "manual_in",
    stop: "manual_stop",
  }), []);

  // Clear warning
  const clearWarning = useCallback(() => {
    setCommandWarning(null);
  }, []);

  // Clear pending command and timeout
  const clearPendingCommand = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPendingCommand(null);
    commandConfirmedRef.current = false;
  }, []);

  // Send a tracked command
  const sendTrackedCommand = useCallback((commandType, sendCommandFn) => {
    // Clear any previous pending command
    clearPendingCommand();
    clearWarning();

    // Store pending command
    const newPendingCommand = {
      type: commandType,
      sentAt: Date.now(),
    };
    setPendingCommand(newPendingCommand);

    // Set timeout for command response
    timeoutRef.current = setTimeout(() => {
      // Command timed out - ESP32 didn't respond
      const commandLabels = {
        out: "PHƠI RA",
        in: "THU VÀO",
        stop: "DỪNG",
      };
      setCommandWarning({
        message: `⚠️ ESP32 không phản hồi lệnh ${commandLabels[commandType]}. Vui lòng kiểm tra kết nối hoặc thiết bị.`,
        commandType,
      });
      setPendingCommand(null);
    }, COMMAND_TIMEOUT_MS);

    // Execute the actual command
    sendCommandFn(commandType);
  }, [clearPendingCommand, clearWarning]);

  // Check if command is confirmed by state change or logs
  // Using refs and useEffect to avoid setState in effect body
  useEffect(() => {
    if (!pendingCommand) {
      previousStateRef.current = system?.state;
      return;
    }

    const expectedState = commandToExpectedState[pendingCommand.type];
    let isConfirmed = false;
    
    // For stop command, just check if state changed
    if (pendingCommand.type === "stop") {
      if (system?.state !== previousStateRef.current) {
        isConfirmed = true;
      }
    } else if (expectedState && system?.state === expectedState) {
      // Command confirmed - state matches expected
      isConfirmed = true;
    }

    // Check logs for confirmation
    if (!isConfirmed && logs.length > 0) {
      const expectedReason = commandToReason[pendingCommand.type];
      const recentLogs = logs.slice(-5);
      
      isConfirmed = recentLogs.some((log) => {
        const logTime = log.ts ? log.ts * 1000 : 0;
        return log.reason === expectedReason && logTime >= pendingCommand.sentAt - 1000;
      });
    }

    // Mark as confirmed using ref to avoid re-render loop
    if (isConfirmed && !commandConfirmedRef.current) {
      commandConfirmedRef.current = true;
      // Use setTimeout(0) to defer state update and avoid cascading renders
      setTimeout(() => {
        clearPendingCommand();
      }, 0);
    }
    
    previousStateRef.current = system?.state;
  }, [system?.state, logs, pendingCommand, commandToExpectedState, commandToReason, clearPendingCommand]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    pendingCommand,
    sendTrackedCommand,
    commandWarning,
    clearWarning,
  };
}
