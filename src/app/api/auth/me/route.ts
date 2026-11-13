import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";
import { aiMode } from "@/lib/ai";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ user: null, aiMode: aiMode() });
  const [user] = await db.select().from(users).where(eq(users.id, uid));
  if (!user) return Response.json({ user: null, aiMode: aiMode() });
  return Response.json({ user: { id: user.id, name: user.name, email: user.email, country: user.country, grade: user.grade, curriculum: user.curriculum, subjects: user.subjects, plan: user.plan, dailyGoal: user.dailyGoal, streak: user.streak, aiUsedToday: user.aiUsedToday }, aiMode: aiMode() });
}
