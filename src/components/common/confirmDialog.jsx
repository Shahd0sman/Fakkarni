import BaseModal from "./basemodal";
import Button from "./button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الإجراء",
  message = "هل أنت متأكد من رغبتك في المتابعة؟ هذا الإجراء لا يمكن التراجع عنه.",
  confirmText = "حذف",
  loading = false,
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="440px"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div
          style={{
            padding: "10px",
            borderRadius: "50%",
            backgroundColor: "color-mix(in srgb, var(--color-error) 15%, transparent)",
            color: "var(--color-error)",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "var(--color-text)" }}>
          {message}
        </p>
      </div>
    </BaseModal>
  );
}

