import { MapExplorer } from "@/components/map/MapExplorer";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getPlans } from "@/lib/data";
import { supabaseReady } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mapa · Barcelona Guide" };

export default async function Mapa() {
  if (!supabaseReady()) return <SetupNotice />;
  const plans = await getPlans();
  return (
    <>
      <h1 className="text-4xl sm:text-5xl">Mapa</h1>
      <p className="mt-2 mb-6 text-ink/70">Los planes hechos y los pendientes, en un solo recorrido.</p>
      <MapExplorer plans={plans} />
    </>
  );
}
