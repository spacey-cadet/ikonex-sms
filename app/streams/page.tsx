"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Btn from "@/components/Btn";
import Modal from "@/components/Modal";
import FormField, { inputStyle } from "@/components/FormField";
import { Plus, Layers, Pencil, Trash2, Eye, Users } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const FORMS = ["Form 1","Form 2","Form 3","Form 4"];
const SECTIONS = ["A","B","C","D","E"];

export default function StreamsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", form: "Form 1", section: "A" });
  const [loading, setLoading] = useState(false);

  const load = () => fetch("/api/streams").then(r => r.json()).then(d => setStreams(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", form: "Form 1", section: "A" }); setShowModal(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ name: s.name, form: s.form, section: s.section }); setShowModal(true); };

  const autoName = (f: string, sec: string) => `${f}${sec}`;

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { ...form, name: form.name || autoName(form.form, form.section) };
    const url = editing ? `/api/streams/${editing.id}` : "/api/streams";
    const method = editing ? "PUT" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) { toast.error(data.error || "Error"); return; }
    toast.success(editing ? "Stream updated" : "Stream created");
    setShowModal(false);
    load();
  };

  const handleDelete = async (s: any) => {
    if (!confirm(`Delete stream "${s.name}"? This will also delete all students in it.`)) return;
    await fetch(`/api/streams/${s.id}`, { method: "DELETE" });
    toast.success("Stream deleted");
    load();
  };

  return (
    <div>
      <PageHeader title="Class Streams" subtitle="Manage school class streams and sections"
        action={<Btn onClick={openAdd}><Plus size={15} /> New Stream</Btn>} />

      {streams.length === 0 ? (
        <div style={{ background: "var(--white)", borderRadius: 12, padding: "60px 24px", textAlign: "center", border: "1px solid var(--border)" }}>
          <Layers size={40} color="var(--slate-light)" style={{ marginBottom: 12 }} />
          <p style={{ color: "var(--slate)", marginBottom: 16 }}>No class streams yet</p>
          <Btn onClick={openAdd}><Plus size={15} /> Create First Stream</Btn>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {streams.map((s: any) => (
            <div key={s.id} style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 20, fontFamily: "'Playfair Display',serif", color: "var(--white)", fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "var(--slate-light)", marginTop: 2 }}>{s.form} — Section {s.section}</div>
                </div>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Layers size={18} color="var(--navy)" />
                </div>
              </div>
              <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={14} color="var(--slate)" />
                <span style={{ fontSize: 13, color: "var(--slate)" }}>{s.studentCount} student{s.studentCount !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
                <Link href={`/streams/${s.id}`} style={{ flex: 1 }}>
                  <Btn variant="ghost" style={{ width: "100%", justifyContent: "center" }}><Eye size={13} /> View</Btn>
                </Link>
                <Btn variant="ghost" onClick={() => openEdit(s)}><Pencil size={13} /></Btn>
                <Btn variant="danger" onClick={() => handleDelete(s)}><Trash2 size={13} /></Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Stream" : "New Class Stream"} onClose={() => setShowModal(false)}>
          <div style={{ padding: 24 }}>
            <FormField label="Form">
              <select value={form.form} onChange={e => setForm(f => ({ ...f, form: e.target.value, name: autoName(e.target.value, f.section) }))} style={inputStyle}>
                {FORMS.map(f => <option key={f}>{f}</option>)}
              </select>
            </FormField>
            <FormField label="Section">
              <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value, name: autoName(f.form, e.target.value) }))} style={inputStyle}>
                {SECTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Stream Name (auto-generated or custom)">
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Form 1A" />
            </FormField>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : editing ? "Update" : "Create"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
