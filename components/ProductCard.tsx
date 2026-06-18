"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";
import { dictionary, localPath, textByLocale } from "@/lib/i18n";
import type { Locale, ProductView } from "@/lib/types";
import { useCart } from "./cart/CartProvider";

export function ProductCard({
  product,
  locale,
}: {
  product: ProductView;
  locale: Locale;
}) {
  const image = normalizeImageUrl(
    product.images.find((candidate) => candidate.isMain)?.url ||
      product.colors.find((color) => color.imageUrl)?.imageUrl ||
      product.images[0]?.url ||
      "/brand/category-image-1.jpg",
  );
  const t = dictionary[locale];
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const firstColor = product.colors.find(
    (color) =>
      color.isAvailable &&
      color.variants.some((variant) => variant.isAvailable),
  );
  const firstVariant = firstColor?.variants.find(
    (variant) => variant.isAvailable,
  );
  const isOutOfStock = product.status === "outOfStock";
  const unavailableLabel = locale === "ar" ? "غير متوفر حاليا" : "Out of stock";
  const canQuickAdd = Boolean(firstColor && firstVariant && !isOutOfStock);

  function quickAdd() {
    if (!firstColor || !firstVariant) return;
    cart.addItem(product, firstColor.id, firstVariant.size, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="wh-product-card group">
      <Link
        href={localPath(locale, `/products/${product.slug}`)}
        className="block"
        aria-label={textByLocale(locale, product.nameAr, product.nameEn)}
      >
        <div className="wh-product-image">
          <Image
            src={image}
            alt={textByLocale(locale, product.nameAr, product.nameEn)}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.045]"
          />
          <div
            className="absolute start-3 top-3 flex gap-1.5"
            aria-label={
              locale === "ar" ? "الألوان المتاحة" : "Available colors"
            }
          >
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.id}
                className="h-3 w-3 rounded-full border border-paper/70 shadow-sm"
                title={textByLocale(locale, color.nameAr, color.nameEn)}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </Link>

      <div className="grid gap-2 p-4 text-start">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={localPath(locale, `/products/${product.slug}`)}
            className="min-w-0 transition hover:text-caramel"
          >
            <h3 className="text-base font-black leading-tight tracking-[-0.04em]">
              {textByLocale(locale, product.nameAr, product.nameEn)}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
              {textByLocale(
                locale,
                product.shortDescriptionAr,
                product.shortDescriptionEn,
              )}
            </p>
          </Link>
          <button
            className="wh-plus-badge shrink-0 transition"
            type="button"
            disabled={!canQuickAdd}
            onClick={quickAdd}
            aria-label={isOutOfStock ? unavailableLabel : t.addToOrder}
            title={isOutOfStock ? unavailableLabel : t.addToOrder}
          >
            {added ? "✓" : "+"}
          </button>
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <p className="text-sm font-black text-caramel">
            {isOutOfStock
              ? unavailableLabel
              : formatMoney(product.price, product.currency, locale)}
          </p>
          <Link
            href={localPath(locale, `/products/${product.slug}`)}
            className="arrow-link text-[0.62rem] text-ink/70"
          >
            {t.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
