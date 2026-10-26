import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Receipt,
  BellRing,
  Bell,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../components/layout/pageHeader.jsx";
import Loading from "../components/common/loading.jsx";
import ErrorMessage from "../components/common/error.jsx";
import billsService from "../services/billsService.js";
import documentService from "../services/documentservice.js";
import reminderService from "../services/reminderservice.js";
import notificationService from "../services/notificationservice.js";
import { formatCurrency } from "../utils/formCurrency.js";
import { formatDate } from "../utils/formDate.js";
import { useAuth } from "../hooks/useAuth.js";

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    documents: [],
    bills: [],
    reminders: [],
    notifications: [],
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [docsRes, billsRes, remsRes, notifsRes] = await Promise.all([
        documentService.getDocuments(),
        billsService.getBills(),
        reminderService.getReminders(),
        notificationService.getNotifications(),
      ]);

      setStats({
        documents: docsRes.data || [],
        bills: billsRes.data || [],
        reminders: remsRes.data || [],
        notifications: notifsRes.data || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function initDashboard() {
      try {
        const [docsRes, billsRes, remsRes, notifsRes] = await Promise.all([
          documentService.getDocuments(),
          billsService.getBills(),
          reminderService.getReminders(),
          notificationService.getNotifications(),
        ]);

        if (!ignore) {
          setStats({
            documents: docsRes.data || [],
            bills: billsRes.data || [],
            reminders: remsRes.data || [],
            notifications: notifsRes.data || [],
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "تعذر تحميل بيانات لوحة التحكم");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    initDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const unpaidBills = stats.bills.filter((b) => b.status !== "paid");
  const totalUnpaidAmount = unpaidBills.reduce((acc, b) => acc + Number(b.amount || 0), 0);
  const unreadNotifications = stats.notifications.filter((n) => !n.isRead);

  // Expiring soon documents (within 30 days)
  const expiringSoonDocs = stats.documents.filter((doc) => {
    if (!doc.expiryDate) return false;
    const diffDays = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${user?.name || "بك"}`}
        description="نظرة عامة على مستنداتك وفواتيرك ومواعيدك القادمة."
      />

      <ErrorMessage message={error} onRetry={fetchDashboardData} />

      {loading ? (
        <Loading message="جاري تجهيز لوحة التحكم..." />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="dashboard-grid">
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <span>إجمالي المستندات</span>
                <strong>{stats.documents.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-warning) 15%, transparent)",
                  color: "var(--color-warning)",
                }}
              >
                <Receipt size={24} />
              </div>
              <div className="stat-info">
                <span>فواتير بانتظار السداد</span>
                <strong>{unpaidBills.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-error) 15%, transparent)",
                  color: "var(--color-error)",
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div className="stat-info">
                <span>المستحقات غير المدفوعة</span>
                <strong>{formatCurrency(totalUnpaidAmount)}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-success) 15%, transparent)",
                  color: "var(--color-success)",
                }}
              >
                <BellRing size={24} />
              </div>
              <div className="stat-info">
                <span>تذكيرات نشطة</span>
                <strong>{stats.reminders.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                <Bell size={24} />
              </div>
              <div className="stat-info">
                <span>إشعارات جديدة</span>
                <strong>{unreadNotifications.length}</strong>
              </div>
            </div>
          </div>

          {/* Quick Sections */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* Upcoming Unpaid Bills */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px" }}>فواتير قادمة تحتاج للسداد</h3>
                <Link to="/bills" style={{ fontSize: "13px", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  عرض الكل <ArrowLeft size={14} />
                </Link>
              </div>

              {unpaidBills.length === 0 ? (
                <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "14px" }}>
                  رائع! جميع فواتيرك مسددة حتى الآن 
                </p>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {unpaidBills.slice(0, 4).map((bill) => (
                    <div
                      key={bill.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        backgroundColor: "var(--color-background)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>{bill.title}</strong>
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                          مستحقة في: {formatDate(bill.dueDate)}
                        </span>
                      </div>
                      <span style={{ fontWeight: "bold", color: "var(--color-primary)", fontSize: "14px" }}>
                        {formatCurrency(bill.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expiring Documents Alert */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px" }}>مستندات تنتهي قريباً (خلال 30 يوماً)</h3>
                <Link to="/documents" style={{ fontSize: "13px", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  عرض المستندات <ArrowLeft size={14} />
                </Link>
              </div>

              {expiringSoonDocs.length === 0 ? (
                <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "14px" }}>
                  لا توجد مستندات تقترب من تاريخ انتهائها حالياً
                </p>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {expiringSoonDocs.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        backgroundColor: "color-mix(in srgb, var(--color-warning) 8%, var(--color-background))",
                        borderRadius: "var(--radius-sm)",
                        borderRight: "3px solid var(--color-warning)",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>{doc.title}</strong>
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                          تنتهي في: {formatDate(doc.expiryDate)}
                        </span>
                      </div>
                      <span className="badge badge-warning">{doc.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
