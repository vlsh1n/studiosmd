import type { Metadata } from "next";
import { headers } from "next/headers";
import KofiOverlay from "@/components/KofiOverlay.client";
import "./globals.css";

export const metadata: Metadata = {
  title: "STUDIOS.MD",
  description: "Studios catalog",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const lang = h.get("x-locale") ?? "ru";

  return (
    <html lang={lang}>
      <body className="antialiased">
        {children}
        <KofiOverlay />
      </body>
    </html>
  );
}
