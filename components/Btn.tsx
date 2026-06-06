type Variant = "primary" | "danger" | "ghost" | "outline";
const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--navy)", color: "var(--white)", border: "none" },
  danger: { background: "var(--red)", color: "var(--white)", border: "none" },
  ghost: { background: "transparent", color: "var(--slate)", border: "1px solid var(--border)" },
  outline: { background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)" },
};
export default function Btn({ children, variant = "primary", onClick, type = "button", disabled, style }: { children: React.ReactNode; variant?: Variant; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; style?: React.CSSProperties }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...styles[variant], padding: "9px 18px", borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s", ...style }}>
      {children}
    </button>
  );
}
