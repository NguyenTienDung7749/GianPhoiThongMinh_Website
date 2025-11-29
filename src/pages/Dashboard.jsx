// src/pages/Dashboard.jsx
import { useState } from "react";
import { useRealtimeStatus } from "../hooks/useRealtimeStatus";
import { useHistory } from "../hooks/useHistory";
import { useDailyStats } from "../hooks/useDailyStats";
import { formatDuration } from "../utils/calcDuration";
import { formatMode, formatState } from "../utils/formatTime";

import StatusCard from "../components/StatusCard";
import FireButton from "../components/FireButton";
import LoadingHellfire from "../components/LoadingHellfire";

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

export function Dashboard() {
  const { sensor, system: initialSystem, loading } = useRealtimeStatus();
  const { logs } = useHistory();
  const { todayStats } = useDailyStats(logs);
  
  // Local state for demo mode
  const [demoSystem, setDemoSystem] = useState(initialSystem);
  const system = isDemoMode ? demoSystem : initialSystem;

  if (loading) {
    return <LoadingHellfire />;
  }

  const isManual = system.mode === "manual";
  const lightText = sensor.light ? "Sáng" : "Tối";
  const rainText = sensor.rain ? "Có mưa" : "Không mưa";

  const handleToggleMode = async () => {
    const newMode = system.mode === "auto" ? "manual" : "auto";
    if (isDemoMode) {
      setDemoSystem(prev => ({ ...prev, mode: newMode }));
    } else {
      const { setMode } = await import("../firebase/rtdb");
      setMode(newMode);
    }
  };

  const handleCommand = async (cmd) => {
    if (!isManual) return;
    if (isDemoMode) {
      const stateMap = { out: "out", in: "in", stop: "idle" };
      setDemoSystem(prev => ({ ...prev, command: cmd, state: stateMap[cmd] || prev.state }));
    } else {
      const { sendCommand } = await import("../firebase/rtdb");
      sendCommand(cmd);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lava-orange animate-glow mb-2">
          🔥 Bảng Điều Khiển
        </h1>
        <p className="text-lava-yellow/60">
          Giám sát và điều khiển giàn phơi thông minh
        </p>
      </div>

      {/* Sensor Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">📡</span> Thông Tin Cảm Biến
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            icon="🌡️"
            label="Nhiệt độ"
            value={sensor.temperature}
            unit="°C"
            variant="default"
          />
          <StatusCard
            icon="💧"
            label="Độ ẩm"
            value={sensor.humidity}
            unit="%"
            variant="default"
          />
          <StatusCard
            icon="🌞"
            label="Ánh sáng"
            value={lightText}
            variant={sensor.light ? "success" : "default"}
          />
          <StatusCard
            icon="🌧️"
            label="Mưa"
            value={rainText}
            variant={sensor.rain ? "warning" : "success"}
          />
        </div>
      </section>

      {/* System Control */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">⚙️</span> Điều Khiển Hệ Thống
        </h2>
        
        <div className="bg-gradient-to-br from-hell-blood to-hell-black rounded-xl border-2 border-lava-red/30 p-6 shadow-lava">
          {/* Status badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              ${system.mode === "auto" 
                ? "bg-lava-yellow/20 text-lava-yellow border border-lava-yellow/30" 
                : "bg-lava-orange/20 text-lava-orange border border-lava-orange/30"
              }
            `}>
              ⚙️ Chế độ: {formatMode(system.mode)}
            </span>
            
            <span className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              ${system.state === "out"
                ? "bg-lava-red/20 text-lava-red border border-lava-red/30"
                : system.state === "in"
                ? "bg-green-900/30 text-green-400 border border-green-700/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700/30"
              }
            `}>
              📍 Trạng thái: {formatState(system.state)}
            </span>
          </div>

          {/* Control buttons */}
          <div className="flex flex-wrap gap-4">
            <FireButton
              onClick={() => handleCommand("out")}
              disabled={!isManual}
              variant="primary"
              icon="🔥"
            >
              Phơi Ra
            </FireButton>

            <FireButton
              onClick={() => handleCommand("in")}
              disabled={!isManual}
              variant="secondary"
              icon="🌋"
            >
              Thu Vào
            </FireButton>

            <FireButton
              onClick={() => handleCommand("stop")}
              disabled={!isManual}
              variant="danger"
              icon="⛔"
            >
              Dừng
            </FireButton>

            <div className="flex-grow"></div>

            <FireButton
              onClick={handleToggleMode}
              variant="mode"
              icon={system.mode === "auto" ? "🎮" : "🤖"}
            >
              {system.mode === "auto" ? "Chuyển Thủ Công" : "Chuyển Tự Động"}
            </FireButton>
          </div>

          {/* Manual mode hint */}
          {!isManual && (
            <p className="mt-4 text-sm text-lava-orange/60 italic">
              💡 Chuyển sang chế độ Thủ công để điều khiển giàn phơi
            </p>
          )}
        </div>
      </section>

      {/* Today Stats */}
      <section>
        <h2 className="text-xl font-semibold text-lava-yellow mb-4 flex items-center gap-2">
          <span className="text-2xl">⏱️</span> Thống Kê Hôm Nay
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-lava-red/20 to-hell-blood rounded-xl border border-lava-red/30 p-5 shadow-lava">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">☀️</span>
              <span className="text-lava-orange/80 text-sm uppercase tracking-wider">Thời gian phơi</span>
            </div>
            <p className="text-2xl font-bold text-lava-yellow">
              {formatDuration(todayStats.dryingSec)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-hell-blood rounded-xl border border-green-700/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏠</span>
              <span className="text-green-400/80 text-sm uppercase tracking-wider">Thời gian thu</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatDuration(todayStats.inSec)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-lava-orange/20 to-hell-blood rounded-xl border border-lava-orange/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔄</span>
              <span className="text-lava-orange/80 text-sm uppercase tracking-wider">Số lần chuyển</span>
            </div>
            <p className="text-2xl font-bold text-lava-orange">
              {todayStats.count} lần
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
