import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { CategoryManager } from "@/components/admin/CategoryManager";
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
        <AdminHeader title="Ø§Ù„Ø£Ù‚Ø³Ø§Ù…" />
        <AdminError />
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <AdminHeader title="الأقسام" />
      <CategoryManager categories={categories} />
    </AdminShell>
  );
}
