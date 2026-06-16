"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { dictionary, textByLocale } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import type { Locale, ProductView } from "@/lib/types";
import { useCart } from "./cart/CartProvider";
import { ProductCard } from "./ProductCard";

export function ProductDetailsClient({
  product,
  locale,
  relatedProducts = []
}: {
  product: ProductView;
  locale: Locale;
  relatedProducts?: ProductView[];
}) {
  const availableColors = product.colors.filter((color) => color.isAvailable);
  const [colorId, setColorId] = useState(availableColors[0]?.id ?? "");
  const selectedColor = availableColors.find((color) => color.id === colorId) ?? availableColors[0];
  const sizes = selectedColor?.variants.filter((variant) => variant.isAvailable) ?? [];
  const [size, setSize] = useState(sizes[0]?.size ?? "");
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();
  const t = dictionary[locale];

  const image = useMemo(() => {
    return (
      selectedColor?.imageUrl ||
      product.images.find((candidate) => candidate.colorId === selectedColor?.id)?.url ||
      product.images.find((candidate) => candidate.isMain)?.url ||
      product.images[0]?.url ||
      "/brand/shirt-stone.png"
    );
  }, [product, selectedColor]);

  function selectColor(nextColorId: string) {
    const nextColor = availableColors.find((color) => color.id === nextColorId);
    setColorId(nextColorId);
    setSize(nextColor?.variants.find((variant) => variant.isAvailable)?.size ?? "");
  }

  return (
    <>
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <section>
        <div className="relative aspect-[0.86] overflow-hidden rounded-2xl bg-stonewash md:aspect-[1.05] lg:aspect-[0.86]">
          <Image src={image} alt={textByLocale(locale, product.nameAr, product.nameEn)} fill priority className="object-cover" />
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
              {product.images.map((candidate) => (
                <button
                  key={candidate.id}
                  className="relative h-20 w-16 overflow-hidden rounded-xl bg-paper shadow-md ring-1 ring-bone/60"
                  onClick={() => candidate.colorId && selectColor(candidate.colorId)}
                  aria-label={textByLocale(locale, candidate.altAr, candidate.altEn)}
                >
                  <Image src={candidate.url} alt={textByLocale(locale, candidate.altAr, candidate.altEn)} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="lg:pt-8">
        <p className="text-[0.75rem] font-black uppercase text-caramel">
          {product.category ? textByLocale(locale, product.category.nameAr, product.category.nameEn) : t.products}
        </p>
        <h1 className="display-tight mt-4 max-w-[12ch] text-[clamp(3rem,8vw,7rem)]">
          {textByLocale(locale, product.nameAr, product.nameEn)}
        </h1>
        <p className="mt-4 text-4xl font-semibold text-caramel">{formatMoney(product.price, product.currency, locale)}</p>
        <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
          {textByLocale(locale, product.descriptionAr, product.descriptionEn)}
        </p>

        <div className="mt-9 space-y-7">
          <div>
            <h2 className="mb-3 text-[0.75rem] font-black uppercase text-caramel">{t.color}</h2>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  className={`tap-target flex items-center gap-2 rounded-full border px-4 py-3 font-black transition ${
                    colorId === color.id ? "border-caramel bg-caramel text-bone" : "border-ink/10 bg-bone hover:bg-paper"
                  }`}
                  onClick={() => selectColor(color.id)}
                >
                  <span className="h-4 w-4 rounded-full border border-ink/20" style={{ backgroundColor: color.hex }} />
                  {textByLocale(locale, color.nameAr, color.nameEn)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-[0.75rem] font-black uppercase text-caramel">{t.size}</h2>
            <div className="flex flex-wrap gap-2">
              {sizes.map((variant) => (
                <button
                  key={variant.id}
                  className={`tap-target rounded-full px-5 py-3 font-black transition ${size === variant.size ? "bg-ink text-bone" : "bg-bone hover:bg-paper"}`}
                  onClick={() => setSize(variant.size)}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
          <label className="block max-w-36">
            <span className="mb-3 block text-[0.75rem] font-black uppercase text-caramel">{t.quantity}</span>
            <input
              className="field"
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>
          <button
            className="tap-target w-full rounded-full bg-ink px-7 py-4 font-black uppercase text-bone transition hover:bg-caramel md:w-auto"
            disabled={!selectedColor || !size}
            onClick={() => selectedColor && cart.addItem(product, selectedColor.id, size, quantity)}
          >
            {t.addToOrder}
          </button>
        </div>

        <div className="mt-12 border-t border-ink/15 pt-8">
          <h2 className="text-2xl font-black">{t.aboutProduct}</h2>
          <p className="mt-4 max-w-2xl leading-8 text-muted">{textByLocale(locale, product.descriptionAr, product.descriptionEn)}</p>
        </div>
      </section>
    </div>
    {relatedProducts.length > 0 && (
      <section className="mt-16 border-t border-ink/15 pt-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 className="display-tight text-[clamp(2.6rem,7vw,5.5rem)]">{t.relatedProducts}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((related) => (
            <ProductCard key={related.id} product={related} locale={locale} />
          ))}
        </div>
      </section>
    )}
    </>
  );
}
