import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";

const COOKIE_NAME = "white_house_admin";

function secret() {
  return process.env.AUTH_SECRET || "white-house-dev-secret-change-me";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function createAdminSession(username: string) {
  const payload = Buffer.from(JSON.stringify({ username, createdAt: Date.now() })).toString("base64url");
  const value = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { username: string; createdAt: number };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  return session;
}

export async function validateAdminLogin(username: string, password: string) {
  const fallbackUser = process.env.ADMIN_USERNAME || "admin";
  const fallbackPassword = process.env.ADMIN_PASSWORD || "admin12345";
  try {
    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (user && verifyPassword(password, user.passwordHash)) return true;
  } catch {
    return username === fallbackUser && password === fallbackPassword;
  }
  return username === fallbackUser && password === fallbackPassword;
}
