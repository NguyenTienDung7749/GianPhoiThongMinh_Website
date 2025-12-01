// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";

/**
 * SVG Component for stylized energy bottle (STING-inspired)
 * Pure CSS/SVG, no copyrighted images
 */
function StingBottle() {
  return (
    <svg viewBox="0 0 60 180" xmlns="http://www.w3.org/2000/svg">
      {/* Bottle neck */}
      <defs>
        <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="50%" stopColor="#cc0000" />
          <stop offset="100%" stopColor="#990000" />
        </linearGradient>
        <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff3300" />
          <stop offset="50%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#cc0000" />
        </linearGradient>
        <linearGradient id="capGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Cap */}
      <rect x="22" y="0" width="16" height="15" rx="2" fill="url(#capGradient)" />
      <rect x="20" y="12" width="20" height="8" rx="2" fill="url(#capGradient)" />
      
      {/* Bottle neck */}
      <path d="M 23 20 L 23 35 C 23 40 15 50 15 55 L 15 165 C 15 172 22 175 30 175 C 38 175 45 172 45 165 L 45 55 C 45 50 37 40 37 35 L 37 20 Z" 
            fill="url(#bottleGradient)" 
            stroke="#660000" 
            strokeWidth="1"
            filter="url(#glowFilter)" />
      
      {/* Liquid inside */}
      <path d="M 18 60 L 18 162 C 18 168 23 171 30 171 C 37 171 42 168 42 162 L 42 60 C 42 57 40 55 30 55 C 20 55 18 57 18 60 Z" 
            fill="url(#liquidGradient)" 
            opacity="0.9" />
      
      {/* Highlight reflection */}
      <path d="M 20 65 C 20 65 22 160 22 162 C 22 165 24 167 26 167 C 26 167 20 165 20 160 L 20 65 Z" 
            fill="rgba(255,255,255,0.2)" />
      
      {/* Energy bolt symbol */}
      <path d="M 32 80 L 26 105 L 30 105 L 24 135 L 36 100 L 32 100 L 38 80 Z" 
            fill="#ffcc00" 
            opacity="0.9"
            filter="url(#glowFilter)" />
      
      {/* Small decorative circles */}
      <circle cx="25" cy="150" r="3" fill="#ffcc00" opacity="0.6" />
      <circle cx="35" cy="145" r="2" fill="#ff6600" opacity="0.5" />
      <circle cx="28" cy="155" r="2" fill="#ff3300" opacity="0.4" />
    </svg>
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
    } catch (error) {
      console.error("Login error:", error);
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

      {/* Sting Bottles Container */}
      <div className="sting-container">
        {/* Left Bottle */}
        <div className="sting-bottle sting-bottle-left">
          <div className="sting-glow"></div>
          <StingBottle />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </div>

        {/* Right Bottle */}
        <div className="sting-bottle sting-bottle-right">
          <div className="sting-glow"></div>
          <StingBottle />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </div>

        {/* Back Bottle (behind card) */}
        <div className="sting-bottle sting-bottle-back">
          <div className="sting-glow"></div>
          <StingBottle />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
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
