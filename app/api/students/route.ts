import { NextRequest, NextResponse } from "next/server";
import db, { initDB } from "@/lib/db";
import { cuid } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await initDB();
  const streamId = req.nextUrl.searchParams.get("streamId");
  let sql = "SELECT s.*, cs.name as streamName FROM Student s JOIN ClassStream cs ON cs.id=s.classStreamId";
  const args: any[] = [];
  if (streamId) { sql += " WHERE s.classStreamId=?"; args.push(streamId); }
  sql += " ORDER BY s.lastName, s.firstName";
  const res = await db.execute({ sql, args });
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  await initDB();
  const { admNo, firstName, lastName, dateOfBirth, gender, guardianName, guardianPhone, classStreamId } = await req.json();
  if (!admNo || !firstName || !lastName || !gender || !classStreamId)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const id = cuid();
  try {
    await db.execute({ sql: "INSERT INTO Student (id,admNo,firstName,lastName,dateOfBirth,gender,guardianName,guardianPhone,classStreamId) VALUES (?,?,?,?,?,?,?,?,?)", args: [id, admNo, firstName, lastName, dateOfBirth || null, gender, guardianName || null, guardianPhone || null, classStreamId] });
    const row = await db.execute({ sql: "SELECT s.*, cs.name as streamName FROM Student s JOIN ClassStream cs ON cs.id=s.classStreamId WHERE s.id=?", args: [id] });
    return NextResponse.json(row.rows[0], { status: 201 });
  } catch (e: any) {
    if (e.message?.includes("UNIQUE")) return NextResponse.json({ error: "Admission number already exists" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
