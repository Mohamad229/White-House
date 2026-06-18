"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";

const statusLabels: Record<string, string> = {
  visible: "ظاهر",
  hidden: "مخفي",
  outOfStock: "غير متوفر",
};

export function ProductManager({ products }: { products: any[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return products;
    return products.filter((product) => {
      const haystack = [
        product.nameAr,
        product.nameEn,
        product.internalCode,
        product.slug,
        product.category?.nameAr,
        product.category?.nameEn,
        statusLabels[product.status],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, products]);

  return (
    <div className="grid gap-5">
      <div className="sticky top-[5.25rem] z-30 rounded-2xl border border-ink/10 bg-paper/95 p-3 shadow-[0_14px_40px_rgb(23_22_60/0.08)] backdrop-blur lg:top-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">بحث في المنتجات</span>
            <input
              className="admin-field min-h-12 rounded-full pe-28"
              dir="rtl"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث بالاسم، الكود، القسم..."
            />
            <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted">
              {filteredProducts.length}/{products.length}
            </span>
          </label>
          <Link
            className="tap-target rounded-full bg-ink px-5 py-3 text-center font-black text-bone"
            href="/admin/products/new"
          >
            منتج جديد
          </Link>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="premium-card p-6 text-center font-bold text-muted">
          لا توجد منتجات مطابقة للبحث.
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <article className="premium-card grid overflow-hidden">
      <ProductThumb product={product} />
      <div className="grid gap-4 p-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-black ${
                product.status === "visible"
                  ? "bg-ink text-bone"
                  : "bg-bone text-muted"
              }`}
            >
              {statusLabels[product.status] || product.status}
            </span>
            {product.isFeatured && (
              <span className="rounded-full bg-brass/40 px-3 py-1.5 text-xs font-black text-ink">
                مختار
              </span>
            )}
          </div>
          <h2 className="line-clamp-2 text-xl font-black leading-tight">
            {product.nameAr}
          </h2>
          <p className="mt-1 truncate text-sm font-bold text-muted" dir="ltr">
            {product.nameEn}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="الكود" value={product.internalCode} />
          <Info label="القسم" value={product.category?.nameAr || "بدون قسم"} />
          <Info
            label="السعر"
            value={formatMoney(product.price, product.currency, "ar")}
          />
          <Info label="الرابط" value={product.slug} ltr />
        </div>

        <Link
          className="tap-target rounded-full bg-caramel px-5 py-3 text-center font-black text-bone transition hover:bg-ink"
          href={`/admin/products/${product.id}`}
        >
          تعديل المنتج
        </Link>
      </div>
    </article>
  );
}

function ProductThumb({ product }: { product: any }) {
  const image = normalizeImageUrl(
    product.images?.find((candidate: any) => candidate.isMain)?.url ||
      product.colors?.find((color: any) => color.imageUrl)?.imageUrl ||
      product.images?.[0]?.url ||
      "/brand/category-image-1.jpg",
  );
  return (
    <div className="relative aspect-[4/3] bg-bone">
      <Image src={image} alt={product.nameAr} fill className="object-cover" />
    </div>
  );
}

function Info({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-bone p-3">
      <p className="text-xs font-black text-muted">{label}</p>
      <p
        className="mt-1 truncate font-black"
        dir={ltr ? "ltr" : "auto"}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
