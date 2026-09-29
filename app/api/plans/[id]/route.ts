import { fail, parsePlan, readBody } from "@/lib/plans";
import { denied } from "@/lib/session";
import { sb, storageRemove, storageUpload } from "@/lib/supabase/server";
import type { Memory, Plan } from "@/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };
const OK_ID = /^[a-z0-9-]{1,80}$/;
const notFound = () =>
  NextResponse.json({ error: "Plan no encontrado." }, { status: 404 });

export async function PATCH(req: Request, { params }: Ctx) {
  const d = await denied(true);
  if (d) return d;
  const { id } = await params;
  if (!OK_ID.test(id)) return notFound();
  try {
    const rows = await sb<Plan>(`plans?id=eq.${id}`, {
      method: "PATCH",
      body: parsePlan(await readBody(req), true),
    });
    return rows[0] ? NextResponse.json(rows[0]) : notFound();
  } catch (e) {
    return fail(e);
  }
}

const ALLOWED: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};
const MAX = 2 * 1024 * 1024;
const err = (status: number, error: string) =>
  NextResponse.json({ error }, { status });

/** Crea un recuerdo: valida, comprueba que el plan está hecho, sube a Storage y guarda en Supabase. */
export async function POST(req: Request, { params }: Ctx) {
  const d = await denied(false); // cualquiera de las dos contraseñas
  if (d) return d;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  //coger de params la id del plan
  const { id } = await params;
  const planId = String(id);

  const caption = String(form?.get("caption") ?? "")
    .trim()
    .slice(0, 140);
  if (!(file instanceof File)) return err(400, "Falta la fotografía.");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED[file.type]?.includes(ext))
    return err(415, "Formato no admitido. Usa JPG, PNG o WEBP.");
  if (file.size > MAX) return err(413, "La fotografía supera los 2 MB.");
  if (!/^[a-z0-9-]{1,80}$/.test(planId)) return err(404, "Plan no encontrado.");
  try {
    const [plan] = await sb<Plan>(`plans?select=id,visited&id=eq.${planId}`);
    if (!plan) return err(404, "Plan no encontrado.");
    if (!plan.visited)
      return err(
        403,
        "Solo se pueden añadir fotos a planes marcados como hechos.",
      );
    let url: string;
    try {
      url = await storageUpload(
        `memories/${crypto.randomUUID()}.${ext}`,
        await file.arrayBuffer(),
        file.type,
      );
    } catch (e) {
      console.error(e);
      return err(502, "No se pudo subir la fotografía a Supabase Storage.");
    }
    try {
      const [row] = await sb<Memory>("memories", {
        method: "POST",
        body: { planId, imageUrl: url, caption },
      });
      return NextResponse.json(row, { status: 201 });
    } catch (e) {
      console.error(e);
      await storageRemove([url]).catch(() => {});
      return err(502, "No se pudo guardar la fotografía.");
    }
  } catch (e) {
    console.error(e);
    return err(500, "Error interno del servidor.");
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  const d = await denied(true);
  if (d) return d;
  const { id } = await params;
  if (!OK_ID.test(id)) return notFound();
  try {
    const mems = await sb<Memory>(`memories?select=imageUrl&planId=eq.${id}`);
    if (mems.length)
      await storageRemove(mems.map((m) => m.imageUrl)).catch(() => {});
    await sb(`plans?id=eq.${id}`, { method: "DELETE" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
