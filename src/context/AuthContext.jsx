// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

// Check if we're in demo mode (no Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_DATABASE_URL;

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isDemoMode ? { email: "demo@example.com" } : null);
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    // Skip auth listener in demo mode
    if (isDemoMode || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
}
