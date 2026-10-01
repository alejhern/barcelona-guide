export const CATEGORIES = [["Arquitectura", "🏛️"], ["Gastronomía", "🍴"], ["Cafeterías", "☕"], ["Mar", "🌊"], ["Miradores", "🌅"], ["Arte", "🎨"], ["Parques", "🌳"], ["Barrios", "🏘️"], ["Planes nocturnos", "🌙"], ["Deportes","🥌"]] as const;
export const CATEGORY_NAMES: string[] = CATEGORIES.map(([c]) => c);
export const TONES: Record<string, string> = { Arquitectura: "#b8563a", Gastronomía: "#c9962f", Cafeterías: "#8a6a4a", Mar: "#2f6f8f", Miradores: "#d27a4a", Arte: "#68703a", Parques: "#5b7a4a", Barrios: "#a5643f", "Planes nocturnos": "#34455e" };
export const toneOf = (category?: string | null) => TONES[category ?? ""] ?? "#b4553a";
