import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/db";

export async function GET() {
  await initDB();
  const res = await db.execute("SELECT * FROM GradingScale ORDER BY minScore DESC");
  return NextResponse.json(res.rows);
}
