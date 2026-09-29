import { PrivateGate } from "@/components/auth/PrivateGate";
export const metadata = { title: "Acceso · Barcelona Guide" };
export default function Login() {
  return <main className="grid min-h-dvh place-items-center px-6"><PrivateGate /></main>;
}
