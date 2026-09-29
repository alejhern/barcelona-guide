"use client";
import type { LayerGroup, Map as LMap, Marker } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { toneOf } from "@/lib/utils";
import type { Plan } from "@/types";

type Leaflet = typeof import("leaflet");
// Sin clave usa OpenStreetMap. Con NEXT_PUBLIC_CARTO_API_KEY usa CARTO Voyager.
const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
const TILES = cartoKey
  ? { url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoKey}`, attribution: "&copy; OpenStreetMap &copy; CARTO" }
  : { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap contributors" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type Props = { plans: Plan[]; selectedId?: string | null; onSelect?: (id: string) => void; photos?: Record<string, string>; className?: string };

export function MapView({ plans, selectedId = null, onSelect, photos = {}, className = "" }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const lib = useRef<Leaflet | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const fitted = useRef(false);
  const cb = useRef(onSelect);
  const [ready, setReady] = useState(false);
  useEffect(() => { cb.current = onSelect; });

  // El mapa se crea una sola vez; los marcadores se sincronizan aparte.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      const m = L.map(el.current, { scrollWheelZoom: false }).setView([41.3915, 2.1665], 12);
      L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: 19 }).addTo(m);
      layer.current = L.layerGroup().addTo(m);
      lib.current = L; map.current = m;
      setReady(true);
    })();
    return () => { cancelled = true; map.current?.remove(); map.current = null; layer.current = null; fitted.current = false; };
  }, []);

  // Resalta el marcador elegido y, si `move`, vuela hasta él (como en la referencia).
  const select = (id: string | null, move: boolean) => {
    Object.entries(markers.current).forEach(([k, mk]) => mk.getElement()?.querySelector(".pin")?.classList.toggle("sel", k === id));
    const mk = id ? markers.current[id] : undefined;
    if (!mk || !move || !map.current) return;
    map.current.once("moveend", () => mk.openPopup());
    map.current.flyTo(mk.getLatLng(), 15, { duration: 0.8 });
  };

  useEffect(() => {
    const L = lib.current, m = map.current, g = layer.current;
    if (!ready || !L || !m || !g) return;
    g.clearLayers(); markers.current = {};
    const pts: [number, number][] = [];
    const pin = (cls: string, txt: string) => L.divIcon({ className: "", html: `<div class="pin ${cls}"><span>${txt}</span></div>`, iconSize: [26, 26], iconAnchor: [13, 32], popupAnchor: [0, -30] });
    const popup = (tone: string, name: string, tag: string, text: string, href: string, cta: string, img?: string) =>
      `${img ? `<img class="pop-photo" src="${esc(img)}" alt="${esc(name)}">` : `<div class="pop-photo" style="background:${tone}">${esc(name)}</div>`}<div class="pop-body"><p style="font-size:12px;opacity:.6">${esc(tag)}</p><p style="font:600 17px var(--font-serif)">${esc(name)}</p><p style="font-size:13px;margin-top:4px">${esc(text)}</p><a href="${href}">${cta}</a></div>`;
    const add = (id: string, lat: number, lng: number, icon: ReturnType<typeof pin>, title: string, html: string) => {
      const mk = L.marker([lat, lng], { icon, title, alt: title }).bindPopup(html).on("click", () => cb.current?.(id)).addTo(g);
      markers.current[id] = mk; pts.push([lat, lng]);
    };
    plans.forEach((p) => add(p.id, p.latitude, p.longitude, pin(p.visited ? "visited" : "pending", p.visited ? "✓" : ""), p.title, popup(toneOf(p.category), p.title, `${p.category} · ${p.duration}`, p.description, `/planes/${p.id}`, "Ver plan", photos[p.id] ?? p.imageUrl)));
    if (!fitted.current && pts.length) { pts.length > 1 ? m.fitBounds(pts, { padding: [40, 40] }) : m.setView(pts[0], 15); fitted.current = true; }
    select(selectedId, false);
  }, [ready, plans, photos]);

  useEffect(() => { if (ready) select(selectedId, true); }, [ready, selectedId]);

  return <div ref={el} role="region" aria-label="Mapa interactivo de Barcelona" className={`z-0 w-full overflow-hidden rounded-sm border border-ink/15 ${className}`} />;
}
