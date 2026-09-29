"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadMemoryModal } from "@/components/album/UploadMemoryModal";
import { Polaroid } from "@/components/ui/Polaroid";
import { fmtDate, ROTATIONS, toneOf } from "@/lib/utils";
import type { Memory, Plan } from "@/types";

export function PlanPhotos({ plan, memories }: { plan: Plan; memories: Memory[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!plan.visited) return <p className="mt-3 text-ink/65">Las fotografías se podrán añadir cuando este plan esté marcado como hecho.</p>;
  return (
    <>
      <button onClick={() => setOpen(true)} className="mt-3 inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-medium text-cream"><Plus size={18} aria-hidden />Añadir fotografía</button>
      {memories.length === 0 ? <p className="mt-4 text-ink/65">Todavía no hay fotos de este plan.</p> : (
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {memories.map((m, i) => <Polaroid key={m.id} src={m.imageUrl} alt={`${m.caption || "Fotografía"} — ${plan.title}`} place={plan.title} sub={`${fmtDate(m.date)}${m.caption ? ` · ${m.caption}` : ""}`} tone={toneOf(plan.category)} rotate={ROTATIONS[i % ROTATIONS.length]} delay={i * 0.06} />)}
        </div>
      )}
      <UploadMemoryModal open={open} planId={plan.id} onClose={() => setOpen(false)} onDone={() => { setOpen(false); router.refresh(); }} />
    </>
  );
}
