export default function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 26, color: "var(--navy)", lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--slate)", marginTop: 4, fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
