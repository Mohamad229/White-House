import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { requireAdmin } from "@/lib/auth";
import { getAllCategories } from "@/lib/data";

export default async function Page() {
  await requireAdmin();
  const categories = await getAllCategories();
  return (
    <AdminShell>
      <AdminHeader title="الأقسام" />
      <CategoryManager categories={categories} />
    </AdminShell>
  );
}
