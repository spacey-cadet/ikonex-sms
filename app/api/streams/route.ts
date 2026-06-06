import { NextRequest, NextResponse } from "next/server";
import db, { initDB } from "@/lib/db";
import { cuid } from "@/lib/utils";

export async function GET() {
  await initDB();
  const res = await db.execute(`
    SELECT cs.*, COUNT(s.id) as studentCount 
    FROM ClassStream cs 
    LEFT JOIN Student s ON s.classStreamId = cs.id 
    GROUP BY cs.id ORDER BY cs.name
  `);
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  await initDB();
  const { name, form, section } = await req.json();
  if (!name || !form || !section) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const id = cuid();
  await db.execute({ sql: "INSERT INTO ClassStream (id, name, form, section) VALUES (?,?,?,?)", args: [id, name, form, section] });
  const row = await db.execute({ sql: "SELECT * FROM ClassStream WHERE id=?", args: [id] });
  return NextResponse.json(row.rows[0], { status: 201 });
}
