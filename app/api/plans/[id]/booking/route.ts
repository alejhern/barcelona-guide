import { denied } from "@/lib/session";
import { sb } from "@/lib/supabase/server";
import type { Plan } from "@/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };
const OK_ID = /^[a-z0-9-]{1,80}$/;
const EVENT_URL =
  /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9_-]+$/;

export async function PATCH(req: Request, { params }: Ctx) {
  const d = await denied(false);
  if (d) return d;
  const { id } = await params;
  if (!OK_ID.test(id))
    return NextResponse.json({ error: "Plan no encontrado." }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    eventUri?: unknown;
  } | null;
  const eventUri = typeof body?.eventUri === "string" ? body.eventUri : "";
  if (!EVENT_URL.test(eventUri))
    return NextResponse.json(
      { error: "Evento de Calendly no válido." },
      { status: 400 },
    );

  const calendlyToken = process.env.CALENDLY_ACCESS_TOKEN;
  if (!calendlyToken)
    return NextResponse.json(
      { error: "Falta configurar CALENDLY_ACCESS_TOKEN." },
      { status: 503 },
    );

  try {
    const calendlyResponse = await fetch(eventUri, {
      headers: { Authorization: `Bearer ${calendlyToken}` },
      cache: "no-store",
    });
    if (!calendlyResponse.ok)
      return NextResponse.json(
        { error: "No se pudo consultar la reserva en Calendly." },
        { status: 502 },
      );
    const calendlyData = (await calendlyResponse.json()) as {
      resource?: { start_time?: string };
    };
    const startTime = calendlyData.resource?.start_time ?? "";
    const parsedStart = new Date(startTime);
    if (Number.isNaN(parsedStart.getTime()))
      return NextResponse.json(
        { error: "Calendly no devolvió una fecha válida." },
        { status: 502 },
      );
    const date = parsedStart.toISOString().slice(0, 10);
    const [plan] = await sb<Plan>(`plans?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { date },
    });
    return plan
      ? NextResponse.json(plan)
      : NextResponse.json({ error: "Plan no encontrado." }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo guardar la fecha de reserva." },
      { status: 500 },
    );
  }
}
