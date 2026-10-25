import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/common/button.jsx";

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
      background: "var(--color-background)",
    }}>
      <h1 style={{ fontSize: "72px", fontWeight: "bold", color: "var(--color-primary)", margin: 0 }}>404</h1>
      <h2 style={{ fontSize: "22px", margin: "12px 0 8px", color: "var(--color-text)" }}>الصفحة غير موجودة</h2>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: "400px", margin: "0 0 24px" }}>
        عذرًا، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={Home}>
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
}
