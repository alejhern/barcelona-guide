import type { Plan } from "@/types";
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";
/** URL de reserva con el plan como respuesta prefijada (a1). Para el widget embebido, usar esta misma URL en el iframe/popup. */
export function bookingUrl(plan: Plan) {
  if (!CALENDLY_URL) return null;
  try { const u = new URL(CALENDLY_URL); u.searchParams.set("a1", plan.title); return u.toString(); } catch { return null; }
}
