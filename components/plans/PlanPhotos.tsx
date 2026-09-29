"use client";
import { UploadMemoryModal } from "@/components/album/UploadMemoryModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Notice } from "@/components/ui/Notice";
import { Polaroid } from "@/components/ui/Polaroid";
import { fmtDate, ROTATIONS, toneOf } from "@/lib/utils";
import type { Memory, Plan } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PlanPhotos({
  plan,
  memories,
}: {
  plan: Plan;
  memories: Memory[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  async function removeMemory() {
    if (!pendingDelete) return;
    const memoryId = pendingDelete;
    setDeleting(memoryId);
    setError("");
    const response = await fetch(`/api/plans/${plan.id}/${memoryId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPendingDelete(null);
      setNotice("Fotografía eliminada del álbum.");
      router.refresh();
    } else {
      setError(
        (await response.json().catch(() => ({}))).error ??
          "No se pudo eliminar la fotografía.",
      );
    }
    setDeleting(null);
  }
  if (!plan.visited)
    return (
      <p className="mt-3 text-ink/65">
        Las fotografías se podrán añadir cuando este plan esté marcado como
        hecho.
      </p>
    );
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-medium text-cream"
      >
        <Plus size={18} aria-hidden />
        Añadir fotografía
      </button>
      {memories.length === 0 ? (
        <p className="mt-4 text-ink/65">Todavía no hay fotos de este plan.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {memories.map((m, i) => (
            <div key={m.id} className="relative">
              <Polaroid
                src={m.imageUrl}
                alt={`${m.caption || "Fotografía"} — ${plan.title}`}
                place={plan.title}
                sub={`${plan.date ? fmtDate(plan.date) : ""}${m.caption ? ` · ${m.caption}` : ""}`}
                tone={toneOf(plan.category)}
                rotate={ROTATIONS[i % ROTATIONS.length]}
                delay={i * 0.06}
              />
              <button
                type="button"
                onClick={() => setPendingDelete(m.id)}
                disabled={deleting === m.id}
                aria-label="Eliminar fotografía"
                title="Eliminar fotografía"
                className="absolute top-2 right-2 rounded-full bg-cream/90 p-2 text-clay shadow-sm disabled:opacity-60"
              >
                <Minus size={18} aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {error}
        </p>
      )}
      <ConfirmModal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={removeMemory}
        busy={!!deleting}
      />
      <Notice message={notice} onClose={() => setNotice("")} />
      <UploadMemoryModal
        open={open}
        planId={plan.id}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
