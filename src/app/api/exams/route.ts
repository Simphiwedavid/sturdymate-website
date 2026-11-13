import { db } from "@/db";
import { exams, checklistItems, activities } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const examList = await db.select().from(exams).where(eq(exams.userId, uid)).orderBy(desc(exams.id));
  const checklist = await db.select().from(checklistItems).where(eq(checklistItems.userId, uid)).orderBy(desc(checklistItems.id));
  return Response.json({ exams: examList, checklist });
}

export async function POST(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const body = await req.json();
  if (body.kind === "exam") {
    if (!body.title || !body.examDate) return Response.json({ error: "Title and date are required." }, { status: 400 });
    const [exam] = await db.insert(exams).values({ userId: uid, title: body.title, subject: body.subject || "General", examDate: body.examDate, type: body.type || "Exam" }).returning();
    await db.insert(activities).values({ userId: uid, label: `Added exam: ${body.title}`, type: "exam" });
    return Response.json({ exam });
  }
  if (body.kind === "checklist") {
    if (!body.label) return Response.json({ error: "Label is required." }, { status: 400 });
    const [item] = await db.insert(checklistItems).values({ userId: uid, label: body.label, subject: body.subject || "General", examId: body.examId || null }).returning();
    return Response.json({ item });
  }
  if (body.kind === "timetable") {
    // Generate a simple revision timetable from subjects + days until exam
    const subjects: string[] = body.subjects || [];
    const days = Math.max(1, Math.min(30, body.days || 7));
    const created = [];
    for (let d=0; d<days; d++) {
      const subj = subjects[d % (subjects.length||1)] || "Revision";
      const [item] = await db.insert(checklistItems).values({ userId: uid, label: `Day ${d+1}: Revise ${subj} — 45 min focus + 10 past-paper questions`, subject: subj }).returning();
      created.push(item);
    }
    await db.insert(activities).values({ userId: uid, label: `Generated ${days}-day study timetable`, type: "exam" });
    return Response.json({ items: created });
  }
  return Response.json({ error: "Unknown request." }, { status: 400 });
}

export async function PATCH(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { id, done } = await req.json();
  const [item] = await db.update(checklistItems).set({ done }).where(and(eq(checklistItems.id, id), eq(checklistItems.userId, uid))).returning();
  return Response.json({ item });
}

export async function DELETE(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { kind, id } = await req.json();
  if (kind === "exam") await db.delete(exams).where(and(eq(exams.id, id), eq(exams.userId, uid)));
  else await db.delete(checklistItems).where(and(eq(checklistItems.id, id), eq(checklistItems.userId, uid)));
  return Response.json({ ok: true });
}
