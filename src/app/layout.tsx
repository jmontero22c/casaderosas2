import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa de Rosas",
  description: "Flores y anchetas — Plataforma de venta en línea",
  icons: {
    icon: '/Logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
