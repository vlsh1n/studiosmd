import type { Metadata } from "next";
import { headers } from "next/headers";
import KofiOverlay from "@/components/KofiOverlay.client";
import { SITE_NAME, SITE_URL } from "@/seo/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: "Photo studios directory in Chișinău.",
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
