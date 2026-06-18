import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";

async function uniqueCategorySlug(
  rawSlug: string,
  fallbackName: string,
  currentId: string,
) {
  const base =
    slugify(rawSlug || fallbackName || "category") || `category-${Date.now()}`;
  let candidate = base;
  let index = 2;
  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${base}-${index}`;
    index += 1;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  const nameAr = String(body.nameAr || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  const imageUrl = normalizeImageUrl(String(body.imageUrl || ""));
  if (!nameAr || !nameEn)
    return NextResponse.json(
      { error: "Missing required category fields." },
      { status: 400 },
    );
  if (!imageUrl)
    return NextResponse.json(
      { error: "Upload a category image." },
      { status: 400 },
    );
  const category = await prisma.category.update({
    where: { id },
    data: {
      slug: await uniqueCategorySlug(
        String(body.slug || ""),
        nameEn || nameAr,
        id,
      ),
      nameAr,
      nameEn,
      descriptionAr: String(body.descriptionAr || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      imageUrl,
      isVisible: body.isVisible !== false,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      {
        error:
          "This category has products. Move or delete those products before deleting the category.",
      },
      { status: 409 },
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
