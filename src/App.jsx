import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  set,
  query,
  orderByKey,
  limitToLast,
} from "firebase/database";
import { db } from "./firebase";
import "./assets/App.css";

function App() {
  const [sensor, setSensor] = useState({
    temperature: 0,
    humidity: 0,
    rain: 0, // 0/1
    light: 0, // 0/1
  });

  const [system, setSystem] = useState({
    mode: "auto", // "auto" | "manual"
    command: "stop",
    state: "idle", // "in" | "out" | "idle"
  });

  const [logs, setLogs] = useState([]); // {id, state, mode, ts, reason}

  // ========= LẤY DỮ LIỆU REALTIME =========
  useEffect(() => {
    // --- system/sensor ---
    const sensorRef = ref(db, "system/sensor");
    onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensor(snapshot.val());
      }
    });

    // --- system (mode, state, command) ---
    const systemRef = ref(db, "system");
    onValue(systemRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        delete data.sensor;
        setSystem((prev) => ({ ...prev, ...data }));
      }
    });

    // --- logs (lấy khá nhiều để sau này có nhiều ngày) ---
    const logsRef = query(ref(db, "logs"), orderByKey(), limitToLast(500));

    onValue(logsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLogs([]);
        return;
      }
      const obj = snapshot.val();
      const arr = Object.keys(obj)
        .map((k) => ({ id: k, ...obj[k] }))
        // sort tăng dần theo thời gian
        .sort((a, b) => (a.ts || 0) - (b.ts || 0));

      setLogs(arr);
    });
  }, []);

  // ========= ĐỔI TEXT CHO SENSOR =========
  const lightText = sensor.light ? "Sáng" : "Tối";
  const rainText = sensor.rain ? "Có mưa" : "Không mưa";

  // ========= ĐỔI MODE =========
  const toggleMode = () => {
    const newMode = system.mode === "auto" ? "manual" : "auto";
    set(ref(db, "system/mode"), newMode);
  };

  const isManual = system.mode === "manual";

  // ========= GỬI LỆNH THỦ CÔNG =========
  const changeCommand = (cmd) => {
    if (!isManual) return; // Auto thì bỏ qua
    set(ref(db, "system/command"), cmd);
  };

  // ========= XỬ LÝ LOG / THỜI GIAN =========

  // format thời gian
  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts * 1000).toLocaleString();
  };

  // So sánh cùng ngày
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const today = new Date();

  // Lọc log hôm nay
  const logsToday = logs.filter((log) => {
    if (!log.ts) return false;
    const d = new Date(log.ts * 1000);
    return isSameDay(d, today);
  });

  // Tính tổng thời gian đang OUT (phơi) trong 1 danh sách log (giây)
  const calcDryingTime = (logList) => {
    if (!logList || logList.length === 0) return 0;

    let total = 0;
    let lastOut = null;
    const nowSec = Math.floor(Date.now() / 1000);

    logList.forEach((log) => {
      if (!log.ts) return;
      if (log.state === "out") {
        lastOut = log.ts; // bắt đầu phơi
      } else if (log.state === "in" && lastOut) {
        // kết thúc phơi
        total += log.ts - lastOut;
        lastOut = null;
      }
    });

    // nếu hiện tại vẫn đang OUT thì cộng thêm
    if (lastOut) {
      total += nowSec - lastOut;
    }

    return total; // giây
  };

  // Định dạng duration: 75s -> "1 phút", 4000s -> "1.1 giờ"
  const formatDuration = (sec) => {
    if (!sec || sec <= 0) return "0 giây";
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec / 60)} phút`;
    return `${(sec / 3600).toFixed(1)} giờ`;
  };

  // span 1 ngày (đặc biệt: hôm nay thì chỉ tính đến hiện tại)
  const getDaySpanSec = (dateObj) => {
    const start = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate()
    );
    const next = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate() + 1
    );

    let end = next;
    const now = new Date();
    if (isSameDay(dateObj, now) && now < next) {
      end = now; // hôm nay: tới thời điểm hiện tại
    }

    const startSec = Math.floor(start.getTime() / 1000);
    const endSec = Math.floor(end.getTime() / 1000);
    return Math.max(endSec - startSec, 0);
  };

  // ===== THỐNG KÊ HÔM NAY =====
  const dryingTodaySec = calcDryingTime(logsToday);
  const todaySpanSec = getDaySpanSec(today);
  const inTodaySec = Math.max(todaySpanSec - dryingTodaySec, 0);

  // ===== THỐNG KÊ THEO TỪNG NGÀY TỪ LOGS =====
  const groupedByDay = {};
  logs.forEach((log) => {
    if (!log.ts) return;
    const d = new Date(log.ts * 1000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    if (!groupedByDay[key]) groupedByDay[key] = [];
    groupedByDay[key].push(log);
  });

  const dailyStats = Object.keys(groupedByDay)
    .sort((a, b) => (a < b ? 1 : -1)) // mới nhất trước
    .map((key) => {
      const list = groupedByDay[key];
      if (!list.length) return null;
      const d = new Date(list[0].ts * 1000);

      const drySec = calcDryingTime(list);
      const spanSec = getDaySpanSec(d);
      const inSec = Math.max(spanSec - drySec, 0);

      return {
        key,
        dateObj: d,
        dryingSec: drySec,
        inSec,
        count: list.length,
      };
    })
    .filter(Boolean)
    .slice(0, 7); // hiển thị tối đa 7 ngày gần nhất

  // ===== MAP TEXT MODE / STATE / REASON =====
  const formatMode = (mode) => (mode === "manual" ? "thủ công" : "tự động");
  const formatState = (state) =>
    state === "out" ? "phơi" : state === "in" ? "thu" : state;

  const formatReason = (reason) => {
    switch (reason) {
      case "manual_in":
        return "thu vào thủ công";
      case "manual_out":
        return "phơi ra thủ công";
      case "auto_rain":
        return "trời mưa";
      case "auto_rain_cleared":
        return "trời ngừng mưa";
      case "auto_bright":
        return "trời sáng";
      case "auto_dark":
        return "trời tối";
      default:
        return reason || "-";
    }
  };

  return (
    <div className="dashboard">
      <h1>Smart Drying System</h1>

      {/* THÔNG TIN THỜI TIẾT */}
      <div className="card">
        <h2>📡 Thông Tin Thời Tiết</h2>
        <p>🌡 Nhiệt độ: {sensor.temperature}°C</p>
        <p>💧 Độ ẩm: {sensor.humidity}%</p>
        <p>🌞 Ánh sáng: {lightText}</p>
        <p>🌧 Mưa: {rainText}</p>
      </div>

      {/* SYSTEM */}
      <div className="card">
        <h2>⚙ System</h2>

        <div className="status-row">
          <span className="badge">
            Chế Độ: {formatMode(system.mode)}
          </span>
          <span className="badge">
            Trạng Thái: {formatState(system.state)}
          </span>
        </div>

        <div className="btn-row">
          <button
            onClick={() => changeCommand("out")}
            disabled={!isManual}
            className={!isManual ? "btn-disabled" : ""}
          >
            Phơi ra
          </button>

          <button
            onClick={() => changeCommand("in")}
            disabled={!isManual}
            className={!isManual ? "btn-disabled" : ""}
          >
            Thu vào
          </button>

          <button onClick={toggleMode} className="btn-mode">
            {system.mode === "auto"
              ? "Chuyển Thủ Công"
              : "Chuyển Tự Động"}
          </button>
        </div>
      </div>

      {/* THỐNG KÊ HÔM NAY */}
      <div className="card">
        <h2>⏱ Thống kê hôm nay</h2>
        <p>Thời gian phơi: {formatDuration(dryingTodaySec)}</p>
        <p>Thời gian thu: {formatDuration(inTodaySec)}</p>
        <p>Số lần chuyển trạng thái: {logsToday.length}</p>
      </div>

      {/* HISTORY GẦN ĐÂY */}
      <div className="card">
        <h2>📜 History (gần đây)</h2>
        {logs.length === 0 ? (
          <p>Chưa có lịch sử.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Thời gian</th>
                <th style={{ textAlign: "left" }}>Chế Độ</th>
                <th style={{ textAlign: "left" }}>Trạng Thái</th>
                <th style={{ textAlign: "left" }}>Lý Do Phơi/Thu</th>
              </tr>
            </thead>
            <tbody>
              {[...logs]
                .slice()
                .reverse()
                .map((log) => (
                  <tr key={log.id}>
                    <td>{formatTime(log.ts)}</td>
                    <td>{formatMode(log.mode)}</td>
                    <td>{formatState(log.state)}</td>
                    <td>{formatReason(log.reason)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* THỐNG KÊ THEO TỪNG NGÀY */}
      <div className="card">
        <h2>📊 Thống kê theo từng ngày</h2>
        {dailyStats.length === 0 ? (
          <p>Chưa có dữ liệu.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Ngày</th>
                <th style={{ textAlign: "left" }}>Thời gian phơi</th>
                <th style={{ textAlign: "left" }}>Thời gian thu</th>
                <th style={{ textAlign: "left" }}>Số lần chuyển trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {dailyStats.map((d) => (
                <tr key={d.key}>
                  <td>{d.dateObj.toLocaleDateString()}</td>
                  <td>{formatDuration(d.dryingSec)}</td>
                  <td>{formatDuration(d.inSec)}</td>
                  <td>{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;