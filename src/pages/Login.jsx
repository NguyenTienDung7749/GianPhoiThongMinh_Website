// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";

/**
 * SVG Component for stylized energy bottle (STING-inspired)
 * Features vertical "STING" text on the label instead of lightning bolt
 * Pure CSS/SVG, no copyrighted images
 */
function StingBottle({ id = "default" }) {
  const gradientPrefix = `bottle-${id}`;
  return (
    <svg viewBox="0 0 60 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${gradientPrefix}-bottleGradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="50%" stopColor="#cc0000" />
          <stop offset="100%" stopColor="#990000" />
        </linearGradient>
        <linearGradient id={`${gradientPrefix}-liquidGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff3300" />
          <stop offset="50%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#cc0000" />
        </linearGradient>
        <linearGradient id={`${gradientPrefix}-capGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <filter id={`${gradientPrefix}-glowFilter`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id={`${gradientPrefix}-textGlow`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Cap */}
      <rect x="22" y="0" width="16" height="15" rx="2" fill={`url(#${gradientPrefix}-capGradient)`} />
      <rect x="20" y="12" width="20" height="8" rx="2" fill={`url(#${gradientPrefix}-capGradient)`} />
      
      {/* Bottle body */}
      <path d="M 23 20 L 23 35 C 23 40 15 50 15 55 L 15 165 C 15 172 22 175 30 175 C 38 175 45 172 45 165 L 45 55 C 45 50 37 40 37 35 L 37 20 Z" 
            fill={`url(#${gradientPrefix}-bottleGradient)`}
            stroke="#660000" 
            strokeWidth="1"
            filter={`url(#${gradientPrefix}-glowFilter)`} />
      
      {/* Liquid inside */}
      <path d="M 18 60 L 18 162 C 18 168 23 171 30 171 C 37 171 42 168 42 162 L 42 60 C 42 57 40 55 30 55 C 20 55 18 57 18 60 Z" 
            fill={`url(#${gradientPrefix}-liquidGradient)`}
            opacity="0.9" />
      
      {/* Highlight reflection */}
      <path d="M 20 65 C 20 65 22 160 22 162 C 22 165 24 167 26 167 C 26 167 20 165 20 160 L 20 65 Z" 
            fill="rgba(255,255,255,0.2)" />
      
      {/* Vertical STING text on label */}
      <text 
        x="30" 
        y="75" 
        textAnchor="middle" 
        fontFamily="Arial Black, Arial, sans-serif" 
        fontWeight="bold"
        fontSize="11"
        fill="#ffcc00"
        filter={`url(#${gradientPrefix}-textGlow)`}
      >
        <tspan x="30" dy="0">S</tspan>
        <tspan x="30" dy="14">T</tspan>
        <tspan x="30" dy="14">I</tspan>
        <tspan x="30" dy="14">N</tspan>
        <tspan x="30" dy="14">G</tspan>
      </text>
      
      {/* Small decorative circles */}
      <circle cx="25" cy="150" r="3" fill="#ffcc00" opacity="0.6" />
      <circle cx="35" cy="145" r="2" fill="#ff6600" opacity="0.5" />
      <circle cx="28" cy="155" r="2" fill="#ff3300" opacity="0.4" />
    </svg>
  );
}

/**
 * Promo Banner Component with fiery animation
 */
function PromoBanner() {
  return (
    <div className="promo-banner">
      <span className="promo-text">🔥 STING ĐANG GIẢM GIÁ 99% 🔥</span>
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

      {/* Top Bottles Container (2 bottles: left and right of banner) */}
      <div className="sting-container-top">
        {/* Top Left Bottle */}
        <div className="sting-bottle sting-bottle-top-left">
          <div className="sting-glow"></div>
          <StingBottle id="top-left" />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </div>

        {/* Top Right Bottle */}
        <div className="sting-bottle sting-bottle-top-right">
          <div className="sting-glow"></div>
          <StingBottle id="top-right" />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </div>
      </div>

      {/* Bottom Sting Bottles Container (3 bottles at bottom) */}
      <div className="sting-container">
        {/* Bottom Left Bottle */}
        <div className="sting-bottle sting-bottle-left">
          <div className="sting-glow"></div>
          <StingBottle id="bottom-left" />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </div>

        {/* Bottom Right Bottle */}
        <div className="sting-bottle sting-bottle-right">
          <div className="sting-glow"></div>
          <StingBottle id="bottom-right" />
          <div className="sting-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </div>

        {/* Bottom Center Bottle (behind card) */}
        <div className="sting-bottle sting-bottle-back">
          <div className="sting-glow"></div>
          <StingBottle id="bottom-center" />
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
