import { db } from "@/db";
import { notes, activities, flashcards } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";
import { summariseNote, generateFlashcardsFromText } from "@/lib/ai";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const list = await db.select().from(notes).where(eq(notes.userId, uid)).orderBy(desc(notes.id));
  return Response.json({ notes: list });
}

export async function POST(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const body = await req.json();
  // PDF upload handling
  let { title, subject, topic, content } = body;
  if (body.pdfBase64) {
    try {
      const mod: any = await import("pdf-parse");
      const pdfParse = mod.default || mod;
      const buf = Buffer.from(body.pdfBase64, "base64");
      const parsed = await pdfParse(buf);
      content = parsed.text;
      title = title || body.fileName?.replace(/\.pdf$/i,"") || "Uploaded PDF";
    } catch {
      return Response.json({ error: "Could not read that PDF. Please paste the text instead, or try a different PDF." }, { status: 400 });
    }
  }
  if (!content?.trim()) return Response.json({ error: "Please paste some notes or upload a PDF." }, { status: 400 });
  if (content.length < 40) return Response.json({ error: "Notes are too short — paste a bit more so I can summarise them." }, { status: 400 });
  const { summary, keyConcepts } = summariseNote(content);
  const [note] = await db.insert(notes).values({ userId: uid, title: title || "Untitled note", subject: subject || "General", topic: topic || "", content, summary, keyConcepts }).returning();
  await db.insert(activities).values({ userId: uid, label: `Added note: ${note.title}`, type: "note" });
  return Response.json({ note });
}

export async function DELETE(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { id } = await req.json();
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, uid)));
  await db.delete(flashcards).where(and(eq(flashcards.noteId, id), eq(flashcards.userId, uid)));
  return Response.json({ ok: true });
}
