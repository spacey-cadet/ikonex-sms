"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormField, { inputStyle } from "@/components/FormField";
import Btn from "@/components/Btn";
import toast from "react-hot-toast";

export default function StudentForm({ student, defaultStreamId }: { student?: any; defaultStreamId?: string }) {
  const router = useRouter();
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    admNo: student?.admNo || "",
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    dateOfBirth: student?.dateOfBirth || "",
    gender: student?.gender || "Male",
    guardianName: student?.guardianName || "",
    guardianPhone: student?.guardianPhone || "",
    classStreamId: student?.classStreamId || defaultStreamId || "",
  });

  useEffect(() => { fetch("/api/streams").then(r => r.json()).then(d => setStreams(Array.isArray(d) ? d : [])); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.admNo || !form.firstName || !form.lastName || !form.classStreamId) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    const url = student ? `/api/students/${student.id}` : "/api/students";
    const method = student ? "PUT" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) { toast.error(data.error || "Error saving student"); return; }
    toast.success(student ? "Student updated" : "Student registered");
    router.push("/students");
  };

  return (
    <div style={{ background: "var(--white)", borderRadius: 12, padding: 28, border: "1px solid var(--border)", maxWidth: 600 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <FormField label="Admission No *">
          <input style={inputStyle} value={form.admNo} onChange={set("admNo")} placeholder="e.g. ADM001" />
        </FormField>
        <FormField label="Class Stream *">
          <select style={inputStyle} value={form.classStreamId} onChange={set("classStreamId")}>
            <option value="">-- Select Stream --</option>
            {streams.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FormField>
        <FormField label="First Name *">
          <input style={inputStyle} value={form.firstName} onChange={set("firstName")} placeholder="First name" />
        </FormField>
        <FormField label="Last Name *">
          <input style={inputStyle} value={form.lastName} onChange={set("lastName")} placeholder="Last name" />
        </FormField>
        <FormField label="Gender *">
          <select style={inputStyle} value={form.gender} onChange={set("gender")}>
            <option>Male</option><option>Female</option>
          </select>
        </FormField>
        <FormField label="Date of Birth">
          <input style={inputStyle} type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
        </FormField>
        <FormField label="Guardian Name">
          <input style={inputStyle} value={form.guardianName} onChange={set("guardianName")} placeholder="Guardian / Parent name" />
        </FormField>
        <FormField label="Guardian Phone">
          <input style={inputStyle} value={form.guardianPhone} onChange={set("guardianPhone")} placeholder="e.g. 0700000000" />
        </FormField>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : student ? "Update Student" : "Register Student"}</Btn>
        <Btn variant="ghost" onClick={() => router.back()}>Cancel</Btn>
      </div>
    </div>
  );
}
