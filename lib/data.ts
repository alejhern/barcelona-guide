import { sb } from "@/lib/supabase/server";
import type { Memory, Plan } from "@/types";

/** Planes con su portada: la foto más reciente de cada plan. */
export async function getPlans(): Promise<Plan[]> {
  const [plans, mems] = await Promise.all([
    sb<Plan>("plans?select=*&order=title.asc"),
    sb<Memory>("memories?select=planId,imageUrl&order=date.desc"),
  ]);
  const cover = new Map<string, string>();
  for (const m of mems)
    if (m.planId && !cover.has(m.planId)) cover.set(m.planId, m.imageUrl);
  return plans.map((p) => ({ ...p }));
}
export async function getPlan(id: string) {
  return (await getPlans()).find((p) => p.id === id) ?? null;
}
export const getMemories = (planId?: string) =>
  sb<Memory>(
    `memories?select=*&order=date.desc${planId ? `&planId=eq.${encodeURIComponent(planId)}` : ""}`,
  );
