import Link from "next/link";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductCard } from "./ProductCard";
import { dictionary, localPath, textByLocale } from "@/lib/i18n";
import type { CategoryView, Locale, ProductView, StoreSettingsView } from "@/lib/types";

export function ProductsPage({
  locale,
  categories,
  products,
  settings,
  selectedCategory
}: {
  locale: Locale;
  categories: CategoryView[];
  products: ProductView[];
  settings: StoreSettingsView;
  selectedCategory?: string;
}) {
  const t = dictionary[locale];
  const active = categories.find((category) => category.slug === selectedCategory);

  return (
    <div className="page-shell" dir={t.dir} lang={locale}>
      <Header locale={locale} />
      <main className="px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <section className="mx-auto max-w-5xl py-8 text-center md:py-14">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-caramel">{t.filters}</p>
          <h1 className="display-tight mt-4 text-[clamp(3.1rem,10vw,7.5rem)]">
            {active ? textByLocale(locale, active.nameAr, active.nameEn) : t.products}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
            {active
              ? textByLocale(locale, active.descriptionAr, active.descriptionEn)
              : locale === "ar"
                ? "كل القطع الظاهرة هنا متاحة للطلب، ويتم تأكيد التفاصيل النهائية عبر واتساب."
                : "Every visible item here is available to order, with final details confirmed through WhatsApp."}
          </p>
        </section>

        <nav
          className="mx-auto flex max-w-5xl gap-2 overflow-x-auto rounded-full border border-ink/10 bg-paper/80 p-2 shadow-[0_14px_40px_rgb(23_22_60/0.08)]"
          aria-label={t.filters}
        >
          <Link
            className={`tap-target min-w-max rounded-full px-5 py-3 text-sm font-black uppercase transition ${
              !selectedCategory ? "bg-ink text-bone" : "text-ink hover:bg-bone"
            }`}
            href={localPath(locale, "/products")}
          >
            {t.all}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              className={`tap-target min-w-max rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                selectedCategory === category.slug ? "bg-ink text-bone" : "text-ink hover:bg-bone"
              }`}
              href={localPath(locale, `/products?category=${category.slug}`)}
            >
              {textByLocale(locale, category.nameAr, category.nameEn)}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
        {products.length === 0 && <p className="py-20 text-center text-muted">{t.empty}</p>}
      </main>
      <Footer locale={locale} categories={categories} settings={settings} />
    </div>
  );
}
