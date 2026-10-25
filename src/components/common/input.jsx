export default function Input({
  label,
  error,
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  style = {},
  ...props
}) {
  const inputId = id || name;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", ...style }}>
      {label && (
        <label
          htmlFor={inputId}
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
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
        }}
        {...props}
      />
      {error && <span style={{ fontSize: "12px", color: "var(--color-error)" }}>{error}</span>}
    </div>
  );
}

