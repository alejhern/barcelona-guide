"use client";
import { Check, Circle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MapView } from "./MapView";
import type { Plan } from "@/types";

export function MapExplorer({ plans }: { plans: Plan[] }) {
  const [show, setShow] = useState({ visited: true, pending: true });
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => { const id = new URLSearchParams(location.search).get("lugar"); if (id) setSel(id); }, []);
  const shown = useMemo(() => plans.filter((p) => (p.visited ? show.visited : show.pending)).sort((a, b) => Number(b.visited) - Number(a.visited)), [show, plans]);
  const fromMap = (id: string) => {
    setSel(id);
    if (matchMedia("(min-width:1024px)").matches) document.getElementById(`row-${id}`)?.scrollIntoView({ block: "nearest" });
  };
  const toggle = (k: keyof typeof show, label: string) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={show[k]} onChange={() => setShow({ ...show, [k]: !show[k] })} className="size-4 accent-clay" />{label}</label>
  );
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[340px_1fr] lg:items-start">
      <div className="sticky top-[57px] z-10 -mx-4 bg-cream/95 px-4 py-2 lg:static lg:order-2 lg:m-0 lg:bg-transparent lg:p-0">
        <MapView plans={shown} selectedId={sel} onSelect={fromMap} className="h-[42dvh] lg:h-[72dvh]" />
      </div>
      <aside aria-label="Travel log" className="lg:order-1 lg:max-h-[72dvh] lg:overflow-y-auto lg:pr-1">
        <h2 className="text-2xl">Travel log</h2>
        <p className="text-sm text-ink/60">{plans.filter((p) => p.visited).length} de {plans.length} planes hechos</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{toggle("visited", "Hechos")}{toggle("pending", "Pendientes")}</div>
        <ul className="mt-4 space-y-2">
          {shown.map((p) => (
            <li key={p.id} id={`row-${p.id}`}>
              <button onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className={`w-full rounded-sm border p-3 text-left ${sel === p.id ? "border-clay bg-[#fffdf8] shadow-sm" : "border-ink/10 hover:border-ink/30"}`}>
                <span className="block font-serif text-lg leading-tight">{p.title}</span>
                <span className="block text-xs text-ink/55">{p.category} · {p.duration}</span>
                <span className="mt-1 block text-sm text-ink/75">{p.description}</span>
                <span className={`mt-2 inline-flex items-center gap-1.5 text-xs ${p.visited ? "text-olive" : "text-ink/60"}`}>
                  {p.visited ? <Check size={14} aria-hidden /> : <Circle size={12} aria-hidden />}{p.visited ? "Ya hemos estado aquí." : "Todavía pendiente."}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
