export default function Select({
  label,
  error,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  placeholder = "اختر...",
  style = {},
  ...props
}) {
  const selectId = id || name;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", ...style }}>
      {label && (
        <label
          htmlFor={selectId}
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
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
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
          cursor: "pointer",
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: "12px", color: "var(--color-error)" }}>{error}</span>}
    </div>
  );
}
