"use client";

import { useCart } from "./CartProvider";

export function CartBadge() {
  const { count } = useCart();
  if (count === 0) return null;

  return (
    <span
      className="tap-target inline-flex items-center rounded-full bg-caramel px-3 py-2 text-[0.72rem] font-black uppercase text-bone"
      aria-label={`Order items: ${count}`}
    >
      {count}
    </span>
  );
}
