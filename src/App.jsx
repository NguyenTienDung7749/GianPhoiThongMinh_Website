// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
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
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </AuthGuard>
            }
          />
          <Route
            path="/history"
            element={
              <AuthGuard>
                <div className="min-h-screen bg-hell-black">
                  <div className="lava-background" />
                  <div className="fixed inset-0 bg-gradient-to-br from-hell-black via-hell-blood to-hell-black opacity-90 pointer-events-none"></div>
                  <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lava-red/5 via-transparent to-transparent pointer-events-none"></div>
                  <div className="relative z-10">
                    <Navbar />
                    <main>
                      <History />
                    </main>
                  </div>
                </div>
              </AuthGuard>
            }
          />
          <Route
            path="/statistics"
            element={
              <AuthGuard>
                <div className="min-h-screen bg-hell-black">
                  <div className="lava-background" />
                  <div className="fixed inset-0 bg-gradient-to-br from-hell-black via-hell-blood to-hell-black opacity-90 pointer-events-none"></div>
                  <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lava-red/5 via-transparent to-transparent pointer-events-none"></div>
                  <div className="relative z-10">
                    <Navbar />
                    <main>
                      <Statistics />
                    </main>
                  </div>
                </div>
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;