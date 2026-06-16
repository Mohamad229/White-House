import { ProductsPage } from "@/components/ProductsPage";
import { getPublicProducts, getStoreSettings, getVisibleCategories } from "@/lib/data";

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [categories, products, settings] = await Promise.all([
    getVisibleCategories(),
    getPublicProducts(category),
    getStoreSettings()
  ]);
  return (
    <ProductsPage
      locale="ar"
      categories={categories}
      products={products}
      settings={settings}
      selectedCategory={category}
    />
  );
}
