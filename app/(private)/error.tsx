"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-lg rounded-sm border border-ink/15 bg-[#fffdf8] p-6">
      <h1 className="text-3xl">No se pudieron cargar los datos</h1>
      <p className="mt-3 text-ink/75">Comprueba la conexión con Supabase y que las tablas existan.</p>
      <button onClick={reset} className="mt-4 rounded-sm bg-ink px-4 py-2.5 font-medium text-cream">Reintentar</button>
    </div>
  );
}
