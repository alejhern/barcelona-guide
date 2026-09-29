# Barcelona Guide

Guía privada de Barcelona: planes con mapa, reserva por Calendly y un álbum de Polaroids. Los datos y las fotos viven en Supabase.

```bash
npm install
cp .env.example .env.local   # rellena las variables
npm run dev                  # http://localhost:3000
```

## Contraseñas y permisos
Una sola pantalla de acceso; la contraseña decide el rol.

| | `PORTAL_PASSWORD` (usuario) | `ADMIN_PASSWORD` (administrador) |
|---|---|---|
| Ver planes, mapa y álbum, reservar | sí | sí |
| Subir fotografías (solo en planes hechos) | sí | sí |
| Crear, editar y borrar planes, marcarlos como hechos | no | sí |

Sin ninguna contraseña, el acceso queda abierto como administrador en desarrollo y cerrado en producción.

## Supabase
1. Crea un proyecto en supabase.com.
2. SQL Editor: pega y ejecuta `supabase/schema.sql` (tablas `plans` y `memories`, con RLS activado y sin políticas: solo el servidor accede).
3. Settings → API Keys: copia la Project URL en `NEXT_PUBLIC_SUPABASE_URL` y la clave secreta (`sb_secret_…`) en `SUPABASE_SECRET_KEY`. No uses `sb_publishable_…` ni la subas al repositorio.
4. Entra como administrador y crea tu primer plan con «Nuevo plan».

## Supabase Storage
El esquema crea un bucket privado llamado `memories`. Las fotos se suben desde `/planes/<plan>` y solo si el plan está hecho; el servidor lo comprueba y genera URLs firmadas con caducidad. No se necesita ninguna variable adicional: se usa `SUPABASE_SECRET_KEY`.

## Calendly
Pon tu enlace de evento en `NEXT_PUBLIC_CALENDLY_URL`. «Reservar este plan» lo abre con el plan como respuesta prefijada.

## Mapa
No necesita clave (OpenStreetMap). Opcional: `NEXT_PUBLIC_CARTO_API_KEY` para el estilo CARTO Voyager.

## Despliegue en Vercel
Importa el repositorio, añade las variables en Settings → Environment Variables y despliega.
