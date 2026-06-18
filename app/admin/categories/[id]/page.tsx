import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategory } from "@/lib/data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  let category;
  try {
    category = await getAdminCategory(id);
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="تعديل القسم" />
        <AdminError />
      </AdminShell>
    );
  }
  if (!category) notFound();

  return (
    <AdminShell>
      <AdminHeader
        title="تعديل القسم"
        action={
          <Link
            className="tap-target rounded-full border border-ink/15 px-5 py-3 font-black"
            href="/admin/categories"
          >
            الرجوع للأقسام
          </Link>
        }
      />
      <CategoryForm category={category} />
    </AdminShell>
  );
}
