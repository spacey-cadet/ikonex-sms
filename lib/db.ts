import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

export default db;

export async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS ClassStream (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      form TEXT NOT NULL,
      section TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Student (
      id TEXT PRIMARY KEY,
      admNo TEXT UNIQUE NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      dateOfBirth TEXT,
      gender TEXT NOT NULL,
      guardianName TEXT,
      guardianPhone TEXT,
      classStreamId TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (classStreamId) REFERENCES ClassStream(id)
    );

    CREATE TABLE IF NOT EXISTS Subject (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ClassStreamSubject (
      id TEXT PRIMARY KEY,
      classStreamId TEXT NOT NULL,
      subjectId TEXT NOT NULL,
      UNIQUE(classStreamId, subjectId),
      FOREIGN KEY (classStreamId) REFERENCES ClassStream(id),
      FOREIGN KEY (subjectId) REFERENCES Subject(id)
    );

    CREATE TABLE IF NOT EXISTS Score (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      subjectId TEXT NOT NULL,
      examScore REAL DEFAULT 0,
      catScore REAL DEFAULT 0,
      term TEXT DEFAULT 'Term 1',
      year INTEGER DEFAULT 2025,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      UNIQUE(studentId, subjectId, term, year),
      FOREIGN KEY (studentId) REFERENCES Student(id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES Subject(id)
    );

    CREATE TABLE IF NOT EXISTS GradingScale (
      id TEXT PRIMARY KEY,
      grade TEXT NOT NULL,
      minScore REAL NOT NULL,
      maxScore REAL NOT NULL,
      points INTEGER NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed default grading scale if empty
  const existing = await db.execute("SELECT COUNT(*) as cnt FROM GradingScale");
  if ((existing.rows[0] as any).cnt === 0) {
    const scales = [
      { grade: "A", min: 75, max: 100, points: 12 },
      { grade: "A-", min: 70, max: 74, points: 11 },
      { grade: "B+", min: 65, max: 69, points: 10 },
      { grade: "B", min: 60, max: 64, points: 9 },
      { grade: "B-", min: 55, max: 59, points: 8 },
      { grade: "C+", min: 50, max: 54, points: 7 },
      { grade: "C", min: 45, max: 49, points: 6 },
      { grade: "C-", min: 40, max: 44, points: 5 },
      { grade: "D+", min: 35, max: 39, points: 4 },
      { grade: "D", min: 30, max: 34, points: 3 },
      { grade: "D-", min: 25, max: 29, points: 2 },
      { grade: "E", min: 0, max: 24, points: 1 },
    ];
    for (const s of scales) {
      await db.execute({
        sql: "INSERT INTO GradingScale (id, grade, minScore, maxScore, points) VALUES (?, ?, ?, ?, ?)",
        args: [crypto.randomUUID(), s.grade, s.min, s.max, s.points],
      });
    }
  }
}
