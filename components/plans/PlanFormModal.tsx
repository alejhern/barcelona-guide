"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { call } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import type { Plan } from "@/types";

const input = "mt-1 w-full rounded-sm border border-ink/25 bg-white/70 px-3 py-2 text-base";
const F = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block text-sm font-medium">{t}{children}</label>;

export function PlanFormModal({ open, onClose, plan }: { open: boolean; onClose: () => void; plan?: Plan }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lines = (k: string) => String(f.get(k) ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    const body = { title: f.get("title"), category: f.get("category"), description: f.get("description"), duration: f.get("duration"), difficulty: f.get("difficulty"), distance: f.get("distance"), latitude: f.get("latitude"), longitude: f.get("longitude"), visited: f.get("visited") === "on", stops: lines("stops"), tips: lines("tips") };
    setBusy(true); setError("");
    const r = plan ? await call(`/api/plans/${plan.id}`, "PATCH", body) : await call("/api/plans", "POST", body);
    setBusy(false);
    if (!r.ok) { setError(r.error ?? "No se pudo guardar."); return; }
    onClose(); router.refresh();
    if (!plan && r.data?.id) router.push(`/planes/${r.data.id}`);
  }
  return (
    <Modal open={open} onClose={onClose} title={plan ? "Editar plan" : "Nuevo plan"} wide>
      <h2 className="pr-8 text-2xl">{plan ? "Editar plan" : "Nuevo plan"}</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <F t="Título"><input name="title" required maxLength={120} defaultValue={plan?.title} className={input} /></F>
        <F t="Categoría"><select name="category" defaultValue={plan?.category ?? "Barrios"} className={input}>{CATEGORIES.map(([c]) => <option key={c}>{c}</option>)}</select></F>
        <F t="Descripción"><textarea name="description" rows={3} maxLength={600} defaultValue={plan?.description} className={input} /></F>
        <div className="grid grid-cols-3 gap-3">
          <F t="Duración"><input name="duration" required placeholder="2–3 horas" defaultValue={plan?.duration} className={input} /></F>
          <F t="Dificultad"><input name="difficulty" placeholder="Fácil" defaultValue={plan?.difficulty ?? ""} className={input} /></F>
          <F t="Distancia"><input name="distance" placeholder="4 km" defaultValue={plan?.distance ?? ""} className={input} /></F>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <F t="Latitud"><input name="latitude" required inputMode="decimal" placeholder="41.3954" defaultValue={plan?.latitude} className={input} /></F>
          <F t="Longitud"><input name="longitude" required inputMode="decimal" placeholder="2.1620" defaultValue={plan?.longitude} className={input} /></F>
        </div>
        <p className="text-xs text-ink/60">Copia las coordenadas con clic derecho sobre el punto en Google Maps u OpenStreetMap.</p>
        <F t="Paradas (una por línea)"><textarea name="stops" rows={3} defaultValue={plan?.stops?.join("\n")} className={input} /></F>
        <F t="Recomendaciones (una por línea)"><textarea name="tips" rows={3} defaultValue={plan?.tips?.join("\n")} className={input} /></F>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="visited" defaultChecked={plan?.visited} className="size-4 accent-clay" />Plan ya hecho (permite subir fotografías)</label>
        {error && <p role="alert" className="text-sm text-clay">{error}</p>}
        <button disabled={busy} className="w-full rounded-sm bg-ink px-4 py-3 font-medium text-cream disabled:opacity-60">{busy ? "Guardando…" : "Guardar plan"}</button>
      </form>
    </Modal>
  );
}
