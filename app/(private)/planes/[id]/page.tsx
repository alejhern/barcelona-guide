import { MapView } from "@/components/map/MapView";
import { BookingModal } from "@/components/plans/BookingModal";
import { PlanAdminBar } from "@/components/plans/PlanAdminBar";
import { PlanPhotos } from "@/components/plans/PlanPhotos";
import { Photo } from "@/components/ui/Polaroid";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getMemories, getPlan } from "@/lib/data";
import { currentRole } from "@/lib/session";
import { supabaseReady } from "@/lib/supabase/server";
import { fmtDate, toneOf } from "@/lib/utils";
import type { Memory } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseReady()) return <SetupNotice />;
  const { id } = await params;
  const plan = await getPlan(id);
  if (!plan) notFound();
  const [memories, role] = await Promise.all([
    plan.visited ? getMemories(id) : Promise.resolve<Memory[]>([]),
    currentRole(),
  ]);
  const meta = [
    ["Categoría", plan.category],
    ["Fecha", plan.date ? fmtDate(plan.date) : undefined],
    ["Duración", plan.duration],
    ["Dificultad", plan.difficulty],
    ["Distancia", plan.distance],
    ["Estado", plan.visited ? "Ya hemos estado aquí." : "Todavía pendiente."],
  ];
  return (
    <article>
      <Link href="/planes" className="text-sm text-ink/60 hover:text-ink">
        Volver a planes
      </Link>
      <div className="mt-3 aspect-[16/9] max-h-[420px] w-full overflow-hidden rounded-sm">
        <Photo
          src={plan?.imageUrl}
          alt={`${plan.title}, Barcelona`}
          tone={toneOf(plan.category)}
          label={plan.title}
        />
      </div>
      <div className="w-full">
        <h1 className="mt-6 text-4xl sm:text-5xl">{plan.title}</h1>
        <p className="mt-3 text-lg">{plan.description}</p>
      </div>
      {role === "admin" && <PlanAdminBar plan={plan} />}
      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-ink/15 py-4 sm:grid-cols-5">
        {meta.map(
          ([k, v]) =>
            v && (
              <div key={k}>
                <dt className="text-xs text-ink/55">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ),
        )}
      </dl>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section aria-labelledby="info">
          {plan.stops && plan.stops.length > 0 && (
            <>
              <h2 id="info" className="text-2xl">
                Paradas
              </h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                {plan.stops.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </>
          )}
          {plan.tips && plan.tips.length > 0 && (
            <>
              <h2 className={`${plan.stops?.length ? "mt-8 " : ""}text-2xl`}>
                Recomendaciones
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink/80">
                {plan.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}
        </section>
        <MapView plans={[plan]} className="h-72 md:h-full md:min-h-80" />
      </div>
      <div className="mt-10">
        <BookingModal plan={plan} />
      </div>
      <section aria-labelledby="fotos" className="mt-14">
        <h2 id="fotos" className="text-3xl">
          Fotografías
        </h2>
        <PlanPhotos plan={plan} memories={memories} />
      </section>
    </article>
  );
}
