"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Btn from "@/components/Btn";
import Modal from "@/components/Modal";
import FormField, { inputStyle } from "@/components/FormField";
import { Plus, BookOpen, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [loading, setLoading] = useState(false);

  const load = () => fetch("/api/subjects").then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", code: "", description: "" }); setShowModal(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ name: s.name, code: s.code, description: s.description || "" }); setShowModal(true); };
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.code) { toast.error("Name and code are required"); return; }
    setLoading(true);
    const url = editing ? `/api/subjects/${editing.id}` : "/api/subjects";
    const method = editing ? "PUT" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) { toast.error(data.error || "Error"); return; }
    toast.success(editing ? "Subject updated" : "Subject created");
    setShowModal(false); load();
  };

  const handleDelete = async (s: any) => {
    if (!confirm(`Delete subject "${s.name}"?`)) return;
    await fetch(`/api/subjects/${s.id}`, { method: "DELETE" });
    toast.success("Subject deleted"); load();
  };

  return (
    <div>
      <PageHeader title="Subjects" subtitle="Manage school subjects"
        action={<Btn onClick={openAdd}><Plus size={15} /> New Subject</Btn>} />

      <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {subjects.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <BookOpen size={36} color="var(--slate-light)" style={{ marginBottom: 10 }} />
            <p style={{ color: "var(--slate)", marginBottom: 12 }}>No subjects yet</p>
            <Btn onClick={openAdd}><Plus size={14} /> Add First Subject</Btn>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--cream)" }}>
                {["Code","Subject Name","Description","Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, background: "var(--navy)", color: "var(--gold-light)", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>{s.code}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{s.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--slate)" }}>{s.description || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(s)} style={{ border: "1px solid var(--border)", background: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "var(--slate)" }}><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(s)} style={{ border: "1px solid #fee2e2", background: "#fff1f1", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Subject" : "New Subject"} onClose={() => setShowModal(false)}>
          <div style={{ padding: 24 }}>
            <FormField label="Subject Name *">
              <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Mathematics" />
            </FormField>
            <FormField label="Subject Code *">
              <input style={inputStyle} value={form.code} onChange={set("code")} placeholder="e.g. MATH" />
            </FormField>
            <FormField label="Description">
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} value={form.description} onChange={set("description")} placeholder="Optional description" />
            </FormField>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : editing ? "Update" : "Create"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
