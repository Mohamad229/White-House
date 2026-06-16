import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { getAllCategories } from "@/lib/data";

export default async function Page() {
  await requireAdmin();
  const categories = await getAllCategories();
  return (
    <AdminShell>
      <AdminHeader title="منتج جديد" />
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
