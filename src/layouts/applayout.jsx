import { Navigate } from "react-router-dom";
import AppShell from "../components/layout/appshell.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function AppLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "grid", height: "100vh", placeItems: "center" }}>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}
