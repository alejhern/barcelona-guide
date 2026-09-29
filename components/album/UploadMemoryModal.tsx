"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

const field = "mt-1 w-full rounded-sm border border-ink/25 bg-white/70 px-3 py-2 text-base";

export function UploadMemoryModal({ open, planId, onClose, onDone }: { open: boolean; planId: string; onClose: () => void; onDone: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    f.set("planId", planId);
    setBusy(true); setError("");
    const r = await fetch("/api/upload", { method: "POST", body: f });
    setBusy(false);
    if (r.ok) onDone(); else setError((await r.json().catch(() => ({}))).error ?? "No se pudo subir la fotografía.");
  }
  return (
    <Modal open={open} onClose={onClose} title="Añadir fotografía">
      <h2 className="pr-8 text-2xl">Añadir fotografía</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Fotografía (JPG, PNG o WEBP, máx. 5 MB)<input name="file" type="file" required accept="image/jpeg,image/png,image/webp" className={field} /></label>
        <label className="block text-sm font-medium">Fecha<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={field} /></label>
        <label className="block text-sm font-medium">Descripción<input name="caption" maxLength={140} className={field} /></label>
        {error && <p role="alert" className="text-sm text-clay">{error}</p>}
        <button disabled={busy} className="w-full rounded-sm bg-ink px-4 py-3 font-medium text-cream disabled:opacity-60">{busy ? "Subiendo…" : "Guardar fotografía"}</button>
      </form>
    </Modal>
  );
}
