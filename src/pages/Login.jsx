// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";

/**
 * GradeBubble Component - displays F+ or F- grade in a floating pill
 * @param {string} grade - The grade text (e.g., "F+" or "F-")
 * @param {string} color - The text color (e.g., "#FFD700")
 */
function GradeBubble({ grade, color }) {
  return (
    <div className="grade-bubble" style={{ color, textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}` }}>
      {grade}
    </div>
  );
}

/**
 * Promo Banner Component with fiery animation
 */
function PromoBanner() {
  return (
    <div className="promo-banner">
      <span className="promo-text">🔥 THẦY NGỌC EM ĐẸP TRAI NHẤT FPL HN 🔥</span>
    </div>
  );
}

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert username to email format
      const email = `${username.trim().toLowerCase()}@system.local`;
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Sai tên đăng nhập hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Volcanic Lava Background */}
      <div className="lava-bg" />

      {/* Energy Sparks */}
      <div className="energy-sparks">
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
      </div>

      {/* Promo Banner at the top */}
      <PromoBanner />

      {/* Top Bottles Container (2 grade bubbles: left and right of banner) */}
      <div className="sting-container-top">
        {/* Top Left - F+ Yellow */}
        <div className="grade-bubble-wrapper sting-bottle-top-left">
          <GradeBubble grade="F+" color="#FFD700" />
        </div>

        {/* Top Right - F+ Green */}
        <div className="grade-bubble-wrapper sting-bottle-top-right">
          <GradeBubble grade="F+" color="#00FF7F" />
        </div>
      </div>

      {/* Bottom Grade Bubbles Container (3 grade bubbles at bottom) */}
      <div className="sting-container">
        {/* Bottom Left - F+ Cyan */}
        <div className="grade-bubble-wrapper sting-bottle-left">
          <GradeBubble grade="F+" color="#00FFFF" />
        </div>

        {/* Bottom Right - F- Pink */}
        <div className="grade-bubble-wrapper sting-bottle-right">
          <GradeBubble grade="F-" color="#FF69B4" />
        </div>

        {/* Bottom Center - F- Purple */}
        <div className="grade-bubble-wrapper sting-bottle-back">
          <GradeBubble grade="F-" color="#DA70D6" />
        </div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <h1 className="text-2xl font-bold text-center mb-6 text-lava-orange animate-glow">
          🔥 Đăng Nhập Hệ Thống
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username" className="text-lava-yellow">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Nhập tên đăng nhập"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="text-lava-yellow">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
