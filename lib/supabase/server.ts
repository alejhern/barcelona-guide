// Solo servidor: nunca importar desde componentes cliente (usa una clave secreta).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const isPublicKey = (value: string | undefined) => {
  if (!value) return false;
  if (value.startsWith("sb_publishable_")) return true;
  try {
    const payload = JSON.parse(
      Buffer.from(value.split(".")[1], "base64url").toString("utf8"),
    ) as { role?: string };
    return payload.role === "anon";
  } catch {
    return false;
  }
};
export const supabaseReady = () => !!(url && key && !isPublicKey(key));

export async function sb<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T[]> {
  if (!supabaseReady())
    throw new Error(
      "Supabase requiere SUPABASE_SECRET_KEY (una clave sb_secret_...), no una clave pública.",
    );
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.status === 204 ? [] : r.json();
}
