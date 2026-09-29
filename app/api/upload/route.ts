import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { denied } from "@/lib/session";
import { sb } from "@/lib/supabase/server";
import type { Memory, Plan } from "@/types";

const ALLOWED: Record<string, string[]> = { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"] };
const MAX = 5 * 1024 * 1024;
const err = (status: number, error: string) => NextResponse.json({ error }, { status });

/** Crea un recuerdo: valida, comprueba que el plan está hecho, sube a Blob y guarda en Supabase. */
export async function POST(req: Request) {
  const d = await denied(false); // cualquiera de las dos contraseñas
  if (d) return d;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const planId = String(form?.get("planId") ?? "");
  const date = String(form?.get("date") ?? "");
  const caption = String(form?.get("caption") ?? "").trim().slice(0, 140);
  if (!(file instanceof File)) return err(400, "Falta la fotografía.");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED[file.type]?.includes(ext)) return err(415, "Formato no admitido. Usa JPG, PNG o WEBP.");
  if (file.size > MAX) return err(413, "La fotografía supera los 5 MB.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return err(400, "Fecha no válida.");
  if (!/^[a-z0-9-]{1,80}$/.test(planId)) return err(404, "Plan no encontrado.");
  try {
    const [plan] = await sb<Plan>(`plans?select=id,visited,latitude,longitude&id=eq.${planId}`);
    if (!plan) return err(404, "Plan no encontrado.");
    if (!plan.visited) return err(403, "Solo se pueden añadir fotos a planes marcados como hechos.");
    if (!process.env.BLOB_READ_WRITE_TOKEN) return err(503, "Vercel Blob no está configurado.");
    let url: string;
    try { url = (await put(`memories/${crypto.randomUUID()}.${ext}`, file, { access: "public", contentType: file.type })).url; }
    catch (e) { console.error(e); return err(502, "No se pudo subir a Vercel Blob. Revisa BLOB_READ_WRITE_TOKEN."); }
    try {
      const [row] = await sb<Memory>("memories", { method: "POST", body: { planId, imageUrl: url, caption, date, latitude: plan.latitude, longitude: plan.longitude } });
      return NextResponse.json(row, { status: 201 });
    } catch (e) { console.error(e); await del(url).catch(() => {}); return err(502, "No se pudo guardar la fotografía."); }
  } catch (e) { console.error(e); return err(500, "Error inesperado."); }
}
