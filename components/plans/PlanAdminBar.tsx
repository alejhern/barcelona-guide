"use client";
import { Modal } from "@/components/ui/Modal";
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
  const [doneModal, setDoneModal] = useState(false);
  const [doneDate, setDoneDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function markAsDone() {
    setBusy(true);
    setError("");
    const r = await call(`/api/plans/${plan.id}`, "PATCH", {
      visited: true,
      date: doneDate,
    });
    setBusy(false);
    if (r.ok) {
      setDoneModal(false);
      router.refresh();
    } else setError(r.error ?? "No se pudo marcar el plan como hecho.");
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
        <button
          onClick={() => setDoneModal(true)}
          disabled={busy}
          className={btn}
        >
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
      <Modal
        open={doneModal}
        onClose={() => setDoneModal(false)}
        title="Marcar plan como hecho"
      >
        <h2 className="pr-8 text-2xl">¿Cuándo hiciste este plan?</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void markAsDone();
          }}
          className="mt-4 space-y-4"
        >
          <label className="block text-sm font-medium">
            Fecha
            <input
              type="date"
              required
              value={doneDate}
              onChange={(event) => setDoneDate(event.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/25 bg-white/70 px-3 py-2 text-base"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !doneDate}
            className="w-full rounded-sm bg-ink px-4 py-3 font-medium text-cream disabled:opacity-60"
          >
            {busy ? "Guardando…" : "Marcar como hecho"}
          </button>
        </form>
      </Modal>
      <PlanFormModal open={edit} onClose={() => setEdit(false)} plan={plan} />
    </div>
  );
}
