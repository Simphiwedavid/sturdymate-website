import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return Response.json({ error: "Email and password are required." }, { status: 400 });
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (!user || !verifyPassword(password, user.passwordHash)) return Response.json({ error: "Incorrect email or password." }, { status: 401 });
    await setSession(user.id);
    return Response.json({ user: { id: user.id, name: user.name, email: user.email, country: user.country, grade: user.grade, curriculum: user.curriculum, subjects: user.subjects, plan: user.plan, dailyGoal: user.dailyGoal, streak: user.streak } });
  } catch (e:any) { return Response.json({ error: e.message || "Login failed." }, { status: 500 }); }
}
