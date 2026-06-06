import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stream = await db.execute({ sql: "SELECT * FROM ClassStream WHERE id=?", args: [id] });
  if (!stream.rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const students = await db.execute({ sql: "SELECT * FROM Student WHERE classStreamId=? ORDER BY lastName", args: [id] });
  const subjects = await db.execute({ sql: "SELECT s.* FROM Subject s JOIN ClassStreamSubject css ON css.subjectId=s.id WHERE css.classStreamId=?", args: [id] });
  return NextResponse.json({ ...stream.rows[0], students: students.rows, subjects: subjects.rows });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, form, section } = await req.json();
  await db.execute({ sql: "UPDATE ClassStream SET name=?,form=?,section=?,updatedAt=datetime('now') WHERE id=?", args: [name, form, section, id] });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.execute({ sql: "DELETE FROM ClassStream WHERE id=?", args: [id] });
  return NextResponse.json({ ok: true });
}
