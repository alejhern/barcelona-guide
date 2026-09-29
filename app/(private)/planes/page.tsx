import { PlanBrowser } from "@/components/plans/PlanBrowser";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getPlans } from "@/lib/data";
import { currentRole } from "@/lib/session";
import { supabaseReady } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Planes · Barcelona Guide" };

export default async function Planes() {
  if (!supabaseReady()) return <SetupNotice />;
  const [plans, role] = await Promise.all([getPlans(), currentRole()]);
  return <PlanBrowser plans={plans} admin={role === "admin"} />;
}
