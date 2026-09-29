import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Barcelona Guide", description: "Una guía privada para descubrir Barcelona: planes y rincones." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbf7ee" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
