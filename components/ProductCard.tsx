import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { localPath, textByLocale } from "@/lib/i18n";
import type { Locale, ProductView } from "@/lib/types";

export function ProductCard({ product, locale }: { product: ProductView; locale: Locale }) {
  const image =
    product.images.find((candidate) => candidate.isMain)?.url ||
    product.colors.find((color) => color.imageUrl)?.imageUrl ||
    product.images[0]?.url ||
    "/brand/shirt-stone.png";

  return (
    <article className="group overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_14px_40px_rgb(23_22_60/0.08)]">
      <Link href={localPath(locale, `/products/${product.slug}`)} className="block">
        <div className="relative aspect-[0.82] overflow-hidden bg-stonewash">
          <Image
            src={image}
            alt={textByLocale(locale, product.nameAr, product.nameEn)}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.035]"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.id}
                className="h-3.5 w-3.5 rounded-full border border-bone/70 shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={textByLocale(locale, color.nameAr, color.nameEn)}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 bg-paper p-4">
          <div className="min-w-0">
            <h3 className="text-base font-black leading-tight">{textByLocale(locale, product.nameAr, product.nameEn)}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-muted">
              {textByLocale(locale, product.shortDescriptionAr, product.shortDescriptionEn)}
            </p>
            <p className="mt-2 text-lg font-semibold text-caramel">{formatMoney(product.price, product.currency, locale)}</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 text-lg font-black transition group-hover:bg-ink group-hover:text-bone">
            +
          </span>
        </div>
      </Link>
    </article>
  );
}
