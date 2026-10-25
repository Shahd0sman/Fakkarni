import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function PublicLayout() {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "grid", height: "100vh", placeItems: "center" }}>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // If logged in and trying to access /login or /register, redirect to dashboard
  if (token && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="public-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
