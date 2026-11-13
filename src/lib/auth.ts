import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "studymate-dev-secret-change-in-production";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(candidate));
  } catch { return false; }
}
export function signToken(userId: number): string {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 1000*60*60*24*30 })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
export function verifyToken(token: string): number | null {
  try {
    const [payload, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return null;
    return data.userId;
  } catch { return null; }
}
export async function getCurrentUserId(): Promise<number | null> {
  const store = await cookies();
  const token = store.get("studymate_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}
export async function setSession(userId: number) {
  const store = await cookies();
  store.set("studymate_session", signToken(userId), { httpOnly: true, path: "/", maxAge: 60*60*24*30, sameSite: "lax" });
}
export async function clearSession() {
  const store = await cookies();
  store.delete("studymate_session");
}
export function todayStr() { return new Date().toISOString().slice(0,10); }
