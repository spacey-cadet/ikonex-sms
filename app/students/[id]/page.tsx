"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Btn from "@/components/Btn";
import { ArrowLeft, User, BarChart2, Pencil } from "lucide-react";
import Link from "next/link";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/students/${id}`).then(r => r.json()).then(setStudent);
    fetch(`/api/scores?studentId=${id}`).then(r => r.json()).then(d => setScores(Array.isArray(d) ? d : []));
  }, [id]);

  if (!student) return <div style={{ padding: 40, color: "var(--slate)" }}>Loading...</div>;

  const totalMarks = scores.reduce((sum, s) => sum + (s.examScore || 0) + (s.catScore || 0), 0);
  const avg = scores.length > 0 ? (totalMarks / scores.length).toFixed(1) : "—";

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link href="/students" style={{ fontSize: 13, color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 4 }}><ArrowLeft size={13} /> Back</Link>
      </div>
      <PageHeader title={`${student.firstName} ${student.lastName}`} subtitle={`Adm No: ${student.admNo} · ${student.streamName}`}
        action={<Link href={`/students/${id}/edit`}><Btn variant="outline"><Pencil size={14} /> Edit Student</Btn></Link>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* Info card */}
        <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ background: "var(--navy)", padding: "24px 20px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <User size={28} color="var(--navy)" />
            </div>
            <div style={{ fontSize: 18, fontFamily: "'Playfair Display',serif", color: "var(--white)", fontWeight: 700 }}>{student.firstName} {student.lastName}</div>
            <div style={{ fontSize: 12, color: "var(--slate-light)", marginTop: 4 }}>{student.streamName}</div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {[
              ["Admission No", student.admNo],
              ["Gender", student.gender],
              ["Date of Birth", student.dateOfBirth || "—"],
              ["Guardian", student.guardianName || "—"],
              ["Guardian Phone", student.guardianPhone || "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                <span style={{ color: "var(--slate)", fontWeight: 500 }}>{label}</span>
                <span style={{ color: "var(--navy)", fontWeight: 600, textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href={`/scores?studentId=${id}`}><Btn style={{ width: "100%", justifyContent: "center" }}><BarChart2 size={13} /> View/Enter Scores</Btn></Link>
            <Link href={`/results?studentId=${id}`}><Btn variant="outline" style={{ width: "100%", justifyContent: "center" }}>View Report Card</Btn></Link>
          </div>
        </div>

        {/* Scores */}
        <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15 }}>Subject Scores</h2>
            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
              <span style={{ color: "var(--slate)" }}>Total: <strong style={{ color: "var(--navy)" }}>{totalMarks}</strong></span>
              <span style={{ color: "var(--slate)" }}>Average: <strong style={{ color: "var(--navy)" }}>{avg}</strong></span>
            </div>
          </div>
          {scores.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--slate)" }}>
              No scores recorded yet. <Link href={`/scores?studentId=${id}`} style={{ color: "var(--gold)" }}>Enter scores →</Link>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--cream)" }}>
                  {["Subject","Exam (80)","CAT (20)","Total","Term","Year"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scores.map((sc: any) => {
                  const total = (sc.examScore || 0) + (sc.catScore || 0);
                  return (
                    <tr key={sc.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 500 }}>{sc.subjectName}</td>
                      <td style={{ padding: "10px 16px", fontSize: 14 }}>{sc.examScore}</td>
                      <td style={{ padding: "10px 16px", fontSize: 14 }}>{sc.catScore}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontWeight: 700, color: total >= 50 ? "var(--green)" : total >= 40 ? "var(--gold)" : "var(--red)", fontFamily: "'DM Mono',monospace" }}>{total}</span>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "var(--slate)" }}>{sc.term}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "var(--slate)" }}>{sc.year}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
