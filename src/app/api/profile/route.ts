import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export async function PATCH(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return Response.json({ error: "Not logged in." }, { status: 401 });
  const body = await req.json();
  const updates: any = {};
  if (body.name) updates.name = body.name;
  if (body.country) updates.country = body.country;
  if (body.grade) updates.grade = body.grade;
  if (body.curriculum) updates.curriculum = body.curriculum;
  if (body.subjects) updates.subjects = body.subjects;
  if (body.dailyGoal) updates.dailyGoal = body.dailyGoal;
  if (body.plan && ["free","premium"].includes(body.plan)) updates.plan = body.plan;
  const [user] = await db.update(users).set(updates).where(eq(users.id, uid)).returning();
  return Response.json({ user: { id: user.id, name: user.name, email: user.email, country: user.country, grade: user.grade, curriculum: user.curriculum, subjects: user.subjects, plan: user.plan, dailyGoal: user.dailyGoal, streak: user.streak } });
}
