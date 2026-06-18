import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { getAllCategories } from "@/lib/data";

export default async function Page() {
  await requireAdmin();
  let categories;
  try {
    categories = await getAllCategories();
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="Ù…Ù†ØªØ¬ Ø¬Ø¯ÙŠØ¯" />
        <AdminError />
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <AdminHeader title="منتج جديد" />
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
