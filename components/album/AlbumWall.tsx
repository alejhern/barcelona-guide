"use client";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Modal } from "@/components/ui/Modal";
import { Notice } from "@/components/ui/Notice";
import { Photo, Polaroid } from "@/components/ui/Polaroid";
import { fmtDate, ROTATIONS, toneOf } from "@/lib/utils";
import type { Memory, Plan } from "@/types";
import { Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AlbumWall({
  memories,
  plans,
}: {
  memories: Memory[];
  plans: Plan[];
}) {
  const router = useRouter();
  const [sel, setSel] = useState<Memory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Memory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const info = (m: Memory) => {
    const p = plans.find((x) => x.id === m.planId);
    return {
      place: p?.title ?? "Barcelona",
      tone: toneOf(p?.category),
      alt: `${m.caption || "Fotografía"} — ${p?.title ?? "Barcelona"}`,
    };
  };
  const s = sel && info(sel);
  async function removeMemory() {
    if (!pendingDelete?.planId) return;
    setDeleting(true);
    setError("");
    const response = await fetch(
      `/api/plans/${pendingDelete.planId}/${pendingDelete.id}`,
      { method: "DELETE" },
    );
    if (response.ok) {
      setPendingDelete(null);
      setSel(null);
      setNotice("Fotografía eliminada del álbum.");
      router.refresh();
    } else {
      setError(
        (await response.json().catch(() => ({}))).error ??
          "No se pudo eliminar la fotografía.",
      );
    }
    setDeleting(false);
  }
  return (
    <>
      <h1 className="text-4xl sm:text-5xl">Barcelona en fotos.</h1>
      <p className="mt-2 text-ink/70">Los sitios que ya hemos descubierto.</p>
      {memories.length === 0 && (
        <p className="mt-8 text-ink/65">
          Todavía no hay fotografías. Se añaden desde la página de cada plan
          hecho.
        </p>
      )}
      <div className="mt-10 columns-2 gap-5 md:columns-3 lg:columns-4">
        {memories.map((m, i) => {
          const plan = plans.find((x) => x.id === m.planId);
          const { place, tone, alt } = info(m);
          return (
            <div
              key={m.id}
              className={`mb-7 break-inside-avoid ${i % 3 === 1 ? "mx-auto w-[88%]" : ""}`}
            >
              <Polaroid
                src={m.imageUrl}
                alt={alt}
                place={place}
                sub={plan?.date ? fmtDate(plan.date) : ""}
                tone={tone}
                rotate={ROTATIONS[i % ROTATIONS.length]}
                delay={i * 0.06}
                tall={i % 2 === 0}
                onClick={() => setSel(m)}
              />
            </div>
          );
        })}
      </div>
      <Modal
        open={!!sel}
        onClose={() => setSel(null)}
        title="Fotografía ampliada"
        wide
      >
        {sel && s && (
          <figure className="relative bg-[#fffdf8] p-3 pb-4 shadow-md">
            <div className="aspect-[4/3] overflow-hidden">
              <Photo
                src={sel.imageUrl}
                alt={s.alt}
                tone={s.tone}
                label={s.place}
              />
            </div>
            <figcaption className="pt-3">
              <p className="font-serif text-2xl">{s.place}</p>
              <p className="text-sm text-ink/60">
                {(() => {
                  const plan = plans.find((x) => x.id === sel.planId);
                  return plan?.date ? fmtDate(plan.date, true) : "";
                })()}
              </p>
              {sel.caption && <p className="mt-2 text-ink/80">{sel.caption}</p>}
            </figcaption>
            <button
              type="button"
              onClick={() => setPendingDelete(sel)}
              aria-label="Eliminar fotografía"
              title="Eliminar fotografía"
              className="absolute top-2 right-2 rounded-full border border-clay/40 p-1.5 text-clay hover:bg-clay/10"
            >
              <Minus size={18} aria-hidden />
            </button>
            {error && (
              <p role="alert" className="mt-3 text-sm text-clay">
                {error}
              </p>
            )}
          </figure>
        )}
      </Modal>
      <ConfirmModal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={removeMemory}
        busy={deleting}
      />
      <Notice message={notice} onClose={() => setNotice("")} />
    </>
  );
}
