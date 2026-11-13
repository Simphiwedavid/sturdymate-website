import { db } from "@/db";
import { users, chatMessages, activities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUserId, todayStr } from "@/lib/auth";
import { generateExplanation } from "@/lib/ai";

const LIMITS: Record<string, number> = { free: 20, premium: 200 };

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const msgs = await db.select().from(chatMessages).where(eq(chatMessages.userId, uid)).orderBy(desc(chatMessages.id)).limit(60);
  return Response.json({ messages: msgs.reverse() });
}

export async function POST(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Please log in to use the AI assistant." }, { status: 401 });
  const { question, subject, level, length } = await req.json();
  if (!question?.trim()) return Response.json({ error: "Please type a question first." }, { status: 400 });
  const [user] = await db.select().from(users).where(eq(users.id, uid));
  const today = todayStr();
  let used = user.aiUsedDate === today ? (user.aiUsedToday || 0) : 0;
  const limit = LIMITS[user.plan || "free"] || 20;
  if (used >= limit) return Response.json({ error: `You've reached your ${user.plan} limit of ${limit} AI questions today. Upgrade to Premium for more, or come back tomorrow.` }, { status: 429 });

  const { text, mode } = await generateExplanation({ question, subject: subject || "General", level: level || "intermediate", length: length || "normal", grade: user.grade || 10, curriculum: user.curriculum || "CAPS" });

  await db.insert(chatMessages).values({ userId: uid, role: "user", content: question, subject, level });
  await db.insert(chatMessages).values({ userId: uid, role: "assistant", content: text, subject, level });
  await db.update(users).set({ aiUsedToday: used + 1, aiUsedDate: today }).where(eq(users.id, uid));
  await db.insert(activities).values({ userId: uid, label: `Asked AI about ${subject || "a topic"}`, type: "chat" });
  return Response.json({ answer: text, mode, remaining: limit - (used + 1) });
}
