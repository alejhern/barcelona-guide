import { Shell } from "@/components/layout/Navbar";
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
