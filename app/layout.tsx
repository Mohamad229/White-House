import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { OrderBar } from "@/components/cart/OrderBar";

export const metadata: Metadata = {
  title: "White House",
  description: "A bilingual premium menswear storefront for White House."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <CartProvider>
          {children}
          <OrderBar />
        </CartProvider>
      </body>
    </html>
  );
}
