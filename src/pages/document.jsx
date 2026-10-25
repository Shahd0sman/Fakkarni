import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, FileText, Paperclip, ExternalLink, Calendar } from "lucide-react";
import PageHeader from "../components/layout/pageHeader.jsx";
import Button from "../components/common/button.jsx";
import BaseModal from "../components/common/basemodal.jsx";
import ConfirmDialog from "../components/common/confirmDialog.jsx";
import Input from "../components/common/input.jsx";
import Select from "../components/common/select.jsx";
import Textarea from "../components/common/textarea.jsx";
import Loading from "../components/common/loading.jsx";
import ErrorMessage from "../components/common/error.jsx";
import EmptyState from "../components/common/emptystate.jsx";
import documentService from "../services/documentservice.js";
import { SERVER_BASE_URL } from "../services/api.js";
import { formatDate, toInputDateFormat } from "../utils/formDate.js";

const DOCUMENT_TYPES = [
  { value: "هوية شخصية", label: "هوية شخصية / جواز سفر" },
  { value: "عقد", label: "عقد / اتفاقية" },
  { value: "شهادة ضمان", label: "شهادة ضمان" },
  { value: "وثيقة رسمية", label: "وثيقة رسمية" },
  { value: "رخصة قيادة", label: "رخصة قيادة / مركبة" },
  { value: "أخرى", label: "أخرى" },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    issueDate: "",
    expiryDate: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await documentService.getDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل المستندات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await documentService.getDocuments();
        if (!ignore) setDocuments(res.data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "تعذر تحميل المستندات");
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
    setEditingDoc(null);
    setFormData({
      title: "",
      type: "وثيقة رسمية",
      description: "",
      issueDate: "",
      expiryDate: "",
    });
    setSelectedFile(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title || "",
      type: doc.type || "وثيقة رسمية",
      description: doc.description || "",
      issueDate: toInputDateFormat(doc.issueDate),
      expiryDate: toInputDateFormat(doc.expiryDate),
    });
    setSelectedFile(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
    setSelectedFile(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormError("حجم الملف يجب ألا يتجاوز 5 ميجابايت");
        return;
      }
      setSelectedFile(file);
      setFormError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("يرجى كتابة عنوان المستند");
      return;
    }
    if (!formData.type.trim()) {
      setFormError("يرجى اختيار نوع المستند");
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", formData.title.trim());
      form.append("type", formData.type.trim());
      if (formData.description) form.append("description", formData.description.trim());
      if (formData.issueDate) form.append("issueDate", formData.issueDate);
      if (formData.expiryDate) form.append("expiryDate", formData.expiryDate);
      if (selectedFile) form.append("file", selectedFile);

      if (editingDoc) {
        await documentService.updateDocument(editingDoc.id, form);
      } else {
        await documentService.createDocument(form);
      }
      closeModal();
      fetchDocuments();
    } catch (err) {
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ المستند");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await documentService.deleteDocument(deleteTargetId);
      setDeleteTargetId(null);
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || "تعذر حذف المستند");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="المستندات والوثائق"
        description="احتفظ بنسخ من أوراقك الثبوتية وتواريخ صلاحيتها ومرفقاتها."
      >
        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          إضافة مستند
        </Button>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchDocuments} />

      {loading ? (
        <Loading message="جاري تحميل المستندات..." />
      ) : documents.length === 0 ? (
        <EmptyState
          title="لا توجد مستندات بعد"
          description="أضف مستنداتك وعقودك وشهادات الضمان لمتابعتها في مكان واحد."
          action={
            <Button variant="primary" icon={Plus} onClick={openCreateModal}>
              إضافة مستند الآن
            </Button>
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>عنوان المستند</th>
                <th>النوع</th>
                <th>الوصف</th>
                <th>تاريخ الانتهاء</th>
                <th>المرفق</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const hasFile = !!doc.filePath;
                const fileUrl = hasFile ? `${SERVER_BASE_URL}/${doc.filePath}` : null;
                const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();

                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={18} style={{ color: "var(--color-primary)" }} />
                        <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                          {doc.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{doc.type}</span>
                    </td>
                    <td style={{ color: "var(--color-text-secondary)", maxWidth: "250px" }}>
                      {doc.description || "-"}
                    </td>
                    <td>
                      {doc.expiryDate ? (
                        <span className={`badge ${isExpired ? "badge-danger" : "badge-warning"}`}>
                          <Calendar size={13} />
                          {formatDate(doc.expiryDate)}
                        </span>
                      ) : (
                        <span style={{ color: "var(--color-text-secondary)" }}>-</span>
                      )}
                    </td>
                    <td>
                      {hasFile ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "var(--color-primary)",
                            fontSize: "13px",
                            fontWeight: "var(--font-weight-medium)",
                          }}
                        >
                          <Paperclip size={14} />
                          عرض الملف
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: "var(--color-text-secondary)" }}>بدون مرفق</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => openEditModal(doc)}
                          title="تعديل"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteTargetId(doc.id)}
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
        title={editingDoc ? "تعديل المستند" : "إضافة مستند جديد"}
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
              {editingDoc ? "تحديث" : "حفظ المستند"}
            </Button>
          </>
        }
      >
        <ErrorMessage message={formError} />
        <form onSubmit={handleSubmit}>
          <Input
            label="عنوان المستند"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="مثال: جواز السفر، عقد الإيجار..."
            required
          />

          <Select
            label="نوع المستند"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            options={DOCUMENT_TYPES}
            required
          />

          <Textarea
            label="ملاحظات أو وصف"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="أضف أي تفاصيل أو أرقام مرجعية هنا..."
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input
              label="تاريخ الإصدار"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleFormChange}
            />

            <Input
              label="تاريخ الانتهاء"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleFormChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--color-text)",
                marginBottom: "6px",
              }}
            >
              ملف المرفق (PDF، صورة، الحد الأقصى 5 ميجابايت)
            </label>
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                fontSize: "13px",
                border: "1px dashed var(--color-border)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-background)",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            />
            {editingDoc?.filePath && !selectedFile && (
              <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginTop: "4px" }}>
                الملف الحالي محفوظ. اختر ملفاً جديداً فقط إذا أردت استبداله.
              </span>
            )}
          </div>
        </form>
      </BaseModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="حذف المستند"
        message="هل أنت متأكد من رغبتك في حذف هذا المستند؟ سيتم حذف جميع التذكيرات المرتبطة به أيضاً."
        confirmText="تأكيد الحذف"
        loading={isDeleting}
      />
    </div>
  );
}
