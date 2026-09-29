// Cliente: llamadas JSON a las rutas /api.
export async function call(url: string, method: string, body?: unknown): Promise<{ ok: boolean; data?: { id?: string }; error?: string }> {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  return r.ok ? { ok: true, data } : { ok: false, error: data.error ?? "No se pudo completar la acción." };
}
