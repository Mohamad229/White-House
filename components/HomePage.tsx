import Image from "next/image";
import Link from "next/link";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductCard } from "./ProductCard";
import { normalizeImageUrl } from "@/lib/image-url";
import { dictionary, localPath, textByLocale } from "@/lib/i18n";
import type {
  CategoryView,
  Locale,
  ProductView,
  StoreSettingsView,
} from "@/lib/types";

const heroImage = "/brand/hero-image.jpg";

const heroCopy = {
  ar: {
    eyebrow: "أزياء رجالية مختارة",
    dark: ["جهز", "إطلالتك"],
    light: ["بالقطع", "الصحيحة"],
    body: "قطع يومية بهوية هادئة، صور واضحة، ألوان دقيقة، وطلب سريع عبر واتساب.",
  },
  en: {
    eyebrow: "Curated menswear",
    dark: ["Get", "yourself"],
    light: ["into the"],
    body: "Everyday pieces with a quiet identity, precise colors, and a fast WhatsApp order flow.",
  },
} as const;

function productsByCategory(
  categories: CategoryView[],
  products: ProductView[],
) {
  return categories
    .map((category) => ({
      category,
      products: products
        .filter((product) => product.category?.slug === category.slug)
        .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
        .slice(0, 4),
    }))
    .filter((group) => group.products.length > 0);
}

export function HomePage({
  locale,
  categories,
  products,
  settings,
}: {
  locale: Locale;
  categories: CategoryView[];
  products: ProductView[];
  settings: StoreSettingsView;
}) {
  const t = dictionary[locale];
  const h = heroCopy[locale];
  const featuredCategories = categories.slice(0, 5);
  const groupedProducts = productsByCategory(categories, products);
  const whatsappNumber = settings.whatsappNumber.replace(/[^\d]/g, "");
  const whatsappHref =
    settings.whatsappUrl ||
    (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "");

  return (
    <div className="page-shell" dir={t.dir} lang={locale}>
      <Header locale={locale} />
      <main>
        <section id="home" className="relative overflow-hidden bg-bone/70">
          <div
            dir="ltr"
            className="mx-auto grid max-w-[1720px] grid-cols-1 lg:h-[calc(100vh-86px)] lg:min-h-[620px] lg:max-h-[760px] lg:grid-cols-2"
          >
            {/* Text Side */}
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              className={`relative z-10 flex h-full flex-col justify-center px-6 py-16 sm:px-10 lg:px-[7vw] ${
                locale === "ar"
                  ? "order-1 text-right lg:order-2 lg:items-end"
                  : "order-1 text-left lg:order-1 lg:items-start"
              }`}
            >
              {/* Glow فقط للإنجليزي أو للجميع بدون تأثير رمادي مزعج */}
              <div
                className={`pointer-events-none absolute top-1/2 h-[42%] w-[min(38rem,86vw)] -translate-y-1/2 rounded-full bg-brass/45 opacity-95 blur-[70px] ${
                  locale === "ar"
                    ? "right-3 sm:right-8 lg:right-[6vw]"
                    : "left-3 sm:left-8 lg:left-[6vw]"
                }`}
                aria-hidden="true"
              />

              <div className="relative max-w-[760px] bg-transparent before:hidden after:hidden">
                <p className="eyebrow mb-6 text-caramel">{h.eyebrow}</p>

                <h1 className="font-black uppercase leading-[0.9] tracking-[-0.075em] text-ink">
                  {h.dark.map((line) => (
                    <span
                      className="block text-[clamp(4.2rem,7vw,8.9rem)]"
                      key={line}
                    >
                      {line}
                    </span>
                  ))}

                  {h.light.map((line) => (
                    <span
                      className="block text-[clamp(4.2rem,7vw,8.9rem)] text-paper drop-shadow-[0_18px_45px_rgba(23,22,60,0.35)]"
                      key={line}
                    >
                      {line}
                    </span>
                  ))}
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-ink/75 sm:text-lg">
                  {h.body}
                </p>

                <div
                  className={`mt-7 flex flex-wrap gap-3 ${
                    locale === "ar" ? "justify-end" : "justify-start"
                  }`}
                >
                  <Link
                    className="btn btn-primary"
                    href={localPath(locale, "/products")}
                  >
                    {t.heroCta}
                  </Link>

                  <Link
                    className="btn btn-ghost"
                    href={localPath(locale, "/#categories")}
                  >
                    {t.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div
              className={`relative min-h-[420px] overflow-hidden bg-transparent sm:min-h-[560px] lg:h-full ${
                locale === "ar" ? "order-2 lg:order-1" : "order-2 lg:order-2"
              }`}
            >
              <Image
                src={heroImage}
                alt="White House menswear hero"
                fill
                priority
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section id="categories" className="section-pad wh-categories-section">
          <div className="container-wide grid gap-8 text-start">
            <div className="wh-section-heading md:flex md:items-end md:justify-between md:gap-8">
              <div className="grid gap-3">
                <p className="eyebrow">{t.filters}</p>
                <h2 className="wh-section-title wh-categories-title text-ink">
                  {t.categories}
                </h2>
              </div>
              <Link
                className="arrow-link w-fit text-ink"
                href={localPath(locale, "/products")}
              >
                {t.viewAll}
              </Link>
            </div>

            <div className="wh-category-grid">
              {featuredCategories.map((category, index) => (
                <Link
                  key={category.id}
                  href={localPath(
                    locale,
                    `/products?category=${category.slug}`,
                  )}
                  className="wh-category-card group"
                >
                  <Image
                    src={
                      normalizeImageUrl(category.imageUrl) ||
                      "/brand/category-image-1.jpg"
                    }
                    alt={textByLocale(locale, category.nameAr, category.nameEn)}
                    fill
                    sizes="(min-width:1280px) 20vw, (min-width:640px) 50vw, 94vw"
                    className="object-cover"
                  />
                  <div className="wh-category-label text-paper">
                    <p className="mb-4 text-[0.62rem] font-black uppercase tracking-[0.2em] text-paper/80">
                      {t.viewCategory} · 0{index + 1}
                    </p>
                    <h3 className="wh-category-name">
                      {textByLocale(locale, category.nameAr, category.nameEn)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad wh-home-products-section pt-0">
          <div className="container-shell grid gap-9 text-start">
            <div className="wh-section-heading md:grid md:grid-cols-[0.9fr_1fr] md:items-end md:gap-8">
              <h2 className="wh-section-title wh-edit-title text-ink">
                <span className="block">{t.newest}</span>
                <span className="accent block">{t.newestLight}</span>
              </h2>
              <p className="max-w-2xl leading-8 text-muted md:text-lg">
                {t.categoryHint}
              </p>
            </div>

            <div className="grid gap-11">
              {groupedProducts.map(({ category, products: groupProducts }) => (
                <div key={category.id} className="grid gap-4">
                  <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-[0.16em] text-caramel">
                      {textByLocale(locale, category.nameAr, category.nameEn)}
                    </h3>
                    <Link
                      className="arrow-link text-[0.7rem]"
                      href={localPath(
                        locale,
                        `/products?category=${category.slug}`,
                      )}
                    >
                      {locale === "ar" ? "عرض المزيد" : "View more"}
                    </Link>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groupProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wh-about-section bg-ink text-paper" id="about">
          <div className="container-shell grid items-center gap-8 md:grid-cols-[1fr_0.8fr]">
            <div className="text-start">
              <p className="eyebrow">{t.about}</p>
              <h2 className="mt-3 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] md:text-6xl">
                {textByLocale(
                  locale,
                  settings.storeNameAr,
                  settings.storeNameEn,
                )}
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-paper/70">
                {textByLocale(locale, settings.aboutAr, settings.aboutEn)}
              </p>
            </div>
            <div className="wh-about-contact-card">
              <p className="text-lg font-black leading-7 text-ink">
                {textByLocale(locale, settings.locationAr, settings.locationEn)}
              </p>
              {/* {settings.supportPhone && (
                <a
                  className="text-ink/70 transition hover:text-ink"
                  href={`tel:${settings.supportPhone}`}
                >
                  {settings.supportPhone}
                </a>
              )}
              <a
                className="text-ink/70 transition hover:text-ink"
                href={`mailto:${settings.supportEmail}`}
              >
                {settings.supportEmail}
              </a> */}
              {whatsappHref && (
                <a className="btn btn-primary w-full" href={whatsappHref}>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} categories={categories} settings={settings} />
    </div>
  );
}
