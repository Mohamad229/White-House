import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

async function uniqueCategorySlug(rawSlug: string, fallbackName: string, currentId: string) {
  const base = slugify(rawSlug || fallbackName || "category") || `category-${Date.now()}`;
  let candidate = base;
  let index = 2;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${base}-${index}`;
    index += 1;
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  const nameAr = String(body.nameAr || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  const imageUrl = String(body.imageUrl || "").trim();
  if (!nameAr || !nameEn) return NextResponse.json({ error: "Missing required category fields." }, { status: 400 });
  if (!imageUrl) return NextResponse.json({ error: "Upload a category image." }, { status: 400 });
  const category = await prisma.category.update({
    where: { id },
    data: {
      slug: await uniqueCategorySlug(String(body.slug || ""), nameEn || nameAr, id),
      nameAr,
      nameEn,
      descriptionAr: String(body.descriptionAr || ""),
      descriptionEn: String(body.descriptionEn || ""),
      imageUrl,
      isVisible: Boolean(body.isVisible),
      sortOrder: Number(body.sortOrder || 0)
    }
  });
  return NextResponse.json(category);
}
