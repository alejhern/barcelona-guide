import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { TravelCard } from "@/components/ui/TravelCard";
import { toneOf } from "@/lib/utils";
import type { Plan } from "@/types";

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <TravelCard imageUrl={plan.imageUrl} tone={toneOf(plan.category)} name={plan.title} tag={`${plan.category} · ${plan.duration}`} text={plan.description}>
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 ${plan.visited ? "text-olive" : "text-ink/60"}`}>
          {plan.visited ? <Check size={16} aria-hidden /> : <Circle size={14} aria-hidden />}{plan.visited ? "Ya hemos estado aquí." : "Todavía pendiente."}
        </span>
        <Link href={`/planes/${plan.id}`} className="font-semibold text-clay underline-offset-4 hover:underline">Ver plan</Link>
      </div>
    </TravelCard>
  );
}
