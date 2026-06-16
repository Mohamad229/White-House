import { NextResponse } from "next/server";
import { createAdminSession, validateAdminLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "");
  const password = String(body.password || "");
  const valid = await validateAdminLogin(username, password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  await createAdminSession(username);
  return NextResponse.json({ ok: true });
}
