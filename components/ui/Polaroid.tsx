"use client";
import { motion } from "framer-motion";

export function Photo({ src, alt, tone, label }: { src?: string; alt: string; tone: string; label: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />;
  return (
    <div role="img" aria-label={alt} className="grid h-full w-full place-items-center p-3 text-center" style={{ background: `linear-gradient(160deg, ${tone}, ${tone}cc)` }}>
      <span className="font-serif text-lg leading-tight text-white/95">{label}</span>
    </div>
  );
}

type Props = { src?: string; alt: string; place: string; sub?: string; tone: string; rotate?: number; delay?: number; tall?: boolean; onClick?: () => void; tag?: string };

export function Polaroid({ src, alt, place, sub, tone, rotate = 0, delay = 0, tall, onClick, tag = "Barcelona" }: Props) {
  const inner = (
    <>
      <div className={`${tall ? "aspect-[4/5]" : "aspect-square"} overflow-hidden bg-paper`}><Photo src={src} alt={alt} tone={tone} label={place} /></div>
      <div className="px-0.5 pt-3 text-left">
        <p className="text-[10px] tracking-[0.2em] text-ink/50 uppercase">{tag}</p>
        <p className="font-serif text-lg leading-tight">{place}</p>
        {sub && <p className="text-xs text-ink/60">{sub}</p>}
      </div>
    </>
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotate * 2 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, type: "spring", stiffness: 90, damping: 14 }}
      whileHover={{ y: -8, rotate: 0, scale: 1.03, boxShadow: "0 22px 34px -10px rgba(43,39,35,.5)" }}
      className="w-full bg-[#fffdf8] p-3 pb-4 shadow-[0_8px_18px_-8px_rgba(43,39,35,.45)]"
    >
      {onClick ? <button onClick={onClick} aria-label={`Ver foto: ${place}`} className="block w-full text-left">{inner}</button> : inner}
    </motion.div>
  );
}
