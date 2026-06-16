import { prisma } from "./prisma";
import { seedCategories, seedProducts, seedSettings } from "./seed-data";
import type { CategoryView, ProductView, StoreSettingsView } from "./types";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  colors: {
    orderBy: { sortOrder: "asc" as const },
    include: { variants: true }
  }
};

function normalizeProduct(product: any): ProductView {
  return {
    ...product,
    images: product.images ?? [],
    colors: (product.colors ?? []).map((color: any) => ({
      ...color,
      variants: color.variants ?? []
    }))
  };
}

export async function getStoreSettings(): Promise<StoreSettingsView> {
  try {
    const settings = await prisma.storeSettings.findFirst({ orderBy: { createdAt: "asc" } });
    return settings ?? seedSettings;
  } catch {
    return seedSettings;
  }
}

export async function getVisibleCategories(): Promise<CategoryView[]> {
  try {
    return await prisma.category.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }]
    });
  } catch {
    return seedCategories.filter((category) => category.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export async function getAllCategories(): Promise<CategoryView[]> {
  try {
    return await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }]
    });
  } catch {
    return seedCategories;
  }
}

export async function getPublicProducts(categorySlug?: string): Promise<ProductView[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "visible",
        ...(categorySlug ? { category: { slug: categorySlug, isVisible: true } } : {})
      },
      include: productInclude,
      orderBy: { createdAt: "desc" }
    });
    return products.map(normalizeProduct);
  } catch {
    return seedProducts.filter((product) => {
      const categoryMatch = !categorySlug || product.category?.slug === categorySlug;
      return product.status === "visible" && categoryMatch;
    });
  }
}

export async function getFeaturedProducts(limit = 4): Promise<ProductView[]> {
  const products = await getPublicProducts();
  return products
    .filter((product) => product.isFeatured)
    .concat(products.filter((product) => !product.isFeatured))
    .slice(0, limit);
}

export async function getRepresentativeProductsByCategory(): Promise<ProductView[]> {
  const [categories, products] = await Promise.all([getVisibleCategories(), getPublicProducts()]);
  const used = new Set<string>();
  return categories
    .map((category) => {
      const candidates = products.filter((product) => product.category?.slug === category.slug && !used.has(product.id));
      const chosen = candidates.find((product) => product.isFeatured) ?? candidates[0];
      if (chosen) used.add(chosen.id);
      return chosen;
    })
    .filter(Boolean) as ProductView[];
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: "visible" },
      include: productInclude
    });
    return product ? normalizeProduct(product) : null;
  } catch {
    return seedProducts.find((product) => product.slug === slug && product.status === "visible") ?? null;
  }
}

export async function getRelatedProducts(product: ProductView, limit = 4): Promise<ProductView[]> {
  const categorySlug = product.category?.slug;
  if (!categorySlug) return [];
  const products = await getPublicProducts(categorySlug);
  return products.filter((candidate) => candidate.id !== product.id).slice(0, limit);
}

export async function getAdminSummary() {
  try {
    const [newOrders, visibleProducts, categories, recentOrders] = await Promise.all([
      prisma.order.count({ where: { status: "new" } }),
      prisma.product.count({ where: { status: "visible" } }),
      prisma.category.count(),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } })
    ]);
    return { newOrders, visibleProducts, categories, recentOrders };
  } catch {
    return { newOrders: 0, visibleProducts: seedProducts.length, categories: seedCategories.length, recentOrders: [] };
  }
}

export async function getAdminProducts() {
  try {
    return await prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: "desc" }
    });
  } catch {
    return seedProducts;
  }
}

export async function getAdminProduct(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id }, include: productInclude });
  } catch {
    return seedProducts.find((product) => product.id === id) ?? null;
  }
}

export async function getAdminOrders() {
  try {
    return await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });
  } catch {
    return [];
  }
}

export async function getAdminOrder(id: string) {
  try {
    return await prisma.order.findUnique({ where: { id }, include: { items: true } });
  } catch {
    return null;
  }
}
