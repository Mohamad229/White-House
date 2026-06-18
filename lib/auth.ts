import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";

const COOKIE_NAME = "white_house_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }
  return "white-house-dev-secret-change-me";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function createAdminSession(username: string) {
  const payload = Buffer.from(
    JSON.stringify({ username, createdAt: Date.now() }),
  ).toString("base64url");
  const value = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const validSignature =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!validSignature) return null;
  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as {
      username: string;
      createdAt: number;
    };
    if (
      !session.username ||
      !session.createdAt ||
      Date.now() - session.createdAt > SESSION_MAX_AGE_SECONDS * 1000
    ) {
      return null;
    }
    return session;
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
  const envUser = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;
  const hasEnvCredentials = Boolean(envUser && envPassword);
  try {
    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (user && verifyPassword(password, user.passwordHash)) return true;
  } catch {
    return hasEnvCredentials && username === envUser && password === envPassword;
  }
  return hasEnvCredentials && username === envUser && password === envPassword;
}
