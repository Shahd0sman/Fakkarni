import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle2, Clock, Receipt } from "lucide-react";
import PageHeader from "../components/layout/pageHeader.jsx";
import Button from "../components/common/button.jsx";
import BaseModal from "../components/common/basemodal.jsx";
import ConfirmDialog from "../components/common/confirmDialog.jsx";
import Input from "../components/common/input.jsx";
import Select from "../components/common/select.jsx";
import Loading from "../components/common/loading.jsx";
import ErrorMessage from "../components/common/error.jsx";
import EmptyState from "../components/common/emptystate.jsx";
import billsService from "../services/billsService.js";
import { formatCurrency } from "../utils/formCurrency.js";
import { formatDate, toInputDateFormat } from "../utils/formDate.js";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  // Delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    dueDate: "",
    status: "unpaid",
  });
  const [formError, setFormError] = useState("");

  const fetchBills = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await billsService.getBills();
      setBills(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل الفواتير");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await billsService.getBills();
        if (!ignore) setBills(res.data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "تعذر تحميل الفواتير");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingBill(null);
    setFormData({
      title: "",
      amount: "",
      dueDate: toInputDateFormat(new Date()),
      status: "unpaid",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (bill) => {
    setEditingBill(bill);
    setFormData({
      title: bill.title,
      amount: bill.amount,
      dueDate: toInputDateFormat(bill.dueDate),
      status: bill.status || "unpaid",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBill(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("يرجى كتابة عنوان الفاتورة");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError("يرجى إدخال مبلغ صحيح أكبر من الصفر");
      return;
    }
    if (!formData.dueDate) {
      setFormError("يرجى تحديد تاريخ الاستحقاق");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
      };

      if (editingBill) {
        await billsService.updateBill(editingBill.id, payload);
      } else {
        await billsService.createBill(payload);
      }
      closeModal();
      fetchBills();
    } catch (err) {
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ الفاتورة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (bill) => {
    const newStatus = bill.status === "paid" ? "unpaid" : "paid";
    try {
      await billsService.updateBill(bill.id, { status: newStatus });
      setBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || "تعذر تحديث حالة الفاتورة");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await billsService.deleteBill(deleteTargetId);
      setDeleteTargetId(null);
      fetchBills();
    } catch (err) {
      alert(err.response?.data?.message || "تعذر حذف الفاتورة");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="الفواتير"
        description="تابع فواتيرك ومواعيد استحقاقها وحالتها المالية."
      >
        {bills.length > 0 && (
          <Button variant="primary" icon={Plus} onClick={openCreateModal}>
            إضافة فاتورة
          </Button>
        )}
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchBills} />

      {loading ? (
        <Loading message="جاري تحميل الفواتير..." />
      ) : bills.length === 0 ? (
        <EmptyState
          title="لا توجد فواتير حالياً"
          description="يمكنك البدء بإضافة فاتورتك الأولى لتتبع مواعيد السداد."
          action={
            <Button variant="primary" icon={Plus} onClick={openCreateModal}>
              إضافة فاتورة الآن
            </Button>
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>عنوان الفاتورة</th>
                <th>المبلغ</th>
                <th>تاريخ الاستحقاق</th>
                <th>الحالة</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => {
                const isPaid = bill.status === "paid";
                return (
                  <tr key={bill.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Receipt size={18} style={{ color: "var(--color-primary)" }} />
                        <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                          {bill.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "var(--color-primary)" }}>
                        {formatCurrency(bill.amount)}
                      </strong>
                    </td>
                    <td>{formatDate(bill.dueDate)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(bill)}
                        title="انقر لتغيير الحالة"
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        <span className={`badge ${isPaid ? "badge-success" : "badge-warning"}`}>
                          {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          {isPaid ? "مدفوعة" : "غير مدفوعة"}
                        </span>
                      </button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => openEditModal(bill)}
                          title="تعديل"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteTargetId(bill.id)}
                          title="حذف"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBill ? "تعديل الفاتورة" : "إضافة فاتورة جديدة"}
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
              {editingBill ? "تحديث" : "حفظ الفاتورة"}
            </Button>
          </>
        }
      >
        <ErrorMessage message={formError} />
        <form onSubmit={handleSubmit}>
          <Input
            label="عنوان الفاتورة"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="فاتورة الكهرباء، الإنترنت..."
            required
          />

          <Input
            label="المبلغ (بالجنيه)"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleFormChange}
            placeholder="مثال: 350.50"
            required
          />

          <Input
            label="تاريخ الاستحقاق"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleFormChange}
            required
          />

          <Select
            label="حالة السداد"
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            placeholder={null}
            options={[
              { value: "unpaid", label: "غير مدفوعة" },
              { value: "paid", label: "مدفوعة" },
            ]}
          />
        </form>
      </BaseModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="حذف الفاتورة"
        message="هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟"
        confirmText="تأكيد الحذف"
        loading={isDeleting}
      />
    </div>
  );
}
