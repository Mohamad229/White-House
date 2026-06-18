import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { ProductManager } from "@/components/admin/ProductManager";
import { requireAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/data";

export default async function Page() {
  await requireAdmin();
  let products;
  try {
    products = await getAdminProducts();
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="المنتجات" />
        <AdminError />
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <AdminHeader title="المنتجات" />
      <ProductManager products={products} />
    </AdminShell>
  );
}
