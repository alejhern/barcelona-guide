import { PlanCard } from "@/components/plans/PlanCard";
import { Polaroid } from "@/components/ui/Polaroid";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getPlans } from "@/lib/data";
import { supabaseReady } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

const HERO = [
  {
    place: "Gràcia",
    sub: "14 sept 2026",
    tone: "#a5643f",
    rotate: -4,
    alt: "Plaza de Gràcia",
  },
  {
    place: "Montjuïc",
    sub: "Atardecer",
    tone: "#d27a4a",
    rotate: 3,
    alt: "Atardecer en Montjuïc",
  },
  {
    place: "El Born",
    sub: "Calles y luz",
    tone: "#b4553a",
    rotate: 2,
    alt: "Calles de El Born",
  },
  {
    place: "Barceloneta",
    sub: "Mar",
    tone: "#2f6f8f",
    rotate: -3,
    alt: "Playa de la Barceloneta",
  },
];

export default async function Home() {
  if (!supabaseReady()) return <SetupNotice />;
  const plans = await getPlans().catch(() => []);
  plans.sort((a, b) => Number(a.visited) - Number(b.visited));
  const done = plans.filter((p) => p.visited).length;
  return (
    <>
      <section className="grid items-center gap-10 py-6 md:grid-cols-2 md:py-14">
        <div>
          <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Barcelona, a nuestra manera.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/75">
            Una selección de lugares, planes y rincones para descubrir la
            ciudad.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/planes"
              className="rounded-sm bg-ink px-5 py-3 font-medium text-cream"
            >
              Descubrir Barcelona
            </Link>
            <Link
              href="/mapa"
              className="rounded-sm border border-ink/30 px-5 py-3 font-medium"
            >
              Ver el mapa
            </Link>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4 px-1">
          {HERO.map((h, i) => (
            <div key={h.place} className={i % 2 ? "mt-8" : ""}>
              <Polaroid {...h} delay={i * 0.12} />
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="log"
        className="my-10 border-y border-ink/15 py-6"
      >
        <h2 id="log" className="text-2xl">
          Travel log
        </h2>
        <p className="mt-1 text-ink/70">
          {done} de {plans.length} planes ya hechos.{" "}
          <Link
            href="/mapa"
            className="font-semibold text-clay underline-offset-4 hover:underline"
          >
            Ver en el mapa.
          </Link>
        </p>
      </section>

      <section aria-labelledby="hoy">
        <h2 id="hoy" className="mb-5 text-3xl">
          ¿Qué exploramos hoy?
        </h2>
        {plans.length === 0 ? (
          <p className="text-ink/65">Todavía no hay planes.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.slice(0, 3).map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
