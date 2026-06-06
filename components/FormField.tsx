export default function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 7, fontSize: 14, outline: "none", background: "var(--white)", color: "var(--navy)", fontFamily: "'DM Sans', sans-serif",
};
