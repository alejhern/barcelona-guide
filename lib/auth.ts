import { createHmac, timingSafeEqual } from "node:crypto";
export const COOKIE = "bg_session";
export type Role = "admin" | "user";
const sig = (role: Role) => createHmac("sha256", `${process.env.PORTAL_PASSWORD}|${process.env.ADMIN_PASSWORD}`).update(role).digest("hex");
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const h = (s: string) => createHmac("sha256", "cmp").update(s).digest("hex");
export const sessionValue = (role: Role) => `${role}.${sig(role)}`;
/** Sin ninguna contraseña configurada: en desarrollo acceso abierto como admin; en producción, cerrado. */
export function getRole(value?: string): Role | null {
  if (!process.env.PORTAL_PASSWORD && !process.env.ADMIN_PASSWORD) return process.env.NODE_ENV !== "production" ? "admin" : null;
  const [role, s] = (value ?? "").split(".");
  return (role === "admin" || role === "user") && s && same(s, sig(role)) ? role : null;
}
export function checkPassword(input: string): Role | null {
  const { ADMIN_PASSWORD: a, PORTAL_PASSWORD: u } = process.env;
  if (a && same(h(input), h(a))) return "admin";
  if (u && same(h(input), h(u))) return "user";
  return null;
}
