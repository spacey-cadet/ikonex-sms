"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, Layers, BarChart2, FileText, Home, GraduationCap } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/streams", label: "Class Streams", icon: Layers },
  { href: "/students", label: "Students", icon: Users },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/scores", label: "Assessments", icon: BarChart2 },
  { href: "/results", label: "Results", icon: FileText },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{ width: 260, position: "fixed", top: 0, left: 0, height: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column", zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--navy-mid)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "var(--gold)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={20} color="var(--navy)" />
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "var(--white)", letterSpacing: "-0.02em" }}>Ikonex Academy</div>
            <div style={{ fontSize: 10, color: "var(--slate-light)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Student Management</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: "var(--slate)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 12px", marginBottom: 4 }}>Menu</div>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 2,
              background: active ? "rgba(201,168,76,0.15)" : "transparent",
              color: active ? "var(--gold-light)" : "var(--slate-light)",
              fontWeight: active ? 600 : 400, fontSize: 14,
              transition: "all 0.15s",
              borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
            }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--navy-mid)" }}>
        <div style={{ fontSize: 11, color: "var(--slate)", lineHeight: 1.5 }}>
          <span style={{ color: "var(--gold)" }}>●</span> System Online<br />
          <span style={{ color: "var(--slate-light)" }}>© 2025 Ikonex Systems</span>
        </div>
      </div>
    </aside>
  );
}
