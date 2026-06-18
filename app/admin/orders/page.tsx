import Link from "next/link";
import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrders } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { whatsappHrefForPhone } from "@/lib/phone";

const statusLabels: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  completed: "مكتمل",
  cancelled: "ملغي"
};

export default async function Page() {
  await requireAdmin();
  let orders;
  try {
    orders = await getAdminOrders();
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="Ø§Ù„Ø·Ù„Ø¨Ø§Øª" />
        <AdminError />
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <AdminHeader title="الطلبات" />
      <div className="grid gap-4">
        {orders.map((order: any) => (
          <article key={order.id} className="premium-card grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-center">
              <Info label="رقم الطلب" value={order.code} strong />
              <Info label="العميل" value={order.customerName} />
              <Info label="الهاتف" value={order.customerPhone} />
              <Info label="الإجمالي" value={formatMoney(order.total, order.currency, "ar")} strong />
              <Info label="الحالة" value={statusLabels[order.status] || order.status} />
              <Info label="التاريخ" value={new Date(order.createdAt).toLocaleDateString("ar-SY")} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              {/* <form className="flex gap-2" action={`/api/admin/orders/${order.id}`} method="post">
                <select className="admin-field min-w-36" name="status" defaultValue={order.status}>
                  <option value="new">جديد</option>
                  <option value="contacted">تم التواصل</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
                <button className="tap-target rounded-full bg-caramel px-4 py-2 font-black text-bone">تحديث</button>
              </form> */}
              <Link className="tap-target rounded-full bg-caramel px-5 py-3 text-center font-black text-bone" href={`/admin/orders/${order.id}`}>
                التفاصيل
              </Link>
              <a
                className="tap-target rounded-full border border-ink/15 px-5 py-3 text-center font-black"
                href={whatsappHrefForPhone(order.customerPhone)}
                target="_blank"
                rel="noreferrer"
              >
                واتساب
              </a>
            </div>
          </article>
        ))}
        {orders.length === 0 && <p className="premium-card p-5 text-muted">لا توجد طلبات بعد.</p>}
      </div>
    </AdminShell>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-black text-muted">{label}</p>
      <p className={`mt-1 truncate ${strong ? "font-black" : "font-semibold"}`}>{value}</p>
    </div>
  );
}
