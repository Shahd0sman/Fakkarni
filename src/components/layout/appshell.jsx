import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Sidebar from "./sidebar.jsx";
import "./appshell.css";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Navbar />
      <Sidebar />
      <main className="app-shell__main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
