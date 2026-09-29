import { Photo } from "./Polaroid";
export function TravelCard({ id, imageUrl, tone, name, tag, text, children }: { id?: string; imageUrl?: string; tone: string; name: string; tag: string; text: string; children?: React.ReactNode }) {
  return (
    <article id={id} className="flex h-full flex-col overflow-hidden rounded-sm border border-ink/10 bg-[#fffdf8] shadow-[0_6px_16px_-10px_rgba(43,39,35,.5)]">
      <div className="aspect-[4/3]"><Photo src={imageUrl} alt={`${name}, Barcelona`} tone={tone} label={name} /></div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-ink/55">{tag}</p>
        <h3 className="mt-0.5 text-xl leading-snug">{name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{text}</p>
        <div className="mt-auto pt-4 text-sm">{children}</div>
      </div>
    </article>
  );
}
