import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await db.execute({ sql: "SELECT s.*, cs.name as streamName FROM Student s JOIN ClassStream cs ON cs.id=s.classStreamId WHERE s.id=?", args: [id] });
  if (!res.rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res.rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { admNo, firstName, lastName, dateOfBirth, gender, guardianName, guardianPhone, classStreamId } = await req.json();
  await db.execute({ sql: "UPDATE Student SET admNo=?,firstName=?,lastName=?,dateOfBirth=?,gender=?,guardianName=?,guardianPhone=?,classStreamId=?,updatedAt=datetime('now') WHERE id=?", args: [admNo, firstName, lastName, dateOfBirth || null, gender, guardianName || null, guardianPhone || null, classStreamId, id] });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.execute({ sql: "DELETE FROM Student WHERE id=?", args: [id] });
  return NextResponse.json({ ok: true });
}
