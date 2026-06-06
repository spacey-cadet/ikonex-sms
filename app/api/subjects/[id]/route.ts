import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, code, description } = await req.json();
  await db.execute({ sql: "UPDATE Subject SET name=?,code=?,description=?,updatedAt=datetime('now') WHERE id=?", args: [name, code, description || null, id] });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.execute({ sql: "DELETE FROM Subject WHERE id=?", args: [id] });
  return NextResponse.json({ ok: true });
}
