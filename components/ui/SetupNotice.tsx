export function SetupNotice() {
  return (
    <div role="status" className="mx-auto max-w-lg rounded-sm border border-ink/15 bg-[#fffdf8] p-6">
      <h1 className="text-3xl">Falta conectar Supabase</h1>
      <p className="mt-3 text-ink/75">Añade <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>SUPABASE_SERVICE_ROLE_KEY</code> en el entorno, ejecuta <code>supabase/schema.sql</code> en el SQL Editor de Supabase y reinicia el servidor.</p>
    </div>
  );
}
