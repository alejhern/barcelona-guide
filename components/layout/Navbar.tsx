"use client";
import { MotionConfig } from "framer-motion";
import { Home, Images, Map, Route } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [["/", "Inicio", Home], ["/planes", "Planes", Route], ["/mapa", "Mapa", Map], ["/album", "Álbum", Images]] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-[900] border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-serif text-xl">Barcelona Guide</Link>
          <nav aria-label="Principal" className="hidden gap-6 text-sm md:flex">
            {LINKS.map(([h, l]) => <Link key={h} href={h} aria-current={active(h) ? "page" : undefined} className={active(h) ? "border-b-2 border-clay pb-0.5 font-semibold" : "text-ink/70 hover:text-ink"}>{l}</Link>)}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 md:pb-16">{children}</main>
      <nav aria-label="Principal móvil" className="fixed inset-x-0 bottom-0 z-[900] grid grid-cols-4 border-t border-ink/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {LINKS.map(([h, l, Icon]) => (
          <Link key={h} href={h} aria-current={active(h) ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${active(h) ? "font-semibold text-clay" : "text-ink/65"}`}>
            <Icon size={20} aria-hidden />{l}
          </Link>
        ))}
      </nav>
    </MotionConfig>
  );
}
