import { notFound } from "next/navigation";
import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminProduct, getAllCategories } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  let product;
  let categories;
  try {
    [product, categories] = await Promise.all([
      getAdminProduct(id),
      getAllCategories(),
    ]);
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬" />
        <AdminError />
      </AdminShell>
    );
  }
  if (!product) notFound();
  return (
    <AdminShell>
      <AdminHeader title="تعديل المنتج" />
      <ProductForm product={product as any} categories={categories} />
    </AdminShell>
  );
}
