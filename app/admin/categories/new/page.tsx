import Link from "next/link";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/auth";

export default async function Page() {
  await requireAdmin();
  return (
    <AdminShell>
      <AdminHeader
        title="قسم جديد"
        action={
          <Link
            className="tap-target rounded-full border border-ink/15 px-5 py-3 font-black"
            href="/admin/categories"
          >
            الرجوع للأقسام
          </Link>
        }
      />
      <CategoryForm />
    </AdminShell>
  );
}
