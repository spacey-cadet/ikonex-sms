"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StudentForm from "@/components/StudentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  useEffect(() => { fetch(`/api/students/${id}`).then(r => r.json()).then(setStudent); }, [id]);
  if (!student) return <div style={{ padding: 40, color: "var(--slate)" }}>Loading...</div>;
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link href="/students" style={{ fontSize: 13, color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 4 }}><ArrowLeft size={13} /> Back</Link>
      </div>
      <PageHeader title="Edit Student" subtitle={`${student.firstName} ${student.lastName}`} />
      <StudentForm student={student} />
    </div>
  );
}
