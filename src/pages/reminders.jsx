import { useState, useEffect } from "react";
import { Plus, Trash2, BellRing, Calendar, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/layout/pageHeader.jsx";
import Button from "../components/common/button.jsx";
import BaseModal from "../components/common/basemodal.jsx";
import ConfirmDialog from "../components/common/confirmDialog.jsx";
import Select from "../components/common/select.jsx";
import Input from "../components/common/input.jsx";
import Loading from "../components/common/loading.jsx";
import ErrorMessage from "../components/common/error.jsx";
import EmptyState from "../components/common/emptystate.jsx";
import reminderService from "../services/reminderservice.js";
import documentService from "../services/documentservice.js";
import { formatDate } from "../utils/formDate.js";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    documentId: "",
    daysBefore: "7",
  });
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [remindersRes, docsRes] = await Promise.all([
        reminderService.getReminders(),
        documentService.getDocuments(),
      ]);
      setReminders(remindersRes.data || []);
      setDocuments(docsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل التذكيرات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [remindersRes, docsRes] = await Promise.all([
          reminderService.getReminders(),
          documentService.getDocuments(),
        ]);
        if (!ignore) {
          setReminders(remindersRes.data || []);
          setDocuments(docsRes.data || []);
        }
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "تعذر تحميل التذكيرات");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Filter documents that have an expiryDate
  const eligibleDocuments = documents.filter((doc) => !!doc.expiryDate);

  const openCreateModal = () => {
    if (eligibleDocuments.length === 0) {
      alert("لا يوجد لديك مستندات بتاريخ انتهاء محدد. يرجى إضافة مستند بتاريخ انتهاء أولاً.");
      return;
    }
    setFormData({
      documentId: eligibleDocuments[0]?.id?.toString() || "",
      daysBefore: "7",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.documentId) {
      setFormError("يرجى اختيار المستند");
      return;
    }
    const days = Number(formData.daysBefore);
    if (isNaN(days) || days < 0 || days > 365) {
      setFormError("يرجى إدخال عدد أيام صحيح بين 0 و 365");
      return;
    }

    setIsSubmitting(true);
    try {
      await reminderService.createReminder({
        documentId: Number(formData.documentId),
        daysBefore: days,
      });
      closeModal();
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || "تعذر إنشاء التذكير");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await reminderService.deleteReminder(deleteTargetId);
      setDeleteTargetId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "تعذر حذف التذكير");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="التذكيرات الذكية"
        description="تنبيهات تلقائية مجدولة قبل انتهاء صلاحية مستنداتك ووثائقك."
      >
        {reminders.length > 0 && (
          <Button variant="primary" icon={Plus} onClick={openCreateModal}>
            إضافة تذكير
          </Button>
        )}
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchData} />

      {loading ? (
        <Loading message="جاري تحميل التذكيرات..." />
      ) : reminders.length === 0 ? (
        <EmptyState
          title="لا توجد تذكيرات نشطة"
          description="يمكنك ضبط تذكير لمستنداتك لتصلك إشعارات قبل انتهاء صلاحيتها بأيام."
          action={
            <Button variant="primary" icon={Plus} onClick={openCreateModal}>
              إنشاء أول تذكير
            </Button>
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>المستند المستهدف</th>
                <th>تاريخ انتهاء المستند</th>
                <th>موعد التنبيه (مسبقاً)</th>
                <th>تاريخ إرسال التذكير</th>
                <th>حالة الإرسال</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => {
                const doc = reminder.document || {};
                return (
                  <tr key={reminder.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <BellRing size={18} style={{ color: "var(--color-primary)" }} />
                        <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                          {doc.title || "مستند غير معروف"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-warning">
                        <Calendar size={13} />
                        {formatDate(doc.expiryDate)}
                      </span>
                    </td>
                    <td>قبل {reminder.daysBefore} أيام</td>
                    <td>{formatDate(reminder.reminderDate)}</td>
                    <td>
                      {reminder.isSent ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={13} />
                          تم التنبيه
                        </span>
                      ) : (
                        <span className="badge badge-info">قيد الانتظار</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteTargetId(reminder.id)}
                        title="حذف التذكير"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Reminder Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="إنشاء تذكير جديد لمستند"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
              حفظ التذكير
            </Button>
          </>
        }
      >
        <ErrorMessage message={formError} />
        <form onSubmit={handleSubmit}>
          <Select
            label="اختر المستند"
            name="documentId"
            value={formData.documentId}
            onChange={handleFormChange}
            placeholder="اختر مستنداً..."
            options={eligibleDocuments.map((d) => ({
              value: d.id.toString(),
              label: `${d.title} (ينتهي في ${formatDate(d.expiryDate)})`,
            }))}
            required
          />

          <Input
            label="التذكير قبل كم يوم من الانتهاء؟"
            name="daysBefore"
            type="number"
            min="0"
            max="365"
            value={formData.daysBefore}
            onChange={handleFormChange}
            placeholder="مثال: 7"
            required
          />
          <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginTop: "-8px", marginBottom: "16px" }}>
            سيقوم النظام بإرسال إشعار تلقائي إلى حسابك في التاريخ المحدد.
          </span>
        </form>
      </BaseModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="حذف التذكير"
        message="هل أنت متأكد من رغبتك في إلغاء هذا التذكير؟"
        confirmText="تأكيد الحذف"
        loading={isDeleting}
      />
    </div>
  );
}
