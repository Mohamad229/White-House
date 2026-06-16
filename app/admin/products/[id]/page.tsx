import { notFound } from "next/navigation";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminProduct, getAllCategories } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), getAllCategories()]);
  if (!product) notFound();
  return (
    <AdminShell>
      <AdminHeader title="تعديل المنتج" />
      <ProductForm product={product as any} categories={categories} />
    </AdminShell>
  );
}
