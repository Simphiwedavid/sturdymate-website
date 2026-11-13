import { db } from "@/db";
import { flashcards, notes, activities } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";
import { generateFlashcardsFromText } from "@/lib/ai";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const list = await db.select().from(flashcards).where(eq(flashcards.userId, uid)).orderBy(desc(flashcards.id));
  return Response.json({ flashcards: list });
}

export async function POST(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const body = await req.json();
  if (body.noteId) {
    const [note] = await db.select().from(notes).where(and(eq(notes.id, body.noteId), eq(notes.userId, uid)));
    if (!note) return Response.json({ error: "Note not found." }, { status: 404 });
    const cards = generateFlashcardsFromText(note.content, note.subject || "General");
    if (!cards.length) return Response.json({ error: "Could not generate flashcards from that note — add more detail." }, { status: 400 });
    const created = [];
    for (const c of cards) {
      const [card] = await db.insert(flashcards).values({ userId: uid, noteId: note.id, front: c.front, back: c.back, subject: note.subject || "General" }).returning();
      created.push(card);
    }
    await db.insert(activities).values({ userId: uid, label: `Created ${created.length} flashcards from "${note.title}"`, type: "flashcard" });
    return Response.json({ flashcards: created });
  }
  if (!body.front?.trim() || !body.back?.trim()) return Response.json({ error: "Front and back are both required." }, { status: 400 });
  const [card] = await db.insert(flashcards).values({ userId: uid, front: body.front, back: body.back, subject: body.subject || "General" }).returning();
  return Response.json({ flashcards: [card] });
}

export async function PATCH(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { id, known } = await req.json();
  const [existing] = await db.select().from(flashcards).where(and(eq(flashcards.id, id), eq(flashcards.userId, uid)));
  if (!existing) return Response.json({ error: "Card not found." }, { status: 404 });
  const [card] = await db.update(flashcards).set({ known, reviewCount: (existing.reviewCount||0)+1 }).where(eq(flashcards.id, id)).returning();
  return Response.json({ card });
}

export async function DELETE(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { id } = await req.json();
  await db.delete(flashcards).where(and(eq(flashcards.id, id), eq(flashcards.userId, uid)));
  return Response.json({ ok: true });
}
