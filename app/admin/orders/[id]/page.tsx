import Image from "next/image";
import { notFound } from "next/navigation";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrder } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  return (
    <AdminShell>
      <AdminHeader title={`طلب ${order.code}`} />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="premium-card p-5">
          <h2 className="text-2xl font-black">بيانات العميل</h2>
          <div className="mt-5 grid gap-3 text-muted">
            <Info label="الاسم" value={order.customerName} />
            <Info label="الهاتف" value={order.customerPhone} />
            <Info label="المدينة والمنطقة" value={order.cityArea} />
            <Info label="العنوان" value={order.detailedAddress} />
            {order.notes && <Info label="ملاحظات" value={order.notes} />}
            <Info label="التاريخ" value={new Date(order.createdAt).toLocaleString("ar-SY")} />
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <a
              className="tap-target rounded-full bg-ink px-5 py-3 text-center font-black text-bone"
              href={`https://wa.me/${String(order.customerPhone).replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              تواصل عبر واتساب
            </a>
            <form className="flex gap-2" action={`/api/admin/orders/${order.id}`} method="post">
              <select className="admin-field" name="status" defaultValue={order.status}>
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
              <button className="tap-target rounded-full bg-caramel px-5 py-3 font-black text-bone">تحديث</button>
            </form>
          </div>
        </section>

        <section className="premium-card p-5">
          <h2 className="text-2xl font-black">المنتجات</h2>
          <div className="mt-5 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-2xl bg-bone p-4 sm:grid-cols-[5.5rem_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-paper">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.selectedProductName} fill className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-muted">بدون صورة</div>
                  )}
                </div>
                <div>
                  <h3 className="font-black">{item.selectedProductName}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    كود: {item.productInternalCode} | لون: {item.selectedColorName} | مقاس: {item.size} | كمية: {item.quantity}
                  </p>
                  <p className="mt-2 font-black">{formatMoney(item.lineTotal, item.currency, "ar")}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-ink/15 pt-5 text-2xl font-black">
            <span>الإجمالي</span>
            <span>{formatMoney(order.total, order.currency, "ar")}</span>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-bone p-3">
      <p className="text-xs font-black text-muted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
