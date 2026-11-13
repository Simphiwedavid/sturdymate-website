import { db } from "@/db";
import { users, notes, flashcards, quizzes, quizAttempts, exams, checklistItems, activities } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getCurrentUserId, todayStr } from "@/lib/auth";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const [user] = await db.select().from(users).where(eq(users.id, uid));
  const today = todayStr();
  // streak logic
  let streak = user.streak || 0;
  if (user.lastStudyDate !== today) {
    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    streak = user.lastStudyDate === yesterday ? streak + 1 : (user.lastStudyDate ? 1 : streak);
    if (!user.lastStudyDate) streak = 1;
    await db.update(users).set({ streak, lastStudyDate: today }).where(eq(users.id, uid));
  }
  const [noteCount] = await db.select({ c: sql<number>`count(*)` }).from(notes).where(eq(notes.userId, uid));
  const [cardCount] = await db.select({ c: sql<number>`count(*)` }).from(flashcards).where(eq(flashcards.userId, uid));
  const [knownCount] = await db.select({ c: sql<number>`count(*)` }).from(flashcards).where(eq(flashcards.userId, uid));
  const attempts = await db.select().from(quizAttempts).where(eq(quizAttempts.userId, uid)).orderBy(desc(quizAttempts.id)).limit(20);
  const avgScore = attempts.length ? Math.round(attempts.reduce((a,b)=>a + (b.total? b.score/b.total*100:0),0)/attempts.length) : 0;
  const examList = await db.select().from(exams).where(eq(exams.userId, uid)).orderBy(desc(exams.id));
  const checklist = await db.select().from(checklistItems).where(eq(checklistItems.userId, uid)).orderBy(desc(checklistItems.id));
  const recent = await db.select().from(activities).where(eq(activities.userId, uid)).orderBy(desc(activities.id)).limit(10);
  const quizList = await db.select().from(quizzes).where(eq(quizzes.userId, uid)).orderBy(desc(quizzes.id)).limit(10);
  // weak topics: subjects with lowest quiz scores
  const bySubject: Record<string,{score:number;total:number}> = {};
  for (const a of attempts) {
    const q = quizList.find(x=>x.id===a.quizId);
    const subj = q?.subject || "General";
    if (!bySubject[subj]) bySubject[subj]={score:0,total:0};
    bySubject[subj].score+=a.score; bySubject[subj].total+=a.total;
  }
  const weakTopics = Object.entries(bySubject).map(([s,v])=>({ subject:s, pct: v.total? Math.round(v.score/v.total*100):0 })).sort((a,b)=>a.pct-b.pct).slice(0,4);
  const doneChecklist = checklist.filter(c=>c.done).length;
  const { passwordHash, ...safeUser } = user as any;
  return Response.json({
    user: { ...safeUser, streak },
    stats: { notes: Number(noteCount.c), flashcards: Number(cardCount.c), attempts: attempts.length, avgScore, exams: examList.length, checklistDone: doneChecklist, checklistTotal: checklist.length, weakTopics },
    exams: examList, checklist, recent, attempts, quizzes: quizList,
  });
}
