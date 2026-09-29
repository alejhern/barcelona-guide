import { NextRequest, NextResponse } from "next/server";
import { COOKIE, getRole } from "@/lib/auth";

export function proxy(req: NextRequest) {
  if (getRole(req.cookies.get(COOKIE)?.value)) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.redirect(new URL("/login", req.url));
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/login).*)"] };
