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

const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "memories";

export async function storageUpload(
  path: string,
  file: ArrayBuffer,
  contentType: string,
) {
  if (!supabaseReady())
    throw new Error("Supabase Storage no está configurado.");
  const r = await fetch(`${url}/storage/v1/object/${storageBucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: file,
  });
  if (!r.ok) throw new Error(`Supabase Storage ${r.status}: ${await r.text()}`);
  return path;
}

export async function storageRemove(urls: string[]) {
  if (!supabaseReady() || urls.length === 0) return;
  const prefix = `/storage/v1/object/public/${storageBucket}/`;
  const prefixes = urls
    .map((value) => {
      if (!value.startsWith("http")) return value;
      try {
        const path = new URL(value).pathname;
        return path.startsWith(prefix) ? path.slice(prefix.length) : null;
      } catch {
        return null;
      }
    })
    .filter((value): value is string => Boolean(value));
  if (prefixes.length === 0) return;
  const responses = await Promise.all(
    prefixes.map((path) => {
      const encodedPath = path
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
      return fetch(`${url}/storage/v1/object/${storageBucket}/${encodedPath}`, {
        method: "DELETE",
        headers: {
          apikey: key!,
          Authorization: `Bearer ${key}`,
        },
      });
    }),
  );
  const failed = responses.find((response) => !response.ok);
  if (failed)
    throw new Error(
      `Supabase Storage ${failed.status}: ${await failed.text()}`,
    );
}

export async function storageSignedUrl(path: string, expiresIn = 3600) {
  if (!supabaseReady())
    throw new Error("Supabase Storage no está configurado.");
  const publicPrefix = `/storage/v1/object/public/${storageBucket}/`;
  const normalized = path.startsWith("http")
    ? new URL(path).pathname.split(publicPrefix)[1]
    : path;
  if (!normalized) throw new Error("Ruta de Storage no válida.");
  const encodedPath = normalized
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const r = await fetch(
    `${url}/storage/v1/object/sign/${storageBucket}/${encodedPath}`,
    {
      method: "POST",
      headers: {
        apikey: key!,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn }),
      cache: "no-store",
    },
  );
  if (!r.ok) throw new Error(`Supabase Storage ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as { signedURL?: string };
  if (!data.signedURL) throw new Error("Supabase no devolvió una URL firmada.");
  if (data.signedURL.startsWith("http")) return data.signedURL;
  if (data.signedURL.startsWith("/storage/v1/"))
    return `${url}${data.signedURL}`;
  if (data.signedURL.startsWith("/object/"))
    return `${url}/storage/v1${data.signedURL}`;
  return `${url}/storage/v1/${data.signedURL.replace(/^\/+/, "")}`;
}
