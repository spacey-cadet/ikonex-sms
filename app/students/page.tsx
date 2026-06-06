"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Btn from "@/components/Btn";
import { Plus, Search, Users, Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [filterStream, setFilterStream] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    const url = filterStream ? `/api/students?streamId=${filterStream}` : "/api/students";
    fetch(url).then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : []));
  };
  useEffect(() => { fetch("/api/streams").then(r => r.json()).then(d => setStreams(Array.isArray(d) ? d : [])); }, []);
  useEffect(() => { load(); }, [filterStream]);

  const handleDelete = async (s: any) => {
    if (!confirm(`Delete student "${s.firstName} ${s.lastName}"?`)) return;
    await fetch(`/api/students/${s.id}`, { method: "DELETE" });
    toast.success("Student deleted");
    load();
  };

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.admNo}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Students" subtitle="Manage student registrations"
        action={<Link href="/students/new"><Btn><Plus size={15} /> Register Student</Btn></Link>} />

      <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {/* Filters */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--slate)" }} />
            <input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: "100%", padding: "8px 8px 8px 32px", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" }} />
          </div>
          <select value={filterStream} onChange={e => setFilterStream(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none", color: "var(--navy)" }}>
            <option value="">All Streams</option>
            {streams.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <span style={{ fontSize: 13, color: "var(--slate)" }}>{filtered.length} students</span>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <Users size={36} color="var(--slate-light)" style={{ marginBottom: 10 }} />
            <p style={{ color: "var(--slate)", marginBottom: 12 }}>No students found</p>
            <Link href="/students/new"><Btn><Plus size={14} /> Register First Student</Btn></Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--cream)" }}>
                {["Adm No","Name","Gender","Stream","Guardian","Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "'DM Mono',monospace", color: "var(--slate)" }}>{s.admNo}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{s.firstName} {s.lastName}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--slate)" }}>{s.gender}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, background: "var(--navy)", color: "var(--gold-light)", padding: "3px 8px", borderRadius: 20, fontWeight: 500 }}>{s.streamName}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--slate)" }}>{s.guardianName || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link href={`/students/${s.id}`}><button style={{ border: "1px solid var(--border)", background: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "var(--slate)" }}><Eye size={13} /></button></Link>
                      <Link href={`/students/${s.id}/edit`}><button style={{ border: "1px solid var(--border)", background: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "var(--slate)" }}><Pencil size={13} /></button></Link>
                      <button onClick={() => handleDelete(s)} style={{ border: "1px solid #fee2e2", background: "#fff1f1", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
