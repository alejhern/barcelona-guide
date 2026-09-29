import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getMemories } from "@/lib/data";
import { fail, parsePlan, readBody } from "@/lib/plans";
import { denied } from "@/lib/session";
import { sb } from "@/lib/supabase/server";
import type { Plan } from "@/types";

type Ctx = { params: Promise<{ id: string }> };
const OK_ID = /^[a-z0-9-]{1,80}$/;
const notFound = () => NextResponse.json({ error: "Plan no encontrado." }, { status: 404 });

export async function PATCH(req: Request, { params }: Ctx) {
  const d = await denied(true);
  if (d) return d;
  const { id } = await params;
  if (!OK_ID.test(id)) return notFound();
  try {
    const rows = await sb<Plan>(`plans?id=eq.${id}`, { method: "PATCH", body: parsePlan(await readBody(req), true) });
    return rows[0] ? NextResponse.json(rows[0]) : notFound();
  } catch (e) { return fail(e); }
}

export async function DELETE(_: Request, { params }: Ctx) {
  const d = await denied(true);
  if (d) return d;
  const { id } = await params;
  if (!OK_ID.test(id)) return notFound();
  try {
    const mems = await getMemories(id);
    if (mems.length && process.env.BLOB_READ_WRITE_TOKEN) await del(mems.map((m) => m.imageUrl)).catch(() => {});
    await sb(`plans?id=eq.${id}`, { method: "DELETE" });
    return NextResponse.json({ ok: true });
  } catch (e) { return fail(e); }
}
