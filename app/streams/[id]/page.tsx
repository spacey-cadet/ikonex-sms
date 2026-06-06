"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Btn from "@/components/Btn";
import Modal from "@/components/Modal";
import FormField, { inputStyle } from "@/components/FormField";
import { BookOpen, Users, Plus, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function StreamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [stream, setStream] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [showAssign, setShowAssign] = useState(false);
  const [selSubject, setSelSubject] = useState("");

  const load = () => {
    fetch(`/api/streams/${id}`).then(r => r.json()).then(d => {
      setStream(d);
      setSubjects(d.subjects || []);
    });
    fetch("/api/subjects").then(r => r.json()).then(setAllSubjects);
  };
  useEffect(() => { load(); }, [id]);

  const assignSubject = async () => {
    if (!selSubject) return;
    const r = await fetch(`/api/streams/${id}/subjects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subjectId: selSubject }) });
    if (!r.ok) { toast.error("Already assigned or error"); return; }
    toast.success("Subject assigned");
    setShowAssign(false);
    load();
  };

  const removeSubject = async (subjectId: string) => {
    await fetch(`/api/streams/${id}/subjects`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subjectId }) });
    toast.success("Subject removed");
    load();
  };

  if (!stream) return <div style={{ padding: 40, color: "var(--slate)" }}>Loading...</div>;

  const unassigned = allSubjects.filter(s => !subjects.find((as: any) => as.id === s.id));

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link href="/streams" style={{ fontSize: 13, color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 4 }}><ArrowLeft size={13} /> Back to Streams</Link>
      </div>
      <PageHeader title={stream.name} subtitle={`${stream.form} — Section ${stream.section}`} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Students */}
        <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}><Users size={16} color="var(--gold)" /> Students ({stream.students?.length || 0})</h2>
            <Link href={`/students/new?streamId=${id}`}><Btn style={{ fontSize: 12, padding: "6px 12px" }}><Plus size={12} /> Add</Btn></Link>
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {(!stream.students || stream.students.length === 0) ? (
              <p style={{ padding: 20, color: "var(--slate)", fontSize: 13 }}>No students in this stream</p>
            ) : stream.students.map((s: any) => (
              <Link key={s.id} href={`/students/${s.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid var(--border)", color: "var(--navy)", fontSize: 14 }}>
                <span style={{ fontWeight: 500 }}>{s.firstName} {s.lastName}</span>
                <span style={{ fontSize: 12, color: "var(--slate)", fontFamily: "'DM Mono',monospace" }}>{s.admNo}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}><BookOpen size={16} color="var(--gold)" /> Subjects ({subjects.length})</h2>
            <Btn style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { setSelSubject(""); setShowAssign(true); }}><Plus size={12} /> Assign</Btn>
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {subjects.length === 0 ? (
              <p style={{ padding: 20, color: "var(--slate)", fontSize: 13 }}>No subjects assigned</p>
            ) : subjects.map((s: any) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: "var(--slate)", marginLeft: 8, fontFamily: "'DM Mono',monospace" }}>{s.code}</span>
                </div>
                <button onClick={() => removeSubject(s.id)} style={{ border: "none", background: "none", color: "var(--red)", cursor: "pointer", padding: 4 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <Link href={`/scores?streamId=${id}`}><Btn variant="outline">Enter Scores for this Stream</Btn></Link>
        <Link href={`/results?streamId=${id}`}><Btn variant="outline">View Results</Btn></Link>
      </div>

      {showAssign && (
        <Modal title="Assign Subject to Stream" onClose={() => setShowAssign(false)}>
          <div style={{ padding: 24 }}>
            <FormField label="Select Subject">
              <select style={inputStyle} value={selSubject} onChange={e => setSelSubject(e.target.value)}>
                <option value="">-- Choose subject --</option>
                {unassigned.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </FormField>
            {unassigned.length === 0 && <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>All subjects are already assigned to this stream.</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowAssign(false)}>Cancel</Btn>
              <Btn onClick={assignSubject} disabled={!selSubject}>Assign</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
