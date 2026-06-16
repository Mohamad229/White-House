import { HomePage } from "@/components/HomePage";
import { getRepresentativeProductsByCategory, getStoreSettings, getVisibleCategories } from "@/lib/data";

export default async function Page() {
  const [categories, products, settings] = await Promise.all([
    getVisibleCategories(),
    getRepresentativeProductsByCategory(),
    getStoreSettings()
  ]);
  return <HomePage locale="ar" categories={categories} products={products} settings={settings} />;
}
