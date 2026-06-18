"use client";

import Image from "next/image";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/image-url";
import type { CategoryView } from "@/lib/types";

export function CategoryManager({
  categories,
}: {
  categories: CategoryView[];
}) {
  return (
    <div className="grid gap-6">
      <section className="premium-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">إدارة الأقسام</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              أضف قسما جديدا أو افتح صفحة مستقلة لتعديل الصورة والظهور والترتيب.
            </p>
          </div>
          <Link
            className="tap-target rounded-full bg-ink px-5 py-3 text-center font-black text-bone"
            href="/admin/categories/new"
          >
            إضافة قسم
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-black">الأقسام الحالية</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const imageUrl = normalizeImageUrl(category.imageUrl);
            return (
              <article
                key={category.id}
                className="premium-card overflow-hidden"
              >
                <div className="relative aspect-[1.25] bg-bone">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.nameAr}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm font-bold text-muted">
                      بدون صورة
                    </div>
                  )}
                </div>
                <div className="grid gap-3 p-4">
                  <div>
                    <h3 className="text-xl font-black">{category.nameAr}</h3>
                    <p className="mt-1 text-sm text-muted">{category.nameEn}</p>
                    <p className="mt-1 truncate text-sm text-muted">
                      {category.slug}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-black ${
                        category.isVisible
                          ? "bg-ink text-bone"
                          : "bg-bone text-muted"
                      }`}
                    >
                      {category.isVisible ? "ظاهر" : "مخفي"}
                    </span>
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="tap-target rounded-full border border-ink/15 px-4 py-2 text-sm font-black transition hover:border-caramel hover:text-caramel"
                    >
                      تعديل
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
