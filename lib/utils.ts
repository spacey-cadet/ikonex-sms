export function cuid(): string {
  return crypto.randomUUID();
}

export function getGrade(score: number, scales: any[]): { grade: string; points: number } {
  const sorted = [...scales].sort((a, b) => b.minScore - a.minScore);
  for (const s of sorted) {
    if (score >= s.minScore && score <= s.maxScore) {
      return { grade: s.grade, points: s.points };
    }
  }
  return { grade: "E", points: 1 };
}

export function calcTotal(exam: number, cat: number): number {
  return exam + cat;
}
