import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductDetailsClient } from "@/components/ProductDetailsClient";
import { getProductBySlug, getRelatedProducts, getStoreSettings, getVisibleCategories } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, categories, settings] = await Promise.all([
    getProductBySlug(slug),
    getVisibleCategories(),
    getStoreSettings()
  ]);
  if (!product) notFound();
  const relatedProducts = await getRelatedProducts(product);
  return (
    <div className="page-shell" dir="rtl" lang="ar">
      <Header locale="ar" />
      <main className="px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-16 xl:px-20">
        <ProductDetailsClient product={product} locale="ar" relatedProducts={relatedProducts} />
      </main>
      <Footer locale="ar" categories={categories} settings={settings} />
    </div>
  );
}
