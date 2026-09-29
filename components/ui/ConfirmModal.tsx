"use client";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  busy,
  title = "Eliminar fotografía",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  busy?: boolean;
  title?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="pr-6">
        <div className="flex items-center gap-3 text-clay">
          <span className="grid size-10 place-items-center rounded-full bg-clay/10">
            <AlertTriangle size={20} aria-hidden />
          </span>
          <h2 className="font-serif text-2xl">¿Eliminar fotografía?</h2>
        </div>
        <p className="mt-4 text-ink/70">
          Esta acción borrará la fotografía del álbum y no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-sm border border-ink/20 px-4 py-2.5 font-medium hover:bg-ink/5 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-sm bg-clay px-4 py-2.5 font-medium text-cream disabled:opacity-60"
          >
            {busy ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
