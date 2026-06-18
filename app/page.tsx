import { HomePage } from "@/components/HomePage";
import {
  getPublicProducts,
  getStoreSettings,
  getVisibleCategories,
} from "@/lib/data";

export default async function Page() {
  const [categories, products, settings] = await Promise.all([
    getVisibleCategories(),
    getPublicProducts(),
    getStoreSettings(),
  ]);
  return (
    <HomePage
      locale="ar"
      categories={categories}
      products={products}
      settings={settings}
    />
  );
}
