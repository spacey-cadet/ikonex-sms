import { NextRequest, NextResponse } from "next/server";
import db, { initDB } from "@/lib/db";
import { cuid } from "@/lib/utils";

export async function GET() {
  await initDB();
  const res = await db.execute("SELECT * FROM Subject ORDER BY name");
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  await initDB();
  const { name, code, description } = await req.json();
  if (!name || !code) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const id = cuid();
  try {
    await db.execute({ sql: "INSERT INTO Subject (id,name,code,description) VALUES (?,?,?,?)", args: [id, name, code, description || null] });
    const row = await db.execute({ sql: "SELECT * FROM Subject WHERE id=?", args: [id] });
    return NextResponse.json(row.rows[0], { status: 201 });
  } catch (e: any) {
    if (e.message?.includes("UNIQUE")) return NextResponse.json({ error: "Subject name or code already exists" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
