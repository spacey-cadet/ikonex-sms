"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import StudentForm from "@/components/StudentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function NewStudentInner() {
  const sp = useSearchParams();
  const streamId = sp.get("streamId") || undefined;
  return <StudentForm defaultStreamId={streamId} />;
}

export default function NewStudentPage() {
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link href="/students" style={{ fontSize: 13, color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 4 }}><ArrowLeft size={13} /> Back to Students</Link>
      </div>
      <PageHeader title="Register Student" subtitle="Add a new student to the system" />
      <Suspense fallback={<div>Loading...</div>}>
        <NewStudentInner />
      </Suspense>
    </div>
  );
}
