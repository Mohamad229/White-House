"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CategoryView, ProductView } from "@/lib/types";
import { slugify } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

type ColorState = {
  tempId: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  imageUrl: string;
  isAvailable: boolean;
  sizes: string[];
};

function emptyColor(index = 0): ColorState {
  return {
    tempId: `color-${Date.now()}-${index}`,
    nameAr: "",
    nameEn: "",
    hex: "#e5c582",
    imageUrl: "",
    isAvailable: true,
    sizes: ["M", "L"],
  };
}

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductView | null;
  categories: CategoryView[];
}) {
  const router = useRouter();
  const initialColors = useMemo<ColorState[]>(() => {
    if (!product?.colors?.length) return [emptyColor(0)];
    return product.colors.map((color, index) => ({
      tempId: color.id || `color-${index}`,
      nameAr: color.nameAr,
      nameEn: color.nameEn,
      hex: color.hex || "#e5c582",
      imageUrl: normalizeImageUrl(
        color.imageUrl ||
          product.images.find((image) => image.colorId === color.id)?.url ||
          "",
      ),
      isAvailable: color.isAvailable,
      sizes: color.variants
        .filter((variant) => variant.isAvailable)
        .map((variant) => variant.size),
    }));
  }, [product]);

  const [status, setStatus] = useState("");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [colors, setColors] = useState<ColorState[]>(initialColors);

  function updateColor(index: number, patch: Partial<ColorState>) {
    setColors((current) =>
      current.map((color, colorIndex) =>
        colorIndex === index ? { ...color, ...patch } : color,
      ),
    );
  }

  function toggleSize(index: number, size: string) {
    setColors((current) =>
      current.map((color, colorIndex) => {
        if (colorIndex !== index) return color;
        const sizes = color.sizes.includes(size)
          ? color.sizes.filter((item) => item !== size)
          : [...color.sizes, size];
        return { ...color, sizes };
      }),
    );
  }

  function updateName(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) setSlug(slugify(event.target.value));
  }

  async function uploadColorImage(index: number, file?: File) {
    if (!file) return;
    setStatus("جار رفع الصورة...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "تعذر رفع الصورة.");
      return;
    }
    updateColor(index, { imageUrl: normalizeImageUrl(data.url) });
    setStatus("تم رفع الصورة وربطها باللون.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const cleanedColors = colors
      .map((color, index) => ({
        id: color.tempId,
        nameAr: color.nameAr.trim(),
        nameEn: color.nameEn.trim(),
        hex: color.hex.trim(),
        imageUrl: normalizeImageUrl(color.imageUrl),
        isAvailable: color.isAvailable,
        sortOrder: index,
        sizes: color.sizes,
      }))
      .filter((color) => color.nameAr && color.nameEn && color.hex);

    if (
      !body.nameAr ||
      !body.nameEn ||
      !body.internalCode ||
      !body.categoryId ||
      Number(body.price) <= 0
    ) {
      setStatus("يرجى تعبئة الاسم، الكود، القسم، والسعر.");
      return;
    }
    if (cleanedColors.length === 0) {
      setStatus("أضف لونا واحدا على الأقل مع الاسم والرمز اللوني.");
      return;
    }
    if (cleanedColors.some((color) => color.sizes.length === 0)) {
      setStatus("اختر مقاسا واحدا على الأقل لكل لون.");
      return;
    }
    if (cleanedColors.some((color) => !color.imageUrl)) {
      setStatus("ارفع صورة لكل لون قبل حفظ المنتج.");
      return;
    }

    const images = cleanedColors
      .filter((color) => color.imageUrl)
      .map((color, index) => ({
        url: color.imageUrl,
        altAr: String(body.nameAr),
        altEn: String(body.nameEn),
        isMain: index === 0,
        colorId: color.id,
        sortOrder: index,
      }));

    const response = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          slug,
          price: Number(body.price || 0),
          currency: "SYP",
          isFeatured: form.get("isFeatured") === "on",
          colors: cleanedColors,
          images,
        }),
      },
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus(
        data?.error || "تعذر حفظ المنتج. تأكد من الحقول وقاعدة البيانات.",
      );
      return;
    }
    setStatus(`تم حفظ المنتج. الرابط المستخدم: ${data.slug || slug}`);
    router.push("/admin/products");
    router.refresh();
  }

  async function deleteProduct() {
    if (!product) return;
    const confirmed = window.confirm(
      "هل تريد حذف هذا المنتج؟ سيتم حذف الصور والألوان والمقاسات المرتبطة به، مع إبقاء الطلبات القديمة محفوظة.",
    );
    if (!confirmed) return;

    setStatus("جاري حذف المنتج...");
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus(data?.error || "تعذر حذف المنتج.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <section className="premium-card grid gap-4 p-4 sm:p-5">
        <h2 className="text-xl font-black">بيانات المنتج</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            name="nameAr"
            label="اسم المنتج بالعربية"
            defaultValue={product?.nameAr}
            required
            onChange={updateName}
          />
          <Field
            name="nameEn"
            label="اسم المنتج بالإنجليزية"
            defaultValue={product?.nameEn}
            required
            onChange={updateName}
          />
          <Field
            name="slug"
            label="الرابط المختصر"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            placeholder="stone-relaxed-tee"
          />
          <Field
            name="internalCode"
            label="الكود الداخلي للموظفين"
            defaultValue={product?.internalCode}
            required
          />
          <label className="block">
            <span className="mb-2 block text-sm font-black">القسم</span>
            <select
              className="admin-field"
              name="categoryId"
              defaultValue={product?.categoryId || categories[0]?.id}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameAr} / {category.nameEn}
                </option>
              ))}
            </select>
          </label>
          <Field
            name="price"
            label="السعر بالليرة السورية"
            type="number"
            min={1}
            defaultValue={String(product?.price ?? "")}
            required
          />
          <label className="block">
            <span className="mb-2 block text-sm font-black">الحالة</span>
            <select
              className="admin-field"
              name="status"
              defaultValue={product?.status || "visible"}
            >
              <option value="visible">ظاهر</option>
              <option value="hidden">مخفي</option>
              <option value="outOfStock">غير متوفر</option>
            </select>
          </label>
          <label className="flex items-center gap-2 self-end rounded-2xl bg-bone p-4 font-black">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product?.isFeatured ?? false}
            />
            يظهر كمختار في الصفحة الرئيسية
          </label>
        </div>
        <Textarea
          name="shortDescriptionAr"
          label="وصف قصير بالعربية"
          defaultValue={product?.shortDescriptionAr}
        />
        <Textarea
          name="shortDescriptionEn"
          label="وصف قصير بالإنجليزية"
          defaultValue={product?.shortDescriptionEn}
        />
        <Textarea
          name="descriptionAr"
          label="وصف كامل بالعربية"
          defaultValue={product?.descriptionAr}
          required
        />
        <Textarea
          name="descriptionEn"
          label="وصف كامل بالإنجليزية"
          defaultValue={product?.descriptionEn}
          required
        />
      </section>

      <section className="premium-card grid gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">الألوان والصور والمقاسات</h2>
            <p className="mt-1 text-sm text-muted">
              ارفع صورة لكل لون حتى تتغير صورة المنتج عند اختيار اللون في
              المتجر.
            </p>
          </div>
          <button
            type="button"
            className="tap-target rounded-full bg-ink px-5 py-3 text-sm font-black text-bone"
            onClick={() =>
              setColors((current) => [...current, emptyColor(current.length)])
            }
          >
            إضافة لون
          </button>
        </div>

        <div className="grid gap-4">
          {colors.map((color, index) => (
            <div
              key={color.tempId}
              className="rounded-2xl border border-ink/10 bg-bone p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-10 w-10 rounded-full border border-ink/15"
                    style={{ backgroundColor: color.hex }}
                  />
                  <strong>لون {index + 1}</strong>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-black"
                  onClick={() =>
                    setColors((current) =>
                      current.length > 1
                        ? current.filter((_, itemIndex) => itemIndex !== index)
                        : current,
                    )
                  }
                >
                  حذف
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="اسم اللون بالعربية"
                  value={color.nameAr}
                  onChange={(event) =>
                    updateColor(index, { nameAr: event.target.value })
                  }
                  required
                />
                <Field
                  label="اسم اللون بالإنجليزية"
                  value={color.nameEn}
                  onChange={(event) =>
                    updateColor(index, { nameEn: event.target.value })
                  }
                  required
                />
                <Field
                  label="رمز اللون HEX"
                  value={color.hex}
                  onChange={(event) =>
                    updateColor(index, { hex: event.target.value })
                  }
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  required
                />
                <label className="flex items-center gap-2 self-end rounded-2xl bg-paper p-4 font-black">
                  <input
                    type="checkbox"
                    checked={color.isAvailable}
                    onChange={(event) =>
                      updateColor(index, { isAvailable: event.target.checked })
                    }
                  />
                  اللون متاح
                </label>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[11rem_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
                  {color.imageUrl ? (
                    <Image
                      src={color.imageUrl}
                      alt={color.nameAr || "صورة اللون"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center p-4 text-center text-sm font-bold text-muted">
                      لا توجد صورة
                    </div>
                  )}
                </div>
                <div className="grid content-start gap-4">
                  <label className="block rounded-2xl border border-dashed border-ink/20 bg-paper p-4">
                    <span className="mb-2 block text-sm font-black">
                      رفع صورة لهذا اللون
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(event) =>
                        uploadColorImage(index, event.target.files?.[0])
                      }
                    />
                  </label>
                  <div>
                    <p className="mb-2 text-sm font-black">المقاسات المتاحة</p>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`tap-target rounded-full px-4 py-2 text-sm font-black ${
                            color.sizes.includes(size)
                              ? "bg-ink text-bone"
                              : "bg-paper text-ink"
                          }`}
                          onClick={() => toggleSize(index, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="tap-target rounded-full bg-ink px-7 py-4 font-black text-bone">
          حفظ المنتج
        </button>
        {product && (
          <button
            type="button"
            className="tap-target rounded-full border border-red-300 bg-red-50 px-7 py-4 font-black text-red-700 transition hover:bg-red-100"
            onClick={deleteProduct}
          >
            حذف المنتج
          </button>
        )}
        {status && <p className="font-bold text-caramel">{status}</p>}
      </div>
    </form>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <input className="admin-field" {...props} />
    </label>
  );
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <textarea className="admin-field min-h-28" {...props} />
    </label>
  );
}
