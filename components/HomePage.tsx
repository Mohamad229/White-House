import Image from "next/image";
import Link from "next/link";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductCard } from "./ProductCard";
import { dictionary, localPath, textByLocale } from "@/lib/i18n";
import type { CategoryView, Locale, ProductView, StoreSettingsView } from "@/lib/types";

const heroImage = "/brand/hero-model.png";
const shellX = "px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16";
const contentMax = "mx-auto max-w-[118rem]";

const heroCopy = {
  ar: {
    lines: ["جهز", "إطلالتك", "بالقطع", "الصحيحة"],
    eyebrow: "أزياء رجالية مختارة"
  },
  en: {
    lines: ["Get", "yourself", "into the", "right gear"],
    eyebrow: "Curated menswear"
  }
} as const;

export function HomePage({
  locale,
  categories,
  products,
  settings
}: {
  locale: Locale;
  categories: CategoryView[];
  products: ProductView[];
  settings: StoreSettingsView;
}) {
  const t = dictionary[locale];
  const h = heroCopy[locale];
  const featuredCategories = categories.slice(0, 5);
  const isRtl = locale === "ar";
  const heroTextOrder = isRtl ? "lg:order-2" : "lg:order-1";
  const heroMediaOrder = isRtl ? "lg:order-1" : "lg:order-2";
  const swatchSide = isRtl ? "lg:right-auto lg:left-[-4rem]" : "lg:left-auto lg:right-[-4rem]";
  const cardTextSide = isRtl ? "right-5 md:right-auto md:left-4" : "left-5 md:left-auto md:right-4";
  const cardRotation = isRtl ? "md:-rotate-90" : "md:rotate-90";
  const arrow = isRtl ? "\u2190" : "\u2192";

  return (
    <div className="page-shell" dir={t.dir} lang={locale}>
      <Header locale={locale} />
      <main>
        <section className="relative isolate overflow-hidden bg-stonewash">
          <div className={`grid min-h-[calc(100svh-4.85rem)] lg:grid-cols-[1.2fr_0.8fr] ${contentMax}`}>
            <div
              className={`relative z-10 flex min-w-0 flex-col justify-center py-16 md:py-20 lg:py-24 ${shellX} ${heroTextOrder}`}
            >
              <p className="mb-8 text-[0.74rem] font-black uppercase tracking-[0.22em] text-caramel">
                {h.eyebrow}
              </p>
              <h1 className="display-tight max-w-[10.8ch] text-[clamp(3.9rem,9vw,8.7rem)] font-black text-ink">
                <span className="block">{h.lines[0]}</span>
                <span className="block">{h.lines[1]}</span>
                <span className="block text-paper drop-shadow-[0_12px_34px_rgb(178_153_95/0.28)]">{h.lines[2]}</span>
                <span className="block text-paper drop-shadow-[0_12px_34px_rgb(178_153_95/0.28)]">{h.lines[3]}</span>
              </h1>
            </div>

            <div className={`relative min-h-[28rem] bg-[rgb(204_202_197)] md:min-h-[38rem] lg:min-h-0 ${heroMediaOrder}`}>
              <Image
                src={heroImage}
                alt="White House menswear hero"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-contain object-bottom"
              />
              <div className={`absolute bottom-8 hidden h-32 w-32 rounded-md bg-caramel/50 md:block ${swatchSide}`} />
            </div>
          </div>
        </section>

        <section id="categories" className={`${shellX} py-14 md:py-16 lg:py-20`}>
          <div className={contentMax}>
            <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.74rem] font-black uppercase tracking-[0.22em] text-caramel">{t.filters}</p>
                <h2 className="display-tight mt-2 text-[clamp(3.1rem,7.8vw,6.4rem)] font-black text-ink">
                  {t.categories}
                </h2>
              </div>
              <Link className="arrow-link w-fit text-ink" href={localPath(locale, "/products")}>
                {t.viewAll}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={localPath(locale, `/products?category=${category.slug}`)}
                  className="group relative h-[30rem] cursor-pointer overflow-hidden rounded-md bg-ink text-bone shadow-[0_18px_44px_rgb(23_22_60/0.12)] outline-none transition duration-300 hover:shadow-[0_26px_64px_rgb(23_22_60/0.18)] focus-visible:ring-4 focus-visible:ring-brass/50 sm:h-[34rem] lg:h-[42rem]"
                >
                  <Image
                    src={category.imageUrl || "/brand/shirt-stone.png"}
                    alt={textByLocale(locale, category.nameAr, category.nameEn)}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale transition duration-500 ease-[var(--ease-out)] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-ink/50 transition duration-300 group-hover:bg-ink/20" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/75 to-transparent" />
                  <div className={`absolute bottom-5 ${cardTextSide}`}>
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-bone/70 md:hidden">
                      {t.viewCategory} <span aria-hidden="true">{arrow}</span>
                    </p>
                    <h3
                      className={`origin-bottom text-5xl font-black leading-none text-bone/90 md:whitespace-nowrap md:text-6xl ${cardRotation}`}
                    >
                      {textByLocale(locale, category.nameAr, category.nameEn)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${shellX} py-14 md:py-16 lg:py-20`}>
          <div className={contentMax}>
            <div className="grid gap-5 md:grid-cols-[1fr_0.9fr] md:items-end">
              <h2 className="display-tight text-[clamp(3.1rem,7.8vw,6.4rem)] font-black">
                <span className="block text-ink">{t.newest}</span>
                <span className="block text-caramel">{t.newestLight}</span>
              </h2>
              <p className="max-w-xl text-base font-semibold leading-8 text-muted md:text-lg">{t.categoryHint}</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="grid gap-3">
                  <ProductCard product={product} locale={locale} />
                  {product.category && (
                    <Link
                      href={localPath(locale, `/products?category=${product.category.slug}`)}
                      className="arrow-link w-fit text-ink/75"
                    >
                      {textByLocale(locale, product.category.nameAr, product.category.nameEn)}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} categories={categories} settings={settings} />
    </div>
  );
}
