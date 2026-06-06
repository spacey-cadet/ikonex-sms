export default function StatCard({ label, value, icon, color = "var(--gold)" }: { label: string; value: string | number; icon: React.ReactNode; color?: string }) {
  return (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "20px 24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "var(--navy)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}
