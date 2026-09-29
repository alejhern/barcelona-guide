import { NextResponse } from "next/server";
import { checkPassword, COOKIE, sessionValue } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const role = typeof password === "string" ? checkPassword(password) : null;
  if (!role) {
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(COOKIE, sessionValue(role), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
