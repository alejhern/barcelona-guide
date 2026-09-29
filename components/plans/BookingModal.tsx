"use client";
import type { Plan } from "@/types";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

type CalendlyApi = {
  initPopupWidget: (options: { url: string }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

function loadCalendly() {
  if (window.Calendly) return Promise.resolve(window.Calendly);
  return new Promise<CalendlyApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existing) {
      existing.addEventListener(
        "load",
        () => {
          if (window.Calendly) resolve(window.Calendly);
          else reject(new Error("Calendly no está disponible."));
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => reject(new Error("No se pudo cargar Calendly.")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.Calendly) resolve(window.Calendly);
      else reject(new Error("Calendly no está disponible."));
    };
    script.onerror = () => reject(new Error("No se pudo cargar Calendly."));
    document.body.appendChild(script);
  });
}

export function BookingModal({ plan }: { plan: Plan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(stylesheet);
    return () => stylesheet.remove();
  }, []);

  async function reserve(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (!plan.calendlyUrl) return;
    setLoading(true);
    setError(false);
    try {
      const calendly = await loadCalendly();
      calendly.initPopupWidget({ url: plan.calendlyUrl });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!plan.visited && plan.calendlyUrl && (
        <a
          href={plan?.calendlyUrl ?? "#"}
          onClick={reserve}
          aria-disabled={!plan.calendlyUrl || loading}
          className="inline-flex items-center gap-2 rounded-sm bg-clay px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarDays size={18} aria-hidden />
          {loading ? "Cargando calendario..." : "Reservar este plan"}
        </a>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-clay">
          No se pudo cargar el calendario. Inténtalo de nuevo.
        </p>
      )}
    </>
  );
}
