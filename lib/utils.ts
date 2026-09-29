export { toneOf } from "./categories";
export const fmtDate = (d: string, withYear = false) => new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" });
export const ROTATIONS = [-3, 2, -1.5, 3, -2, 1.5, -4, 2.5];
