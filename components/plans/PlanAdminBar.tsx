"use client";
import { call } from "@/lib/api";
import type { Plan } from "@/types";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlanFormModal } from "./PlanFormModal";

const btn =
  "inline-flex items-center gap-1.5 rounded-sm border border-ink/25 px-3 py-1.5 text-sm hover:border-ink/60 disabled:opacity-60";

export function PlanAdminBar({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    setBusy(true);
    setError("");
    const r = await call(`/api/plans/${plan.id}`, "PATCH", {
      visited: !plan.visited,
    });
    setBusy(false);
    if (r.ok) router.refresh();
    else setError(r.error ?? "");
  }
  async function remove() {
    if (
      !confirm(
        "¿Eliminar este plan y todas sus fotografías? No se puede deshacer.",
      )
    )
      return;
    setBusy(true);
    setError("");
    const r = await call(`/api/plans/${plan.id}`, "DELETE");
    if (r.ok) {
      router.push("/planes");
      router.refresh();
    } else {
      setBusy(false);
      setError(r.error ?? "");
    }
  }
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 rounded-sm bg-sun/20 p-3">
      <span className="mr-1 text-xs text-ink/60">Administrador</span>
      {!plan.visited && (
        <button onClick={toggle} disabled={busy} className={btn}>
          <CheckCircle2 size={15} aria-hidden />
          Marcar como hecho
        </button>
      )}
      <button onClick={() => setEdit(true)} disabled={busy} className={btn}>
        <Pencil size={15} aria-hidden />
        Editar
      </button>
      <button onClick={remove} disabled={busy} className={`${btn} text-clay`}>
        <Trash2 size={15} aria-hidden />
        Eliminar
      </button>
      {error && (
        <p role="alert" className="w-full text-sm text-clay">
          {error}
        </p>
      )}
      <PlanFormModal open={edit} onClose={() => setEdit(false)} plan={plan} />
    </div>
  );
}
