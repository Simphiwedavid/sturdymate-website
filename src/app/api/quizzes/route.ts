import { db } from "@/db";
import { quizzes, quizAttempts, notes, activities } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";
import { generateQuizFromText, generateQuizFromTopic } from "@/lib/ai";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const list = await db.select().from(quizzes).where(eq(quizzes.userId, uid)).orderBy(desc(quizzes.id)).limit(30);
  const attempts = await db.select().from(quizAttempts).where(eq(quizAttempts.userId, uid)).orderBy(desc(quizAttempts.id)).limit(30);
  return Response.json({ quizzes: list, attempts });
}

export async function POST(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { subject, topic, difficulty, count, noteId, title } = await req.json();
  let questions: any[] = [];
  if (noteId) {
    const [note] = await db.select().from(notes).where(and(eq(notes.id, noteId), eq(notes.userId, uid)));
    if (!note) return Response.json({ error: "Note not found." }, { status: 404 });
    questions = generateQuizFromText({ text: note.content, subject: note.subject || "General", topic: note.topic || "", difficulty: difficulty || "medium", count: count || 5 });
    if (!questions.length) return Response.json({ error: "Your note is too short to generate a quiz. Add more detail and try again." }, { status: 400 });
    const [quiz] = await db.insert(quizzes).values({ userId: uid, title: title || `Quiz: ${note.title}`, subject: note.subject || "General", topic: note.topic || "", difficulty: difficulty || "medium", questions }).returning();
    await db.insert(activities).values({ userId: uid, label: `Generated quiz from "${note.title}"`, type: "quiz" });
    return Response.json({ quiz });
  }
  if (!topic?.trim()) return Response.json({ error: "Choose a topic or a note to generate a quiz from." }, { status: 400 });
  questions = generateQuizFromTopic({ subject: subject || "General", topic, difficulty: difficulty || "medium", count: count || 5 });
  const [quiz] = await db.insert(quizzes).values({ userId: uid, title: title || `Quiz: ${topic}`, subject: subject || "General", topic, difficulty: difficulty || "medium", questions }).returning();
  await db.insert(activities).values({ userId: uid, label: `Generated quiz on ${topic}`, type: "quiz" });
  return Response.json({ quiz });
}

export async function PATCH(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { quizId, answers } = await req.json();
  const [quiz] = await db.select().from(quizzes).where(and(eq(quizzes.id, quizId), eq(quizzes.userId, uid)));
  if (!quiz) return Response.json({ error: "Quiz not found." }, { status: 404 });
  const qs = quiz.questions || [];
  let score = 0;
  const results = qs.map((q:any, i:number) => {
    const correct = answers?.[i] === q.answer;
    if (correct) score++;
    return { q: q.q, yourAnswer: answers?.[i] || "", correctAnswer: q.answer, correct, explanation: q.explanation };
  });
  await db.insert(quizAttempts).values({ userId: uid, quizId, score, total: qs.length, answers: results });
  await db.insert(activities).values({ userId: uid, label: `Completed quiz "${quiz.title}" — ${score}/${qs.length}`, type: "quiz" });
  return Response.json({ score, total: qs.length, results });
}
