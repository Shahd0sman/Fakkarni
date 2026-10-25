export default function Textarea({
  label,
  error,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  style = {},
  ...props
}) {
  const textareaId = id || name;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", ...style }}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{
            fontSize: "13px",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text)",
            textAlign: "right",
          }}
        >
          {label} {required && <span style={{ color: "var(--color-error)" }}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontFamily: "var(--font-family)",
          fontSize: "14px",
          color: "var(--color-text)",
          backgroundColor: "var(--color-surface)",
          border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-sm)",
          outline: "none",
          transition: "border-color 0.15s ease",
          boxSizing: "border-box",
          resize: "vertical",
        }}
        {...props}
      />
      {error && <span style={{ fontSize: "12px", color: "var(--color-error)" }}>{error}</span>}
    </div>
  );
}

