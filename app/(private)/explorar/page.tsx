import { redirect } from "next/navigation";
// Explorar y Planes son ahora la misma sección; se mantiene la ruta para no romper enlaces antiguos.
export default function Explorar() { redirect("/planes"); }
