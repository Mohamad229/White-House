"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CartProvider } from "@/components/cart/CartProvider";
import { OrderBar } from "@/components/cart/OrderBar";

function localeForPath(pathname: string) {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { lang: "en", dir: "ltr" };
  }
  return { lang: "ar", dir: "rtl" };
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function AppRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const adminPath = isAdminPath(pathname);

  useEffect(() => {
    const { lang, dir } = localeForPath(pathname);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [pathname]);

  if (adminPath) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      {children}
      <OrderBar />
    </CartProvider>
  );
}
