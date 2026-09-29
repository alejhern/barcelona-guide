import { AlbumWall } from "@/components/album/AlbumWall";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getMemories, getPlans } from "@/lib/data";
import { supabaseReady } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Álbum · Barcelona Guide" };

export default async function Album() {
  if (!supabaseReady()) return <SetupNotice />;
  const [memories, plans] = await Promise.all([getMemories(), getPlans()]);
  return <AlbumWall memories={memories} plans={plans} />;
}
