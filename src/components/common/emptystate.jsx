import emptySvg from "../../assets/empty.png";

export default function EmptyState({ title = "لا توجد بيانات", description, action }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      textAlign: "center",
      color: "var(--color-text-secondary)",
      background: "var(--color-surface)",
      border: "1px dashed var(--color-border)",
      borderRadius: "var(--radius-md)",
      gap: "16px"
    }}>
      <img src={emptySvg} alt="فارغ" style={{ width: "300px", height: "auto", opacity: 0.8 }} />
      <div>
        <h3 style={{ margin: "0 0 6px", color: "var(--color-text)", fontSize: "16px" }}>{title}</h3>
        {description && <p style={{ margin: 0, fontSize: "14px" }}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

