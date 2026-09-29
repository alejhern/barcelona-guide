"use client";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Plan } from "@/types";

/** `url` llega ya construido desde el servidor (lib/calendly); null si Calendly no está configurado. */
export function BookingModal({ plan, url }: { plan: Plan; url: string | null }) {
  const [open, setOpen] = useState(false);
  const [dateStep, setDateStep] = useState(false);
  const close = () => { setOpen(false); setDateStep(false); };
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-sm bg-clay px-6 py-3 font-medium text-white">Elegir este plan</button>
      <Modal open={open} onClose={close} title={`Elegir ${plan.title}`}>
        <h2 className="pr-8 text-2xl">{plan.title}</h2>
        <p className="mt-1 text-sm text-ink/70">{plan.duration} · {plan.distance}</p>
        {!dateStep ? (
          <button onClick={() => setDateStep(true)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-4 py-3 font-medium text-cream"><CalendarDays size={18} aria-hidden />Seleccionar fecha</button>
        ) : url ? (
          <>
            <p className="mt-5 text-sm text-ink/75">Se abrirá el calendario para elegir día y hora.</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 block rounded-sm bg-clay px-4 py-3 text-center font-medium text-white">Reservar este plan</a>
          </>
        ) : (
          <p role="status" className="mt-5 rounded-sm bg-sun/30 p-3 text-sm">El calendario todavía no está configurado. Añade NEXT_PUBLIC_CALENDLY_URL en el entorno para activar la reserva.</p>
        )}
      </Modal>
    </>
  );
}
