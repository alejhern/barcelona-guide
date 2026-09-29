import { sb, storageSignedUrl } from "@/lib/supabase/server";
import type { Memory, Plan } from "@/types";

const withSignedUrls = (memories: Memory[]) =>
  Promise.all(
    memories.map(async (memory) => {
      try {
        return { ...memory, imageUrl: await storageSignedUrl(memory.imageUrl) };
      } catch (error) {
        console.error("No se pudo firmar la imagen de Supabase Storage", error);
        return { ...memory, imageUrl: "" };
      }
    }),
  );

/** Planes con su portada: la foto más reciente de cada plan. */
export async function getPlans(): Promise<Plan[]> {
  const [plans, rawMems] = await Promise.all([
    sb<Plan>("plans?select=*&order=title.asc"),
    sb<Memory>("memories?select=planId,imageUrl&order=createdAt.desc"),
  ]);
  const mems = await withSignedUrls(rawMems);
  const cover = new Map<string, string>();
  for (const m of mems)
    if (m.planId && !cover.has(m.planId)) cover.set(m.planId, m.imageUrl);
  return plans.map((p) => ({ ...p }));
}
export async function getPlan(id: string) {
  return (await getPlans()).find((p) => p.id === id) ?? null;
}
export async function getMemories(planId?: string) {
  const memories = await sb<Memory>(
    `memories?select=*&order=createdAt.desc${planId ? `&planId=eq.${encodeURIComponent(planId)}` : ""}`,
  );
  return withSignedUrls(memories);
}
