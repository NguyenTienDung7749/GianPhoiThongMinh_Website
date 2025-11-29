// src/components/Layout.jsx
import Navbar from "./Navbar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-hell-black">
      {/* Volcanic Lava Background Animation */}
      <div className="lava-background" />
      
      {/* Fire Particles */}
      <div className="fire-particles">
        <span className="fire-particle">🔥</span>
        <span className="fire-particle">✨</span>
        <span className="fire-particle">🔥</span>
        <span className="fire-particle">✨</span>
        <span className="fire-particle">🔥</span>
      </div>
      
      {/* Background texture overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-hell-black via-hell-blood to-hell-black opacity-90 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lava-red/5 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
