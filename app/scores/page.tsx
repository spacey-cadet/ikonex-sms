"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Btn from "@/components/Btn";
import FormField, { inputStyle } from "@/components/FormField";
import { Save, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

const TERMS = ["Term 1","Term 2","Term 3"];
const YEARS = [2023,2024,2025,2026];

function ScoresInner() {
  const sp = useSearchParams();
  const [streams, setStreams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [streamSubjects, setStreamSubjects] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, { exam: string; cat: string }>>({});
  const [existing, setExisting] = useState<any[]>([]);
  const [selStream, setSelStream] = useState(sp.get("streamId") || "");
  const [selSubject, setSelSubject] = useState("");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(2025);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/streams").then(r => r.json()).then(d => setStreams(Array.isArray(d) ? d : []));
    fetch("/api/subjects").then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    if (!selStream) { setStudents([]); setStreamSubjects([]); setSelSubject(""); return; }
    fetch(`/api/students?streamId=${selStream}`).then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : []));
    fetch(`/api/streams/${selStream}`).then(r => r.json()).then(d => setStreamSubjects(d.subjects || []));
  }, [selStream]);

  useEffect(() => {
    if (!selStream || !selSubject) { setExisting([]); setScores({}); return; }
    fetch(`/api/scores?streamId=${selStream}&subjectId=${selSubject}&term=${encodeURIComponent(term)}&year=${year}`)
      .then(r => r.json()).then(d => {
        const data = Array.isArray(d) ? d : [];
        setExisting(data);
        const init: Record<string, { exam: string; cat: string }> = {};
        data.forEach((sc: any) => { init[sc.studentId] = { exam: String(sc.examScore), cat: String(sc.catScore) }; });
        setScores(init);
      });
  }, [selStream, selSubject, term, year]);

  const setScore = (studentId: string, field: "exam" | "cat", value: string) => {
    setScores(s => ({ ...s, [studentId]: { ...s[studentId], [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    let saved = 0, errors = 0;
    for (const student of students) {
      const sc = scores[student.id];
      if (!sc) continue;
      const examScore = parseFloat(sc.exam || "0");
      const catScore = parseFloat(sc.cat || "0");
      if (isNaN(examScore) || isNaN(catScore)) continue;
      const isExisting = existing.find((e: any) => e.studentId === student.id);
      const url = "/api/scores";
      const method = isExisting ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: student.id, subjectId: selSubject, examScore, catScore, term, year }) });
      if (r.ok) saved++; else errors++;
    }
    setSaving(false);
    if (saved > 0) toast.success(`Saved ${saved} score${saved > 1 ? "s" : ""}`);
    if (errors > 0) toast.error(`${errors} error(s) — check score ranges`);
    // Reload
    fetch(`/api/scores?streamId=${selStream}&subjectId=${selSubject}&term=${encodeURIComponent(term)}&year=${year}`)
      .then(r => r.json()).then(d => { setExisting(Array.isArray(d) ? d : []); });
  };

  return (
    <div>
      <PageHeader title="Assessments" subtitle="Record examination and CAT scores per subject" />

      {/* Filters */}
      <div style={{ background: "var(--white)", borderRadius: 12, padding: 20, border: "1px solid var(--border)", marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <FormField label="Class Stream">
          <select style={inputStyle} value={selStream} onChange={e => { setSelStream(e.target.value); setSelSubject(""); }}>
            <option value="">-- Select --</option>
            {streams.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FormField>
        <FormField label="Subject">
          <select style={inputStyle} value={selSubject} onChange={e => setSelSubject(e.target.value)} disabled={!selStream}>
            <option value="">-- Select --</option>
            {streamSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FormField>
        <FormField label="Term">
          <select style={inputStyle} value={term} onChange={e => setTerm(e.target.value)}>
            {TERMS.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Year">
          <select style={inputStyle} value={year} onChange={e => setYear(Number(e.target.value))}>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </FormField>
      </div>

      {!selStream || !selSubject ? (
        <div style={{ background: "var(--white)", borderRadius: 12, padding: "60px 24px", textAlign: "center", border: "1px solid var(--border)" }}>
          <BarChart2 size={36} color="var(--slate-light)" style={{ marginBottom: 10 }} />
          <p style={{ color: "var(--slate)" }}>Select a class stream and subject to enter scores</p>
        </div>
      ) : students.length === 0 ? (
        <div style={{ background: "var(--white)", borderRadius: 12, padding: "40px 24px", textAlign: "center", border: "1px solid var(--border)", color: "var(--slate)" }}>No students in this stream</div>
      ) : (
        <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, color: "var(--navy)", fontWeight: 600 }}>
              {streams.find(s => s.id === selStream)?.name} — {streamSubjects.find(s => s.id === selSubject)?.name} — {term} {year}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--slate)" }}>Exam max: 80 | CAT max: 20</span>
              <Btn onClick={handleSave} disabled={saving}><Save size={14} />{saving ? "Saving..." : "Save All Scores"}</Btn>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--cream)" }}>
                {["#","Adm No","Student Name","Exam Score (0-80)","CAT Score (0-20)","Total","Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((st: any, i: number) => {
                const sc = scores[st.id] || { exam: "", cat: "" };
                const exam = parseFloat(sc.exam || "0") || 0;
                const cat = parseFloat(sc.cat || "0") || 0;
                const total = exam + cat;
                const isExisting = !!existing.find((e: any) => e.studentId === st.id);
                return (
                  <tr key={st.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 16px", fontSize: 13, color: "var(--slate)" }}>{i + 1}</td>
                    <td style={{ padding: "8px 16px", fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--slate)" }}>{st.admNo}</td>
                    <td style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500 }}>{st.firstName} {st.lastName}</td>
                    <td style={{ padding: "8px 16px" }}>
                      <input type="number" min="0" max="80" step="0.5" value={sc.exam}
                        onChange={e => setScore(st.id, "exam", e.target.value)}
                        style={{ width: 80, padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, outline: "none", textAlign: "center" }} />
                    </td>
                    <td style={{ padding: "8px 16px" }}>
                      <input type="number" min="0" max="20" step="0.5" value={sc.cat}
                        onChange={e => setScore(st.id, "cat", e.target.value)}
                        style={{ width: 80, padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, outline: "none", textAlign: "center" }} />
                    </td>
                    <td style={{ padding: "8px 16px" }}>
                      <span style={{ fontWeight: 700, fontFamily: "'DM Mono',monospace", color: total >= 50 ? "var(--green)" : total >= 40 ? "var(--gold)" : "var(--red)", fontSize: 14 }}>{sc.exam || sc.cat ? total : "—"}</span>
                    </td>
                    <td style={{ padding: "8px 16px" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: isExisting ? "#dcfce7" : "#fef3c7", color: isExisting ? "#16a34a" : "#92400e", fontWeight: 600 }}>
                        {isExisting ? "Recorded" : "New"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={handleSave} disabled={saving}><Save size={14} />{saving ? "Saving..." : "Save All Scores"}</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScoresPage() {
  return <Suspense fallback={<div>Loading...</div>}><ScoresInner /></Suspense>;
}
