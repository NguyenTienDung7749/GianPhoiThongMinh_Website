// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hell-black">
        {/* Volcanic Lava Background Animation */}
        <div className="lava-background" />
        
        {/* Background texture overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-hell-black via-hell-blood to-hell-black opacity-90 pointer-events-none"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lava-red/5 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;