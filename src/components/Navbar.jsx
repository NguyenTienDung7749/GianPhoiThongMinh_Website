// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export function Navbar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
      isActive
        ? "bg-lava-red text-white shadow-lava"
        : "text-lava-orange hover:bg-lava-red/20 hover:text-lava-yellow"
    }`;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-hell-black/95 backdrop-blur-sm border-b border-lava-red/30 sticky top-0 z-50 card-lava-glow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-flicker">🔥</span>
            <h1 className="text-xl font-bold text-lava-orange animate-glow">
              Giàn Phơi Thông Minh
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className={linkClass}>
              🏠 Tổng Quan
            </NavLink>
            <NavLink to="/history" className={linkClass}>
              📜 Lịch Sử
            </NavLink>
            <NavLink to="/statistics" className={linkClass}>
              📊 Thống Kê
            </NavLink>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn-logout"
            >
              🚪 Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
