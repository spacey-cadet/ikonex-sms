import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { cuid } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { subjectId } = await req.json();
  try {
    await db.execute({ sql: "INSERT INTO ClassStreamSubject (id, classStreamId, subjectId) VALUES (?,?,?)", args: [cuid(), id, subjectId] });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already assigned" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { subjectId } = await req.json();
  await db.execute({ sql: "DELETE FROM ClassStreamSubject WHERE classStreamId=? AND subjectId=?", args: [id, subjectId] });
  return NextResponse.json({ ok: true });
}
