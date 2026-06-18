import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";

async function uniqueCategorySlug(rawSlug: string, fallbackName: string) {
  const base =
    slugify(rawSlug || fallbackName || "category") || `category-${Date.now()}`;
  let candidate = base;
  let index = 2;
  while (
    await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
  ) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
}

export async function POST(request: Request) {
  await requireAdmin();
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
  const category = await prisma.category.create({
    data: {
      slug: await uniqueCategorySlug(String(body.slug || ""), nameEn || nameAr),
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
