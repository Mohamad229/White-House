"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { dictionary, textByLocale } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";
import type { Locale, ProductView } from "@/lib/types";
import { useCart } from "./cart/CartProvider";
import { ProductCard } from "./ProductCard";

export function ProductDetailsClient({
  product,
  locale,
  relatedProducts = [],
}: {
  product: ProductView;
  locale: Locale;
  relatedProducts?: ProductView[];
}) {
  const availableColors = product.colors.filter((color) => color.isAvailable);
  const [colorId, setColorId] = useState(availableColors[0]?.id ?? "");
  const selectedColor =
    availableColors.find((color) => color.id === colorId) ?? availableColors[0];
  const sizes =
    selectedColor?.variants.filter((variant) => variant.isAvailable) ?? [];
  const [size, setSize] = useState(sizes[0]?.size ?? "");
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();
  const t = dictionary[locale];
  const isOutOfStock = product.status === "outOfStock";
  const unavailableLabel = locale === "ar" ? "غير متوفر حاليا" : "Out of stock";

  const gallery = useMemo(() => {
    const colorImages = product.images.filter(
      (candidate) => candidate.colorId === selectedColor?.id,
    );
    return colorImages.length ? colorImages : product.images;
  }, [product.images, selectedColor?.id]);

  const fallbackImage = normalizeImageUrl(
    selectedColor?.imageUrl ||
      product.images.find((candidate) => candidate.colorId === selectedColor?.id)
        ?.url ||
      product.images.find((candidate) => candidate.isMain)?.url ||
      product.images[0]?.url ||
      "/brand/category-image-1.jpg",
  );

  const [activeImage, setActiveImage] = useState(fallbackImage);

  function selectColor(nextColorId: string) {
    const nextColor = availableColors.find((color) => color.id === nextColorId);
    setColorId(nextColorId);
    setSize(
      nextColor?.variants.find((variant) => variant.isAvailable)?.size ?? "",
    );
    const colorImage =
      normalizeImageUrl(
        nextColor?.imageUrl ||
          product.images.find((candidate) => candidate.colorId === nextColorId)
            ?.url ||
          product.images.find((candidate) => candidate.isMain)?.url ||
          product.images[0]?.url,
      );
    if (colorImage) setActiveImage(colorImage);
  }

  return (
    <>
      <section className="container-shell grid gap-10 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
        <div className="grid gap-3">
          <div className="wh-product-gallery">
            <Image
              src={activeImage || fallbackImage}
              alt={textByLocale(locale, product.nameAr, product.nameEn)}
              fill
              priority
              className="object-cover"
              sizes="(min-width:1024px) 48vw, 94vw"
            />
            {gallery.length > 1 && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-ink/45 to-transparent p-4">
                {gallery.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    className={`relative aspect-square w-14 overflow-hidden rounded-xl border bg-paper transition ${
                      (activeImage || fallbackImage) ===
                      normalizeImageUrl(candidate.url)
                        ? "border-paper"
                        : "border-paper/30 opacity-80"
                    }`}
                    onClick={() => setActiveImage(normalizeImageUrl(candidate.url))}
                    aria-label={textByLocale(
                      locale,
                      candidate.altAr,
                      candidate.altEn,
                    )}
                  >
                    <Image
                      src={normalizeImageUrl(candidate.url)}
                      alt={textByLocale(
                        locale,
                        candidate.altAr,
                        candidate.altEn,
                      )}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-7 text-start">
          <div className="grid gap-4">
            <p className="eyebrow">
              {product.category
                ? textByLocale(
                    locale,
                    product.category.nameAr,
                    product.category.nameEn,
                  )
                : t.products}
            </p>
            <h1 className="wh-product-detail-title text-ink">
              {textByLocale(locale, product.nameAr, product.nameEn)}
            </h1>
            <p className="text-2xl font-black text-caramel md:text-3xl">
              {formatMoney(product.price, product.currency, locale)}
            </p>
            <p className="max-w-2xl leading-8 text-muted">
              {textByLocale(
                locale,
                product.descriptionAr,
                product.descriptionEn,
              )}
            </p>
          </div>

          <div className="grid gap-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-caramel">
              {t.color}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`wh-chip ${color.id === selectedColor?.id ? "wh-chip-active" : ""}`}
                  onClick={() => selectColor(color.id)}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-ink/15"
                    style={{ backgroundColor: color.hex }}
                  />
                  {textByLocale(locale, color.nameAr, color.nameEn)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-caramel">
              {t.size}
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`wh-chip min-w-11 ${variant.size === size ? "wh-chip-active" : ""}`}
                  onClick={() => setSize(variant.size)}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-caramel">
              {t.quantity}
            </p>
            <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-ink/10 bg-paper">
              <button
                className="grid h-12 w-12 place-items-center transition hover:bg-ink hover:text-paper"
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-14 text-center text-sm font-black">
                {quantity}
              </span>
              <button
                className="grid h-12 w-12 place-items-center transition hover:bg-ink hover:text-paper"
                type="button"
                onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary w-full"
            type="button"
            disabled={!selectedColor || !size || isOutOfStock}
            onClick={() =>
              selectedColor &&
              !isOutOfStock &&
              cart.addItem(product, selectedColor.id, size, quantity)
            }
          >
            {isOutOfStock ? unavailableLabel : t.addToOrder}
          </button>

          <div className="border-t border-ink/15 pt-8">
            <h2 className="text-2xl font-black">{t.aboutProduct}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted">
              {textByLocale(
                locale,
                product.descriptionAr,
                product.descriptionEn,
              )}
            </p>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="container-shell wh-related-section border-t border-ink/15">
          <h2 className="wh-section-title wh-related-title text-ink">
            {t.relatedProducts}
          </h2>
          <div className="wh-related-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
