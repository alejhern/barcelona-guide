import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, getRole } from "./auth";
import { supabaseReady } from "./supabase/server";

export async function currentRole() { return getRole((await cookies()).get(COOKIE)?.value); }
/** Devuelve la respuesta de error si no hay permiso (o falta Supabase); null si se puede continuar. */
export async function denied(adminOnly: boolean): Promise<NextResponse | null> {
  const role = await currentRole();
  if (!role) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (adminOnly && role !== "admin") return NextResponse.json({ error: "Solo el administrador puede hacerlo." }, { status: 403 });
  if (!supabaseReady()) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 503 });
  return null;
}
