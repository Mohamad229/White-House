import { ProductStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { seedCategories, seedProducts, seedSettings } from "./seed-data";
import type { CategoryView, ProductView, StoreSettingsView } from "./types";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  colors: {
    orderBy: { sortOrder: "asc" as const },
    include: { variants: true },
  },
};

const publicProductStatuses = [
  ProductStatus.visible,
  ProductStatus.outOfStock,
];

function normalizeProduct(product: any): ProductView {
  return {
    ...product,
    images: product.images ?? [],
    colors: (product.colors ?? []).map((color: any) => ({
      ...color,
      variants: color.variants ?? [],
    })),
  };
}

function canUseSeedFallback() {
  return process.env.USE_SEED_FALLBACK === "true" || !process.env.DATABASE_URL;
}

function publicReadError(error: unknown, fallback: unknown) {
  if (canUseSeedFallback()) return fallback;
  throw error;
}

export async function getStoreSettings(): Promise<StoreSettingsView> {
  try {
    const settings = await prisma.storeSettings.findFirst({
      orderBy: { createdAt: "asc" },
    });
    return settings ?? seedSettings;
  } catch (error) {
    return publicReadError(error, seedSettings) as StoreSettingsView;
  }
}

export async function getAdminStoreSettings(): Promise<StoreSettingsView> {
  const settings = await prisma.storeSettings.findFirst({
    orderBy: { createdAt: "asc" },
  });
  return settings ?? seedSettings;
}

export async function getVisibleCategories(): Promise<CategoryView[]> {
  try {
    return await prisma.category.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    });
  } catch (error) {
    return publicReadError(
      error,
      seedCategories
        .filter((category) => category.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    ) as CategoryView[];
  }
}

export async function getAllCategories(): Promise<CategoryView[]> {
  return await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });
}

export async function getAdminCategory(id: string): Promise<CategoryView | null> {
  return await prisma.category.findUnique({
    where: { id },
  });
}

export async function getPublicProducts(
  categorySlug?: string,
): Promise<ProductView[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: { in: publicProductStatuses },
        ...(categorySlug
          ? { category: { slug: categorySlug, isVisible: true } }
          : {}),
      },
      include: productInclude,
      orderBy: { createdAt: "desc" },
    });
    return products.map(normalizeProduct);
  } catch (error) {
    return publicReadError(
      error,
      seedProducts.filter((product) => {
        const categoryMatch =
          !categorySlug || product.category?.slug === categorySlug;
        return product.status !== "hidden" && categoryMatch;
      }),
    ) as ProductView[];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<ProductView[]> {
  const products = await getPublicProducts();
  return products
    .filter((product) => product.isFeatured)
    .concat(products.filter((product) => !product.isFeatured))
    .slice(0, limit);
}

export async function getRepresentativeProductsByCategory(): Promise<
  ProductView[]
> {
  const [categories, products] = await Promise.all([
    getVisibleCategories(),
    getPublicProducts(),
  ]);
  const used = new Set<string>();
  return categories
    .map((category) => {
      const candidates = products.filter(
        (product) =>
          product.category?.slug === category.slug && !used.has(product.id),
      );
      const chosen =
        candidates.find((product) => product.isFeatured) ?? candidates[0];
      if (chosen) used.add(chosen.id);
      return chosen;
    })
    .filter(Boolean) as ProductView[];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductView | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: { in: publicProductStatuses } },
      include: productInclude,
    });
    return product ? normalizeProduct(product) : null;
  } catch (error) {
    return publicReadError(
      error,
      seedProducts.find(
        (product) => product.slug === slug && product.status !== "hidden",
      ) ?? null,
    ) as ProductView | null;
  }
}

export async function getRelatedProducts(
  product: ProductView,
  limit = 4,
): Promise<ProductView[]> {
  const categorySlug = product.category?.slug;
  if (!categorySlug) return [];
  const products = await getPublicProducts(categorySlug);
  return products
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, limit);
}

export async function getAdminSummary() {
  const [newOrders, visibleProducts, categories, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { status: "new" } }),
      prisma.product.count({ where: { status: "visible" } }),
      prisma.category.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);
  return { newOrders, visibleProducts, categories, recentOrders };
}

export async function getAdminProducts() {
  return await prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function getAdminOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getAdminOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}
