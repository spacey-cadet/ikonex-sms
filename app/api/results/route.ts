import { NextRequest, NextResponse } from "next/server";
import db, { initDB } from "@/lib/db";
import { getGrade } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await initDB();
  const streamId = req.nextUrl.searchParams.get("streamId");
  const term = req.nextUrl.searchParams.get("term") || "Term 1";
  const year = req.nextUrl.searchParams.get("year") || "2025";

  if (!streamId) return NextResponse.json({ error: "streamId required" }, { status: 400 });

  const gradesRes = await db.execute("SELECT * FROM GradingScale ORDER BY minScore DESC");
  const gradingScales = gradesRes.rows as any[];

  const studentsRes = await db.execute({
    sql: "SELECT * FROM Student WHERE classStreamId=? ORDER BY lastName, firstName",
    args: [streamId],
  });
  const students = studentsRes.rows as any[];

  const subjectsRes = await db.execute({
    sql: "SELECT s.* FROM Subject s JOIN ClassStreamSubject css ON css.subjectId=s.id WHERE css.classStreamId=?",
    args: [streamId],
  });
  const subjects = subjectsRes.rows as any[];

  const scoresRes = await db.execute({
    sql: `SELECT sc.* FROM Score sc 
          JOIN Student st ON st.id=sc.studentId 
          WHERE st.classStreamId=? AND sc.term=? AND sc.year=?`,
    args: [streamId, term, year],
  });
  const allScores = scoresRes.rows as any[];

  const results = students.map((student) => {
    const studentScores = allScores.filter((sc) => sc.studentId === student.id);
    let totalMarks = 0;
    let totalPoints = 0;
    let subjectCount = 0;

    const subjectResults = subjects.map((subj) => {
      const score = studentScores.find((sc) => sc.subjectId === subj.id);
      const total = score ? (score.examScore as number) + (score.catScore as number) : 0;
      const { grade, points } = getGrade(total, gradingScales);
      if (score) { totalMarks += total; subjectCount++; totalPoints += points; }
      return { subjectId: subj.id, subjectName: subj.name, subjectCode: subj.code, examScore: score?.examScore || 0, catScore: score?.catScore || 0, total, grade, points };
    });

    const average = subjectCount > 0 ? totalMarks / subjectCount : 0;
    const meanGrade = getGrade(average, gradingScales);

    return { studentId: student.id, admNo: student.admNo, firstName: student.firstName, lastName: student.lastName, subjectResults, totalMarks, average: Math.round(average * 10) / 10, meanGrade: meanGrade.grade, totalPoints, position: 0 };
  });

  // Rank students
  const ranked = [...results].sort((a, b) => b.totalMarks - a.totalMarks);
  ranked.forEach((r, i) => { r.position = i + 1; });

  // Subject positions
  for (const subj of subjects) {
    const subjScores = ranked
      .map((r) => ({ studentId: r.studentId, score: r.subjectResults.find((s) => s.subjectId === subj.id)?.total || 0 }))
      .sort((a, b) => b.score - a.score);
    subjScores.forEach((ss, i) => {
      const student = ranked.find((r) => r.studentId === ss.studentId);
      if (student) {
        const sr = student.subjectResults.find((s) => s.subjectId === subj.id);
        if (sr) (sr as any).position = i + 1;
      }
    });
  }

  return NextResponse.json({ students: ranked, subjects, term, year, streamId });
}
