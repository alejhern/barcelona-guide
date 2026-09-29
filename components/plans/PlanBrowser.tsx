"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PlanCard } from "./PlanCard";
import { PlanFormModal } from "./PlanFormModal";
import { CATEGORIES } from "@/lib/categories";
import type { Plan } from "@/types";

export function PlanBrowser({ plans, admin }: { plans: Plan[]; admin: boolean }) {
  const [cat, setCat] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const list = plans.filter((p) => !cat || p.category === cat);
  const chip = (on: boolean) => `rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap ${on ? "border-ink bg-ink text-cream" : "border-ink/25 hover:border-ink/60"}`;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">Planes</h1>
          <p className="mt-2 text-ink/70">¿Qué exploramos hoy? Elige un plan y reserva día y hora.</p>
        </div>
        {admin && <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-medium text-cream"><Plus size={18} aria-hidden />Nuevo plan</button>}
      </div>
      <div role="group" aria-label="Categorías" className="-mx-4 mt-6 mb-8 flex gap-2 overflow-x-auto px-4 pb-2">
        <button aria-pressed={!cat} onClick={() => setCat(null)} className={chip(!cat)}>Todos</button>
        {CATEGORIES.map(([c, e]) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}><span aria-hidden>{e}</span> {c}</button>)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}><PlanCard plan={p} /></motion.div>)}
        </AnimatePresence>
      </div>
      {list.length === 0 && <p className="mt-8 text-ink/60">{plans.length === 0 ? `Todavía no hay planes.${admin ? " Crea el primero con «Nuevo plan»." : ""}` : "Todavía no hay planes en esta categoría."}</p>}
      {admin && <PlanFormModal open={creating} onClose={() => setCreating(false)} />}
    </>
  );
}
