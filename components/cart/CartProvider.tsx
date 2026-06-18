"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { normalizeImageUrl } from "@/lib/image-url";
import type { ProductView, Locale } from "@/lib/types";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  colorId: string;
  colorAr: string;
  colorEn: string;
  colorHex: string;
  size: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  imageUrl?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (
    product: ProductView,
    colorId: string,
    size: string,
    quantity: number,
  ) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("white-house-order");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      window.localStorage.removeItem("white-house-order");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("white-house-order", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      addItem(product, colorId, size, quantity) {
        if (product.status !== "visible") return;
        const color = product.colors.find(
          (candidate) => candidate.id === colorId,
        );
        if (!color) return;
        const key = `${product.id}:${colorId}:${size}`;
        const imageUrl = normalizeImageUrl(
          color.imageUrl ||
            product.images.find((candidate) => candidate.colorId === colorId)
              ?.url ||
            product.images.find((candidate) => candidate.isMain)?.url ||
            product.images[0]?.url,
        );
        setItems((current) => {
          const existing = current.find((item) => item.key === key);
          if (existing) {
            return current.map((item) =>
              item.key === key
                ? { ...item, quantity: Math.min(20, item.quantity + quantity) }
                : item,
            );
          }
          return [
            ...current,
            {
              key,
              productId: product.id,
              slug: product.slug,
              nameAr: product.nameAr,
              nameEn: product.nameEn,
              colorId,
              colorAr: color.nameAr,
              colorEn: color.nameEn,
              colorHex: color.hex,
              size,
              quantity,
              unitPrice: product.price,
              currency: product.currency,
              imageUrl,
            },
          ];
        });
      },
      updateQuantity(key, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) }
              : item,
          ),
        );
      },
      removeItem(key) {
        setItems((current) => current.filter((item) => item.key !== key));
      },
      clear() {
        setItems([]);
      },
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function itemName(item: CartItem, locale: Locale) {
  return locale === "ar" ? item.nameAr : item.nameEn;
}

export function itemColor(item: CartItem, locale: Locale) {
  return locale === "ar" ? item.colorAr : item.colorEn;
}
