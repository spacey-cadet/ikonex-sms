import { NextRequest, NextResponse } from "next/server";
import db, { initDB } from "@/lib/db";
import { cuid } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await initDB();
  const studentId = req.nextUrl.searchParams.get("studentId");
  const subjectId = req.nextUrl.searchParams.get("subjectId");
  const streamId = req.nextUrl.searchParams.get("streamId");
  const term = req.nextUrl.searchParams.get("term") || "Term 1";
  const year = req.nextUrl.searchParams.get("year") || "2025";

  if (studentId) {
    const res = await db.execute({
      sql: `SELECT sc.*, s.name as subjectName, s.code as subjectCode 
            FROM Score sc JOIN Subject s ON s.id=sc.subjectId 
            WHERE sc.studentId=? AND sc.term=? AND sc.year=?`,
      args: [studentId, term, year],
    });
    return NextResponse.json(res.rows);
  }

  if (streamId && subjectId) {
    const res = await db.execute({
      sql: `SELECT sc.*, st.firstName, st.lastName, st.admNo
            FROM Score sc 
            JOIN Student st ON st.id=sc.studentId
            WHERE st.classStreamId=? AND sc.subjectId=? AND sc.term=? AND sc.year=?
            ORDER BY (sc.examScore+sc.catScore) DESC`,
      args: [streamId, subjectId, term, year],
    });
    return NextResponse.json(res.rows);
  }

  const res = await db.execute({ sql: "SELECT * FROM Score WHERE term=? AND year=?", args: [term, year] });
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  await initDB();
  const { studentId, subjectId, examScore, catScore, term, year } = await req.json();
  if (!studentId || !subjectId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (examScore < 0 || examScore > 80) return NextResponse.json({ error: "Exam score must be 0-80" }, { status: 400 });
  if (catScore < 0 || catScore > 20) return NextResponse.json({ error: "CAT score must be 0-20" }, { status: 400 });
  const id = cuid();
  try {
    await db.execute({ sql: "INSERT INTO Score (id,studentId,subjectId,examScore,catScore,term,year) VALUES (?,?,?,?,?,?,?)", args: [id, studentId, subjectId, examScore, catScore, term || "Term 1", year || 2025] });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e: any) {
    if (e.message?.includes("UNIQUE")) return NextResponse.json({ error: "Score already recorded for this student/subject/term/year" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await initDB();
  const { studentId, subjectId, examScore, catScore, term, year } = await req.json();
  if (examScore < 0 || examScore > 80) return NextResponse.json({ error: "Exam score must be 0-80" }, { status: 400 });
  if (catScore < 0 || catScore > 20) return NextResponse.json({ error: "CAT score must be 0-20" }, { status: 400 });
  await db.execute({ sql: "UPDATE Score SET examScore=?,catScore=?,updatedAt=datetime('now') WHERE studentId=? AND subjectId=? AND term=? AND year=?", args: [examScore, catScore, studentId, subjectId, term, year] });
  return NextResponse.json({ ok: true });
}
