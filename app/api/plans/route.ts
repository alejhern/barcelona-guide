import { NextResponse } from "next/server";
import { fail, parsePlan, readBody, slugify } from "@/lib/plans";
import { denied } from "@/lib/session";
import { sb } from "@/lib/supabase/server";
import type { Plan } from "@/types";

export async function POST(req: Request) {
  const d = await denied(true);
  if (d) return d;
  try {
    const body = await readBody(req);
    const plan = { ...parsePlan(body, false), id: `${slugify(String(body.title))}-${crypto.randomUUID().slice(0, 4)}` };
    const [row] = await sb<Plan>("plans", { method: "POST", body: plan });
    return NextResponse.json(row, { status: 201 });
  } catch (e) { return fail(e); }
}
