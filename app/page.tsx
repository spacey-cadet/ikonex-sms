"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { Users, Layers, BookOpen, BarChart2, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({ streams: 0, students: 0, subjects: 0, scores: 0 });
  const [streams, setStreams] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/init").then(r => r.json()),
      fetch("/api/streams").then(r => r.json()),
      fetch("/api/students").then(r => r.json()),
      fetch("/api/subjects").then(r => r.json()),
      fetch("/api/scores").then(r => r.json()),
    ]).then(([, s, st, sb, sc]) => {
      setStreams(Array.isArray(s) ? s : []);
      setStats({ streams: Array.isArray(s) ? s.length : 0, students: Array.isArray(st) ? st.length : 0, subjects: Array.isArray(sb) ? sb.length : 0, scores: Array.isArray(sc) ? sc.length : 0 });
    });
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome to Ikonex Academy Student Management System" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Class Streams" value={stats.streams} icon={<Layers size={22} />} color="var(--gold)" />
        <StatCard label="Total Students" value={stats.students} icon={<Users size={22} />} color="#1d4ed8" />
        <StatCard label="Subjects" value={stats.subjects} icon={<BookOpen size={22} />} color="#16a34a" />
        <StatCard label="Score Entries" value={stats.scores} icon={<BarChart2 size={22} />} color="#9333ea" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Quick Actions */}
        <div style={{ background: "var(--white)", borderRadius: 12, padding: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: 16, marginBottom: 16, color: "var(--navy)" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { href: "/streams", label: "Manage Class Streams", icon: <Layers size={15} />, color: "var(--gold)" },
              { href: "/students/new", label: "Register New Student", icon: <Users size={15} />, color: "#1d4ed8" },
              { href: "/subjects", label: "Manage Subjects", icon: <BookOpen size={15} />, color: "#16a34a" },
              { href: "/scores", label: "Enter Assessment Scores", icon: <BarChart2 size={15} />, color: "#9333ea" },
              { href: "/results", label: "View Results & Rankings", icon: <TrendingUp size={15} />, color: "#dc2626" },
            ].map(({ href, label, icon, color }) => (
              <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "var(--cream)", color: "var(--navy)", fontSize: 14, fontWeight: 500, transition: "background 0.15s" }}>
                <span style={{ color }}>{icon}</span>{label}
              </Link>
            ))}
          </div>
        </div>

        {/* Class Streams overview */}
        <div style={{ background: "var(--white)", borderRadius: 12, padding: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: 16, marginBottom: 16, color: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Class Streams
            <Link href="/streams" style={{ fontSize: 12, color: "var(--gold)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>View All →</Link>
          </h2>
          {streams.length === 0 ? (
            <p style={{ color: "var(--slate)", fontSize: 13 }}>No streams yet. <Link href="/streams" style={{ color: "var(--gold)" }}>Create one</Link></p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {streams.slice(0, 6).map((s: any) => (
                <Link key={s.id} href={`/streams/${s.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "var(--cream)", color: "var(--navy)", fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Award size={14} color="var(--gold)" />
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--slate)", background: "var(--white)", padding: "2px 8px", borderRadius: 20, border: "1px solid var(--border)" }}>{s.studentCount} students</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "var(--navy)", borderRadius: 10, color: "var(--slate-light)", fontSize: 12 }}>
        <span style={{ color: "var(--gold)" }}>ℹ</span> Ikonex Academy SMS — Built with Next.js + SQLite. For production, configure a PostgreSQL <code style={{ background: "rgba(255,255,255,0.08)", padding: "0 4px", borderRadius: 3 }}>DATABASE_URL</code> in your environment.
      </div>
    </div>
  );
}
