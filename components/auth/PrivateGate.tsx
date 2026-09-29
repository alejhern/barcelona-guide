"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PrivateGate() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { router.replace("/"); router.refresh(); return; }
    setError((await r.json().catch(() => ({}))).error ?? "No se pudo entrar."); setBusy(false);
  }
  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <h1 className="text-4xl leading-tight sm:text-5xl">Barcelona, a nuestra manera.</h1>
      <p className="mt-3 mb-8 text-ink/70">Una guía privada para descubrir la ciudad.</p>
      <label htmlFor="pw" className="mb-1 block text-sm font-medium">Contraseña</label>
      <input id="pw" type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} aria-describedby={error ? "pw-err" : undefined}
        className="w-full rounded-sm border border-ink/25 bg-white/70 px-3 py-2.5 text-base" />
      {error && <p id="pw-err" role="alert" className="mt-2 text-sm text-clay">{error}</p>}
      <button disabled={busy} className="mt-4 w-full rounded-sm bg-ink px-4 py-3 font-medium text-cream disabled:opacity-60">{busy ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
