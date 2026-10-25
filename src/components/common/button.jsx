export default function Button({
  children,
  variant = "primary", // primary | secondary | outline | danger
  size = "md",         // sm | md | lg
  type = "button",
  loading = false,
  disabled = false,
  onClick,
  icon: Icon,
  className = "",
  style = {},
  ...props
}) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-family)",
    fontWeight: "var(--font-weight-medium)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.65 : 1,
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  };

  const sizeStyles = {
    sm: { padding: "6px 12px", fontSize: "12px", height: "32px" },
    md: { padding: "8px 16px", fontSize: "14px", height: "40px" },
    lg: { padding: "12px 24px", fontSize: "16px", height: "48px" },
  };

  const variantStyles = {
    primary: {
      backgroundColor: "var(--color-primary)",
      color: "#ffffff",
      borderColor: "var(--color-primary)",
    },
    secondary: {
      backgroundColor: "var(--color-primary-light)",
      color: "var(--color-primary)",
      borderColor: "transparent",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--color-text)",
      borderColor: "var(--color-border)",
    },
    danger: {
      backgroundColor: "var(--color-error)",
      color: "#ffffff",
      borderColor: "var(--color-error)",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      className={className}
      {...props}
    >
      {loading ? (
        <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      ) : (
        Icon && <Icon size={size === "sm" ? 15 : size === "lg" ? 20 : 18} />
      )}
      {children}
    </button>
  );
}

