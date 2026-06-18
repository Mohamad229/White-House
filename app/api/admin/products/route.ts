import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";

const productStatuses = ["visible", "hidden", "outOfStock"] as const;

type ColorInput = {
  id?: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  imageUrl?: string;
  isAvailable?: boolean;
  sortOrder?: number;
  sizes?: string[];
};

type ImageInput = {
  url: string;
  altAr?: string;
  altEn?: string;
  isMain?: boolean;
  colorId?: string;
  sortOrder?: number;
};

function parseJson<T>(value: unknown, fallback: T): T {
  try {
    return JSON.parse(String(value || "")) as T;
  } catch {
    return fallback;
  }
}

function arrayInput<T>(value: unknown, jsonValue: unknown, fallback: T[]): T[] {
  if (Array.isArray(value)) return value as T[];
  return parseJson<T[]>(jsonValue, fallback);
}

async function uniqueProductSlug(rawSlug: string, fallbackName: string) {
  const base =
    slugify(rawSlug || fallbackName || "product") || `product-${Date.now()}`;
  let candidate = base;
  let index = 2;
  while (
    await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
  ) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
}

async function productData(body: any) {
  const nameAr = String(body.nameAr || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  const internalCode = String(body.internalCode || "").trim();
  const categoryId = String(body.categoryId || "").trim();
  const price = Number(body.price || 0);
  if (!nameAr || !nameEn || !internalCode || !categoryId || price <= 0) {
    throw new Error("Missing required product fields");
  }
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) throw new Error("Category does not exist");
  return {
    categoryId,
    slug: await uniqueProductSlug(
      String(body.slug || ""),
      String(nameEn || nameAr || ""),
    ),
    internalCode,
    nameAr,
    nameEn,
    descriptionAr: String(body.descriptionAr || ""),
    descriptionEn: String(body.descriptionEn || ""),
    shortDescriptionAr: String(body.shortDescriptionAr || ""),
    shortDescriptionEn: String(body.shortDescriptionEn || ""),
    price,
    currency: "SYP",
    status: productStatuses.includes(body.status)
      ? (body.status as any)
      : "visible",
    isFeatured: Boolean(body.isFeatured),
  };
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const images = arrayInput<ImageInput>(body.images, body.imagesJson, []);
  const colors = arrayInput<ColorInput>(body.colors, body.colorsJson, []);
  if (colors.length === 0)
    return NextResponse.json(
      { error: "Add at least one color." },
      { status: 400 },
    );
  if (colors.some((color) => !String(color.imageUrl || "").trim())) {
    return NextResponse.json(
      { error: "Upload an image for every color." },
      { status: 400 },
    );
  }
  if (colors.some((color) => !color.sizes?.length)) {
    return NextResponse.json(
      { error: "Select at least one size for every color." },
      { status: 400 },
    );
  }
  let baseProductData;
  try {
    baseProductData = await productData(body);
  } catch {
    return NextResponse.json(
      { error: "Missing required product fields." },
      { status: 400 },
    );
  }
  const product = await prisma.product.create({
    data: {
      ...baseProductData,
    },
  });

  const colorIdMap = new Map<string, string>();
  for (const color of colors) {
    const createdColor = await prisma.productColor.create({
      data: {
        productId: product.id,
        nameAr: String(color.nameAr || "").trim(),
        nameEn: String(color.nameEn || "").trim(),
        hex: String(color.hex || "#e5c582"),
        imageUrl: normalizeImageUrl(color.imageUrl) || null,
        isAvailable: color.isAvailable !== false,
        sortOrder: Number(color.sortOrder || 0),
      },
    });
    if (color.id) colorIdMap.set(color.id, createdColor.id);
    colorIdMap.set(color.nameEn, createdColor.id);
    colorIdMap.set(color.nameAr, createdColor.id);
    if ((color.sizes || []).length > 0) {
      await prisma.productVariant.createMany({
        data: (color.sizes || []).map((size) => ({
          productId: product.id,
          colorId: createdColor.id,
          size,
          isAvailable: true,
        })),
      });
    }
  }

  if (images.length > 0) {
    await prisma.productImage.createMany({
      data: images.map((image) => ({
        productId: product.id,
        url: normalizeImageUrl(image.url),
        altAr: image.altAr || body.nameAr,
        altEn: image.altEn || body.nameEn,
        isMain: Boolean(image.isMain),
        colorId: image.colorId ? (colorIdMap.get(image.colorId) ?? null) : null,
        sortOrder: Number(image.sortOrder || 0),
      })),
    });
  }
  return NextResponse.json(product);
}
