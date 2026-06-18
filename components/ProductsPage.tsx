"use client";

import { useMemo, useState } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductCard } from "./ProductCard";
import { dictionary, textByLocale } from "@/lib/i18n";
import type {
  CategoryView,
  Locale,
  ProductView,
  StoreSettingsView,
} from "@/lib/types";

export function ProductsPage({
  locale,
  categories,
  products,
  settings,
  selectedCategory,
}: {
  locale: Locale;
  categories: CategoryView[];
  products: ProductView[];
  settings: StoreSettingsView;
  selectedCategory?: string;
}) {
  const t = dictionary[locale];
  const initialCategory = selectedCategory || "all";
  const [categorySlug, setCategorySlug] = useState(initialCategory);

  const active = categories.find((category) => category.slug === categorySlug);
  const isRtl = locale === "ar";

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (product.category?.slug) {
        counts.set(
          product.category.slug,
          (counts.get(product.category.slug) || 0) + 1,
        );
      }
    });
    return counts;
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (categorySlug === "all") {
      return products;
    }

    return products.filter(
      (product) => product.category?.slug === categorySlug,
    );
  }, [products, categorySlug]);

  const activeTitle = active
    ? textByLocale(locale, active.nameAr, active.nameEn)
    : t.products;

  const activeDescription = active
    ? textByLocale(locale, active.descriptionAr, active.descriptionEn)
    : locale === "ar"
      ? "كل القطع الظاهرة هنا متاحة للطلب، ويتم تأكيد التفاصيل النهائية عبر واتساب."
      : "Every visible item here is available to order, with final details confirmed through WhatsApp.";

  return (
    <div className="page-shell" dir={t.dir} lang={locale}>
      <Header locale={locale} />

      <main className="container-shell wh-products-main">
        <section className="wh-products-heading">
          <p className="eyebrow">{t.filters}</p>
          <h1 className="wh-section-title max-w-none text-ink">
            {activeTitle}
          </h1>
          <p className="max-w-2xl leading-8 text-muted">{activeDescription}</p>
        </section>

        <section
          className="mx-auto mt-8 w-full max-w-[1180px] sm:mt-10"
          aria-label={t.filters}
        >
          <div
            className="rounded-[26px] border border-[#e2d8c6] bg-paper/95 p-3 shadow-[0_18px_60px_rgba(23,22,60,0.07)] backdrop-blur sm:rounded-[999px] sm:p-2"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-2 sm:hidden">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-caramel">
                  {locale === "ar" ? "فلترة حسب التصنيف" : "Filter by category"}
                </p>
                <p className="mt-1 text-sm font-black text-ink">
                  {active
                    ? textByLocale(locale, active.nameAr, active.nameEn)
                    : t.all}
                </p>
              </div>
              <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-black text-paper">
                {visibleProducts.length}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
              <button
                type="button"
                onClick={() => setCategorySlug("all")}
                className={`shrink-0 rounded-full px-5 py-3 text-xs font-black uppercase tracking-wide transition sm:px-6 sm:py-3.5 ${
                  categorySlug === "all"
                    ? "bg-ink text-paper shadow-[0_10px_22px_rgba(23,22,60,0.16)]"
                    : "bg-white text-ink ring-1 ring-[#e2d8c6] hover:bg-bone"
                }`}
              >
                <span>{t.all}</span>
                <span
                  className={`ms-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                    categorySlug === "all"
                      ? "bg-paper/15 text-paper"
                      : "bg-bone text-muted"
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {categories.map((category) => {
                const label = textByLocale(
                  locale,
                  category.nameAr,
                  category.nameEn,
                );
                const isActive = categorySlug === category.slug;

                return (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => setCategorySlug(category.slug)}
                    className={`shrink-0 rounded-full px-5 py-3 text-xs font-black uppercase tracking-wide transition sm:px-6 sm:py-3.5 ${
                      isActive
                        ? "bg-ink text-paper shadow-[0_10px_22px_rgba(23,22,60,0.16)]"
                        : "bg-white text-ink ring-1 ring-[#e2d8c6] hover:bg-bone"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`ms-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                        isActive
                          ? "bg-paper/15 text-paper"
                          : "bg-bone text-muted"
                      }`}
                    >
                      {categoryCounts.get(category.slug) || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {visibleProducts.length > 0 ? (
          <div className="wh-products-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="admin-panel p-8 text-center text-muted">
            {t.empty}
          </div>
        )}
      </main>

      <Footer locale={locale} categories={categories} settings={settings} />
    </div>
  );
}
