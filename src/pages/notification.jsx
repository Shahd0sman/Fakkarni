import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import PageHeader from "../components/layout/pageHeader.jsx";
import Button from "../components/common/button.jsx";
import Loading from "../components/common/loading.jsx";
import ErrorMessage from "../components/common/error.jsx";
import EmptyState from "../components/common/emptystate.jsx";
import notificationService from "../services/notificationservice.js";
import { formatDate } from "../utils/formDate.js";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingId, setMarkingId] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await notificationService.getNotifications();
        if (!ignore) setNotifications(res.data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "تعذر تحميل الإشعارات");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    setMarkingId(id);
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      alert(err.response?.data?.message || "تعذر تحديث الإشعار");
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      try {
        await notificationService.markAsRead(n.id);
      } catch {
        // continue
      }
    }
    fetchNotifications();
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div>
      <PageHeader
        title="الإشعارات والتنبيهات"
        description="جميع الإشعارات الخاصة بانتهاء وثائقك ومواعيدك المهمة."
      >
        {hasUnread && (
          <Button variant="outline" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
            تحديد الكل كمقروء
          </Button>
        )}
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchNotifications} />

      {loading ? (
        <Loading message="جاري تحميل الإشعارات..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="لا توجد إشعارات حالياً"
          description="ستظهر هنا التنبيهات الخاصة بمستنداتك وفواتيرك عند حلول مواعيدها."
        />
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {notifications.map((item) => {
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "16px 20px",
                  backgroundColor: item.isRead
                    ? "var(--color-surface)"
                    : "color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",
                  borderLeft: item.isRead
                    ? "1px solid var(--color-border)"
                    : "4px solid var(--color-primary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      backgroundColor: item.isRead
                        ? "var(--color-background)"
                        : "var(--color-primary-light)",
                      color: item.isRead
                        ? "var(--color-text-secondary)"
                        : "var(--color-primary)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: "0 0 4px",
                        fontSize: "15px",
                        fontWeight: item.isRead ? "normal" : "bold",
                        color: "var(--color-text)",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: "13px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {item.message}
                    </p>
                    <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {!item.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Check}
                    loading={markingId === item.id}
                    onClick={() => handleMarkAsRead(item.id)}
                  >
                    تحديد كمقروء
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
