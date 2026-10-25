import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 16px",
      backgroundColor: "color-mix(in srgb, var(--color-error) 10%, transparent)",
      color: "var(--color-error)",
      borderRadius: "var(--radius-sm)",
      fontSize: "14px",
      marginBottom: "16px"
    }}>
      <AlertCircle size={18} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "none",
            border: "1px solid var(--color-error)",
            color: "var(--color-error)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

