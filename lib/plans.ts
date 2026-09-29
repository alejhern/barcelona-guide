import { NextResponse } from "next/server";
import { CATEGORY_NAMES } from "./categories";

export class InputError extends Error {}
export function fail(e: unknown) {
  if (e instanceof InputError)
    return NextResponse.json({ error: e.message }, { status: 400 });
  console.error(e);
  return NextResponse.json(
    { error: "No se pudo guardar. Inténtalo de nuevo." },
    { status: 500 },
  );
}
export async function readBody(req: Request): Promise<Record<string, unknown>> {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object" || Array.isArray(b))
    throw new InputError("Datos no válidos");
  return b as Record<string, unknown>;
}
export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "plan";

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const num = (v: unknown) =>
  typeof v === "number"
    ? v
    : typeof v === "string" && v.trim()
      ? Number(v.replace(",", "."))
      : NaN;
const list = (v: unknown) =>
  Array.isArray(v)
    ? v
        .map((x) => str(x, 120))
        .filter(Boolean)
        .slice(0, 20)
    : [];
const bad = (k: string): never => {
  throw new InputError(`Campo no válido: ${k}`);
};

/** Solo deja pasar los campos permitidos, ya validados. `partial` permite actualizar solo algunos. */
export function parsePlan(b: Record<string, unknown>, partial: boolean) {
  const has = (k: string) => !partial || k in b;
  const o: Record<string, unknown> = {};
  if (has("title")) o.title = str(b.title, 120) || bad("título");
  if (has("imageUrl")) o.imageUrl = str(b.imageUrl, 300) || null;
  if (has("category")) {
    const c = str(b.category, 40);
    o.category = CATEGORY_NAMES.includes(c) ? c : bad("categoría");
  }
  if (has("description")) o.description = str(b.description, 600);
  if (has("date")) {
    const date = str(b.date, 10);
    o.date = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  }
  if (has("duration")) o.duration = str(b.duration, 40) || bad("duración");
  if (has("difficulty")) o.difficulty = str(b.difficulty, 40) || null;
  if (has("distance")) o.distance = str(b.distance, 40) || null;
  if (has("latitude")) {
    const v = num(b.latitude);
    o.latitude = Math.abs(v) <= 90 ? v : bad("latitud");
  }
  if (has("longitude")) {
    const v = num(b.longitude);
    o.longitude = Math.abs(v) <= 180 ? v : bad("longitud");
  }
  if (has("visited")) o.visited = b.visited === true;
  if (has("stops")) o.stops = list(b.stops);
  if (has("tips")) o.tips = list(b.tips);
  if (has("calendlyUrl")) o.calendlyUrl = str(b.calendlyUrl, 300);
  return o;
}
