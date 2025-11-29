// src/components/AuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingHellfire } from "./LoadingHellfire";

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingHellfire />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthGuard;
