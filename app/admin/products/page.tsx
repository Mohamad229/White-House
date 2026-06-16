import Image from "next/image";
import Link from "next/link";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/data";
import { formatMoney } from "@/lib/format";

const statusLabels: Record<string, string> = {
  visible: "ظاهر",
  hidden: "مخفي",
  outOfStock: "غير متوفر"
};

export default async function Page() {
  await requireAdmin();
  const products = await getAdminProducts();
  return (
    <AdminShell>
      <AdminHeader
        title="المنتجات"
        action={<Link className="tap-target rounded-full bg-ink px-5 py-3 font-black text-bone" href="/admin/products/new">منتج جديد</Link>}
      />

      <div className="grid gap-4 md:hidden">
        {products.map((product: any) => <ProductMobileCard key={product.id} product={product} />)}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_18px_60px_rgb(23_22_60/0.08)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right">
            <thead className="bg-ink text-bone">
              <tr>
                <th className="p-4">المنتج</th>
                <th className="p-4">الكود</th>
                <th className="p-4">القسم</th>
                <th className="p-4">السعر</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">تعديل</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} className="border-b border-ink/10 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ProductThumb product={product} />
                      <span className="font-black">{product.nameAr}</span>
                    </div>
                  </td>
                  <td className="p-4">{product.internalCode}</td>
                  <td className="p-4">{product.category?.nameAr}</td>
                  <td className="p-4">{formatMoney(product.price, product.currency, "ar")}</td>
                  <td className="p-4">{statusLabels[product.status] || product.status}</td>
                  <td className="p-4">
                    <Link className="font-black text-caramel" href={`/admin/products/${product.id}`}>تعديل</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function ProductMobileCard({ product }: { product: any }) {
  return (
    <article className="premium-card grid gap-4 p-4">
      <div className="grid grid-cols-[5.5rem_1fr] gap-4">
        <ProductThumb product={product} />
        <div className="min-w-0">
          <h2 className="text-lg font-black">{product.nameAr}</h2>
          <p className="mt-1 text-sm text-muted">{product.internalCode}</p>
          <p className="mt-1 text-sm text-muted">{product.category?.nameAr || "بدون قسم"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="السعر" value={formatMoney(product.price, product.currency, "ar")} />
        <Info label="الحالة" value={statusLabels[product.status] || product.status} />
      </div>
      <Link className="tap-target rounded-full bg-ink px-5 py-3 text-center font-black text-bone" href={`/admin/products/${product.id}`}>
        تعديل المنتج
      </Link>
    </article>
  );
}

function ProductThumb({ product }: { product: any }) {
  const image =
    product.images?.find((candidate: any) => candidate.isMain)?.url ||
    product.colors?.find((color: any) => color.imageUrl)?.imageUrl ||
    product.images?.[0]?.url ||
    "/brand/shirt-stone.png";
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-bone">
      <Image src={image} alt={product.nameAr} fill className="object-cover" />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-bone p-3">
      <p className="text-xs font-black text-muted">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}
