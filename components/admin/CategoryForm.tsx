"use client";

import Image from "next/image";
import { useState } from "react";
import type { CategoryView } from "@/lib/types";
import { slugify } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";

export function CategoryForm({
  category,
  compact = false,
}: {
  category?: CategoryView | null;
  compact?: boolean;
}) {
  const [status, setStatus] = useState("");
  const [slug, setSlug] = useState(category?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category?.slug));
  const [imageUrl, setImageUrl] = useState(
    normalizeImageUrl(category?.imageUrl),
  );
  const imageRequiredText =
    "صورة القسم مطلوبة لأنها تظهر في بطاقات الأقسام في المتجر.";

  function updateName(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) setSlug(slugify(event.target.value));
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setStatus("جاري رفع الصورة...");
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
    setImageUrl(normalizeImageUrl(data.url));
    setStatus("تم رفع الصورة.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    if (!imageUrl) {
      setStatus(imageRequiredText);
      return;
    }

    const response = await fetch(
      category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories",
      {
        method: category ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          slug,
          imageUrl: normalizeImageUrl(imageUrl),
          descriptionAr: String(body.descriptionAr || ""),
          descriptionEn: String(body.descriptionEn || ""),
          isVisible: form.get("isVisible") === "on",
          sortOrder: Number(body.sortOrder || 0),
        }),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus(data?.error || "تعذر الحفظ. تأكد من البيانات.");
      return;
    }
    setStatus("تم الحفظ.");
    window.setTimeout(() => window.location.reload(), 650);
  }

  async function deleteCategory() {
    if (!category) return;
    const confirmed = window.confirm(
      "هل تريد حذف هذا القسم؟ لا يمكن حذف قسم يحتوي على منتجات.",
    );
    if (!confirmed) return;
    setStatus("");
    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus(data?.error || "تعذر حذف القسم.");
      return;
    }
    setStatus("تم حذف القسم.");
    window.setTimeout(() => window.location.reload(), 650);
  }

  return (
    <form
      onSubmit={submit}
      className={`grid gap-4 ${compact ? "" : "premium-card p-4 sm:p-5"}`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="nameAr"
          label="اسم القسم بالعربية"
          defaultValue={category?.nameAr}
          onChange={updateName}
          required
        />
        <Field
          name="nameEn"
          label="اسم القسم بالإنجليزية"
          defaultValue={category?.nameEn}
          onChange={updateName}
          required
        />
        <Field
          name="slug"
          label="الرابط المختصر"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(slugify(event.target.value));
          }}
        />
        <Field
          name="sortOrder"
          label="الترتيب"
          type="number"
          defaultValue={String(category?.sortOrder ?? 0)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          name="descriptionAr"
          label="وصف القسم بالعربية"
          defaultValue={category?.descriptionAr || ""}
        />
        <Textarea
          name="descriptionEn"
          label="Category description in English"
          defaultValue={category?.descriptionEn || ""}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[10rem_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-bone">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={category?.nameAr || "صورة القسم"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center p-4 text-center text-sm font-bold text-muted">
              لا توجد صورة
            </div>
          )}
        </div>
        <label className="block rounded-2xl border border-dashed border-ink/20 bg-bone p-4">
          <span className="mb-2 block text-sm font-black">
            رفع صورة القسم
          </span>
          <span className="mb-3 block text-xs font-bold leading-5 text-muted">
            {imageRequiredText}
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => uploadImage(event.target.files?.[0])}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 rounded-2xl bg-bone p-4 font-black">
        <input
          type="checkbox"
          name="isVisible"
          defaultChecked={category?.isVisible ?? true}
        />
        ظاهر في المتجر
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="tap-target rounded-full bg-ink px-6 py-3 font-black text-bone">
          حفظ القسم
        </button>
        {category && (
          <button
            type="button"
            className="tap-target rounded-full border border-red-300 px-6 py-3 font-black text-red-700"
            onClick={deleteCategory}
          >
            حذف القسم
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
      <textarea className="admin-field min-h-24" {...props} />
    </label>
  );
}
