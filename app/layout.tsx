import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { AppRouteShell } from "@/components/AppRouteShell";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "White House",
  description: "A bilingual premium menswear storefront for White House.",
};

function routeDocumentLocale(pathname: string) {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { lang: "en", dir: "ltr" };
  }
  return { lang: "ar", dir: "rtl" };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/";
  const { lang, dir } = routeDocumentLocale(pathname);

  return (
    <html lang={lang} dir={dir}>
      <body className={`${ibmPlexArabic.variable} ${inter.variable}`}>
        <AppRouteShell>{children}</AppRouteShell>
      </body>
    </html>
  );
}
