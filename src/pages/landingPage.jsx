import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Receipt, Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/common/button.jsx";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "48px 20px",
        background: "var(--color-background)",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Centered Logo & Brand Name side-by-side */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <img
            src={logo}
            alt="فكّرني"
            style={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
          <strong
            style={{
              fontSize: "64px",
              color: "var(--color-primary)",
              fontWeight: "var(--font-weight-bold)",
            }}
          >
            فكّرني
          </strong>
        </div>

        {/* Text Content */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "var(--color-text)",
            lineHeight: "1.3",
            marginBottom: "16px",
          }}
        >
          تنظيم المستندات والفواتير والتذكيرات في مكان واحد
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--color-text-secondary)",
            lineHeight: "1.6",
            marginBottom: "32px",
            maxWidth: "600px",
          }}
        >
          فكّرني يساعدك في تتبع مواعيد انتهاء المستندات والوثائق المهمة، وإدارة
          الفواتير، والحصول على تنبيهات ذكية قبل انتهاء المواعيد.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "48px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" variant="primary" icon={ArrowLeft}>
                الانتقال للوحة التحكم
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" variant="primary" icon={ArrowLeft}>
                  ابدأ الآن مجانًا
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  تسجيل الدخول
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            width: "100%",
            textAlign: "right",
          }}
        >
          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <FileText size={24} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0, fontSize: "16px" }}>إدارة المستندات</h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--color-text-secondary)",
              }}
            >
              ارفع مستنداتك وعقودك وتواريخ صلاحيتها مع الحفاظ على ملفاتك بأمان.
            </p>
          </div>

          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <Receipt size={24} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0, fontSize: "16px" }}>متابعة الفواتير</h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--color-text-secondary)",
              }}
            >
              سجل فواتيرك ومواعيد استحقاقها وتابع ما تم سداده أولاً بأول.
            </p>
          </div>

          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <Bell size={24} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0, fontSize: "16px" }}>تذكيرات ذكية</h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--color-text-secondary)",
              }}
            >
              احصل على إشعارات مسبقة قبل انتهاء صلاحية أي وثيقة.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
