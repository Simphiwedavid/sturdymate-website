import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, country, grade, curriculum, subjects } = await req.json();
    if (!name || !email || !password) return Response.json({ error: "Name, email and password are required." }, { status: 400 });
    if (password.length < 6) return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing.length) return Response.json({ error: "An account with this email already exists. Try logging in." }, { status: 409 });
    const [user] = await db.insert(users).values({
      name, email: email.toLowerCase(), passwordHash: hashPassword(password),
      country: country || "South Africa", grade: grade || 10, curriculum: curriculum || "CAPS",
      subjects: subjects || [],
    }).returning();
    await setSession(user.id);
    return Response.json({ user: { id: user.id, name: user.name, email: user.email, country: user.country, grade: user.grade, curriculum: user.curriculum, subjects: user.subjects, plan: user.plan, dailyGoal: user.dailyGoal, streak: user.streak } });
  } catch (e:any) { return Response.json({ error: e.message || "Registration failed." }, { status: 500 }); }
}
